// Pill-shaped status badge. Reuses the Stitch color tokens.
const STATUS_STYLES = {
  draft: 'bg-surface-variant text-on-surface-variant border-outline-variant',
  submitted: 'bg-primary-fixed text-on-primary-fixed-variant border-primary/20',
  under_review: 'bg-secondary-container text-on-secondary-container border-secondary/20',
  revisions_requested: 'bg-error-container text-on-error-container border-error/20',
  approved: 'bg-primary-container text-on-primary border-primary/20',
};

const STATUS_LABELS = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  revisions_requested: 'Revisions Requested',
  approved: 'Approved',
};

export default function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`px-3 py-1 rounded-full font-label-xs text-label-xs border flex items-center gap-1.5 ${style} ${className}`}
    >
      {label}
    </span>
  );
}
