import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, GraduationCap, LogOut, User, Check, ExternalLink, Menu, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout, isCompany } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to={isCompany ? '/company' : '/dashboard'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                  Placement Portal
                </span>
                <span className="text-[11px] text-slate-400 font-medium">College CSE Placement Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`pt-2.5 pb-2 px-2 rounded-xl transition cursor-pointer ${
                            notif.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className={`text-xs font-semibold ${notif.isRead ? 'text-slate-700' : 'text-blue-900'}`}>
                              {notif.title}
                            </h5>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="mt-1 block text-[10px] text-slate-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                    <Link
                      to={isCompany ? '/company/applicants' : '/notifications'}
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      View all notifications <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700 font-semibold text-xs">
                  {user?.profilePhotoUrl ? (
                    <img src={user.profilePhotoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <span className="block text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || 'Student User'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {user?.role || 'STUDENT'}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {!isCompany ? (
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile
                      </Link>
                    ) : (
                      <Link
                        to="/company/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" /> Company Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
