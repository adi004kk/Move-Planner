import React, { useState, useEffect } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
  Wind,
  RefreshCw,
  Umbrella,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Compass,
  MapPin,
  Calendar
} from 'lucide-react';
import { Coordinates, DailyWeatherForecast } from '../../types/travel';
import { WeatherService } from '../../services/apiAdapters';

interface ItineraryWeatherWidgetProps {
  coordinates: Coordinates;
  destinationName: string;
  category?: string;
  startDate?: string;
  daysCount: number;
  activeDayNumber: number;
  onSelectDay?: (dayNumber: number) => void;
}

export const ItineraryWeatherWidget: React.FC<ItineraryWeatherWidgetProps> = ({
  coordinates,
  destinationName,
  category,
  startDate,
  daysCount,
  activeDayNumber,
  onSelectDay
}) => {
  const [forecasts, setForecasts] = useState<DailyWeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await WeatherService.getForecastForItinerary({
        coordinates,
        destinationName,
        category,
        startDate,
        daysCount
      });
      setForecasts(data);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [coordinates.lat, coordinates.lng, startDate, daysCount]);

  const activeForecast = forecasts.find(f => f.dayNumber === activeDayNumber) || forecasts[0];

  const renderWeatherIcon = (iconType: DailyWeatherForecast['iconType'], className = 'w-5 h-5') => {
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud':
        return <Cloud className={`${className} text-sky-500`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'snow':
        return <Snowflake className={`${className} text-cyan-400`} />;
      case 'thunder':
        return <Zap className={`${className} text-purple-500`} />;
      case 'fog':
        return <Wind className={`${className} text-slate-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  const getSuitabilityBadge = (suitability: DailyWeatherForecast['outdoorSuitability']) => {
    switch (suitability) {
      case 'Excellent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Excellent for Outdoors</span>;
      case 'Good':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Good for Sightseeing</span>;
      case 'Fair':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Fair &bull; Check Rain</span>;
      case 'Caution':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Indoor Priority</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-base">
              Scheduled Weather & Outdoor Activity Advisory
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100 hidden sm:inline">
              Open-Meteo Live API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time atmospheric forecast for {destinationName} to plan trekking, boat cruises, and walking tours.
          </p>
        </div>

        <button
          onClick={fetchWeather}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors self-start sm:self-auto disabled:opacity-50"
          title="Refresh forecast"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Updating...' : 'Refresh Forecast'}</span>
        </button>
      </div>

      {/* Multi-Day Forecast Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {forecasts.map((f) => {
          const isActive = f.dayNumber === activeDayNumber;
          return (
            <button
              key={f.dayNumber}
              onClick={() => onSelectDay && onSelectDay(f.dayNumber)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-2 ring-sky-500/20'
                  : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div>
                <span className={`text-[11px] font-bold block ${isActive ? 'text-sky-900' : 'text-slate-700'}`}>
                  Day {f.dayNumber}
                </span>
                <span className="text-[10px] text-slate-400 block line-clamp-1">
                  {f.date.slice(5)}
                </span>
              </div>

              <div className="my-2 flex items-center justify-between">
                {renderWeatherIcon(f.iconType, 'w-6 h-6')}
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 block">{f.tempMaxCelsius}°</span>
                  <span className="text-[10px] text-slate-400 block">{f.tempMinCelsius}°</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">{f.precipitationProbability}% rain</span>
                {f.precipitationProbability > 50 && (
                  <Umbrella className="w-3 h-3 text-blue-500 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Weather Card for Active Day */}
      {activeForecast && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-slate-50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {renderWeatherIcon(activeForecast.iconType, 'w-4 h-4')}
                <span>{activeForecast.dayName}: {activeForecast.condition}</span>
              </span>
              {getSuitabilityBadge(activeForecast.outdoorSuitability)}
              {activeForecast.isLive && (
                <span className="text-[10px] font-bold text-sky-700 bg-white/80 px-2 py-0.5 rounded-md border border-sky-200">
                  Live Station
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activeForecast.activityAdvisory}
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-slate-600">
              <span className="font-bold text-slate-700">Recommended Gear:</span>
              {activeForecast.recommendedGear.map((item, idx) => (
                <span key={idx} className="bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:gap-1.5 text-xs text-slate-600 shrink-0 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
            <div>
              <span className="text-slate-400 text-[10px] block">High / Low</span>
              <strong className="text-slate-900 text-sm">{activeForecast.tempMaxCelsius}°C / {activeForecast.tempMinCelsius}°C</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Rain Probability</span>
              <strong className="text-blue-600 text-sm">{activeForecast.precipitationProbability}%</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Wind Speed</span>
              <strong className="text-slate-800 text-sm">{activeForecast.windSpeedKmh} km/h</strong>
            </div>
          </div>
        </div>
      )}

      {/* Advisory Alert for Rainy Days */}
      {activeForecast && activeForecast.precipitationProbability > 55 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Outdoor Weather Warning for Day {activeDayNumber}</span>
            <p className="text-amber-800">
              There is an elevated chance of rain on this day. If you have outdoor activities (like boat rides or cliff walks), consider swapping them with an indoor museum or culinary cafe tour using the reorder buttons below.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
