const { z } = require('zod');

// Student creates a thesis (starts as a draft).
const createThesisSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  supervisorId: z.string().min(1, 'A supervisor must be assigned'),
});

// Student uploads / resubmits a version of the thesis.
const createSubmissionSchema = z.object({
  fileUrl: z.string().min(1, 'File URL is required'),
  fileType: z.enum(['docx', 'pdf']),
});

module.exports = { createThesisSchema, createSubmissionSchema };
