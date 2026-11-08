import React, { useState, useMemo } from 'react';
import { Footprints, Search, Compass, Clock, Award, Filter } from 'lucide-react';
import { ACTIVITIES, DESTINATIONS } from '../data/travelData';
import { ActivityCard } from '../components/cards/ActivityCard';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';

export const ActivitiesPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const categories = ['All', 'Sightseeing', 'Water Sports', 'Cultural', 'Trekking'];
  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];

  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter(act => {
      if (destinationFilter !== 'All' && act.destinationId !== destinationFilter) {
        return false;
      }
      if (categoryFilter !== 'All' && act.category !== categoryFilter) {
        return false;
      }
      if (difficultyFilter !== 'All' && act.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    });
  }, [destinationFilter, categoryFilter, difficultyFilter]);

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Things to Do & Outdoor Adventures — Tours, Treks & Water Sports"
        description="Find top-rated outdoor activities, cultural tours, water sports, and Himalayan treks. Real duration, pricing, and fitness difficulty ratings."
        keywords="things to do, outdoor adventure, water sports, trekking tours, travel activities, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Experiences & Adventures
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Things to Do & Outdoor Thrills
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Paragliding across Himalayan snow valleys, scuba diving coral reefs in Goa & Andaman, bungee jumping, and red dune safaris.
        </p>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Destination
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              <option value="All">All Destinations</option>
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Difficulty Level
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{filteredActivities.length}</strong> adventure experiences</span>
          <span className="text-slate-400">All prices include safety gear & certified instructor briefing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredActivities.map(act => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      </div>

    </div>
  );
};
