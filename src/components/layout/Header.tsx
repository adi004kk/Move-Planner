import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Heart,
  MapPin,
  Briefcase,
  User,
  Menu,
  X,
  Globe,
  Sparkles,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { Currency } from '../../types/travel';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { currency, setCurrency, savedDestinationIds, savedHotelIds, savedAttractionIds, user, logout } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalSavedCount = savedDestinationIds.length + savedHotelIds.length + savedAttractionIds.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  MovePlanner
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-600 -mt-1 hidden sm:block">
                  Travel Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Manali, Goa, hotels, cafes, treks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-sky-500 rounded-full outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-inner"
              />
            </div>
          </form>

          {/* Right: Actions (Currency, Itinerary Wizard CTA, Saved, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                title="Change currency"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
              </button>
              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {currencies.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${
                        currency === curr.code ? 'font-bold text-sky-600 bg-sky-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr.label}</span>
                      {currency === curr.code && <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Trip Planner Button */}
            <Link
              to="/itinerary-planner"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/30 transition-all hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </Link>

            {/* Saved Places Link */}
            <Link
              to="/saved"
              className="relative p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Saved places"
            >
              <Heart className="w-5 h-5" />
              {totalSavedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalSavedCount}
                </span>
              )}
            </Link>

            {/* Trips Link */}
            <Link
              to="/trips"
              className="hidden lg:flex p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="My trips"
            >
              <Briefcase className="w-5 h-5" />
            </Link>

            {/* Auth / Profile Area */}
            {user.isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs truncate block max-w-[150px]">
                          {user.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                        {user.email || 'Verified Traveler'}
                      </span>
                    </div>

                    {/* Menu Links */}
                    <div className="py-1 text-xs">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-600 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Preferences</span>
                      </Link>

                      <Link
                        to="/trips"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-600 font-medium transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>My Trips</span>
                      </Link>

                      <Link
                        to="/saved"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-600 font-medium transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Saved Places ({totalSavedCount})</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-600 font-medium transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Logout Action */}
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>

                <Link
                  to="/signup"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations, hotels, food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 rounded-full outline-none border border-transparent focus:border-sky-500"
            />
          </div>
        </form>
      </div>
    </header>
  );
};
