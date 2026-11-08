import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, MapPin, X, ArrowUpDown } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationCard } from '../components/cards/DestinationCard';
import { Destination } from '../types/travel';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';


export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { formatPrice } = useTravel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedIdealFor, setSelectedIdealFor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'budget-asc' | 'budget-desc' | 'reviews'>('rating');
  const [maxBudget, setMaxBudget] = useState<number>(50000);

  const categories = ['All', 'Hill Station', 'Beach', 'Heritage & Culture', 'Spiritual', 'Adventure', 'Urban & Modern', 'Nature & Wildlife'];
  const idealForOptions = ['All', 'Couples', 'Solo', 'Family', 'Adventure', 'Relaxation', 'Culture', 'Foodies'];

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      // Category filter
      if (selectedCategory !== 'All' && dest.category !== selectedCategory) {
        return false;
      }
      // Country filter
      if (selectedCountry === 'India' && dest.country !== 'India') return false;
      if (selectedCountry === 'International' && dest.country === 'India') return false;

      // Ideal for filter
      if (selectedIdealFor !== 'All' && !dest.idealFor.includes(selectedIdealFor as any)) {
        return false;
      }

      // Budget filter
      if (dest.estimatedDailyBudget.midRange > maxBudget) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesState = dest.stateOrRegion.toLowerCase().includes(q);
        const matchesCountry = dest.country.toLowerCase().includes(q);
        const matchesHighlights = dest.highlights.some(h => h.toLowerCase().includes(q));
        if (!matchesName && !matchesState && !matchesCountry && !matchesHighlights) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'budget-asc') return a.estimatedDailyBudget.midRange - b.estimatedDailyBudget.midRange;
      if (sortBy === 'budget-desc') return b.estimatedDailyBudget.midRange - a.estimatedDailyBudget.midRange;
      return 0;
    });
  }, [selectedCategory, selectedCountry, selectedIdealFor, maxBudget, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCountry('All');
    setSelectedIdealFor('All');
    setMaxBudget(50000);
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Explore Worldwide Destinations — Hill Stations, Beaches, Heritage & Culture"
        description="Discover top travel destinations worldwide. Filter by travel style, daily budget, season, and geography with verified safety ratings and cost estimates."
        keywords="explore destinations, hill stations, beach vacations, romantic getaways, adventure trips, MovePlanner"
      />
      
      {/* Page Header */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Curated Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Explore All Destinations
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Discover {DESTINATIONS.length} world-class travel hubs across India and overseas. Compare ideal seasons, average daily expenses, and top sights.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by city, country, or interest (e.g. Goa, temples, paragliding)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="budget-asc">Budget: Low to High</option>
                <option value="budget-desc">Budget: High to Low</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Region & Travel Style Sub-filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Region:</span>
            {['All', 'India', 'International'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedCountry(region)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedCountry === region ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Best For:</span>
            {idealForOptions.slice(0, 5).map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedIdealFor(opt)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedIdealFor === opt ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900">{filteredDestinations.length}</strong> matching destinations</span>
        {selectedCategory !== 'All' && (
          <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-medium">
            Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-lg">No matching destinations found</h3>
          <p className="text-xs text-slate-500">Try broadening your search criteria or resetting filters.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
