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
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'reviews'
  const [students, setStudents] = useState([]);
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [studentsRes, thesesRes] = await Promise.all([
          api.getMyStudents().catch(() => ({ students: [] })),
          api.getTheses().catch(() => ({ theses: [] })),
        ]);
        if (!active) return;
        setStudents(studentsRes.students || []);
        setTheses(thesesRes.theses || []);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredTheses = useMemo(
    () => (filter === 'all' ? theses : theses.filter((t) => t.status === filter)),
    [theses, filter]
  );

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface m-0 font-bold">
          Supervisor Dashboard
        </h2>
        <p className="font-body-base text-body-base text-secondary m-0">
          Monitor your assigned department students and review incoming thesis submissions.
        </p>
      </div>

      {/* Main View Tabs */}
      <div className="flex border-b border-outline-variant mb-6 gap-8">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 font-label-md text-label-md font-semibold transition-colors relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'students'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <Icon name="groups" />
          My Department Students
          <span className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs px-2 py-0.5 rounded-full border border-outline-variant">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 font-label-md text-label-md font-semibold transition-colors relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <Icon name="rate_review" />
          Submitted Thesis Reviews
          <span className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs px-2 py-0.5 rounded-full border border-outline-variant">
            {theses.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading dashboard data…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : activeTab === 'students' ? (
        /* TAB 1: ALL ASSIGNED STUDENTS LIST */
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
            <h3 className="font-section-header text-section-header text-on-surface">
              Department Student Roster
            </h3>
            <span className="font-body-sm text-body-sm text-secondary">
              Showing all registered students regardless of submission state
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Index No.</th>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Thesis Title</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                {students.map((s) => {
                  const studentName = `${s.firstName} ${s.lastName}`;
                  const thesis = s.studentTheses?.[0];
                  return (
                    <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-on-surface font-semibold">
                        {s.indexNumber ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-xs font-bold">
                            {initials(studentName)}
                          </div>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            {studentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary">{s.email}</td>
                      <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">
                        {thesis ? thesis.title : <em className="text-outline">No thesis created yet</em>}
                      </td>
                      <td className="px-6 py-4">
                        {thesis ? (
                          <StatusBadge status={thesis.status} />
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-container text-secondary border border-outline-variant">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {thesis && thesis.status !== 'draft' ? (
                          <Link
                            to={`/review/${thesis.id}`}
                            className="bg-primary text-on-primary font-label-xs text-label-xs px-3.5 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-1"
                          >
                            Review Thesis
                          </Link>
                        ) : (
                          <span className="text-outline font-label-xs text-label-xs italic">
                            Awaiting Submission
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-secondary">
                      No students found in your department yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 2: ACTIVE THESIS SUBMISSIONS FOR REVIEW */
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={
                  filter === f.value
                    ? 'px-4 py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-sm cursor-pointer'
                    : 'px-4 py-1.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-container-low transition-colors cursor-pointer'
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredTheses.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm">
              <Icon name="assignment_turned_in" className="text-[40px] text-outline mb-2" />
              <p className="font-body-base text-body-base text-secondary">
                No active thesis submissions match this status filter.
              </p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                      <th className="px-6 py-3 font-semibold">Student Name</th>
                      <th className="px-6 py-3 font-semibold">Thesis Title</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Last Updated</th>
                      <th className="px-6 py-3 font-semibold">Submissions</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm">
                    {filteredTheses.map((t) => {
                      const studentName = t.student
                        ? `${t.student.firstName} ${t.student.lastName}`
                        : 'Unknown student';
                      return (
                        <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-xs font-bold">
                                {initials(studentName)}
                              </div>
                              <span className="font-label-md text-label-md text-on-surface font-semibold">
                                {studentName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant max-w-xs truncate">
                            {t.title}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="px-6 py-4 text-secondary">
                            {formatUpdated(t.updatedAt)}
                          </td>
                          <td className="px-6 py-4 text-secondary">
                            v{t._count?.submissions ?? 1}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/review/${t.id}`}
                              className="bg-primary text-on-primary font-label-xs text-label-xs px-3.5 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-1"
                            >
                              Review Submission
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
