import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, MapPin, Compass, Utensils, Heart, Briefcase, Award, ShieldCheck, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Currency } from '../types/travel';

export const ProfilePage: React.FC = () => {
  const { user, updateUserPreferences, logout, loginAsDemoUser, trips, savedDestinationIds, savedHotelIds, savedAttractionIds } = useTravel();

  const [name, setName] = useState(user.name);
  const [homeCity, setHomeCity] = useState(user.homeCity);
  const [preferredCurrency, setPreferredCurrency] = useState<Currency>(user.preferredCurrency);
  const [travelStyle, setTravelStyle] = useState(user.travelStyle);

  useEffect(() => {
    setName(user.name);
    setHomeCity(user.homeCity);
    setPreferredCurrency(user.preferredCurrency);
    setTravelStyle(user.travelStyle);
  }, [user]);

  const totalSaved = savedDestinationIds.length + savedHotelIds.length + savedAttractionIds.length;
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.itinerary?.days?.length || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({
      name,
      homeCity,
      preferredCurrency,
      travelStyle
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-sky-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                {user.isLoggedIn ? 'Verified Traveler' : 'Guest Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>{user.homeCity || 'Travel Explorer'}</span>
              {user.email && (
                <>
                  <span>&bull;</span>
                  <span>{user.email}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user.isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5 border border-rose-200/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
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
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </Link>

              <button
                onClick={loginAsDemoUser}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                title="Fast demo sign in"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guest Mode Notice */}
      {!user.isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block">You are in Guest Mode</span>
              <span className="text-amber-800/90 text-[11px]">
                Your trips and saved places are stored in your local browser cache. Log in to sync across devices.
              </span>
            </div>
          </div>
          <Link
            to="/login"
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors shrink-0"
          >
            Log In Now
          </Link>
        </div>
      )}

      {/* Travel Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Created Trips</span>
          <span className="text-3xl font-extrabold text-slate-900 block">{trips.length}</span>
          <span className="text-[11px] text-slate-500">Active & completed trip plans</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Saved Places</span>
          <span className="text-3xl font-extrabold text-rose-500 block">{totalSaved}</span>
          <span className="text-[11px] text-slate-500">Destinations, hotels & dining spots</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Planned Days</span>
          <span className="text-3xl font-extrabold text-sky-600 block">{totalDaysPlanned}</span>
          <span className="text-[11px] text-slate-500">Daily itineraries generated</span>
        </div>
      </div>

      {/* Profile & Travel Style Preferences Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="font-serif text-xl font-bold text-slate-900">
          Personal Travel Preferences
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Home Origin City</label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, Bengaluru..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Currency</label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as Currency)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Typical Travel Pacing</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="Relaxed">Relaxed (1-2 stops per day)</option>
                <option value="Balanced">Balanced (2-3 stops per day)</option>
                <option value="Fast-Paced">Fast-Paced (4+ sights per day)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
