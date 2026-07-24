import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navByRole } from '../data/navItems';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { getSocket, joinUserRoom } from '../lib/socket';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = navByRole[role] ?? navByRole.student;
  const [thesisId, setThesisId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (role === 'student') {
      api
        .getTheses()
        .then((data) => setThesisId(data.theses[0]?.id ?? null))
        .catch(() => setThesisId(null));
    }
  }, [role]);

  // Fetch unread notifications count + Real-time socket listener
  const fetchUnread = () => {
    api
      .getNotifications()
      .then((data) => {
        const count = (data.notifications || []).filter((n) => !n.read).length;
        setUnreadCount(count);
      })
      .catch(() => setUnreadCount(0));
  };

  useEffect(() => {
    fetchUnread();

    if (user?.id) {
      joinUserRoom(user.id);
      const socket = getSocket();

      socket.on('notification:new', fetchUnread);
      socket.on('notification:read', fetchUnread);
      socket.on('notification:readAll', fetchUnread);

      // Interval fallback polling every 5s
      const interval = setInterval(fetchUnread, 5000);

      return () => {
        socket.off('notification:new', fetchUnread);
        socket.off('notification:read', fetchUnread);
        socket.off('notification:readAll', fetchUnread);
        clearInterval(interval);
      };
    }
  }, [user?.id]);

  const badgeText = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null;

  function resolveTo(to) {
    if (thesisId) return to.replace(':id', thesisId);
    if (to.includes('/workspace')) return '/dashboard';
    if (to.includes('/version-history')) return '/dashboard';
    return to.replace(':id', 't-1');
  }

  function handleLogout() {
    logout();
    if (onNavigate) onNavigate();
    navigate('/login');
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

              {/* Notification Badge: Shows 1..9 or 9+ */}
              {item.label === 'Notifications' && badgeText && (
                <span className="bg-error text-on-error font-label-xs text-[11px] font-bold px-2 py-0.5 rounded-full ml-auto shadow-sm animate-pulse">
                  {badgeText}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-1">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors"
        >
          <MaterialIcon name="settings" />
          Settings / Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md text-error hover:bg-error-container/20 transition-colors w-full text-left cursor-pointer"
        >
          <MaterialIcon name="logout" className="text-error" />
          Logout
        </button>
      </div>
    </nav>
  );
}
