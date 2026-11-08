import React, { useState } from 'react';
import { BookOpen, Search, Clock, Tag, Sparkles } from 'lucide-react';
import { TRAVEL_GUIDES } from '../data/travelData';
import { GuideCard } from '../components/cards/GuideCard';
import { SEOHead } from '../components/seo/SEOHead';

export const TravelGuidesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Solo Travel', 'Packing & Gear', 'Road Trips', 'Budget', 'Safety'];

  const filteredGuides = TRAVEL_GUIDES.filter(guide => {
    if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchSummary = guide.summary.toLowerCase().includes(q);
      const matchTags = guide.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Editorial Travel Guides & Field Playbooks"
        description="In-depth travel guides written by globetrotters. Packing lists, solo travel safety, high-altitude road trips, and budget hacks."
        keywords="travel guides, solo travel, packing list, road trips, budget travel, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Travel Knowledge
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Editorial Travel Guides & Field Playbooks
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Actionable, honest guides written for modern travelers. Master carry-on packing, navigate monsoons, and solo travel with ease.
        </p>

        {/* Search & Categories */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides by topic (e.g. solo, packing, monsoon, safety)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGuides.map(guide => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

    </div>
  );
};
