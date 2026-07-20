import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[16px]' }) {
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

export default function VersionHistory() {
  const { id } = useParams();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getThesis(id)
      .then((data) => setThesis(data.thesis))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submissions = thesis?.submissions ?? [];

  return (
    <AppLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-2">
            <Link to={`/thesis/${id}/workspace`} className="hover:text-primary transition-colors cursor-pointer">
              Thesis Workspace
            </Link>
            <Icon name="chevron_right" className="text-sm" />
            <span className="text-on-surface">Version History</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Version History</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-2 max-w-2xl">
            Track changes, review committee feedback, and access previous iterations of your
            submission.
          </p>
        </div>
        <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low transition-colors flex items-center gap-2">
          <Icon name="download" className="text-sm" />
          Export Log
        </button>
      </div>

      {loading ? (
        <p className="font-body-base text-body-base text-secondary">Loading versions…</p>
      ) : error && !thesis ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      ) : (
        <>
          {/* Table card */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-ambient overflow-hidden">
            <div className="p-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-bright">
              <div className="relative w-full max-w-xs">
                <Icon
                  name="filter_list"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
                />
                <input
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-outline-variant bg-surface-container-lowest text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Filter versions..."
                  type="text"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-bright border-b border-outline-variant font-label-xs text-label-xs uppercase text-on-surface-variant tracking-wider">
                    <th className="py-3 px-6 font-semibold">Version</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold">Submitted Date</th>
                    <th className="py-3 px-6 font-semibold">File</th>
                    <th className="py-3 px-6 font-semibold">Notes</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/30">
                  {submissions.map((s, i) => {
                    const current = i === 0;
                    return (
                      <tr
                        key={s.id}
                        className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-on-surface">v{s.versionNumber}</span>
                            {current && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-on-primary-container">
                                CURRENT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {formatDate(s.submittedAt)}
                        </td>
                        <td className="py-4 px-6 uppercase text-on-surface-variant">
                          {s.fileType}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-on-surface-variant">
                            <Icon name="chat_bubble_outline" className="text-[16px]" />
                            <span>{s._count?.comments ?? 0} notes</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/thesis/${id}/workspace`}
                            className="text-primary hover:text-primary-container font-label-md transition-colors flex items-center justify-end w-full gap-1"
                          >
                            View
                            <Icon name="arrow_forward" className="text-[16px]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-secondary">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant/50 flex items-center justify-between bg-surface-bright text-body-sm text-on-surface-variant">
              <div>
                Showing 1 to {submissions.length} of {submissions.length} versions
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-outline-variant rounded bg-surface-container-lowest text-outline cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 border border-outline-variant rounded bg-surface-container-lowest text-outline cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
