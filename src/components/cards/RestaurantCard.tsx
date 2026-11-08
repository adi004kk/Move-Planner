import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Utensils, Tag } from 'lucide-react';
import { Restaurant } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isRestaurantSaved, toggleSaveRestaurant, formatPrice } = useTravel();
  const saved = isRestaurantSaved(restaurant.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs">
            {restaurant.type}
          </span>
          <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
            {restaurant.priceRange}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveRestaurant(restaurant.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={saved ? 'Remove restaurant from saved' : 'Save restaurant'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        {/* Dietary badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 flex-wrap">
          {restaurant.dietaryOptions.map((opt) => (
            <span
              key={opt}
              className="text-[10px] font-medium bg-emerald-950/80 backdrop-blur-xs text-emerald-200 px-2 py-0.5 rounded-md"
            >
              {opt}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-500 line-clamp-1">
              {restaurant.destinationName} &bull; {restaurant.cuisine.join(', ')}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
            </div>
          </div>

          <Link to={`/food/${restaurant.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {restaurant.name}
            </h3>
          </Link>

          {/* Signature dishes */}
          <div className="mt-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Signature Dishes
            </span>
            <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-2">
              {restaurant.signatureDishes.join(', ')}
            </p>
          </div>
        </div>

        <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Avg. for two</span>
            <span className="text-sm font-bold text-slate-800">
              {formatPrice(restaurant.approxCostForTwo)}
            </span>
          </div>

          <Link
            to={`/food/${restaurant.slug}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-xl transition-all"
          >
            Menu & Location
          </Link>
        </div>
      </div>
    </div>
  );
};
