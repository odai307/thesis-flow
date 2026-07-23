import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const DEPT_ICONS = {
  'Comp Sci': 'computer',
  Maths: 'calculate',
  Engineering: 'engineering',
};

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout role="coordinator">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Department Management</h2>
          <p className="font-body-base text-body-base text-secondary mt-1">
            Overview of university departments and assigned department coordinators.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading departments…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map((d) => {
            const coordinatorName = d.coordinator
              ? `${d.coordinator.firstName} ${d.coordinator.lastName}`
              : 'Unassigned';

            return (
              <div
                key={d.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:border-outline transition-colors relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{d.name}</h3>
                    <p className="font-body-sm text-body-sm text-secondary mt-1">
                      Coordinator: <strong className="text-on-surface">{coordinatorName}</strong>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                    <Icon name={DEPT_ICONS[d.name] ?? 'school'} />
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-4 mt-2">
                  <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider block font-semibold mb-1">
                    Coordinator Contact
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    {d.coordinator?.email ?? 'N/A'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
