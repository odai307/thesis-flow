import AppLayout from '../components/AppLayout';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const STATS = [
  { label: 'Total Students', value: '124', icon: 'school', iconCls: 'text-primary-container bg-primary-fixed', trend: '+12% from last month', trendCls: 'text-[#059669]' },
  { label: 'Pending Reviews', value: '18', icon: 'pending_actions', iconCls: 'text-tertiary bg-tertiary-fixed', trend: '+3 require attention', trendCls: 'text-error' },
  { label: 'Approved this Month', value: '12', icon: 'check_circle', iconCls: 'text-[#059669] bg-[#D1FAE5]', trend: 'On track for targets', trendCls: 'text-secondary' },
  { label: 'Avg. Completion Time', value: '7.2', sub: 'months', icon: 'schedule', iconCls: 'text-primary-container bg-primary-fixed', trend: '-0.4 months vs avg', trendCls: 'text-[#059669]' },
];

const BARS = [
  { dept: 'CS', h: '80%', cls: 'bg-primary-container', val: 45 },
  { dept: 'Math', h: '40%', cls: 'bg-secondary-fixed-dim', val: 22 },
  { dept: 'Physics', h: '60%', cls: 'bg-primary-fixed-dim', val: 34 },
  { dept: 'Eng', h: '90%', cls: 'bg-surface-variant', val: 51 },
];

const DONUT = [
  { label: 'Under Review (35%)', color: 'bg-primary-container' },
  { label: 'Submitted (25%)', color: 'bg-primary-fixed-dim' },
  { label: 'Draft (20%)', color: 'bg-secondary-container' },
  { label: 'Approved (20%)', color: 'bg-surface-variant' },
];

const ACTIVITY = [
  { initials: 'ES', name: 'Emma Stone', dept: 'Computer Science', supervisor: 'Dr. Alan Turing', action: 'Submitted v2.0', actionCls: 'bg-secondary-fixed text-on-secondary-fixed', time: '2 hours ago' },
  { initials: 'JD', name: 'John Doe', dept: 'Mathematics', supervisor: 'Prof. Euler', action: 'Revisions Requested', actionCls: 'bg-error-container text-on-error-container', time: '5 hours ago' },
  { initials: 'AS', name: 'Alice Smith', dept: 'Physics', supervisor: 'Dr. Marie Curie', action: 'Approved', actionCls: 'bg-[#D1FAE5] text-[#065F46]', time: 'Yesterday, 14:30' },
  { initials: 'RB', name: 'Robert Brown', dept: 'Engineering', supervisor: 'Prof. Tesla', action: 'Draft Saved', actionCls: 'bg-surface-variant text-on-surface-variant', time: 'Yesterday, 09:15' },
];

export default function CoordinatorDashboard() {
  return (
    <AppLayout role="coordinator">
      <div className="space-y-1">
        <h2 className="font-display-lg text-display-lg text-on-surface">Coordinator Dashboard</h2>
        <p className="font-body-base text-body-base text-on-surface-variant">
          Department-wide overview of thesis progress.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-gap">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm flex flex-col gap-2 hover:border-outline transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary">{s.label}</span>
              <span className={`material-symbols-outlined ${s.iconCls} p-1.5 rounded-full text-sm`}>
                {s.icon}
              </span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface mt-2">
              {s.value} {s.sub && <span className="text-lg font-normal text-secondary">{s.sub}</span>}
            </div>
            <div className={`flex items-center gap-1 font-label-xs text-label-xs ${s.trendCls}`}>
              <Icon name="trending_up" className="text-[16px]" />
              <span>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-gap">
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-lg p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-section-header text-section-header text-on-surface">
              Thesis Submissions by Department
            </h3>
            <select className="bg-surface-container-low border border-outline-variant rounded-md px-3 py-1 font-label-sm text-label-sm focus:ring-1 focus:ring-primary outline-none">
              <option>Current Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 relative pt-8">
            <div className="absolute inset-0 flex items-end justify-around px-8 pb-8 pt-8">
              {BARS.map((b) => (
                <div
                  key={b.dept}
                  className={`w-16 ${b.cls} rounded-t-md hover:opacity-80 transition-opacity relative group`}
                  style={{ height: b.h }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-on-secondary px-2 py-1 rounded text-xs font-medium">
                    {b.val}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-outline-variant flex justify-around items-center px-8">
              {BARS.map((b) => (
                <span key={b.dept} className="font-label-xs text-label-xs text-secondary truncate w-16 text-center">
                  {b.dept}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-section-header text-section-header text-on-surface">Theses by Status</h3>
            <button className="p-1 hover:bg-surface-container-high rounded text-secondary transition-colors">
              <Icon name="more_vert" className="text-sm" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-48 h-48 rounded-full border-[24px] border-surface-container-low relative flex items-center justify-center mb-6"
              style={{
                borderTopColor: '#3538cd',
                borderRightColor: '#d6e0f8',
                borderBottomColor: '#e4e1ed',
                borderLeftColor: '#c0c1ff',
                transform: 'rotate(45deg)',
              }}
            >
              <div
                className="absolute inset-0 m-auto w-full h-full flex flex-col items-center justify-center"
                style={{ transform: 'rotate(-45deg)' }}
              >
                <span className="font-headline-md text-headline-md text-on-surface">124</span>
                <span className="font-label-xs text-label-xs text-secondary">Total</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4">
              {DONUT.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${d.color}`} />
                  <span className="font-label-xs text-label-xs text-secondary">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface">
          <h3 className="font-section-header text-section-header text-on-surface">Recent Activity</h3>
          <a className="font-label-md text-label-md text-primary hover:underline" href="#">
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Student Name', 'Supervisor', 'Action', 'Timestamp'].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-6 font-label-xs text-label-xs text-secondary uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {ACTIVITY.map((a, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center font-label-md text-label-md">
                        {a.initials}
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">{a.name}</div>
                        <div className="font-body-sm text-body-sm text-secondary">{a.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface">{a.supervisor}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-xs text-label-xs ${a.actionCls}`}
                    >
                      {a.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-body-sm text-body-sm text-secondary">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
