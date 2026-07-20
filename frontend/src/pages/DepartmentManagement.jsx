import AppLayout from '../components/AppLayout';
import { departments } from '../data/mockData';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const DEPT_ICONS = {
  'Computer Science': 'computer',
  Mathematics: 'calculate',
  Physics: 'science',
  Engineering: 'engineering',
};

export default function DepartmentManagement() {
  return (
    <AppLayout role="coordinator">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Department Management</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            Create and manage departments, assign coordinators.
          </p>
        </div>
        <button className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary transition-colors shadow-sm">
          <Icon name="add" className="text-[18px]" />
          New Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {departments.map((d) => (
          <div
            key={d.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col gap-4 hover:border-outline transition-colors shadow-ambient group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container" />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-section-header text-section-header text-on-surface">{d.name}</h3>
                <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                  Coordinator: {d.coordinator}
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary opacity-50">
                {DEPT_ICONS[d.name] ?? 'school'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-outline-variant">
              <div>
                <div className="font-label-xs text-label-xs text-secondary uppercase tracking-wider mb-1">
                  Students
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">{d.members}</div>
              </div>
              <div>
                <div className="font-label-xs text-label-xs text-secondary uppercase tracking-wider mb-1">
                  Supervisors
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">
                  {Math.max(1, Math.round(d.members / 9))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <button className="flex-1 h-9 px-3 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                <Icon name="settings" className="text-[16px]" />
                Edit Settings
              </button>
              <button className="flex-1 h-9 px-3 bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                <Icon name="group" className="text-[16px]" />
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
