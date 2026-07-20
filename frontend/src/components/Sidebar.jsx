import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navByRole } from '../data/navItems';
import { api } from '../lib/api';

function MaterialIcon({ name, filled = false, className = 'text-[20px]' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  );
}

export default function Sidebar({ role, onNavigate }) {
  const items = navByRole[role] ?? navByRole.student;
  // Resolve the student's real thesis id so workspace/version-history links work.
  const [thesisId, setThesisId] = useState(null);

  useEffect(() => {
    if (role !== 'student') return;
    api
      .getTheses()
      .then((data) => setThesisId(data.theses[0]?.id ?? null))
      .catch(() => setThesisId(null));
  }, [role]);

  function resolveTo(to) {
    if (thesisId) return to.replace(':id', thesisId);
    // No thesis yet: point workspace/version-history to the dashboard for now.
    if (to.includes('/workspace')) return '/dashboard';
    if (to.includes('/version-history')) return '/dashboard';
    return to.replace(':id', 't-1');
  }

  return (
    <nav className="bg-surface-container-lowest text-primary h-screen w-sidebar-width flex-shrink-0 sticky top-0 border-r border-outline-variant flex flex-col py-gutter px-4 z-50">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold">
          TF
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold leading-none">
            ThesisFlow
          </h1>
          <span className="font-label-xs text-label-xs text-secondary mt-1 block">
            Academic Portal
          </span>
        </div>
      </div>

      {/* Primary nav */}
      <ul className="flex flex-col gap-2 flex-grow">
        {items.map((item) => (
          <li key={item.label}>
            <NavLink
              to={resolveTo(item.to)}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-secondary hover:bg-surface-container-high'
                }`
              }
            >
              <MaterialIcon name={item.icon} />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors"
        >
          <MaterialIcon name="settings" />
          Settings
        </NavLink>
      </div>
    </nav>
  );
}
