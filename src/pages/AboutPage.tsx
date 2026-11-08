import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, Globe, MapPin, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <SEOHead
        title="About MovePlanner — Mission, Editorial Philosophy & Story"
        description="Learn how MovePlanner empowers travelers worldwide with smart itinerary planning, transparent costs, and authentic local discovery without sponsored bias."
        keywords="about MovePlanner, travel platform, smart travel planner, travel mission"
      />
      
      {/* Brand Hero Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-500/25">
          <Compass className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
          About MovePlanner
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Plan smarter. Explore more. Travel better.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          MovePlanner is the modern travel planning platform engineered to end tab overload. We bring together destination discovery, hotels, authentic local eateries, transit guidance, and day-by-day itineraries into one unified workspace.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">No Sponsored Bias</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recommendations prioritize authentic traveler value and cultural distinction over paid placement bids.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Realistic Budgets</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transparent price breakdowns across budget tiers in multi-currency formats with itemized expense logging.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Offline & Guest Friendly</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No forced account walls. Save places, build trips, and export printable PDFs directly from your browser.
          </p>
        </div>
      </div>

      {/* Architecture & Engineering Standards */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Architecture & Design Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          MovePlanner is crafted on modern web standards with React, TypeScript, Tailwind CSS, and Leaflet OpenStreetMap tiles. We adhere to zero-pill discipline, high information density, and responsive multi-device accessibility.
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Version 1.0.0 &bull; 2026 Production Edition</span>
          <Link to="/explore" className="text-sky-600 font-bold hover:underline">
            Explore Destinations &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
};
