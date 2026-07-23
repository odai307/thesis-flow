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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-2">
            <Link to={`/thesis/${id}/workspace`} className="hover:text-primary transition-colors cursor-pointer">
              Thesis Workspace
            </Link>
            <Icon name="chevron_right" className="text-sm" />
            <span className="text-on-surface">Version History</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Version History</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1 max-w-2xl">
            Track changes, review committee feedback, and access previous iterations of your submission.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading versions…</p>
        </div>
      ) : error && !thesis ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : (
        <>
          {/* Table card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-bright border-b border-outline-variant font-label-xs text-label-xs uppercase text-on-surface-variant tracking-wider">
                    <th className="py-3.5 px-6 font-semibold">Version</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold">Submitted Date</th>
                    <th className="py-3.5 px-6 font-semibold">File Type</th>
                    <th className="py-3.5 px-6 font-semibold">Comments</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/30">
                  {submissions.map((s, i) => {
                    const isLatest = i === 0;
                    return (
                      <tr
                        key={s.id}
                        className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface">v{s.versionNumber}</span>
                            {isLatest && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-on-primary">
                                CURRENT LATEST
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
                        <td className="py-4 px-6 uppercase text-on-surface-variant font-semibold">
                          {s.fileType}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <Icon name="chat_bubble_outline" className="text-[16px]" />
                            <span>{s._count?.comments ?? 0} notes</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {s.fileUrl && (
                              <a
                                href={s.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="text-secondary hover:text-primary font-label-md transition-colors flex items-center gap-1"
                              >
                                <Icon name="download" className="text-[16px]" />
                                Download
                              </a>
                            )}
                            <Link
                              to={`/thesis/${id}/workspace?submissionId=${s.id}`}
                              className="text-primary hover:text-primary-container font-label-md font-semibold transition-colors flex items-center gap-1"
                            >
                              View Version
                              <Icon name="arrow_forward" className="text-[16px]" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-secondary">
                        No submissions uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-bright text-body-sm text-on-surface-variant">
              <div>
                Showing {submissions.length} version{submissions.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
