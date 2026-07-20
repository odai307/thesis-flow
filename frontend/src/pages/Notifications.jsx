import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[24px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const TYPE_ICON = {
  comment: { name: 'comment', cls: 'bg-primary-fixed text-primary-container' },
  status_change: { name: 'check_circle', cls: 'bg-tertiary-fixed text-tertiary' },
  upload: { name: 'upload_file', cls: 'bg-surface-variant text-on-surface-variant' },
  system: { name: 'info', cls: 'bg-surface-variant text-on-surface-variant' },
};

function relativeTime(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getNotifications()
      .then((data) => setNotifications(data.notifications))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function markAllRead() {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      setError(e.message);
    }
  }

  async function markOneRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.markNotificationRead(id);
    } catch (e) {
      setError(e.message);
    }
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">
            Notifications
            {unread > 0 && (
              <span className="ml-3 align-middle bg-error text-on-error text-[11px] font-semibold rounded-full px-2 py-0.5">
                {unread} new
              </span>
            )}
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            Stay updated on your academic progress.
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container transition-colors shrink-0 disabled:opacity-50"
        >
          <Icon name="done_all" className="text-[18px]" />
          Mark all as read
        </button>
      </div>

      {loading ? (
        <p className="font-body-base text-body-base text-on-surface-variant">Loading notifications…</p>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      ) : notifications.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
          <Icon name="notifications" className="text-[40px] text-outline" />
          <p className="font-body-base text-body-base text-on-surface-variant mt-3">
            You&apos;re all caught up. No notifications yet.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface px-6 py-3 border-b border-outline-variant">
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
              Recent
            </span>
          </div>

          {notifications.map((n, i) => {
            const icon = TYPE_ICON[n.type] ?? TYPE_ICON.system;
            const isLast = i === notifications.length - 1;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markOneRead(n.id)}
                className={`relative p-6 ${isLast ? '' : 'border-b border-outline-variant'} hover:bg-surface-container-low transition-colors cursor-pointer group ${
                  n.read ? '' : 'bg-inverse-on-surface/30'
                }`}
              >
                {!n.read && (
                  <div className="absolute top-6 left-3 w-2 h-2 rounded-full bg-primary-container" />
                )}
                <div className="flex items-start gap-4 pl-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${icon.cls}`}
                  >
                    <Icon name={icon.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-section-header text-section-header text-on-background line-clamp-1">
                        {n.message}
                      </h4>
                      <span className="font-label-xs text-label-xs text-primary shrink-0">
                        {relativeTime(n.createdAt)}
                      </span>
                    </div>
                    {n.thesisId && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Thesis reference available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
