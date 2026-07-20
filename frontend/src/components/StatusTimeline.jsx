// Horizontal status timeline strip: Draft -> Submitted -> Under Review ->
// Revisions/Approved. The current step is highlighted; completed steps filled.
const STEPS = ['draft', 'submitted', 'under_review', 'revisions_requested', 'approved'];

const LABELS = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  revisions_requested: 'Revisions',
  approved: 'Approved',
};

export default function StatusTimeline({ current }) {
  const currentIdx = STEPS.indexOf(current);
  return (
    <ol className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  active
                    ? 'bg-primary border-primary'
                    : done
                      ? 'bg-primary-container border-primary-container'
                      : 'bg-surface-container-lowest border-outline-variant'
                }`}
              />
              <span
                className={`mt-2 font-label-xs text-label-xs whitespace-nowrap ${
                  active ? 'text-primary font-semibold' : 'text-secondary'
                }`}
              >
                {LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 ${
                  i < currentIdx ? 'bg-primary-container' : 'bg-outline-variant'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
