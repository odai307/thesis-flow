import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function MaterialIcon({ name, filled = false, className = 'text-[24px]' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  );
}

// Mobile-only top bar + slide-in drawer. Visible only below md.
export default function TopBar({ onMenuClick, user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api
      .getNotifications()
      .then((data) => {
        const count = (data.notifications || []).filter((n) => !n.read).length;
        setUnreadCount(count);
      })
      .catch(() => setUnreadCount(0));
  }, []);

  const badgeText = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-40 bg-surface-bright border-b border-outline-variant md:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-on-surface cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Open menu"
        >
          <MaterialIcon name="menu" />
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
          ThesisFlow
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="text-on-surface-variant relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <MaterialIcon name="notifications" />
          {badgeText && (
            <span className="absolute -top-1 -right-2.5 bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.2 shadow-sm animate-pulse">
              {badgeText}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          title="Logout"
          className="text-error cursor-pointer opacity-80 hover:opacity-100 transition-opacity p-1"
        >
          <MaterialIcon name="logout" className="text-error text-[22px]" />
        </button>
      </div>
    </header>
  );
}
