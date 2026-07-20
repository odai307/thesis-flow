import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Revisions Requested', value: 'revisions_requested' },
  { label: 'Approved', value: 'approved' },
];

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatUpdated(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SupervisorDashboard() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api
      .getTheses()
      .then((data) => setTheses(data.theses))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? theses : theses.filter((t) => t.status === filter)),
    [theses, filter],
  );

  return (
    <AppLayout role="supervisor">
      <div className="space-y-1">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface m-0">
          Supervisor Dashboard
        </h2>
        <p className="font-body-base text-body-base text-on-surface-variant m-0">
          Track and review your assigned students&apos; progress.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? 'px-4 py-1.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-full'
                : 'px-4 py-1.5 bg-surface border border-outline-variant text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-container-low transition-colors'
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-body-base text-body-base text-secondary">Loading theses…</p>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="font-body-base text-body-base text-secondary">
          No theses match this filter.
        </p>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['Student Name', 'Thesis Title', 'Status', 'Last Updated', 'Version', 'Action'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider text-right last:text-right first:text-left"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((t) => {
                  const studentName = t.student
                    ? `${t.student.firstName} ${t.student.lastName}`
                    : 'Unknown student';
                  return (
                    <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-xs">
                            {initials(studentName)}
                          </div>
                          <span className="font-label-md text-label-md text-on-surface">
                            {studentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {t.title}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        {formatUpdated(t.updatedAt)}
                      </td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                        v{t._count?.submissions ?? 1}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/review/${t.id}`}
                          className="bg-primary-container text-on-primary font-label-xs text-label-xs px-3 py-1.5 rounded hover:bg-primary transition-colors"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {filtered.length} of {theses.length} students
            </span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
                disabled
              >
                <Icon name="chevron_left" />
              </button>
              <button className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low">
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
