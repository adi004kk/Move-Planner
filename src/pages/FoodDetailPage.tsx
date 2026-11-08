import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Utensils, Star, Heart, MapPin, Clock, DollarSign, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { RESTAURANTS } from '../data/travelData';
import { useTravel } from '../context/TravelContext';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { SEOHead } from '../components/seo/SEOHead';

export const FoodDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isRestaurantSaved, toggleSaveRestaurant, formatPrice, showToast } = useTravel();

  const restaurant = RESTAURANTS.find(r => r.slug === slug || r.id === slug) || RESTAURANTS[0];
  const saved = isRestaurantSaved(restaurant.id);

  return (
    <div className="space-y-10 pb-20">
      <SEOHead
        title={`${restaurant.name} (${restaurant.destinationName}) — Menu, Reviews & Dining`}
        description={`${restaurant.name} in ${restaurant.destinationName}. ${restaurant.type} serving ${restaurant.cuisine.join(', ')}. Signature dishes: ${restaurant.signatureDishes.slice(0, 3).join(', ')}. Must-try tip: ${restaurant.mustTryTip}`}
        image={restaurant.image}
        type="place"
        keywords={`${restaurant.name}, food in ${restaurant.destinationName}, ${restaurant.type}, best restaurants ${restaurant.destinationName}, MovePlanner`}
        jsonLd={{
          '@type': 'Restaurant',
          name: restaurant.name,
          description: `${restaurant.type} serving ${restaurant.cuisine.join(', ')}. ${restaurant.mustTryTip}`,
          image: [restaurant.image],
          servesCuisine: restaurant.cuisine,
          priceRange: restaurant.priceRange,
          address: {
            '@type': 'PostalAddress',
            streetAddress: restaurant.address,
            addressLocality: restaurant.destinationName
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: restaurant.coordinates.lat,
            longitude: restaurant.coordinates.lng
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: restaurant.rating,
            reviewCount: restaurant.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }}
      />

      
      {/* Hero Media Card */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Link to="/food" className="hover:text-amber-600">Food & Dining</Link>
            <span>&bull;</span>
            <Link to={`/destinations/${restaurant.destinationId.replace('dest-', '')}`} className="hover:text-amber-600">
              {restaurant.destinationName}
            </Link>
            <span>&bull;</span>
            <span className="font-semibold text-slate-800">{restaurant.name}</span>
          </div>

          <button
            onClick={() => toggleSaveRestaurant(restaurant.id)}
            className={`p-2 rounded-full border transition-all ${
              saved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {restaurant.type}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                {restaurant.priceRange}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating}</span>
                <span className="text-slate-400 font-normal">({restaurant.reviewCount} food reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{restaurant.address}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Avg. Cost for Two</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatPrice(restaurant.approxCostForTwo)}
            </span>
            <span className="text-xs text-slate-500"> (Estimated)</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-slate-100 shadow-inner">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Two-Column Grid: Menu & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Signature Dishes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Signature Dishes to Order</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {restaurant.signatureDishes.map((dish, i) => (
                <div key={dish} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-sm">{dish}</h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">Chef specialty & local traveler favorite</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insider Food Tip */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Insider Foodie Tip</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              "{restaurant.mustTryTip}"
            </p>
          </div>

          {/* Dietary Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-slate-900">Dietary Accommodations</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {restaurant.dietaryOptions.map((opt) => (
                <span
                  key={opt}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>

          {/* Food Reviews & Traveler Recommendations */}
          <ReviewsSection
            targetId={restaurant.id}
            targetType="restaurant"
            targetName={restaurant.name}
            baselineRating={restaurant.rating}
            baselineReviewCount={restaurant.reviewCount}
          />

        </div>


        {/* Right Column: Timing, Location & Plan Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-5 sticky top-24">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Practical Dining Info</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Opening Hours</span>
                </span>
                <span className="text-slate-600 font-medium">{restaurant.openingHours}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Location</span>
                </span>
                <span className="text-slate-600 font-medium leading-relaxed">{restaurant.address}</span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Get Directions on Map</span>
            </a>

            <button
              onClick={() => showToast(`Saved "${restaurant.name}" to your meal planning list!`)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Trip Meal Stops</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
