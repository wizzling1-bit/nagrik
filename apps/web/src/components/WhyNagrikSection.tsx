'use client';

import React from 'react';
import {
  MapPin,
  Play,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhyNagrikSection: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      id: 'neighborhood',
      title: t.whyCard1Title,
      description: t.whyCard1Desc,
      icon: MapPin,
    },
    {
      id: 'video',
      title: t.whyCard2Title,
      description: t.whyCard2Desc,
      icon: Play,
    },
    {
      id: 'reporting',
      title: t.whyCard3Title,
      description: t.whyCard3Desc,
      icon: Camera,
    },
    {
      id: 'privacy',
      title: t.whyCard4Title,
      description: t.whyCard4Desc,
      icon: ShieldCheck,
    }
  ];

  return (
    <section id="why-nagrik" className="py-16 sm:py-24 bg-white dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl text-left space-y-2">
          <div className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
            {t.whyBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.whyTitle1} <span className="text-brand-600 dark:text-brand-500 font-medium italic">{t.whyTitle2}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.whySubtitle}
          </p>
        </div>

        {/* 4 Lightweight Benefits Grid with Interactive Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {benefits.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="card-hover-effect group p-6 rounded-2xl bg-[#FAF9F6] dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-brand-500/40 dark:hover:border-brand-500/40 flex flex-col justify-between cursor-default relative overflow-hidden"
              >
                {/* Subtle Card Top Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />

                <div className="space-y-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-5 h-5 transition-transform duration-300" />
                  </div>

                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
