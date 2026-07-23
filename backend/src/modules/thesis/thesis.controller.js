const path = require('path');
const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');
const { transitionThesisStatus } = require('../../shared/transitions');
const { createNotification } = require('../notification/notification.controller');

// Relations we always want alongside a thesis so the frontend doesn't have to re-fetch them.
const THESIS_INCLUDE = {
  student: { select: { id: true, firstName: true, lastName: true, email: true } },
  supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
  currentSubmission: {
    select: { id: true, versionNumber: true, status: true, fileType: true, submittedAt: true, fileUrl: true },
  },
  _count: { select: { submissions: true } },
};

// POST /api/theses - Student creates a thesis draft
async function createThesis(req, res) {
  try {
    const { title, supervisorId } = req.body;
    const userId = req.user.id;

    const student = await prisma.user.findUnique({ where: { id: userId } });
    if (!student || student.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const supervisor = await prisma.user.findUnique({ where: { id: supervisorId } });
    if (!supervisor || supervisor.role !== 'supervisor' || supervisor.deletedAt) {
      throw new AppError('Assigned supervisor does not exist or is inactive', 400);
    }

    const thesis = await prisma.thesis.create({
      data: {
        title,
        studentId: userId,
        supervisorId,
        departmentId: student.departmentId,
        status: 'draft',
      },
      include: THESIS_INCLUDE,
    });

    res.status(201).json({ thesis });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/theses - List theses scoped by caller's role and visibility rules
async function listTheses(req, res) {
  try {
    const { id: userId, role } = req.user;
    let where = {};

    if (role === 'student') {
      where = { studentId: userId };
    } else if (role === 'supervisor') {
      where = { supervisorId: userId, status: { not: 'draft' } };
    } else if (role === 'coordinator') {
      const dept = await prisma.department.findUnique({ where: { coordinatorId: userId } });
      if (!dept) return res.json({ theses: [] });
      where = { departmentId: dept.id, status: 'approved' };
    }

    const theses = await prisma.thesis.findMany({
      where,
      include: THESIS_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ theses });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/theses/:id - Get a single thesis
async function getThesis(req, res) {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    const thesis = await prisma.thesis.findUnique({
      where: { id },
      include: {
        ...THESIS_INCLUDE,
        submissions: {
          orderBy: { versionNumber: 'desc' },
          select: {
            id: true,
            versionNumber: true,
            status: true,
            fileType: true,
            fileUrl: true,
            submittedAt: true,
            _count: { select: { comments: true } },
          },
        },
      },
    });

    if (!thesis) throw new AppError('Thesis not found', 404);

    if (role === 'student') {
      if (thesis.studentId !== userId) {
        throw new AppError('Not authorized to view this thesis', 403);
      }
    } else if (role === 'supervisor') {
      if (thesis.supervisorId !== userId || thesis.status === 'draft') {
        throw new AppError('Not authorized to view this thesis', 403);
      }
    } else if (role === 'coordinator') {
      const dept = await prisma.department.findUnique({ where: { coordinatorId: userId } });
      const isDeptThesis = dept && thesis.departmentId === dept.id;
      if (!isDeptThesis || thesis.status !== 'approved') {
        throw new AppError('Coordinators can only view approved theses in their department', 403);
      }
    }

    res.json({ thesis });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/submissions/upload - Student uploads draft paper (Does NOT auto-submit to supervisor)
async function submitVersion(req, res) {
  try {
    const { id: thesisId } = req.params;
    const userId = req.user.id;

    let fileUrl, fileType;
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = ext === 'docx' ? 'docx' : 'pdf';
    } else {
      ({ fileUrl, fileType } = req.body || {});
      if (!fileUrl) throw new AppError('A file is required', 400);
      fileType = fileType || 'pdf';
    }

    const result = await prisma.$transaction(async (tx) => {
      const thesis = await tx.thesis.findUnique({ where: { id: thesisId } });
      if (!thesis) throw new AppError('Thesis not found', 404);
      if (thesis.studentId !== userId) throw new AppError('Only the student can upload', 403);

      if (!['draft', 'revisions_requested'].includes(thesis.status)) {
        throw new AppError(`Cannot upload paper while thesis is in status "${thesis.status}"`, 400);
      }

      const versionNumber = (await tx.submission.count({ where: { thesisId } })) + 1;

      const submission = await tx.submission.create({
        data: {
          thesisId,
          versionNumber,
          fileUrl,
          fileType,
          status: 'pending_review',
        },
      });

      await tx.thesis.update({
        where: { id: thesisId },
        data: { currentSubmissionId: submission.id },
      });

      return { submission, status: thesis.status };
    });

    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/submit - Student explicitly submits uploaded paper to supervisor
async function submitToSupervisor(req, res) {
  try {
    const { id: thesisId } = req.params;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const thesis = await tx.thesis.findUnique({
        where: { id: thesisId },
        include: { currentSubmission: true },
      });

      if (!thesis) throw new AppError('Thesis not found', 404);
      if (thesis.studentId !== userId) throw new AppError('Only the student can submit to supervisor', 403);
      if (!thesis.currentSubmissionId) throw new AppError('Please upload a paper file before submitting', 400);

      if (!['draft', 'revisions_requested'].includes(thesis.status)) {
        throw new AppError(`Thesis is already submitted or in review (Status: ${thesis.status})`, 400);
      }

      const newStatus = transitionThesisStatus(thesis.status, 'submitted');
      await tx.thesis.update({
        where: { id: thesisId },
        data: { status: newStatus },
      });

      await tx.notification.create({
        data: {
          userId: thesis.supervisorId,
          thesisId,
          type: 'status_change',
          referenceId: thesis.currentSubmissionId,
          message: `New thesis submission (v${thesis.currentSubmission.versionNumber}) for "${thesis.title}"`,
        },
      });

      return { thesisId, status: newStatus };
    });

    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/start-review - Supervisor starts review
async function startReview(req, res) {
  try {
    const { id: thesisId } = req.params;
    const userId = req.user.id;

    const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
    if (!thesis) throw new AppError('Thesis not found', 404);
    if (thesis.supervisorId !== userId) {
      throw new AppError('Only the assigned supervisor can do this', 403);
    }

    const newStatus = transitionThesisStatus(thesis.status, 'under_review');

    const updated = await prisma.thesis.update({
      where: { id: thesisId },
      data: { status: newStatus },
    });

    await createNotification({
      userId: thesis.studentId,
      thesisId,
      type: 'status_change',
      referenceId: thesisId,
      message: `Your supervisor has started reviewing "${thesis.title}"`,
    });

    res.json({ thesis: updated, status: newStatus });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/approve - Supervisor approves thesis
async function approve(req, res) {
  try {
    const { id: thesisId } = req.params;
    const userId = req.user.id;

    const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
    if (!thesis) throw new AppError('Thesis not found', 404);
    if (thesis.supervisorId !== userId) {
      throw new AppError('Only the assigned supervisor can do this', 403);
    }

    const newStatus = transitionThesisStatus(thesis.status, 'approved');

    const updated = await prisma.thesis.update({
      where: { id: thesisId },
      data: { status: newStatus },
    });

    if (thesis.currentSubmissionId) {
      await prisma.submission.update({
        where: { id: thesis.currentSubmissionId },
        data: { status: 'approved' },
      });
    }

    await createNotification({
      userId: thesis.studentId,
      thesisId,
      type: 'status_change',
      referenceId: thesisId,
      message: `Your thesis "${thesis.title}" has been approved`,
    });

    const dept = await prisma.department.findUnique({ where: { id: thesis.departmentId } });
    if (dept?.coordinatorId) {
      await createNotification({
        userId: dept.coordinatorId,
        thesisId,
        type: 'status_change',
        referenceId: thesisId,
        message: `Thesis "${thesis.title}" was approved and forwarded to department dashboard`,
      });
    }

    res.json({ thesis: updated, status: newStatus });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/request-revisions - Supervisor requests revisions
async function requestRevisions(req, res) {
  try {
    const { id: thesisId } = req.params;
    const userId = req.user.id;

    const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
    if (!thesis) throw new AppError('Thesis not found', 404);
    if (thesis.supervisorId !== userId) {
      throw new AppError('Only the assigned supervisor can do this', 403);
    }

    const newStatus = transitionThesisStatus(thesis.status, 'revisions_requested');

    const updated = await prisma.thesis.update({
      where: { id: thesisId },
      data: { status: newStatus },
    });

    if (thesis.currentSubmissionId) {
      await prisma.submission.update({
        where: { id: thesis.currentSubmissionId },
        data: { status: 'revisions_requested' },
      });
    }

    await createNotification({
      userId: thesis.studentId,
      thesisId,
      type: 'status_change',
      referenceId: thesisId,
      message: `Revisions requested on "${thesis.title}"`,
    });

    res.json({ thesis: updated, status: newStatus });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/theses/:id/reopen - Coordinator override to reopen an approved thesis
async function reopenThesis(req, res) {
  try {
    const { id: thesisId } = req.params;

    const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
    if (!thesis) throw new AppError('Thesis not found', 404);

    const newStatus = transitionThesisStatus(thesis.status, 'revisions_requested', true);

    const updated = await prisma.thesis.update({
      where: { id: thesisId },
      data: { status: newStatus },
    });

    if (thesis.currentSubmissionId) {
      await prisma.submission.update({
        where: { id: thesis.currentSubmissionId },
        data: { status: 'revisions_requested' },
      });
    }

    await createNotification({
      userId: thesis.studentId,
      thesisId,
      type: 'status_change',
      referenceId: thesisId,
      message: `Thesis "${thesis.title}" has been reopened by the department coordinator`,
    });

    res.json({ thesis: updated, status: newStatus });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  createThesis,
  listTheses,
  getThesis,
  submitVersion,
  submitToSupervisor,
  startReview,
  approve,
  requestRevisions,
  reopenThesis,
};