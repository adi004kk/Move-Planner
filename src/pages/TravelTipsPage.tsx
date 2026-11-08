import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, Square, AlertTriangle, PhoneCall, CheckCircle2, Sparkles } from 'lucide-react';
import { TRAVEL_CHECKLIST_ITEMS, SCAM_WARNINGS } from '../data/travelData';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';


export const TravelTipsPage: React.FC = () => {
  const { showToast } = useTravel();

  // Interactive Checklist check-offs
  const [checkedIds, setCheckedIds] = useState<string[]>(['c1', 'c4', 'c6']);

  const toggleChecklist = (id: string) => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const emergencyContacts = [
    { country: 'India', police: '112 / 100', ambulance: '102 / 108', touristHelpline: '1363 (24x7 Multi-lingual)' },
    { country: 'Singapore', police: '999', ambulance: '995', touristHelpline: '1800 736 2000' },
    { country: 'UAE / Dubai', police: '999', ambulance: '998', touristHelpline: '800 4888' },
    { country: 'Japan', police: '110', ambulance: '119', touristHelpline: '050-3816-2787 (Japan Visitor Hotline)' },
    { country: 'France', police: '17 / 112', ambulance: '15', touristHelpline: '+33 1 42 96 70 00' },
    { country: 'Switzerland', police: '117 / 112', ambulance: '144', touristHelpline: '0800 100 200' }
  ];

  return (
    <div className="space-y-10 pb-20">
      <SEOHead
        title="Essential Travel Safety Tips, Scams to Avoid & Emergency Contacts"
        description="Stay safe on the road. Actionable countermeasures against tourist scams, pre-departure essential checklists, and verified international emergency numbers."
        keywords="travel safety tips, tourist scams, travel emergency contacts, packing checklist, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Safety & Field Protocols
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Travel Tips, Safety & Packing Checklists
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Actionable precautions against common tourist traps, pre-departure packing checklists, and verified national emergency helplines.
        </p>
      </div>

      {/* Interactive Pre-Departure Packing Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
              <span>Essential Pre-Departure Checklist</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {checkedIds.length} of {TRAVEL_CHECKLIST_ITEMS.length} items packed &bull; Click to check off items
            </p>
          </div>

          <button
            onClick={() => {
              setCheckedIds(TRAVEL_CHECKLIST_ITEMS.map(i => i.id));
              showToast('All checklist items marked as packed!');
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            Mark All Packed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {TRAVEL_CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Tourist Scams & Countermeasures */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span>Top Tourist Scams & How to Avoid Them</span>
        </h2>
        <p className="text-xs text-slate-500">
          Recognize these standard diversion tactics before you arrive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {SCAM_WARNINGS.map((scam, i) => (
            <div key={i} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Scenario {i + 1}
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-base mt-1">
                  {scam.title}
                </h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {scam.description}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200/50">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  MovePlanner Countermeasure:
                </span>
                <p className="text-xs font-semibold text-emerald-800 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  {scam.countermeasure}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-sky-600" />
          <span>International Emergency Numbers</span>
        </h2>
        <p className="text-xs text-slate-500">
          Store these numbers in your phone contacts prior to departure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {emergencyContacts.map(c => (
            <div key={c.country} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <h3 className="font-serif font-bold text-slate-900 text-sm">{c.country}</h3>
              <div className="flex justify-between text-slate-600">
                <span>Police:</span>
                <strong className="text-slate-900">{c.police}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ambulance:</span>
                <strong className="text-slate-900">{c.ambulance}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tourist Help:</span>
                <strong className="text-sky-700">{c.touristHelpline}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
