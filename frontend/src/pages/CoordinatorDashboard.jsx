import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Modal dialog for coordinator to reopen an approved thesis
function ConfirmReopenModal({ isOpen, thesis, onConfirm, onClose, busy }) {
  if (!isOpen || !thesis) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3 text-tertiary">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
            <Icon name="lock_open" className="text-[24px]" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Reopen Approved Thesis?</h3>
        </div>
        <p className="font-body-base text-body-base text-secondary mb-6 leading-relaxed">
          Reopening <strong>&quot;{thesis.title}&quot;</strong> will revert its status back to <strong>Revisions Requested</strong>, allowing the student to upload further revisions.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-5 py-2.5 rounded-lg text-white font-label-md text-label-md bg-tertiary-container hover:bg-tertiary transition-colors disabled:opacity-50 shadow-sm"
          >
            {busy ? 'Reopening...' : 'Reopen Thesis'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoordinatorDashboard() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reopenTarget, setReopenTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function loadData() {
    try {
      const data = await api.getTheses();
      setTheses(data.theses || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleConfirmReopen() {
    if (!reopenTarget) return;
    setBusy(true);
    try {
      await api.reopenThesis(reopenTarget.id);
      setReopenTarget(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppLayout>
      <ConfirmReopenModal
        isOpen={!!reopenTarget}
        thesis={reopenTarget}
        onConfirm={handleConfirmReopen}
        onClose={() => setReopenTarget(null)}
        busy={busy}
      />

      <div className="space-y-1 mb-6">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface m-0 font-bold">
          Department Coordinator Dashboard
        </h2>
        <p className="font-body-base text-body-base text-secondary m-0">
          Department-wide overview of supervisor-approved theses ready for final archiving.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="font-label-md text-label-md text-secondary block mb-1">Approved Department Theses</span>
          <span className="font-display-lg text-display-lg text-on-surface font-bold">{theses.length}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="font-label-md text-label-md text-secondary block mb-1">Status</span>
          <span className="font-display-lg text-display-lg text-[#059669] font-bold">All Approved</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="font-label-md text-label-md text-secondary block mb-1">Coordinator Access</span>
          <span className="font-display-lg text-display-lg text-primary font-bold">Full Archive</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading approved department theses…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
            <h3 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
              <Icon name="verified" className="text-[#059669]" />
              Approved Department Theses Archive
            </h3>
            <span className="font-body-sm text-body-sm text-secondary">
              Showing theses approved by department supervisors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-semibold">Student Name</th>
                  <th className="px-6 py-3.5 font-semibold">Thesis Title</th>
                  <th className="px-6 py-3.5 font-semibold">Supervisor</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Approved Date</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                {theses.map((t) => {
                  const studentName = t.student
                    ? `${t.student.firstName} ${t.student.lastName}`
                    : 'Unknown student';
                  const supervisorName = t.supervisor
                    ? `${t.supervisor.firstName} ${t.supervisor.lastName}`
                    : 'Unassigned';

                  return (
                    <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-on-surface">
                        {studentName}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">
                        {t.title}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {supervisorName}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {formatDate(t.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/review/${t.id}`}
                            className="bg-primary text-on-primary font-label-xs text-label-xs px-3.5 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-1"
                          >
                            View Submission
                          </Link>
                          <button
                            onClick={() => setReopenTarget(t)}
                            className="bg-tertiary-container text-on-tertiary-container font-label-xs text-label-xs px-3.5 py-2 rounded-lg hover:bg-tertiary transition-colors shadow-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            Reopen Thesis
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {theses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary">
                      <Icon name="history_edu" className="text-[40px] text-outline mb-2 block mx-auto" />
                      No supervisor-approved theses in your department yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
