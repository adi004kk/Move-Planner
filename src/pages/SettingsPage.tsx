import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Globe, Download, Trash2, Bell, Shield, Moon, Sun, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Currency } from '../types/travel';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, trips, expenses, savedDestinationIds, showToast, user, logout } = useTravel();

  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [offlineSync, setOfflineSync] = useState(true);
  const [travelAlerts, setTravelAlerts] = useState(true);

  const handleExportData = () => {
    const backupData = {
      app: 'MovePlanner',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      trips,
      expenses,
      savedDestinationIds
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moveplanner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Travel data backup exported successfully!');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear your locally saved data? This will restore standard sample trips.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Configuration
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize currency display, distance metrics, and manage local storage backups.
        </p>
      </div>

      {/* Regional & Localization */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>Regional & Localization</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Active Currency</span>
              <span className="text-slate-500">Updates prices across all hotels, food, and budgets</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 outline-none"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Distance Metric</span>
              <span className="text-slate-500">Used in route calculators and map distance indicators</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setDistanceUnit('km')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  distanceUnit === 'km' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Kilometers
              </button>
              <button
                onClick={() => setDistanceUnit('miles')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  distanceUnit === 'miles' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Miles
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Storage & Backups */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Data Storage & Backups</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Offline Local Storage Sync</span>
              <span className="text-slate-500">Keep trip plans, budgets, and saved items in your browser</span>
            </div>
            <input
              type="checkbox"
              checked={offlineSync}
              onChange={(e) => setOfflineSync(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded-sm cursor-pointer"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export Trips Backup (JSON)</span>
            </button>

            <button
              onClick={handleResetData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account & Session Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-sky-600" />
          <span>Account & Session</span>
        </h2>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">
                {user.isLoggedIn ? user.name : 'Guest Traveler'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                user.isLoggedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {user.isLoggedIn ? 'Logged In' : 'Guest Mode'}
              </span>
            </div>
            <span className="text-xs text-slate-500 block">
              {user.isLoggedIn
                ? `Signed in as ${user.email || 'Verified Traveler'}`
                : 'Trips and preferences are stored only in this local browser.'}
            </span>
          </div>

          <div>
            {user.isLoggedIn ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out from this Device</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>

                <Link
                  to="/signup"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
