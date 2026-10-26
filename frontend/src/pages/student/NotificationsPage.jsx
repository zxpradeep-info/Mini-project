import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  Award,
  XCircle,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'SHORTLISTED':
      case 'SELECTED':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'INTERVIEW_SCHEDULED':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'JOB_MATCH':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time updates regarding application status changes, shortlists, and placement alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold border border-blue-200/60 transition"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">You have no notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`pt-4 pb-3 px-4 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? 'hover:bg-slate-50/70'
                    : 'bg-blue-50/40 border border-blue-100/70 hover:bg-blue-50/70'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                    {getIconForType(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${notif.isRead ? 'text-slate-800' : 'text-slate-950'}`}>
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1.5">
                      {new Date(notif.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <Link
                    to="/applications"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition"
                  >
                    View Application <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
