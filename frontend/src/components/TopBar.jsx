import { notifications } from '../data/mockData';

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
  const unread = notifications.filter((n) => !n.read).length;
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
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
          <MaterialIcon name="notifications" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-semibold rounded-full px-1">
              {unread}
            </span>
          )}
        </button>
        {user?.avatar ? (
          <img
            alt="User avatar"
            className="w-8 h-8 rounded-full border border-outline-variant object-cover"
            src={user.avatar}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md border border-outline-variant">
            {(user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')}
          </div>
        )}
      </div>
    </header>
  );
}
