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
  Compass,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar,
  Thermometer,
  ShieldCheck,
  Droplets
} from 'lucide-react';
import { Coordinates, DailyWeatherForecast } from '../../types/travel';
import { WeatherService } from '../../services/apiAdapters';

interface TripWeatherWidgetProps {
  coordinates: Coordinates;
  destinationName: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
}

export const TripWeatherWidget: React.FC<TripWeatherWidgetProps> = ({
  coordinates,
  destinationName,
  category = 'Hill Station',
  startDate,
  endDate,
  durationDays = 4
}) => {
  const [forecasts, setForecasts] = useState<DailyWeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate actual number of days between start and end date if available
  const daysCount = React.useMemo(() => {
    if (startDate && endDate) {
      const s = new Date(startDate).getTime();
      const e = new Date(endDate).getTime();
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0 && diff <= 14) return diff;
    }
    return Math.max(3, Math.min(10, durationDays));
  }, [startDate, endDate, durationDays]);

  const loadWeather = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await WeatherService.getForecastForItinerary({
        coordinates,
        destinationName,
        category,
        startDate,
        daysCount
      });
      setForecasts(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Weather load error:', err);
      setErrorMsg('Live weather service temporarily unavailable; using seasonal model.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [coordinates.lat, coordinates.lng, startDate, daysCount, destinationName]);

  const activeForecast = forecasts[selectedDayIndex] || forecasts[0];

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
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Ideal for Outdoors
          </span>
        );
      case 'Good':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            Good Conditions
          </span>
        );
      case 'Fair':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Fair Weather
          </span>
        );
      case 'Caution':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Rain Advisory
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      
      {/* Header with Location, Dates & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sun className="w-4 h-4 text-amber-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Trip Weather & Travel Forecast
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              {destinationName} ({coordinates.lat.toFixed(2)}°N, {coordinates.lng.toFixed(2)}°E)
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {startDate ? `${startDate} to ${endDate || ''}` : `${daysCount} travel days`}
            </span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
              Open-Meteo Live API
            </span>
          </div>
        </div>

        <button
          onClick={loadWeather}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh weather data from live meteorological satellite"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Updating...' : 'Live Refresh'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Multi-Day Forecast Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Daily Forecast for Travel Dates:</span>
          <span className="text-[11px] text-slate-400">Select any day below to inspect activity advisories</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto pb-1">
          {forecasts.map((f, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={f.date || idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-0.5">
                    <span>Day {f.dayNumber}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {f.date}
                  </span>
                </div>

                <div className="my-2 flex items-center justify-between">
                  {renderWeatherIcon(f.iconType, 'w-6 h-6')}
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block">{f.tempMaxCelsius}°</span>
                    <span className="text-[10px] text-slate-400 block font-medium">{f.tempMinCelsius}°</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${f.precipitationProbability > 40 ? 'text-blue-600' : 'text-slate-500'}`}>
                    {f.precipitationProbability}% rain
                  </span>
                  {f.precipitationProbability > 40 && (
                    <Umbrella className="w-3 h-3 text-blue-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Spotlight Card */}
      {activeForecast && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-slate-50 border border-sky-100/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  {renderWeatherIcon(activeForecast.iconType, 'w-5 h-5')}
                  <span>Day {activeForecast.dayNumber} ({activeForecast.date}): {activeForecast.condition}</span>
                </span>
                {getSuitabilityBadge(activeForecast.outdoorSuitability)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xl font-medium">
                {activeForecast.activityAdvisory}
              </p>
            </div>

            {/* Micro Metrics Column */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-6 bg-white/80 p-3 rounded-xl border border-sky-100 text-xs shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max / Min</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {activeForecast.tempMaxCelsius}° / {activeForecast.tempMinCelsius}°C
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precipitation</span>
                <span className="font-extrabold text-blue-600 text-sm">
                  {activeForecast.precipitationProbability}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wind Speed</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {activeForecast.windSpeedKmh} km/h
                </span>
              </div>
            </div>
          </div>

          {/* Packing & Gear Recommendation */}
          <div className="pt-3 border-t border-sky-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Recommended Gear for This Day:</span>
              </span>
              {activeForecast.recommendedGear.map((gear, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                >
                  {gear}
                </span>
              ))}
            </div>

            <span className="text-[10px] text-slate-400">
              Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )}

      {/* Rainy / Inclement Weather Suggestion Banner */}
      {activeForecast && activeForecast.precipitationProbability > 50 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Inclement Weather Heads-Up for Day {activeForecast.dayNumber}</p>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Showers or high precipitation are forecasted. Remember to pack a waterproof rain jacket or umbrella in your daypack, or schedule indoor attractions (museums, cafes, local markets) for this day.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
