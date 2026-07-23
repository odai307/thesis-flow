import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();

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

  async function handleNotificationClick(n) {
    // 1. Mark as read if not already read
    if (!n.read) {
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
      try {
        await api.markNotificationRead(n.id);
      } catch {
        /* silent catch */
      }
    }

    // 2. Determine target page based on role and notification content
    if (!n.thesisId) return;

    if (user?.role === 'student') {
      const subParam = n.referenceId ? `?submissionId=${n.referenceId}` : '';
      navigate(`/thesis/${n.thesisId}/workspace${subParam}`);
    } else if (user?.role === 'supervisor') {
      navigate(`/review/${n.thesisId}`);
    } else if (user?.role === 'coordinator') {
      navigate(`/review/${n.thesisId}`);
    }
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background font-bold">
            Notifications
            {unread > 0 && (
              <span className="ml-3 align-middle bg-error text-on-error text-[11px] font-bold rounded-full px-2.5 py-0.5">
                {unread} unread
              </span>
            )}
          </h2>
          <p className="font-body-base text-body-base text-secondary mt-1">
            Click on any notification to view details and update its status.
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container transition-colors shrink-0 disabled:opacity-50 shadow-sm cursor-pointer"
        >
          <Icon name="done_all" className="text-[18px]" />
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading notifications…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : notifications.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm">
          <Icon name="notifications_off" className="text-[44px] text-outline mb-2" />
          <p className="font-body-base text-body-base text-secondary mt-1">
            You&apos;re all caught up. No notifications found.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-bright px-6 py-3 border-b border-outline-variant flex items-center justify-between">
            <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider font-semibold">
              Recent Notifications ({notifications.length})
            </span>
          </div>

          <div className="divide-y divide-outline-variant/40">
            {notifications.map((n) => {
              const icon = TYPE_ICON[n.type] ?? TYPE_ICON.system;
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`relative p-6 hover:bg-surface-container-low transition-colors cursor-pointer group flex items-start gap-4 ${
                    n.read ? 'opacity-80' : 'bg-primary-fixed/10 font-medium'
                  }`}
                >
                  {!n.read && (
                    <div className="absolute top-7 left-3 w-2.5 h-2.5 rounded-full bg-primary shadow-sm animate-pulse" />
                  )}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${icon.cls}`}
                  >
                    <Icon name={icon.name} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-section-header text-section-header text-on-surface group-hover:text-primary transition-colors">
                        {n.message}
                      </h4>
                      <span className="font-label-xs text-label-xs text-secondary shrink-0">
                        {relativeTime(n.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-label-xs text-label-xs text-primary bg-surface-container px-2 py-0.5 rounded border border-outline-variant">
                        Click to view details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
