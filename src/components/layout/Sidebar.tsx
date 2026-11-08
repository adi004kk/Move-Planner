import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Map,
  Search,
  Sparkles,
  Hotel,
  UtensilsCrossed,
  Landmark,
  Footprints,
  Bus,
  CalendarDays,
  Briefcase,
  Heart,
  Calculator,
  BookOpen,
  ShieldAlert,
  Scale,
  User,
  Settings,
  Info,
  Phone,
  X,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useTravel();
  const navSections = [
    {
      title: 'DISCOVER',
      items: [
        { label: 'Home', path: '/', icon: Compass },
        { label: 'Explore Destinations', path: '/explore', icon: MapPin },
        { label: 'Interactive Map', path: '/map', icon: Map },
        { label: 'Global Search', path: '/search', icon: Search },
        { label: 'Compare Destinations', path: '/compare', icon: Scale }
      ]
    },
    {
      title: 'EXPLORE & RESEARCH',
      items: [
        { label: 'Trip Planning Wizard', path: '/itinerary-planner', icon: Sparkles, badge: 'Popular' },
        { label: 'Hotels & Hostels', path: '/hotels', icon: Hotel },
        { label: 'Food & Restaurants', path: '/food', icon: UtensilsCrossed },
        { label: 'Attractions & Sights', path: '/attractions', icon: Landmark },
        { label: 'Things to Do', path: '/activities', icon: Footprints },
        { label: 'Local Transport', path: '/transport', icon: Bus },
        { label: 'Best Time to Visit', path: '/best-time-to-visit', icon: CalendarDays }
      ]
    },
    {
      title: 'TRIP MANAGEMENT',
      items: [
        { label: 'My Trips', path: '/trips', icon: Briefcase },
        { label: 'Saved Places', path: '/saved', icon: Heart },
        { label: 'Budget Planner', path: '/budget-planner', icon: Calculator },
        { label: 'Travel Guides', path: '/travel-guides', icon: BookOpen },
        { label: 'Safety & Checklists', path: '/travel-tips', icon: ShieldAlert }
      ]
    },
    {
      title: 'ACCOUNT & SUPPORT',
      items: [
        { label: 'Profile & Preferences', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'About MovePlanner', path: '/about', icon: Info },
        { label: 'Contact Us', path: '/contact', icon: Phone }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 z-50 lg:z-30 h-screen lg:h-[calc(100vh-5rem)] w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              MP
            </div>
            <span className="font-serif font-bold text-slate-800 text-lg">MovePlanner</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-sky-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* User Account / Auth Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {user.isLoggedIn ? (
            <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-slate-800 block truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{user.email || 'Verified Traveler'}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to="/profile"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="text-slate-600 hover:text-sky-600 font-medium text-[11px]"
                >
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    logout();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Guest Traveler</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">Not logged in</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Log in to save custom trips and sync itineraries across devices.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <Link
                  to="/login"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Log In</span>
                </Link>

                <Link
                  to="/signup"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-[11px] text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Tagline / Demo Notice */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
          <p className="font-medium text-slate-700">MovePlanner Pro</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Plan smarter. Explore more. Travel better.
          </p>
        </div>
      </aside>
    </>
  );
};
