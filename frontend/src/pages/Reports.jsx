import AppLayout from '../components/AppLayout';
import { departmentReports } from '../data/mockData';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const MONTHS = [
  { m: 'Jan', submitted: '40%', drafted: '20%' },
  { m: 'Feb', submitted: '55%', drafted: '25%' },
  { m: 'Mar', submitted: '45%', drafted: '35%' },
  { m: 'Apr', submitted: '70%', drafted: '15%' },
  { m: 'May', submitted: '85%', drafted: '10%' },
  { m: 'Jun', submitted: '95%', drafted: '5%' },
];

const WORKLOAD = [
  { name: 'Dr. Eleanor Vance', img: null, initials: 'EV', students: '8 Candidates', time: '4.2 Days', status: 'Optimal', statusCls: 'bg-secondary-container text-on-secondary-container' },
  { name: 'Prof. Arthur Pendelton', img: null, initials: 'AP', students: '14 Candidates', time: '12.5 Days', status: 'Overloaded', statusCls: 'bg-error-container text-on-error-container' },
  { name: 'Dr. Miriam Kester', img: null, initials: 'MK', students: '5 Candidates', time: '2.1 Days', status: 'Optimal', statusCls: 'bg-secondary-container text-on-secondary-container' },
];

const MAX = Math.max(...departmentReports.map((d) => d.value));

export default function Reports() {
  return (
    <AppLayout role="coordinator">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Reports</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            Department-wide thesis progress and supervisor workload.
          </p>
        </div>
        <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2">
          <Icon name="download" className="text-[18px]" />
          Export Report
        </button>
      </div>

      {/* Status distribution chart */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-section-header text-section-header text-on-surface">
            Thesis Progress by Status
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-label-xs text-label-xs text-secondary">
              <span className="w-3 h-3 rounded-sm bg-primary-container inline-block" /> Submitted
            </span>
            <span className="flex items-center gap-1.5 font-label-xs text-label-xs text-secondary">
              <span className="w-3 h-3 rounded-sm bg-secondary-container inline-block" /> Drafts
            </span>
          </div>
        </div>
        <div className="w-full h-64 border-b border-outline-variant relative flex items-end justify-between px-4 pb-0 pt-8 gap-2 mt-auto">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            <div className="w-full border-t border-dashed border-outline-variant/50" />
            <div className="w-full border-t border-dashed border-outline-variant/50" />
            <div className="w-full border-t border-dashed border-outline-variant/50" />
          </div>
          {departmentReports.map((d) => (
            <div key={d.label} className="relative flex-1 flex flex-col justify-end items-center group">
              <div
                className="w-12 bg-primary-container rounded-t-sm transition-all hover:opacity-90 relative z-10 cursor-pointer shadow-sm"
                style={{ height: `${(d.value / MAX) * 100}%` }}
              />
              <span className="absolute -bottom-8 font-label-xs text-label-xs text-secondary text-center">
                {d.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Supervisor workload table */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <h2 className="font-section-header text-section-header text-on-surface">
            Supervisor Workload
          </h2>
          <button className="text-primary-container font-label-md text-label-md hover:underline flex items-center gap-1">
            View All <Icon name="arrow_forward" className="text-[16px]" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Supervisor Name', 'Active Students', 'Avg. Review Time', 'Status', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className={`py-3 px-6 font-label-xs text-label-xs text-secondary uppercase tracking-wider ${
                        h === 'Actions' ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-variant">
              {WORKLOAD.map((w, i) => (
                <tr key={i} className="hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-label-md text-label-md">
                      {w.initials}
                    </div>
                    <span className="font-label-md text-label-md text-on-background">{w.name}</span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{w.students}</td>
                  <td className="py-4 px-6 text-on-surface-variant">{w.time}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-xs text-label-xs ${w.statusCls}`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-secondary hover:text-primary-container transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
