import React, { useState } from 'react';
import { Settings, Bell, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    statusAlerts: true,
    interviewReminders: true,
    twoFactor: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Portal Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure notification preferences, security options, and session settings.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-blue-600" /> Notification Channels
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Application Status Change Notifications
                </span>
                <span className="text-xs text-slate-400">
                  Receive instant alerts when shortlisted, rejected, or scheduled for interviews.
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.statusAlerts}
                onChange={(e) => setPrefs({ ...prefs, statusAlerts: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Email Digests & Opportunity Alerts
                </span>
                <span className="text-xs text-slate-400">
                  Receive daily summaries of jobs matching your skill profile.
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailAlerts}
                onChange={(e) => setPrefs({ ...prefs, emailAlerts: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Interview Round Reminders
                </span>
                <span className="text-xs text-slate-400">
                  Receive alerts 24 hours prior to scheduled interviews.
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.interviewReminders}
                onChange={(e) => setPrefs({ ...prefs, interviewReminders: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-blue-600" /> Security & Passwords
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
