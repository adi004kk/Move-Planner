import React, { useState, useId } from 'react';
import { TrendingUp, DollarSign, Calendar, Sparkles, ArrowDownRight, ArrowUpRight, CheckCircle2, Info } from 'lucide-react';
import { Destination, MonthlyPriceTrend } from '../../types/travel';
import { DestinationService } from '../../services/apiAdapters';
import { useTravel } from '../../context/TravelContext';

interface PriceTrendsChartProps {
  destination: Destination;
}

export const PriceTrendsChart: React.FC<PriceTrendsChartProps> = ({ destination }) => {
  const { formatPrice } = useTravel();
  const gradientId = useId();

  const [activeMetric, setActiveMetric] = useState<'both' | 'hotel' | 'daily'>('both');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(() => {
    // default to current month (e.g. October -> index 9)
    return new Date().getMonth();
  });

  const priceTrends: MonthlyPriceTrend[] = destination.monthlyPriceTrends || DestinationService.getPriceTrends(destination);

  // Calculate scales for SVG (Width: 760, Height: 240, Padding: top 20, bottom 40, left 60, right 30)
  const chartW = 760;
  const chartH = 220;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;

  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;

  const allHotelPrices = priceTrends.map(p => p.hotelAvgPerNight);
  const allDailyPrices = priceTrends.map(p => p.dailySpendEstimate);
  const minVal = Math.floor(Math.min(...allHotelPrices, ...allDailyPrices) * 0.85);
  const maxVal = Math.ceil(Math.max(...allHotelPrices, ...allDailyPrices) * 1.15);

  const getX = (index: number) => padLeft + (index / (priceTrends.length - 1)) * innerW;
  const getY = (val: number) => padTop + innerH - ((val - minVal) / (maxVal - minVal || 1)) * innerH;

  // Build SVG Path
  const generateSmoothPath = (values: number[]) => {
    const points = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const hotelPath = generateSmoothPath(allHotelPrices);
  const dailyPath = generateSmoothPath(allDailyPrices);

  const hotelAreaPath = `${hotelPath} L ${getX(priceTrends.length - 1)} ${padTop + innerH} L ${getX(0)} ${padTop + innerH} Z`;
  const dailyAreaPath = `${dailyPath} L ${getX(priceTrends.length - 1)} ${padTop + innerH} L ${getX(0)} ${padTop + innerH} Z`;

  // Key stats
  const cheapestMonth = [...priceTrends].sort((a, b) => (a.hotelAvgPerNight + a.dailySpendEstimate) - (b.hotelAvgPerNight + b.dailySpendEstimate))[0];
  const peakMonth = [...priceTrends].sort((a, b) => (b.hotelAvgPerNight + b.dailySpendEstimate) - (a.hotelAvgPerNight + a.dailySpendEstimate))[0];
  const shoulderMonth = priceTrends.find(p => p.seasonType === 'Shoulder Season') || priceTrends[3];

  const selectedMonthData = priceTrends[selectedMonthIndex] || priceTrends[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Seasonality Economics
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
            Price Trends & Seasonal Cost Curve
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize typical monthly fluctuations in accommodation and daily expenses for {destination.name}.
          </p>
        </div>

        {/* Metric Switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetric === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveMetric('hotel')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetric === 'hotel' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotel Nightly
          </button>
          <button
            onClick={() => setActiveMetric('daily')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeMetric === 'daily' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Spend
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Best Budget Window</span>
            <span className="font-serif font-bold text-slate-900 text-sm mt-0.5 block">{cheapestMonth.fullMonth}</span>
            <span className="text-[11px] text-emerald-800">Hotels from {formatPrice(cheapestMonth.hotelAvgPerNight)}/nt</span>
          </div>
          <ArrowDownRight className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Sweet Spot (Shoulder)</span>
            <span className="font-serif font-bold text-slate-900 text-sm mt-0.5 block">{shoulderMonth.fullMonth}</span>
            <span className="text-[11px] text-amber-800">Balanced weather & prices</span>
          </div>
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Peak Surge Period</span>
            <span className="font-serif font-bold text-slate-900 text-sm mt-0.5 block">{peakMonth.fullMonth}</span>
            <span className="text-[11px] text-rose-800">+{Math.round((peakMonth.flightIndexMultiplier - 1) * 100)}% demand surge</span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-rose-600 shrink-0" />
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full overflow-hidden bg-slate-50/60 rounded-3xl border border-slate-200/60 p-2 sm:p-4">
        
        {/* Chart Legend */}
        <div className="flex items-center justify-end gap-5 text-xs px-2 mb-2">
          {(activeMetric === 'both' || activeMetric === 'hotel') && (
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-sky-500 shadow-xs" />
              <span>Avg Hotel / Night</span>
            </div>
          )}
          {(activeMetric === 'both' || activeMetric === 'daily') && (
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-xs" />
              <span>Est. Daily Spend</span>
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full min-w-[620px] h-60 select-none"
          >
            <defs>
              <linearGradient id={`${gradientId}-hotel`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id={`${gradientId}-daily`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines & Values */}
            {[0, 0.33, 0.66, 1].map((pct, idx) => {
              const yVal = padTop + pct * innerH;
              const val = Math.round(maxVal - pct * (maxVal - minVal));
              return (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={yVal}
                    x2={chartW - padRight}
                    y2={yVal}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 10}
                    y={yVal + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    {formatPrice(val)}
                  </text>
                </g>
              );
            })}

            {/* Area Fills */}
            {(activeMetric === 'both' || activeMetric === 'hotel') && (
              <path d={hotelAreaPath} fill={`url(#${gradientId}-hotel)`} />
            )}
            {(activeMetric === 'both' || activeMetric === 'daily') && (
              <path d={dailyAreaPath} fill={`url(#${gradientId}-daily)`} />
            )}

            {/* Line Paths */}
            {(activeMetric === 'both' || activeMetric === 'hotel') && (
              <path
                d={hotelPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {(activeMetric === 'both' || activeMetric === 'daily') && (
              <path
                d={dailyPath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Month Axis Labels & Vertical Guide Line */}
            {priceTrends.map((p, idx) => {
              const xPos = getX(idx);
              const isSelected = selectedMonthIndex === idx;

              return (
                <g key={p.month} className="cursor-pointer" onClick={() => setSelectedMonthIndex(idx)}>
                  {/* Subtle column trigger zone */}
                  <rect
                    x={xPos - 22}
                    y={padTop}
                    width={44}
                    height={innerH}
                    fill="transparent"
                  />

                  {/* Active highlight vertical line */}
                  {isSelected && (
                    <line
                      x1={xPos}
                      y1={padTop}
                      x2={xPos}
                      y2={padTop + innerH}
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Month Text Label */}
                  <text
                    x={xPos}
                    y={chartH - 12}
                    textAnchor="middle"
                    className={`text-[11px] font-bold transition-all ${
                      isSelected ? 'fill-sky-600 font-extrabold' : 'fill-slate-500'
                    }`}
                  >
                    {p.month}
                  </text>

                  {/* Points on Hotel Line */}
                  {(activeMetric === 'both' || activeMetric === 'hotel') && (
                    <circle
                      cx={xPos}
                      cy={getY(p.hotelAvgPerNight)}
                      r={isSelected ? 5.5 : 3.5}
                      fill={isSelected ? '#0284c7' : 'white'}
                      stroke="#0284c7"
                      strokeWidth={isSelected ? 2.5 : 2}
                      className="transition-all"
                    />
                  )}

                  {/* Points on Daily Line */}
                  {(activeMetric === 'both' || activeMetric === 'daily') && (
                    <circle
                      cx={xPos}
                      cy={getY(p.dailySpendEstimate)}
                      r={isSelected ? 5.5 : 3.5}
                      fill={isSelected ? '#4f46e5' : 'white'}
                      stroke="#4f46e5"
                      strokeWidth={isSelected ? 2.5 : 2}
                      className="transition-all"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Month Detail Card */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-xl font-bold">{selectedMonthData.fullMonth} Cost Profile</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedMonthData.seasonType === 'Peak Season'
                  ? 'bg-rose-500 text-white'
                  : selectedMonthData.seasonType === 'Shoulder Season'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {selectedMonthData.seasonType}
            </span>
          </div>

          <span className="text-xs text-slate-400">
            Click any month above or in the strip below to compare
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Hotel Avg / Night</span>
            <span className="text-lg font-bold text-sky-400 mt-0.5 block">
              {formatPrice(selectedMonthData.hotelAvgPerNight)}
            </span>
            <span className="text-[10px] text-slate-400">3-4 star room</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Daily Budget</span>
            <span className="text-lg font-bold text-indigo-300 mt-0.5 block">
              {formatPrice(selectedMonthData.dailySpendEstimate)}
            </span>
            <span className="text-[10px] text-slate-400">Meals, transit, sights</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Flight / Transit Index</span>
            <span className="text-lg font-bold text-amber-300 mt-0.5 block">
              {selectedMonthData.flightIndexMultiplier}x
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedMonthData.flightIndexMultiplier > 1 ? `+${Math.round((selectedMonthData.flightIndexMultiplier - 1) * 100)}% high season` : 'Discounted fares'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Recommendation</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block leading-relaxed">
              {selectedMonthData.savingsTip}
            </span>
          </div>
        </div>
      </div>

      {/* Month-by-month pill tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {priceTrends.map((p, idx) => (
          <button
            key={p.month}
            onClick={() => setSelectedMonthIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMonthIndex === idx
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            {p.month}
          </button>
        ))}
      </div>

    </div>
  );
};
