import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { currentUser, thesis, submissions } from '../data/mockData';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Profile() {
  return (
    <AppLayout>
      <header className="flex flex-col gap-1">
        <h2 className="font-display-lg text-display-lg text-on-surface">Profile & Settings</h2>
        <p className="font-body-base text-body-base text-on-surface-variant">
          Manage your personal information and thesis history.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <section className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              alt="User avatar"
              className="w-24 h-24 rounded-full object-cover border border-outline-variant mb-4"
              src={currentUser.avatar}
            />
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <span className="font-label-xs text-label-xs text-secondary mt-1">
              {currentUser.role}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                University Email
              </span>
              <a
                className="font-body-base text-body-base text-primary hover:underline flex items-center gap-2"
                href={`mailto:${currentUser.email}`}
              >
                {currentUser.email}
                <Icon name="content_copy" className="text-[16px] text-outline" />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                Student ID
              </span>
              <span className="font-body-base text-body-base text-on-surface font-medium">
                #982-104-55
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                Primary Supervisor
              </span>
              <span className="font-body-base text-body-base text-on-surface">
                {thesis.supervisor}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                Expected Graduation
              </span>
              <span className="font-body-base text-body-base text-on-surface">Spring 2025</span>
            </div>
          </div>
        </section>

        {/* Thesis history */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2">
            <h3 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
              <Icon name="history" className="text-secondary" />
              Thesis History
            </h3>
            <span className="font-body-sm text-body-sm text-secondary">Showing all submitted versions</span>
          </div>

          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-ambient">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-bright border-b border-outline-variant">
                    <th className="py-3 px-4 font-label-xs text-label-xs text-secondary uppercase tracking-wider w-24">
                      Version
                    </th>
                    <th className="py-3 px-4 font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th className="py-3 px-4 font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                      Focus
                    </th>
                    <th className="py-3 px-4 font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 font-label-xs text-label-xs text-secondary uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-4">
                        <span className="font-body-base text-body-base text-on-surface font-medium">
                          v{s.version}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-secondary">{s.date}</td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface">
                        {s.file}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-primary hover:bg-primary-fixed rounded font-label-md text-label-md transition-colors">
                          View Feedback
                          <Icon name="arrow_forward" className="text-[16px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
