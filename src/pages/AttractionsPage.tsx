import React, { useState, useMemo } from 'react';
import { Landmark, Search, Clock, Ticket, Star, MapPin } from 'lucide-react';
import { ATTRACTIONS, DESTINATIONS } from '../data/travelData';
import { AttractionCard } from '../components/cards/AttractionCard';
import { SEOHead } from '../components/seo/SEOHead';



export const AttractionsPage: React.FC = () => {
  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Monument', 'Nature', 'Temple', 'Viewpoint', 'Museum', 'Beach', 'Adventure'];

  const filteredAttractions = useMemo(() => {
    return ATTRACTIONS.filter(attr => {
      if (destinationFilter !== 'All' && attr.destinationId !== destinationFilter) {
        return false;
      }
      if (categoryFilter !== 'All' && attr.category !== categoryFilter) {
        return false;
      }
      if (freeOnly && !attr.entryFee.isFree) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = attr.name.toLowerCase().includes(q);
        const matchesDesc = attr.description.toLowerCase().includes(q);
        const matchesDest = attr.destinationName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesDest) return false;
      }
      return true;
    });
  }, [destinationFilter, categoryFilter, freeOnly, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Attractions & Historic Landmarks — Monuments, Nature & Viewpoints"
        description="Discover famous attractions, historical monuments, mountain passes, and natural wonders. View entry fees, timings, and insider visit tips."
        keywords="tourist attractions, historic monuments, travel landmarks, sightseeing, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          Sightseeing & Landmarks
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Attractions & Historical Sights
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Explore UNESCO heritage forts, ancient Himalayan pagodas, sacred river ghats, and high mountain passes.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
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
              Sight Type
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

          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-800">Free Admission</span>
              <span className="text-[10px] text-slate-400">No ticket needed</span>
            </div>
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded-sm cursor-pointer"
            />
          </div>

          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search sight name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{filteredAttractions.length}</strong> attractions</span>
          <span className="text-slate-400">Opening times & entry estimates verified for travel planning</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAttractions.map(attr => (
            <AttractionCard key={attr.id} attraction={attr} />
          ))}
        </div>
      </div>

    </div>
  );
};
