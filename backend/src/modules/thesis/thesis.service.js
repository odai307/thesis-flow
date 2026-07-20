const { prisma } = require('../../lib/prisma');
const { AppError } = require('../../shared/errors');
const { transitionThesisStatus } = require('../../shared/transitions');
const { createNotification } = require('../notification/notification.service');

// Create a thesis. The creator (student) is taken from the auth user;
// a supervisor must be assigned up front (schema enforces both FKs).
async function createThesis(input, userId) {
  const data = input;
  const student = await prisma.user.findUnique({ where: { id: userId } });
  if (!student) throw new AppError('User not found', 404);

  const supervisor = await prisma.user.findUnique({ where: { id: data.supervisorId } });
  if (!supervisor || supervisor.role !== 'supervisor') {
    throw new AppError('Assigned supervisor does not exist', 400);
  }

  const thesis = await prisma.thesis.create({
    data: {
      title: data.title,
      studentId: userId,
      supervisorId: data.supervisorId,
      departmentId: student.departmentId,
      status: 'draft',
    },
  });
  return thesis;
}

// Relations we always want alongside a thesis (supervisor name + current
// submission version/status) so the frontend doesn't have to re-fetch them.
const THESIS_INCLUDE = {
  student: { select: { id: true, firstName: true, lastName: true } },
  supervisor: { select: { id: true, firstName: true, lastName: true } },
  currentSubmission: {
    select: { id: true, versionNumber: true, status: true, fileType: true, submittedAt: true },
  },
  _count: { select: { submissions: true } },
};

// List theses, scoped by the caller's role (per spec).
async function listTheses(userId, role) {
  let where = {};
  if (role === 'student') {
    where = { studentId: userId };
  } else if (role === 'supervisor') {
    where = { supervisorId: userId };
  } else {
    // coordinator: all theses in their department
    const dept = await prisma.department.findUnique({ where: { coordinatorId: userId } });
    if (!dept) return [];
    where = { departmentId: dept.id };
  }
  return prisma.thesis.findMany({
    where,
    include: THESIS_INCLUDE,
    orderBy: { updatedAt: 'desc' },
  });
}

async function getThesis(id, userId, role) {
  const thesis = await prisma.thesis.findUnique({
    where: { id },
    include: {
      ...THESIS_INCLUDE,
      student: { select: { id: true, firstName: true, lastName: true } },
      // Full version history, newest first.
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

  const owns =
    thesis.studentId === userId ||
    thesis.supervisorId === userId ||
    role === 'coordinator';
  if (!owns) throw new AppError('Not authorized to view this thesis', 403);
  return thesis;
}

// Student uploads a new version. Bumps versionNumber, sets it as current,
// and moves status draft -> submitted (or revisions_requested -> submitted).
async function submitVersion(thesisId, input, userId) {
  const data = input;
  const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
  if (!thesis) throw new AppError('Thesis not found', 404);
  if (thesis.studentId !== userId) throw new AppError('Only the student can submit', 403);

  // Only allow submission from draft or revisions_requested.
  if (!['draft', 'revisions_requested'].includes(thesis.status)) {
    throw new AppError(`Cannot submit from status "${thesis.status}"`, 400);
  }

  const versionNumber =
    (await prisma.submission.count({ where: { thesisId } })) + 1;

  const submission = await prisma.submission.create({
    data: {
      thesisId,
      versionNumber,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      status: 'pending_review',
    },
  });

  const newStatus = transitionThesisStatus(thesis.status, 'submitted');
  await prisma.thesis.update({
    where: { id: thesisId },
    data: { currentSubmissionId: submission.id, status: newStatus },
  });

  // Notify the supervisor that a new version is awaiting review.
  await createNotification({
    userId: thesis.supervisorId,
    thesisId,
    type: 'status_change',
    referenceId: submission.id,
    message: `New submission (v${versionNumber}) for "${thesis.title}"`,
  });

  return { submission, status: newStatus };
}

// --- Supervisor review actions ---

// Shared guard: load the thesis and ensure the caller is its supervisor.
async function loadForSupervisor(thesisId, userId) {
  const thesis = await prisma.thesis.findUnique({ where: { id: thesisId } });
  if (!thesis) throw new AppError('Thesis not found', 404);
  if (thesis.supervisorId !== userId) {
    throw new AppError('Only the assigned supervisor can do this', 403);
  }
  return thesis;
}

// submitted -> under_review. Supervisor opens the thesis for review.
async function startReview(thesisId, userId) {
  const thesis = await loadForSupervisor(thesisId, userId);
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
  return { thesis: updated, status: newStatus };
}

// under_review -> approved. Also marks the current submission approved.
async function approve(thesisId, userId) {
  const thesis = await loadForSupervisor(thesisId, userId);
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
  return { thesis: updated, status: newStatus };
}

// under_review -> revisions_requested. Marks the current submission accordingly.
async function requestRevisions(thesisId, userId) {
  const thesis = await loadForSupervisor(thesisId, userId);
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
  return { thesis: updated, status: newStatus };
}

module.exports = {
  createThesis,
  listTheses,
  getThesis,
  submitVersion,
  startReview,
  approve,
  requestRevisions,
};
