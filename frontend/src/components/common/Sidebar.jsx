import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wrench,
  Briefcase,
  FileCheck2,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Building2,
  PlusCircle,
  Users,
  Shuffle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, isCompany, logout, updateUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const switchRole = () => {
    const newRole = isCompany ? 'STUDENT' : 'COMPANY';
    updateUser({
      role: newRole,
      name: newRole === 'STUDENT' ? 'Pradeep Kumar' : 'ABC Tech HR Recruiter',
    });
    navigate(newRole === 'STUDENT' ? '/dashboard' : '/company');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'My Skills', path: '/skills', icon: Wrench },
    { name: 'Jobs & Internships', path: '/jobs', icon: Briefcase },
    { name: 'Applications', path: '/applications', icon: FileCheck2 },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Help & Support', path: '/support', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const companyLinks = [
    { name: 'Dashboard', path: '/company', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/company/profile', icon: Building2 },
    { name: 'Post Jobs', path: '/company/post-job', icon: PlusCircle },
    { name: 'Manage Jobs', path: '/company/manage-jobs', icon: Briefcase },
    { name: 'Applicants', path: '/company/applicants', icon: Users },
    { name: 'Applications', path: '/company/applications', icon: FileCheck2 },
    { name: 'Notifications', path: '/company/notifications', icon: Bell },
    { name: 'Help & Support', path: '/company/support', icon: HelpCircle },
    { name: 'Settings', path: '/company/settings', icon: Settings },
  ];

  const links = isCompany ? companyLinks : studentLinks;

  const content = (
    <div className="flex flex-col h-full justify-between bg-white border-r border-slate-100 p-4">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              PP
            </div>
            <span className="font-bold text-slate-800 text-sm">Placement Portal</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Current Portal</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
            isCompany ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isCompany ? 'Company / Admin' : 'Student'}
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/dashboard' || link.path === '/company'}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        <button
          onClick={switchRole}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 rounded-xl transition"
          title="Switch view between Student and Recruiter/Company"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Switch to {isCompany ? 'Student View' : 'Company View'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-16 left-0 z-20 overflow-y-auto">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
