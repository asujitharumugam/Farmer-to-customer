import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-slate-700" /> Account Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage system notification preferences, security protocols, and platform defaults.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Notification Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-600" /> Notification Preferences
          </h3>

          <div className="space-y-3 text-xs font-bold text-slate-800">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
              <div>
                <p>Email Harvest & Order Status Alerts</p>
                <p className="text-[11px] font-normal text-slate-500">Receive email updates when orders are accepted or dispatched.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
              <div>
                <p>SMS Delivery Text Notifications</p>
                <p className="text-[11px] font-normal text-slate-500">Get instant SMS text when delivery driver is near your home.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security & Password Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" /> Password & Security
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Save All Settings
        </button>

      </form>

    </div>
  );
};

export default Settings;
