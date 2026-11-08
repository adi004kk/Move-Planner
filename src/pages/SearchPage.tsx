import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Hotel, Utensils, Landmark, Footprints, BookOpen, Star, X, Sparkles } from 'lucide-react';
import { DESTINATIONS, HOTELS, RESTAURANTS, ATTRACTIONS, ACTIVITIES, TRAVEL_GUIDES } from '../data/travelData';
import { DestinationCard } from '../components/cards/DestinationCard';
import { HotelCard } from '../components/cards/HotelCard';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { AttractionCard } from '../components/cards/AttractionCard';
import { ActivityCard } from '../components/cards/ActivityCard';
import { GuideCard } from '../components/cards/GuideCard';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';


export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const { recentSearches, addRecentSearch, clearRecentSearches } = useTravel();

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'hotels' | 'food' | 'attractions' | 'activities' | 'guides'>('all');

  useEffect(() => {
    if (queryParam) {
      setInputQuery(queryParam);
      addRecentSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
      addRecentSearch(inputQuery.trim());
    }
  };

  const q = inputQuery.toLowerCase().trim();

  const matchedDestinations = DESTINATIONS.filter(d =>
    !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.highlights.some(h => h.toLowerCase().includes(q))
  );

  const matchedHotels = HOTELS.filter(h =>
    !q || h.name.toLowerCase().includes(q) || h.destinationName.toLowerCase().includes(q) || h.amenities.some(a => a.toLowerCase().includes(q))
  );

  const matchedRestaurants = RESTAURANTS.filter(r =>
    !q || r.name.toLowerCase().includes(q) || r.destinationName.toLowerCase().includes(q) || r.cuisine.some(c => c.toLowerCase().includes(q)) || r.signatureDishes.some(s => s.toLowerCase().includes(q))
  );

  const matchedAttractions = ATTRACTIONS.filter(a =>
    !q || a.name.toLowerCase().includes(q) || a.destinationName.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
  );

  const matchedActivities = ACTIVITIES.filter(act =>
    !q || act.name.toLowerCase().includes(act.name) || act.destinationName.toLowerCase().includes(q) || act.category.toLowerCase().includes(q)
  );

  const matchedGuides = TRAVEL_GUIDES.filter(g =>
    !q || g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q))
  );

  const totalResults =
    matchedDestinations.length +
    matchedHotels.length +
    matchedRestaurants.length +
    matchedAttractions.length +
    matchedActivities.length +
    matchedGuides.length;

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title={inputQuery ? `Search Results for "${inputQuery}"` : 'Global Travel Search — Destinations, Stays & Sights'}
        description={`Search across destinations, hotels, local cuisine, and travel activities on MovePlanner. ${inputQuery ? `Showing search results for ${inputQuery}.` : ''}`}
        keywords="travel search, hotel search, attraction finder, explore cities, MovePlanner"
      />
      
      {/* Search Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h1 className="font-serif text-3xl font-extrabold text-slate-900">
          Global Travel Search
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search cities, hotels, street food spots, mountain passes, and packing guides.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="mt-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Manali, Goa beaches, boutique hotels, momos, scuba diving..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 focus:bg-white text-slate-800 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
          >
            Search
          </button>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Recent Searches:</span>
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setInputQuery(term);
                  setSearchParams({ q: term });
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 font-medium transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              onClick={clearRecentSearches}
              className="text-[11px] text-slate-400 hover:text-rose-500 ml-auto"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `All Results (${totalResults})` },
          { id: 'destinations', label: `Destinations (${matchedDestinations.length})` },
          { id: 'attractions', label: `Attractions (${matchedAttractions.length})` },
          { id: 'hotels', label: `Hotels (${matchedHotels.length})` },
          { id: 'food', label: `Food & Cafes (${matchedRestaurants.length})` },
          { id: 'activities', label: `Activities (${matchedActivities.length})` },
          { id: 'guides', label: `Guides (${matchedGuides.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Content */}
      <div className="space-y-12">
        
        {/* Destinations Group */}
        {(activeTab === 'all' || activeTab === 'destinations') && matchedDestinations.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>Destinations ({matchedDestinations.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {matchedDestinations.map(d => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        )}

        {/* Attractions Group */}
        {(activeTab === 'all' || activeTab === 'attractions') && matchedAttractions.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-purple-600" />
              <span>Attractions & Sights ({matchedAttractions.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedAttractions.map(a => (
                <AttractionCard key={a.id} attraction={a} />
              ))}
            </div>
          </div>
        )}

        {/* Hotels Group */}
        {(activeTab === 'all' || activeTab === 'hotels') && matchedHotels.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-indigo-600" />
              <span>Accommodations ({matchedHotels.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedHotels.map(h => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          </div>
        )}

        {/* Food Group */}
        {(activeTab === 'all' || activeTab === 'food') && matchedRestaurants.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <span>Food & Dining Spots ({matchedRestaurants.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedRestaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        )}

        {/* Activities Group */}
        {(activeTab === 'all' || activeTab === 'activities') && matchedActivities.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-emerald-600" />
              <span>Things to Do ({matchedActivities.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedActivities.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          </div>
        )}

        {/* Guides Group */}
        {(activeTab === 'all' || activeTab === 'guides') && matchedGuides.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Travel Guides ({matchedGuides.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedGuides.map(g => (
                <GuideCard key={g.id} guide={g} />
              ))}
            </div>
          </div>
        )}

        {/* No Results Fallback */}
        {totalResults === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">No matches found for "{inputQuery}"</h3>
            <p className="text-xs text-slate-500">Try searching for Manali, Goa, Singapore, hotels, cafes, or treks.</p>
          </div>
        )}

      </div>

    </div>
  );
};
