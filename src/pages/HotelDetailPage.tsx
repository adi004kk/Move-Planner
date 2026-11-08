import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Hotel as HotelIcon,
  Star,
  Heart,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  BedDouble,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HOTELS } from '../data/travelData';
import { useTravel } from '../context/TravelContext';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { SEOHead } from '../components/seo/SEOHead';

export const HotelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isHotelSaved, toggleSaveHotel, formatPrice, showToast } = useTravel();

  const hotel = HOTELS.find(h => h.slug === slug || h.id === slug) || HOTELS[0];
  const saved = isHotelSaved(hotel.id);

  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes[0]?.name || '');

  return (
    <div className="space-y-10 pb-20">
      <SEOHead
        title={`${hotel.name} — ${hotel.destinationName} Hotel Booking & Reviews`}
        description={`${hotel.name} in ${hotel.destinationName}. ${hotel.type} featuring ${hotel.amenities.slice(0, 3).join(', ')}. Rated ${hotel.rating}/5 from ${hotel.reviewCount} traveler reviews.`}
        image={hotel.image}
        type="place"
        keywords={`${hotel.name}, hotels in ${hotel.destinationName}, ${hotel.type}, resort booking, MovePlanner`}
        jsonLd={{
          '@type': 'Hotel',
          name: hotel.name,
          description: `${hotel.type} in ${hotel.destinationName} featuring ${hotel.amenities.join(', ')}`,
          image: [hotel.image, ...(hotel.gallery || [])],
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.locationAddress,
            addressLocality: hotel.destinationName
          },
          priceRange: `₹${hotel.pricePerNight}`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: hotel.rating,
            reviewCount: hotel.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }}
      />

      
      {/* Header and Hero Media */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Link to="/hotels" className="hover:text-sky-600">Hotels</Link>
            <span>&bull;</span>
            <Link to={`/destinations/${hotel.destinationId.replace('dest-', '')}`} className="hover:text-sky-600">
              {hotel.destinationName}
            </Link>
            <span>&bull;</span>
            <span className="font-semibold text-slate-800">{hotel.name}</span>
          </div>

          <button
            onClick={() => toggleSaveHotel(hotel.id)}
            className={`p-2 rounded-full border transition-all ${
              saved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title & Ratings */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                {hotel.type}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{hotel.rating}</span>
                <span className="text-slate-400 font-normal">({hotel.reviewCount} verified reviews)</span>
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
              {hotel.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{hotel.locationAddress} ({hotel.distanceFromCenterKm} km from center)</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Starting at</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatPrice(hotel.pricePerNight)}
            </span>
            <span className="text-xs text-slate-500"> / night</span>
          </div>
        </div>

        {/* Image Display */}
        <div className="rounded-2xl overflow-hidden h-80 sm:h-96 w-full bg-slate-100 shadow-inner">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Grid Content: Left Details, Right Booking / Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Room Types */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Available Room Types</h2>
            <div className="space-y-3">
              {hotel.roomTypes.map((room) => (
                <div
                  key={room.name}
                  onClick={() => setSelectedRoom(room.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedRoom === room.name
                      ? 'border-sky-500 bg-sky-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-slate-900 text-base">{room.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {room.capacity}
                      </span>
                      <span>&bull;</span>
                      <span>{room.features.join(' &bull; ')}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-lg font-bold text-slate-900 block">{formatPrice(room.price)}</span>
                    <span className="text-[10px] text-slate-400 block">per night + taxes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities & Facilities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Amenities & Property Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Essential Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Check-in & Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Check-in Time</span>
                <span className="text-slate-600">{hotel.checkInTime}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Check-out Time</span>
                <span className="text-slate-600">{hotel.checkOutTime}</span>
              </div>
              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Cancellation Policy</span>
                <span className="text-slate-600">{hotel.cancellationPolicy}</span>
              </div>
            </div>
          </div>

          {/* Guest Ratings & Verified Reviews */}
          <ReviewsSection
            targetId={hotel.id}
            targetType="hotel"
            targetName={hotel.name}
            baselineRating={hotel.rating}
            baselineReviewCount={hotel.reviewCount}
          />

        </div>


        {/* Right Sticky Inquiry / Trip Action Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-5 sticky top-24">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Trip Planning Note</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Selected Room</span>
                <span className="font-bold text-slate-900">{selectedRoom}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nightly Rate</span>
                <span className="font-bold text-slate-900">{formatPrice(hotel.pricePerNight)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-700">{hotel.destinationName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
              <strong>Transparent Demo Notice:</strong> Rates and rooms represent realistic sample estimates for trip planning. Direct live bookings connect when an authorized booking channel is configured.
            </div>

            <button
              onClick={() => showToast(`Added ${hotel.name} to your trip accommodation plan!`)}
              className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Trip Itinerary</span>
            </button>

            <Link
              to={`/itinerary-planner?destination=${hotel.destinationId.replace('dest-', '')}`}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Build Complete Trip Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
