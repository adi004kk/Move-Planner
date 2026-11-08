import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  Plane,
  Train,
  Car,
  ShieldCheck,
  Compass,
  Utensils,
  Hotel as HotelIcon,
  Landmark,
  ArrowRight,
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { DESTINATIONS, ATTRACTIONS, HOTELS, RESTAURANTS, ACTIVITIES } from '../data/travelData';
import { HotelCard } from '../components/cards/HotelCard';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { AttractionCard } from '../components/cards/AttractionCard';
import { ActivityCard } from '../components/cards/ActivityCard';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { PriceTrendsChart } from '../components/common/PriceTrendsChart';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { SEOHead } from '../components/seo/SEOHead';
import { useTravel } from '../context/TravelContext';


export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDestinationSaved, toggleSaveDestination, formatPrice, showToast, getReviewsForTarget } = useTravel();

  const destination = DESTINATIONS.find(d => d.slug === slug || d.id === slug) || DESTINATIONS[0];
  const saved = isDestinationSaved(destination.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'price-trends' | 'attractions' | 'hotels' | 'food' | 'activities' | 'practical' | 'map' | 'reviews'>('overview');


  const destinationAttractions = ATTRACTIONS.filter(a => a.destinationId === destination.id);
  const destinationHotels = HOTELS.filter(h => h.destinationId === destination.id);
  const destinationRestaurants = RESTAURANTS.filter(r => r.destinationId === destination.id);
  const destinationActivities = ACTIVITIES.filter(a => a.destinationId === destination.id);
  const targetReviews = getReviewsForTarget(destination.id);


  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Destination link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <SEOHead
        title={`${destination.name} Travel Guide 2026 — Best Time, Budget & Things to Do`}
        description={destination.description.slice(0, 155)}
        image={destination.heroImage}
        type="place"
        keywords={`${destination.name}, ${destination.stateOrRegion}, ${destination.country}, travel guide, hotels in ${destination.name}, best time to visit ${destination.name}, things to do in ${destination.name}`}
        jsonLd={{
          '@type': 'TouristDestination',
          name: destination.name,
          description: destination.description,
          image: [destination.heroImage, ...(destination.gallery || [])],
          touristType: destination.idealFor,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: destination.coordinates.lat,
            longitude: destination.coordinates.lng
          },
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: `${destination.stateOrRegion}, ${destination.country}`
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: destination.rating,
            reviewCount: destination.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }}
      />
      
      {/* 1. HERO BANNER & GALLERY */}

      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/80">
        <div className="relative h-80 sm:h-96 lg:h-[460px] w-full">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/20" />
        </div>

        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/90 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Link to="/" className="hover:text-sky-300">Home</Link>
            <span>&bull;</span>
            <Link to="/explore" className="hover:text-sky-300">Destinations</Link>
            <span>&bull;</span>
            <span className="text-white font-semibold">{destination.name}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all shadow-md"
              title="Share destination"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveDestination(destination.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                saved ? 'bg-rose-500 text-white' : 'bg-slate-900/60 hover:bg-slate-900 text-white'
              }`}
              title={saved ? 'Saved' : 'Save'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Bottom Overlay Content */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-xs">
                {destination.category}
              </span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full cursor-pointer transition-all hover:scale-105"
                title="View verified traveler ratings and reviews"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{destination.rating}</span>
                <span className="font-normal text-slate-200">
                  ({targetReviews.length > 0 ? `${targetReviews.length} verified` : `${destination.reviewCount}`} reviews)
                </span>
              </button>

            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              {destination.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-light flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{destination.stateOrRegion}, {destination.country}</span>
            </p>
          </div>

          {/* Quick Plan CTA */}
          <div className="flex items-center gap-3">
            <Link
              to={`/itinerary-planner?destination=${destination.slug}`}
              className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Plan Trip to {destination.name}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS & AT-A-GLANCE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Stay</span>
          <span className="text-base sm:text-lg font-bold text-slate-900 mt-1 block">{destination.durationDaysRecommended}</span>
          <span className="text-xs text-slate-500">To explore core highlights</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Est. Daily Budget</span>
          <span className="text-base sm:text-lg font-bold text-slate-900 mt-1 block">
            {formatPrice(destination.estimatedDailyBudget.midRange)}
          </span>
          <span className="text-xs text-slate-500">Mid-range traveler estimate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Peak Travel Season</span>
          <span className="text-base sm:text-lg font-bold text-slate-900 mt-1 block line-clamp-1">
            {destination.bestTimeToVisit.bestMonths.slice(0, 3).join(', ')}
          </span>
          <span className="text-xs text-slate-500">Prime weather conditions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Safety Rating</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 mt-1 block">{destination.safetyRating} / 5.0</span>
          <span className="text-xs text-slate-500">Verified traveler index</span>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="sticky top-16 sm:top-20 z-20 bg-slate-50/90 backdrop-blur-md py-2 border-b border-slate-200">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'reviews', label: `Reviews & Ratings (${targetReviews.length > 0 ? targetReviews.length : destination.reviewCount})`, icon: Star },
            { id: 'price-trends', label: 'Price Trends', icon: TrendingUp },
            { id: 'attractions', label: `Attractions (${destinationAttractions.length})`, icon: Landmark },
            { id: 'hotels', label: `Hotels (${destinationHotels.length})`, icon: HotelIcon },
            { id: 'food', label: `Food & Dining (${destinationRestaurants.length})`, icon: Utensils },
            { id: 'activities', label: `Activities (${destinationActivities.length})`, icon: Compass },
            { id: 'practical', label: 'How to Reach & Tips', icon: Plane },
            { id: 'map', label: 'Location Map', icon: MapPin }
          ].map((tab) => {

            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          
          {/* Editorial Introduction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">About {destination.name}</h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {destination.description}
            </p>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Top Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seasonal Weather Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Best Time to Visit</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {destination.bestTimeToVisit.weatherSummary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[11px] font-bold uppercase text-emerald-700 block">Peak Season</span>
                <p className="text-xs text-emerald-950 mt-1 font-medium">{destination.bestTimeToVisit.peakSeason}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[11px] font-bold uppercase text-amber-700 block">Moderate Season</span>
                <p className="text-xs text-amber-950 mt-1 font-medium">{destination.bestTimeToVisit.moderateSeason}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-600 block">Off-Season</span>
                <p className="text-xs text-slate-700 mt-1 font-medium">{destination.bestTimeToVisit.offSeason}</p>
              </div>
            </div>
          </div>

          {/* Budget Breakdown Tiers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Estimated Daily Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Backpacker / Budget</span>
                <span className="text-2xl font-bold text-slate-900 block">{formatPrice(destination.estimatedDailyBudget.budget)}</span>
                <span className="text-[11px] text-slate-400">Hostel bed, street food, public transport</span>
              </div>
              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-1 shadow-xs">
                <span className="text-xs font-semibold text-sky-700 uppercase">Mid-Range (Recommended)</span>
                <span className="text-2xl font-bold text-sky-950 block">{formatPrice(destination.estimatedDailyBudget.midRange)}</span>
                <span className="text-[11px] text-sky-600">3-star hotel, cafes, local taxis, activities</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Luxury Resort</span>
                <span className="text-2xl font-bold text-slate-900 block">{formatPrice(destination.estimatedDailyBudget.luxury)}</span>
                <span className="text-[11px] text-slate-400">5-star heritage resort, fine dining, private driver</span>
              </div>
            </div>
          </div>

          {/* Monthly Price Trends Section */}
          <PriceTrendsChart destination={destination} />

          {/* Ratings & Verified Traveler Reviews */}
          <ReviewsSection
            targetId={destination.id}
            targetType="destination"
            targetName={destination.name}
            baselineRating={destination.rating}
            baselineReviewCount={destination.reviewCount}
          />

        </div>
      )}


      {/* Dedicated Price Trends Tab */}
      {activeTab === 'price-trends' && (
        <div className="space-y-6">
          <PriceTrendsChart destination={destination} />
        </div>
      )}

      {/* Attractions Tab */}
      {activeTab === 'attractions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Famous Attractions in {destination.name}</h2>
            <span className="text-xs text-slate-500">{destinationAttractions.length} sights</span>
          </div>
          {destinationAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinationAttractions.map(attraction => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">More attractions are being cataloged for this destination.</p>
          )}
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Recommended Stays & Resorts</h2>
            <Link to="/hotels" className="text-xs font-bold text-sky-600 hover:text-sky-700">Explore all hotels &rarr;</Link>
          </div>
          {destinationHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinationHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Sample hotels for this destination are available in the main directory.</p>
          )}
        </div>
      )}

      {/* Food Tab */}
      {activeTab === 'food' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Dining, Cafes & Local Specialties</h2>
            <Link to="/food" className="text-xs font-bold text-sky-600 hover:text-sky-700">Food directory &rarr;</Link>
          </div>
          {destinationRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinationRestaurants.map(rest => (
                <RestaurantCard key={rest.id} restaurant={rest} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Culinary spots for this destination are available in the main food guide.</p>
          )}
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Things to Do in {destination.name}</h2>
          {destinationActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinationActivities.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Explore top adventure and cultural activities across all destinations in the Activities section.</p>
          )}
        </div>
      )}

      {/* Practical Travel Info Tab */}
      {activeTab === 'practical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-600" />
              <span>How to Reach</span>
            </h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-0.5">By Air</span>
                <p className="text-slate-600">{destination.howToReach.byAir}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-0.5">By Train</span>
                <p className="text-slate-600">{destination.howToReach.byTrain}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-0.5">By Road</span>
                <p className="text-slate-600">{destination.howToReach.byRoad}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Safety & Etiquette</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">Safety Tips</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {destination.safetyTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">Local Etiquette</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {destination.localEtiquette.map((et, i) => (
                    <li key={i}>{et}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-900">{destination.name} Interactive Map</h2>
          <InteractiveMap
            initialCenter={destination.coordinates}
            initialZoom={11}
            highlightCoordinates={destination.coordinates}
          />
        </div>
      )}

      {/* Dedicated Reviews & Ratings Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <ReviewsSection
            targetId={destination.id}
            targetType="destination"
            targetName={destination.name}
            baselineRating={destination.rating}
            baselineReviewCount={destination.reviewCount}
          />
        </div>
      )}


    </div>
  );
};
