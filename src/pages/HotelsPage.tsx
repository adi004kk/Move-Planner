import React, { useState, useMemo } from 'react';
import { Hotel as HotelIcon, Search, Calendar, Users, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { HOTELS, DESTINATIONS } from '../data/travelData';
import { HotelCard } from '../components/cards/HotelCard';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';




export const HotelsPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');
  const [familyFriendlyOnly, setFamilyFriendlyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  const propertyTypes = ['All', 'Luxury Resort', 'Heritage Palace', 'Boutique Hotel', 'Hostel'];
  const amenitiesList = ['All', 'Pool', 'Spa', 'Beach', 'Wi-Fi', 'Balcony'];

  const filteredHotels = useMemo(() => {
    return HOTELS.filter(hotel => {
      if (destinationFilter !== 'All' && hotel.destinationId !== destinationFilter) {
        return false;
      }
      if (propertyType !== 'All' && hotel.type !== propertyType) {
        return false;
      }
      if (hotel.pricePerNight > maxPrice) {
        return false;
      }
      if (familyFriendlyOnly && !hotel.familyFriendly) {
        return false;
      }
      if (selectedAmenity !== 'All') {
        const hasAmenity = hotel.amenities.some(a => a.toLowerCase().includes(selectedAmenity.toLowerCase()));
        if (!hasAmenity) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      return 0;
    });
  }, [destinationFilter, propertyType, maxPrice, selectedAmenity, familyFriendlyOnly, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="Discover Best Hotels, Boutique Stays & Luxury Resorts"
        description="Find and compare top-rated boutique hotels, royal palaces, beach resorts, and backpacker hostels worldwide. Verified pricing, amenities, and room choices."
        keywords="hotel booking, luxury resorts, boutique stays, hostels, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Accommodations
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Hotels, Resorts & Hostels
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          From floating Lake Pichola palaces to Himalayan boutique cedar retreats and beach shacks.
        </p>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {/* Destination Selector */}
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

          {/* Property Type */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer mt-0.5"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Family Friendly Toggle */}
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-800">Family Friendly</span>
              <span className="text-[10px] text-slate-400">Suitable for kids</span>
            </div>
            <input
              type="checkbox"
              checked={familyFriendlyOnly}
              onChange={(e) => setFamilyFriendlyOnly(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Amenity Badges */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium">Amenity:</span>
          {amenitiesList.map(amenity => (
            <button
              key={amenity}
              onClick={() => setSelectedAmenity(amenity)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedAmenity === amenity ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{filteredHotels.length}</strong> properties</span>
          <span className="text-slate-400">Rates shown are estimated sample averages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>

    </div>
  );
};
