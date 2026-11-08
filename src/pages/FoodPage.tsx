import React, { useState, useMemo } from 'react';
import { Utensils, Search, Star, MapPin, Tag, Heart } from 'lucide-react';
import { RESTAURANTS, DESTINATIONS } from '../data/travelData';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';


export const FoodPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Local Eatery', 'Street Food Stall', 'Cafe', 'Fine Dining'];
  const dietaryTags = ['All', 'Vegetarian Friendly', 'Pure Veg', 'Vegan Options', 'Halal'];
  const priceRanges = ['All', '$', '$$', '$$$', '$$$$'];

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(r => {
      if (destinationFilter !== 'All' && r.destinationId !== destinationFilter) {
        return false;
      }
      if (selectedType !== 'All' && r.type !== selectedType) {
        return false;
      }
      if (selectedPriceRange !== 'All' && r.priceRange !== selectedPriceRange) {
        return false;
      }
      if (selectedDietary !== 'All' && !r.dietaryOptions.includes(selectedDietary as any)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine.some(c => c.toLowerCase().includes(q));
        const matchesDishes = r.signatureDishes.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCuisine && !matchesDishes) return false;
      }
      return true;
    });
  }, [destinationFilter, selectedType, selectedDietary, selectedPriceRange, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Culinary & Dining Guide — Local Street Food, Cafes & Fine Dining"
        description="Explore the best restaurants, local eateries, cafes, and street food stalls. Filter by dietary accommodations (Vegetarian, Halal, Vegan) and price range."
        keywords="local food guide, best restaurants, street food, cafes, culinary travel, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Gastronomy & Local Flavors
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Restaurants, Cafes & Street Food
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          From Manali’s river trout and Old Delhi-style kachoris to Michelin hawker stalls in Singapore and Goan fish thalis.
        </p>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          
          {/* Destination */}
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

          {/* Type */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Dining Style
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Dietary */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Dietary Preference
            </label>
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              {dietaryTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Search Food */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Dish (momos, thali, pizza)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none"
            />
          </div>

        </div>

        {/* Price Range Pills */}
        <div className="flex items-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 font-medium">Price Bracket:</span>
          {priceRanges.map(pr => (
            <button
              key={pr}
              onClick={() => setSelectedPriceRange(pr)}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                selectedPriceRange === pr ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {pr === 'All' ? 'All Prices' : pr}
            </button>
          ))}
        </div>

      </div>

      {/* Food Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{filteredRestaurants.length}</strong> food spots</span>
          <span className="text-slate-400">Dietary options verified from local menus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>

    </div>
  );
};
