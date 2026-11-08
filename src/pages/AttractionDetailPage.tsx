import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Landmark,
  Star,
  Heart,
  MapPin,
  Clock,
  Ticket,
  Sparkles,
  Navigation,
  Accessibility,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { ATTRACTIONS } from '../data/travelData';
import { useTravel } from '../context/TravelContext';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { SEOHead } from '../components/seo/SEOHead';

export const AttractionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAttractionSaved, toggleSaveAttraction, formatPrice, showToast } = useTravel();

  const attraction = ATTRACTIONS.find(a => a.slug === slug || a.id === slug) || ATTRACTIONS[0];
  const saved = isAttractionSaved(attraction.id);

  return (
    <div className="space-y-10 pb-20">
      <SEOHead
        title={`${attraction.name} (${attraction.destinationName}) — Tickets, Timings & Guide`}
        description={attraction.description.slice(0, 155)}
        image={attraction.image}
        type="place"
        keywords={`${attraction.name}, sights in ${attraction.destinationName}, ${attraction.category}, tickets, MovePlanner`}
        jsonLd={{
          '@type': 'TouristAttraction',
          name: attraction.name,
          description: attraction.description,
          image: [attraction.image, ...(attraction.gallery || [])],
          touristType: attraction.category,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: attraction.coordinates.lat,
            longitude: attraction.coordinates.lng
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: attraction.rating,
            reviewCount: attraction.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }}
      />
      
      {/* Media & Header Container */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Link to="/attractions" className="hover:text-purple-600">Attractions</Link>
            <span>&bull;</span>
            <Link to={`/destinations/${attraction.destinationId.replace('dest-', '')}`} className="hover:text-purple-600">
              {attraction.destinationName}
            </Link>
            <span>&bull;</span>
            <span className="font-semibold text-slate-800">{attraction.name}</span>
          </div>

          <button
            onClick={() => toggleSaveAttraction(attraction.id)}
            className={`p-2 rounded-full border transition-all ${
              saved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title & Category */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                {attraction.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{attraction.rating}</span>
                <span className="text-slate-400 font-normal">({attraction.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
              {attraction.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{attraction.destinationName} &bull; Coordinates: {attraction.coordinates.lat.toFixed(4)}, {attraction.coordinates.lng.toFixed(4)}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Admission Fee</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {attraction.entryFee.isFree ? 'Free Entry' : formatPrice(attraction.entryFee.adultPrice || 0)}
            </span>
            <span className="text-xs text-slate-500 block">
              {attraction.entryFee.isFree ? 'No ticket needed' : 'per adult standard ticket'}
            </span>
          </div>
        </div>

        {/* Image Display */}
        <div className="rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-slate-100 shadow-inner">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">About this Sight</h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {attraction.description}
            </p>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-base">Travel & Photography Tips</h3>
              <ul className="space-y-2">
                {attraction.travelTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Accessibility Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-sky-600" />
              <span>Accessibility Guidance</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {attraction.accessibility}
            </p>
          </div>

          {/* Traveler Reviews & Rating Breakdown */}
          <ReviewsSection
            targetId={attraction.id}
            targetType="attraction"
            targetName={attraction.name}
            baselineRating={attraction.rating}
            baselineReviewCount={attraction.reviewCount}
          />

        </div>


        {/* Right Action Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-5 sticky top-24">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Visiting Schedule</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Opening Hours</span>
                </span>
                <span className="text-slate-600 font-medium">{attraction.openingHours}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Best Visiting Time</span>
                </span>
                <span className="text-slate-600 font-medium leading-relaxed">{attraction.bestVisitingTime}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Recommended Duration</span>
                </span>
                <span className="text-slate-600 font-medium">{attraction.estimatedDurationHours} hours</span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${attraction.coordinates.lat},${attraction.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Get Directions on Map</span>
            </a>

            <button
              onClick={() => showToast(`Added "${attraction.name}" to your sightseeing itinerary wishlist!`)}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Itinerary</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
