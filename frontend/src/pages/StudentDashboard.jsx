import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { activities, committee, deadlines } from '../data/mockData';

function Icon({ name, className = 'text-[18px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create-thesis form state (shown when student has no thesis yet).
  const [supervisors, setSupervisors] = useState([]);
  const [title, setTitle] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api
      .getTheses()
      .then((data) => setThesis(data.theses[0] ?? null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Load supervisors when student needs to create a thesis
  useEffect(() => {
    if (!loading && !thesis) {
      api
        .getSupervisors()
        .then((data) => setSupervisors(data.supervisors))
        .catch(() => setSupervisors([]));
    }
  }, [loading, thesis]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim() || !supervisorId) return;
    setCreating(true);
    setError('');
    try {
      const { thesis: created } = await api.createThesis(title.trim(), supervisorId);
      // Go straight to the workspace to upload the first version
      navigate(`/thesis/${created.id}/workspace`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">
            Loading your thesis dashboard…
          </p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      </AppLayout>
    );
  }

  // 1. NO THESIS CREATED YET — Render Thesis Creation Form
  if (!thesis) {
    return (
      <AppLayout>
        <header className="mb-6">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
            My Student Dashboard
          </h2>
          <p className="font-body-base text-body-base text-secondary">
            Get started by creating your thesis project and selecting a supervisor.
          </p>
        </header>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 max-w-xl mx-auto shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
              <Icon name="menu_book" className="text-[28px]" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Start Your Thesis</h3>
              <p className="font-body-sm text-body-sm text-secondary">Fill in the details below to create your thesis entry.</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-5 mt-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium">
                Thesis Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Artificial Intelligence in Modern Healthcare Systems"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium">
                Assigned Supervisor
              </label>
              <select
                required
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select a supervisor from your department...</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={creating || !supervisorId || !title.trim()}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50 shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              <Icon name="add_circle" />
              {creating ? 'Creating Thesis...' : 'Create Thesis & Open Workspace'}
            </button>
          </form>
        </section>
      </AppLayout>
    );
  }

  // 2. THESIS EXISTS — Render Full Dashboard & Actions
  const supervisorName = thesis.supervisor
    ? `${thesis.supervisor.firstName} ${thesis.supervisor.lastName}`
    : 'Unassigned';
  const version = thesis.currentSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;

  const PROGRESS_BY_STATUS = {
    draft: 10,
    submitted: 40,
    under_review: 70,
    revisions_requested: 50,
    approved: 100,
  };
  const progress = PROGRESS_BY_STATUS[thesis.status] ?? 0;

  return (
    <AppLayout>
      {/* Page header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
            My Student Dashboard
          </h2>
          <p className="font-body-base text-body-base text-secondary">
            Manage your thesis progression, upload drafts, and review feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/thesis/${thesis.id}/workspace`}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
          >
            <Icon name="edit_document" />
            Thesis Workspace
          </Link>
          <Link
            to={`/thesis/${thesis.id}/version-history`}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <Icon name="history" />
            Version History
          </Link>
        </div>
      </header>

      {/* Hero thesis card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-ambient relative overflow-hidden group mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary-container to-secondary" />
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={thesis.status} />
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-xs text-label-xs border border-outline-variant">
                Version {version}
              </span>
            </div>

            <Link to={`/thesis/${thesis.id}/workspace`}>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3 pr-4 hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                {thesis.title}
                <Icon name="open_in_new" className="text-[20px] text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-6 mt-auto pt-4 text-secondary font-body-sm text-body-sm">
              <div className="flex items-center gap-2">
                <Icon name="person" />
                <span>
                  Supervisor: <strong className="text-on-surface">{supervisorName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="folder" />
                <span>{thesis._count?.submissions ?? 0} Total Submissions</span>
              </div>
            </div>
          </div>

          <div className="lg:w-72 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant pt-6 lg:pt-0 lg:pl-8">
            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider font-semibold">
                  Overall Progress
                </span>
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Direct button to upload revision in workspace */}
            <button
              onClick={() => navigate(`/thesis/${thesis.id}/workspace`)}
              className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
            >
              <Icon name="upload_file" />
              Upload Paper / Revision
            </button>
          </div>
        </div>
      </section>

      {/* Activity & details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent activity */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-section-header text-section-header text-on-surface">Recent Activity</h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            {activities.map((a, i) => (
              <div
                key={a.id}
                className={`flex gap-4 p-5 ${i < activities.length - 1 ? 'border-b border-outline-variant' : ''} ${
                  i === 0 ? 'bg-surface-bright' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.iconClass}`}
                >
                  <Icon name={a.icon} />
                </div>
                <div>
                  <p
                    className="font-body-base text-body-base text-on-surface"
                    dangerouslySetInnerHTML={{ __html: a.html }}
                  />
                  {a.detail && (
                    <p className="font-body-sm text-body-sm text-secondary mt-1">{a.detail}</p>
                  )}
                  <span className="font-label-xs text-label-xs text-outline mt-2 block">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Side panel */}
        <section className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-section-header text-section-header text-on-surface mb-4">
              Advisory Committee
            </h3>
            <ul className="flex flex-col gap-4">
              {committee.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <img
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    src={m.avatar}
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">{m.name}</span>
                    <span className="font-label-xs text-label-xs text-secondary">{m.role}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-section-header text-section-header text-on-surface mb-4">
              Upcoming Deadlines
            </h3>
            <ul className="flex flex-col gap-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant">
              {deadlines.map((d) => (
                <li key={d.id} className="flex gap-4 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-surface-container-lowest mt-0.5 ${
                      d.urgent ? 'bg-error' : 'bg-surface-variant'
                    }`}
                  >
                    {d.urgent && <div className="w-2 h-2 bg-on-error rounded-full" />}
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface block">{d.label}</span>
                    <span
                      className={`font-label-xs text-label-xs block mt-0.5 ${
                        d.urgent ? 'text-error font-medium' : 'text-secondary'
                      }`}
                    >
                      {d.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
