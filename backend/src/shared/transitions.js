// Single source of truth for allowed thesis status changes.
// Every status mutation must pass through transitionThesisStatus().
// Statuses are plain strings (the Prisma enum maps 1:1 to these string values).
const { AppError } = require('./errors');

const TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['revisions_requested', 'approved'],
  revisions_requested: ['submitted'], // resubmission flips back to submitted
  approved: [], // reopening an approved thesis needs a coordinator override (handled separately)
};

function canTransition(from, to, isCoordinator = false) {
  if (isCoordinator && from === 'approved' && to === 'revisions_requested') {
    return true;
  }
  return TRANSITIONS[from]?.includes(to) ?? false;
}

function transitionThesisStatus(from, to, isCoordinator = false) {
  if (!canTransition(from, to, isCoordinator)) {
    throw new AppError(`Illegal thesis status transition: ${from} → ${to}`, 400);
  }
  return to;
}

module.exports = { canTransition, transitionThesisStatus };
