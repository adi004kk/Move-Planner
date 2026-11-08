import React, { useState } from 'react';
import { CalendarDays, Sun, CloudRain, Snowflake, Wind, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { Link } from 'react-router-dom';
import { DestinationCard } from '../components/cards/DestinationCard';
import { SEOHead } from '../components/seo/SEOHead';

export const BestTimeToVisitPage: React.FC = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>('October');

  const matchingDestinations = DESTINATIONS.filter(d =>
    d.bestTimeToVisit.bestMonths.includes(selectedMonth)
  );

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title="Best Time to Visit: Month-by-Month Global Seasonal Travel Guide"
        description="Discover where to travel every month of the year. Peak seasons, shoulder seasons, weather conditions, and seasonal cost comparisons."
        keywords="best time to visit, month by month travel, seasonal guide, weather guide, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Seasonality & Climate
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Best Time to Visit: Month-by-Month Guide
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Timing your trip makes all the difference between clear mountain views and heavy monsoon rains. Select any month to see which global destinations are at their absolute peak.
        </p>

        {/* 12-Month Selector Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMonth === m
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations for Selected Month */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Prime Destinations in {selectedMonth}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These destinations have sunny skies, pleasant temperatures, or active festival seasons in {selectedMonth}.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {matchingDestinations.length} Recommended
          </span>
        </div>

        {matchingDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingDestinations.map(d => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No destinations have their primary peak season in this month, but many offer great low-season budget discounts!
          </div>
        )}
      </div>

      {/* Seasonal Travel Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Summer (April - June)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Escape metro heat to the cool Himalayas: Manali, Leh-Ladakh, Kashmir, or alpine Europe in Interlaken.
          </p>
          <span className="text-[11px] font-semibold text-amber-700 block">Highlights: Paragliding, trekking, clear passes</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Monsoon (July - August)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cascading waterfalls and lush hills in Munnar (Kerala), full lakes in Udaipur, and Bali’s dry sunny season.
          </p>
          <span className="text-[11px] font-semibold text-sky-700 block">Highlights: Ayurveda treatments, half-price stays</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Autumn (Sept - Nov)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crisp skies and blooming festivals: Ganga Aarti in Rishikesh & Varanasi, Rajasthan heritage forts, Kyoto maples.
          </p>
          <span className="text-[11px] font-semibold text-indigo-700 block">Highlights: Best season for photography</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Snowflake className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Winter (Dec - Feb)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sun-drenched beaches in Goa, Andaman, Maldives, luxury shopping in Dubai, and ski powder in Gulmarg.
          </p>
          <span className="text-[11px] font-semibold text-blue-700 block">Highlights: Beach life, diving, ski runs</span>
        </div>

      </div>

    </div>
  );
};
