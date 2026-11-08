import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Hotel, Utensils, Landmark, ArrowRight, Trash2 } from 'lucide-react';
import { DESTINATIONS, HOTELS, RESTAURANTS, ATTRACTIONS } from '../data/travelData';
import { DestinationCard } from '../components/cards/DestinationCard';
import { HotelCard } from '../components/cards/HotelCard';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { AttractionCard } from '../components/cards/AttractionCard';
import { useTravel } from '../context/TravelContext';

export const SavedPage: React.FC = () => {
  const {
    savedDestinationIds,
    savedHotelIds,
    savedRestaurantIds,
    savedAttractionIds
  } = useTravel();

  const [activeTab, setActiveTab] = useState<'destinations' | 'hotels' | 'restaurants' | 'attractions'>('destinations');

  const savedDestinations = DESTINATIONS.filter(d => savedDestinationIds.includes(d.id));
  const savedHotels = HOTELS.filter(h => savedHotelIds.includes(h.id));
  const savedRestaurants = RESTAURANTS.filter(r => savedRestaurantIds.includes(r.id));
  const savedAttractions = ATTRACTIONS.filter(a => savedAttractionIds.includes(a.id));

  const totalSaved =
    savedDestinations.length +
    savedHotels.length +
    savedRestaurants.length +
    savedAttractions.length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Wishlist & Favourites
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Saved Places & Collections
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Your bookmarked destinations, boutique resorts, local food spots, and attractions saved to local storage.
        </p>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'destinations', label: `Destinations (${savedDestinations.length})`, icon: MapPin },
            { id: 'hotels', label: `Hotels (${savedHotels.length})`, icon: Hotel },
            { id: 'restaurants', label: `Food & Cafes (${savedRestaurants.length})`, icon: Utensils },
            { id: 'attractions', label: `Attractions (${savedAttractions.length})`, icon: Landmark }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Groups */}
      {activeTab === 'destinations' && (
        <div>
          {savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedDestinations.map(d => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          ) : (
            <EmptyState tabName="Destinations" link="/explore" />
          )}
        </div>
      )}

      {activeTab === 'hotels' && (
        <div>
          {savedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedHotels.map(h => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          ) : (
            <EmptyState tabName="Hotels" link="/hotels" />
          )}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div>
          {savedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRestaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          ) : (
            <EmptyState tabName="Restaurants" link="/food" />
          )}
        </div>
      )}

      {activeTab === 'attractions' && (
        <div>
          {savedAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedAttractions.map(a => (
                <AttractionCard key={a.id} attraction={a} />
              ))}
            </div>
          ) : (
            <EmptyState tabName="Attractions" link="/attractions" />
          )}
        </div>
      )}

    </div>
  );
};

const EmptyState: React.FC<{ tabName: string; link: string }> = ({ tabName, link }) => (
  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-3">
    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
      <Heart className="w-6 h-6" />
    </div>
    <h3 className="font-serif font-bold text-slate-800 text-lg">No saved {tabName.toLowerCase()} yet</h3>
    <p className="text-xs text-slate-500">
      Click the heart icon on any {tabName.slice(0, -1).toLowerCase()} card to save it to your wishlist.
    </p>
    <Link
      to={link}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
    >
      <span>Explore {tabName}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
);
