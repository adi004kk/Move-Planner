import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Hotel, Utensils, Landmark, Footprints, Heart, Star, ExternalLink, X } from 'lucide-react';
import { DESTINATIONS, ATTRACTIONS, HOTELS, RESTAURANTS, ACTIVITIES } from '../../data/travelData';
import { Coordinates } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface MapItem {
  id: string;
  name: string;
  category: 'Destination' | 'Attraction' | 'Hotel' | 'Restaurant' | 'Activity';
  coordinates: Coordinates;
  image: string;
  rating?: number;
  snippet: string;
  priceOrFee?: string;
  linkUrl: string;
}

interface InteractiveMapProps {
  initialCenter?: Coordinates;
  initialZoom?: number;
  highlightCoordinates?: Coordinates;
  filterDestinationId?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialCenter = { lat: 20.5937, lng: 78.9629 }, // Center of India
  initialZoom = 5,
  highlightCoordinates,
  filterDestinationId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { formatPrice, toggleSaveDestination, toggleSaveHotel, toggleSaveRestaurant, toggleSaveAttraction } = useTravel();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPlace, setSelectedPlace] = useState<MapItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Assemble all mappable items
  const allItems: MapItem[] = [
    ...DESTINATIONS.map(d => ({
      id: d.id,
      name: d.name,
      category: 'Destination' as const,
      coordinates: d.coordinates,
      image: d.heroImage,
      rating: d.rating,
      snippet: `${d.stateOrRegion}, ${d.country} — ${d.tagline}`,
      priceOrFee: `From ${formatPrice(d.estimatedDailyBudget.midRange)}/day`,
      linkUrl: `/destinations/${d.slug}`
    })),
    ...ATTRACTIONS.map(a => ({
      id: a.id,
      name: a.name,
      category: 'Attraction' as const,
      coordinates: a.coordinates,
      image: a.image,
      rating: a.rating,
      snippet: `${a.destinationName} — ${a.description}`,
      priceOrFee: a.entryFee.isFree ? 'Free entry' : `Entry: ${formatPrice(a.entryFee.adultPrice || 0)}`,
      linkUrl: `/attractions/${a.slug}`
    })),
    ...HOTELS.map(h => ({
      id: h.id,
      name: h.name,
      category: 'Hotel' as const,
      coordinates: h.coordinates,
      image: h.image,
      rating: h.rating,
      snippet: `${h.destinationName} — ${h.type} (${h.distanceFromCenterKm}km from center)`,
      priceOrFee: `${formatPrice(h.pricePerNight)}/night`,
      linkUrl: `/hotels/${h.slug}`
    })),
    ...RESTAURANTS.map(r => ({
      id: r.id,
      name: r.name,
      category: 'Restaurant' as const,
      coordinates: r.coordinates,
      image: r.image,
      rating: r.rating,
      snippet: `${r.destinationName} — ${r.cuisine.join(', ')}`,
      priceOrFee: `Avg. for 2: ${formatPrice(r.approxCostForTwo)}`,
      linkUrl: `/food/${r.slug}`
    })),
    ...ACTIVITIES.map(act => ({
      id: act.id,
      name: act.name,
      category: 'Activity' as const,
      coordinates: act.coordinates,
      image: act.image,
      rating: act.rating,
      snippet: `${act.destinationName} — ${act.duration} (${act.difficulty})`,
      priceOrFee: `${formatPrice(act.pricePerPerson)}/person`,
      linkUrl: `/activities`
    }))
  ];

  // Filter items based on active category & query
  const filteredItems = allItems.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q);
    }
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: false
    });

    // OpenStreetMap CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Timeout to ensure correct container sizing
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync markers when filtered items change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredItems.forEach(item => {
      const getCategoryColor = () => {
        switch (item.category) {
          case 'Destination': return '#0284c7'; // Sky
          case 'Hotel': return '#4f46e5'; // Indigo
          case 'Restaurant': return '#d97706'; // Amber
          case 'Attraction': return '#9333ea'; // Purple
          case 'Activity': return '#059669'; // Emerald
          default: return '#0284c7';
        }
      };

      const iconHtml = `
        <div style="
          background-color: ${getCategoryColor()};
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          ${item.category.charAt(0)}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPlace(item);
        map.panTo([item.coordinates.lat, item.coordinates.lng], { animate: true });
      });

      layer.addLayer(marker);
    });
  }, [filteredItems]);

  // Center on highlight coordinates if provided
  useEffect(() => {
    if (highlightCoordinates && mapInstanceRef.current) {
      mapInstanceRef.current.setView([highlightCoordinates.lat, highlightCoordinates.lng], 13, { animate: true });
    }
  }, [highlightCoordinates]);

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex flex-col">
      {/* Top Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Search inside map */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 px-3.5 py-2 flex items-center gap-2 max-w-sm w-full">
          <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
          <input
            type="text"
            placeholder="Search map spots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Toggles */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-1 flex items-center gap-1 overflow-x-auto max-w-full">
          {['All', 'Destination', 'Attraction', 'Hotel', 'Restaurant', 'Activity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'Show All' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Selected Place Overlay Flyout Card */}
      {selectedPlace && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="relative h-36 bg-slate-100">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
              aria-label="Close card"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 shadow-xs">
                {selectedPlace.category}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-serif font-bold text-slate-900 text-base leading-tight">
                {selectedPlace.name}
              </h4>
              {selectedPlace.rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedPlace.rating}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {selectedPlace.snippet}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Pricing / Fee</span>
                <span className="text-xs font-bold text-slate-800">{selectedPlace.priceOrFee}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                  title="Open in Google Maps for turn-by-turn directions"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </a>

                <a
                  href={selectedPlace.linkUrl}
                  className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Stats Badge */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 text-[11px] font-medium text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredItems.length}</span> travel locations &bull; OpenStreetMap
        </div>
      </div>
    </div>
  );
};
