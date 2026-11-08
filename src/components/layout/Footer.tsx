import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                MovePlanner
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Plan smarter. Explore more. Travel better. The all-in-one travel technology platform combining destination discovery, day-by-day itineraries, interactive maps, and budget calculators.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-950/50 border border-sky-800/40 px-3 py-2 rounded-xl max-w-sm">
              <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
              <span>Transparent planning. No sponsored bias. 100% guest-friendly.</span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations/manali" className="hover:text-white transition-colors">Manali, Himachal</Link></li>
              <li><Link to="/destinations/goa" className="hover:text-white transition-colors">Goa Beaches</Link></li>
              <li><Link to="/destinations/jaipur" className="hover:text-white transition-colors">Jaipur Pink City</Link></li>
              <li><Link to="/destinations/udaipur" className="hover:text-white transition-colors">Udaipur Lakes</Link></li>
              <li><Link to="/destinations/leh-ladakh" className="hover:text-white transition-colors">Leh-Ladakh Passes</Link></li>
              <li><Link to="/destinations/singapore" className="hover:text-white transition-colors">Singapore City</Link></li>
              <li><Link to="/explore" className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">View All 20+ &rarr;</Link></li>
            </ul>
          </div>

          {/* Column 2: Plan & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Planning Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/itinerary-planner" className="hover:text-white transition-colors">Trip Creation Wizard</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Interactive Travel Map</Link></li>
              <li><Link to="/budget-planner" className="hover:text-white transition-colors">Budget Calculator</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Destination Comparison</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition-colors">Hotels & Stays</Link></li>
              <li><Link to="/food" className="hover:text-white transition-colors">Restaurants & Food</Link></li>
              <li><Link to="/best-time-to-visit" className="hover:text-white transition-colors">Seasonal Weather</Link></li>
            </ul>
          </div>

          {/* Column 3: Guides & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Resources & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/travel-guides" className="hover:text-white transition-colors">Travel Guides</Link></li>
              <li><Link to="/travel-tips" className="hover:text-white transition-colors">Safety & Checklists</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About MovePlanner</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">Preferences</Link></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 MovePlanner Inc. All travel listings, sample budgets, and itineraries are designed for realistic trip planning.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms</Link>
            <Link to="/contact" className="hover:text-slate-400">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
