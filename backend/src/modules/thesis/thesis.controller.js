const path = require('path');
const { asyncHandler } = require('../../shared/errors');
const { AppError } = require('../../shared/errors');
const thesisService = require('./thesis.service');

const createThesis = asyncHandler(async (req, res) => {
  const thesis = await thesisService.createThesis(req.body, req.user.id);
  res.status(201).json({ thesis });
});

const listTheses = asyncHandler(async (req, res) => {
  const theses = await thesisService.listTheses(req.user.id, req.user.role);
  res.json({ theses });
});

const getThesis = asyncHandler(async (req, res) => {
  const thesis = await thesisService.getThesis(req.params.id, req.user.id, req.user.role);
  res.json({ thesis });
});

const submitVersion = asyncHandler(async (req, res) => {
  // multipart upload (multer) provides req.file; JSON path provides req.body.
  let input;
  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const fileUrl = `/uploads/${req.file.filename}`;
    input = { fileUrl, fileType: ext === 'docx' ? 'docx' : 'pdf' };
  } else {
    const { fileUrl, fileType } = req.body;
    if (!fileUrl) throw new AppError('A file is required', 400);
    input = { fileUrl, fileType: fileType || 'pdf' };
  }
  const result = await thesisService.submitVersion(req.params.id, input, req.user.id);
  res.status(201).json(result);
});

const startReview = asyncHandler(async (req, res) => {
  const result = await thesisService.startReview(req.params.id, req.user.id);
  res.json(result);
});

const approve = asyncHandler(async (req, res) => {
  const result = await thesisService.approve(req.params.id, req.user.id);
  res.json(result);
});

const requestRevisions = asyncHandler(async (req, res) => {
  const result = await thesisService.requestRevisions(req.params.id, req.user.id);
  res.json(result);
});

module.exports = {
  createThesis,
  listTheses,
  getThesis,
  submitVersion,
  startReview,
  approve,
  requestRevisions,
};
