import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { activities, committee, deadlines } from '../data/mockData';

function Icon({ name, className = 'text-[18px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function StudentDashboard() {
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getTheses()
      .then((data) => setThesis(data.theses[0] ?? null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <p className="font-body-base text-body-base text-secondary">Loading your thesis…</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      </AppLayout>
    );
  }

  if (!thesis) {
    return (
      <AppLayout>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
              My Dashboard
            </h2>
            <p className="font-body-base text-body-base text-secondary">
              Manage your thesis progression and supervisor feedback.
            </p>
          </div>
        </header>
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center">
          <Icon name="menu_book" className="text-[40px] text-outline" />
          <h3 className="font-section-header text-section-header text-on-surface mt-3">
            No thesis yet
          </h3>
          <p className="font-body-sm text-body-sm text-secondary mt-1">
            You haven&apos;t created a thesis. Start a draft to begin.
          </p>
        </section>
      </AppLayout>
    );
  }

  const supervisorName = thesis.supervisor
    ? `${thesis.supervisor.firstName} ${thesis.supervisor.lastName}`
    : 'Unassigned';
  const version = thesis.currentSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;
  // Simple progress derived from the thesis lifecycle status.
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
            My Dashboard
          </h2>
          <p className="font-body-base text-body-base text-secondary">
            Manage your thesis progression and supervisor feedback.
          </p>
        </div>
        <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm">
          View Guidelines
        </button>
      </header>

      {/* Hero thesis card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-ambient relative overflow-hidden group hover:border-outline transition-colors">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error via-tertiary-container to-primary opacity-80" />
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={thesis.status} />
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-xs text-label-xs border border-outline-variant">
                Version {version}
              </span>
            </div>
            <Link to={`/thesis/${thesis.id}/workspace`}>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3 pr-4 hover:text-primary transition-colors">
                {thesis.title}
              </h3>
            </Link>
            <div className="flex items-center gap-6 mt-auto pt-4 text-secondary font-body-sm text-body-sm">
              <div className="flex items-center gap-2">
                <Icon name="person" />
                <span>
                  Supervisor: <strong>{supervisorName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-error font-medium">
                <Icon name="comment" />
                <span>{thesis._count?.submissions ?? 0} Submission(s)</span>
              </div>
            </div>
          </div>

          <div className="lg:w-72 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant pt-6 lg:pt-0 lg:pl-8">
            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                  Overall Progress
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button className="w-full bg-primary-container text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm mt-auto">
              <Icon name="upload_file" />
              Upload Revision
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
            <button className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-1 transition-colors">
              View all <Icon name="arrow_forward" className="text-[16px]" />
            </button>
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
                    <span className="font-label-md text-label-md text-on-surface">{m.name}</span>
                    <span className="font-label-xs text-label-xs text-secondary">{m.role}</span>
                  </div>
                  <button className="ml-auto text-outline hover:text-primary transition-colors">
                    <Icon name="mail" />
                  </button>
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
