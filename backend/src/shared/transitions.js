// Single source of truth for allowed thesis status changes.
// Every status mutation must pass through transitionThesisStatus().
// Statuses are plain strings (the Prisma enum maps 1:1 to these string values).
const TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['revisions_requested', 'approved'],
  revisions_requested: ['submitted'], // resubmission flips back to submitted
  approved: [], // reopening an approved thesis needs a coordinator override (handled separately)
};

function canTransition(from, to) {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

function transitionThesisStatus(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal thesis status transition: ${from} → ${to}`);
  }
  return to;
}

module.exports = { canTransition, transitionThesisStatus };
