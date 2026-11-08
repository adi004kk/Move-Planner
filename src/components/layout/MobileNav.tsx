import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Map, Sparkles, Briefcase, Heart } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const MobileNav: React.FC = () => {
  const { savedDestinationIds, savedHotelIds, savedAttractionIds } = useTravel();
  const totalSaved = savedDestinationIds.length + savedHotelIds.length + savedAttractionIds.length;

  const navItems = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Map', path: '/map', icon: Map },
    { label: 'Plan', path: '/itinerary-planner', icon: Sparkles, isPrimary: true },
    { label: 'Trips', path: '/trips', icon: Briefcase },
    { label: 'Saved', path: '/saved', icon: Heart, count: totalSaved }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 lg:hidden shadow-lg no-print">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-sky-700 mt-1">{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 relative transition-colors ${
                  isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
