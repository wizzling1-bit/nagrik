'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CityCoverageItem {
  name: string;
  state: string;
  keyAreas: string;
  code: string;
}

export const CoverageSection: React.FC = () => {
  const { t } = useLanguage();

  const activeCities: CityCoverageItem[] = [
    { name: 'Patna', state: 'Bihar', keyAreas: 'Kankarbagh, Boring Road, Bailey Road', code: 'PAT' },
    { name: 'Varanasi', state: 'Uttar Pradesh', keyAreas: 'Godowlia, Dashashwamedh, Sigra', code: 'VNS' },
    { name: 'Lucknow', state: 'Uttar Pradesh', keyAreas: 'Gomti Nagar, Hazratganj, Alambagh', code: 'LKO' },
    { name: 'Bengaluru', state: 'Karnataka', keyAreas: 'Indiranagar, Koramangala, Whitefield', code: 'BLR' },
    { name: 'Delhi NCR', state: 'National Capital Region', keyAreas: 'Dwarka, Rohini, Connaught Place', code: 'DEL' },
    { name: 'Mumbai', state: 'Maharashtra', keyAreas: 'Andheri, Bandra, Dadar, Colaba', code: 'BOM' },
    { name: 'Pune', state: 'Maharashtra', keyAreas: 'Hinjewadi, Shivaji Nagar, Kothrud', code: 'PNQ' },
    { name: 'Kolkata', state: 'West Bengal', keyAreas: 'Salt Lake, Park Street, Howrah', code: 'CCU' }
  ];

  return (
    <section id="coverage" className="py-16 sm:py-24 bg-white dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-2xl text-left space-y-2">
            <div className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
              {t.coverageBadge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.coverageTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.coverageSubtitle}
            </p>
          </div>

          <div className="self-start md:self-end text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100+ Indian Cities Active</span>
          </div>
        </div>

        {/* Clean City Discovery Grid with Interactive Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {activeCities.map((city) => (
            <div
              key={city.name}
              className="card-hover-effect group p-6 bg-[#FAF9F6] dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-brand-500/40 dark:hover:border-brand-500/40 cursor-default relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />

              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md group-hover:bg-brand-500 group-hover:text-white transition-colors duration-200">
                  {city.code}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{t.coverageActiveStatus}</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                  {city.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {city.state}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                <span className="truncate">{city.keyAreas}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
