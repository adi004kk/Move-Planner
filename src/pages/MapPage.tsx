import React, { useState } from 'react';
import { Map, MapPin, Compass, Sparkles, Navigation, Layers } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { Coordinates } from '../types/travel';
import { SEOHead } from '../components/seo/SEOHead';

export const MapPage: React.FC = () => {
  const [selectedDestId, setSelectedDestId] = useState<string>('all');
  const [targetCoords, setTargetCoords] = useState<Coordinates | undefined>(undefined);

  const handleDestinationSelect = (destId: string) => {
    setSelectedDestId(destId);
    if (destId === 'all') {
      setTargetCoords({ lat: 20.5937, lng: 78.9629 });
    } else {
      const found = DESTINATIONS.find(d => d.id === destId);
      if (found) {
        setTargetCoords(found.coordinates);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <SEOHead
        title="Interactive Global Travel Map & Route Explorer"
        description="Explore worldwide destinations on an interactive leaflet map with pinpoints, nearby sights, hotels, and geographic guides."
        keywords="travel map, interactive map, destination map, travel route explorer, MovePlanner"
      />
      
      {/* Top Map Control Banner */}

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Geographic Explorer
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Interactive Travel Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click pins to preview attractions, hotels, restaurants, and adventure sites with direct routing.
          </p>
        </div>

        {/* Quick Jump Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl shrink-0">
          <Navigation className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-700">Jump to:</span>
          <select
            value={selectedDestId}
            onChange={(e) => handleDestinationSelect(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
          >
            <option value="all">Full World Map</option>
            {DESTINATIONS.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Box */}
      <InteractiveMap
        initialCenter={{ lat: 20.5937, lng: 78.9629 }}
        initialZoom={5}
        highlightCoordinates={targetCoords}
      />

    </div>
  );
};
