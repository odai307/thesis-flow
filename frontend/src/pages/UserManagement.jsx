import AppLayout from '../components/AppLayout';
import { allUsers } from '../data/mockData';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
}

export default function UserManagement() {
  return (
    <AppLayout role="coordinator">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">User Management</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            Create, edit, and deactivate users across the department.
          </p>
        </div>
        <button className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary transition-colors shadow-sm">
          <Icon name="person_add" className="text-[18px]" />
          Add User
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className={`py-3 px-6 font-label-xs text-secondary uppercase tracking-wider ${
                      h === 'Actions' ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface divide-y divide-outline-variant">
              {allUsers.map((u) => (
                <tr key={u.id} className={`transition-colors group ${u.status === 'deactivated' ? 'opacity-80' : 'hover:bg-surface-container-low'}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md border border-outline-variant">
                        {initials(u.name)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-secondary">{u.email}</td>
                  <td className="py-4 px-6">{u.role}</td>
                  <td className="py-4 px-6">{u.department}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-xs ${
                        u.status === 'active'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {u.status === 'active' ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-variant transition-colors">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <span className="font-body-sm text-secondary">
            Showing 1 to {allUsers.length} of {allUsers.length} users
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-outline-variant text-secondary font-label-sm hover:bg-surface-container-high disabled:opacity-50 transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface bg-surface font-label-sm hover:bg-surface-container-high transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
