'use client';

import React from 'react';
import Link from 'next/link';
import {
  PenTool,
  MapPin,
  Award,
  Wallet
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PublisherGatewaySection: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    { title: t.publisherPillar1, icon: PenTool },
    { title: t.publisherPillar2, icon: MapPin },
    { title: t.publisherPillar3, icon: Award },
    { title: t.publisherPillar4, icon: Wallet }
  ];

  return (
    <section className="py-16 sm:py-20 bg-surface-page dark:bg-surface-page border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="card-hover-effect group p-8 sm:p-10 rounded-2xl bg-surface-card dark:bg-surface-card border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />

          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
              <PenTool className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
              <span>{t.publisherGatewayBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white leading-tight">
              {t.publisherGatewayTitle}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.publisherGatewaySubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 group/pill">
                    <Icon className="w-3.5 h-3.5 text-brand-500 group-hover/pill:scale-125 transition-transform shrink-0" />
                    <span>{pillar.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto relative z-10">
            <Link
              href="/#calculator"
              className="btn-shimmer px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 hover:-translate-y-0.5 shadow-sm text-center focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <span>{t.publisherGatewayCta}</span>
            </Link>
            <Link
              href="/creator"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 text-center"
            >
              <span>{t.navPublisherPortal} →</span>
            </Link>
            <span className="font-script text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl font-bold rotate-3 text-center select-none pointer-events-none hidden sm:block pt-1 animate-scribble-float-2">
              ~ 1,200+ local reporters and growing ✍️
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
