'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  MapPin,
  Play,
  QrCode,
  Compass,
  Radio,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenQrModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQrModal }) => {
  const { language, t } = useLanguage();

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Consumer Editorial Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Simple Eyebrow with Animated Live Beacon */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 text-xs font-mono font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase animate-fade-in-down">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600 dark:bg-brand-400" />
              </span>
              <span>{t.heroEyebrow}</span>
            </div>

            {/* Dominant Editorial Headline (60-72px Desktop) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black font-serif tracking-tight text-slate-900 dark:text-white leading-[1.02] animate-fade-in-up animate-delay-100">
              {t.heroHeadline1}{' '}
              <span className="text-brand-600 dark:text-brand-500 italic font-medium">
                {t.heroHeadline2}
              </span>
            </h1>

            {/* Clear Supporting Copy */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal animate-fade-in-up animate-delay-200">
              {t.heroSubtitle}
            </p>

            {/* Primary & Secondary Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 animate-fade-in-up animate-delay-300">
              <Link
                href="/#download"
                className="btn-shimmer inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <Smartphone className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{t.heroCtaPrimary}</span>
              </Link>

              <Link
                href="/#why-nagrik"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <span>{t.heroCtaSecondary}</span>
              </Link>

              <button
                onClick={onOpenQrModal}
                className="inline-flex items-center justify-center p-3.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand-500 shadow-xs"
                title={t.heroScanQr}
                aria-label={t.heroScanQr}
              >
                <QrCode className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-200 hover:rotate-6" />
              </button>
            </div>

            {/* Quiet Supporting Proof Line */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 animate-fade-in-up animate-delay-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>5 KM Ward Geofence</span>
              </span>
              <span>·</span>
              <span>100% Free / Zero Login</span>
              <span>·</span>
              <span>Verified Eyewitness Bytes</span>
            </div>

          </div>

          {/* Right Column: Authentic Product Smartphone Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up animate-delay-200">
            <div className="w-full max-w-[320px] sm:max-w-[340px] animate-float">
              
              {/* Smartphone Chassis with Subtle Ambient Glow */}
              <div className="p-3 rounded-3xl bg-slate-200/90 dark:bg-[#111827] border border-slate-300/80 dark:border-slate-800 shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/15 transition-all duration-300 relative group">
                
                {/* Smartphone Screen Content */}
                <div className="bg-white dark:bg-[#0B0F17] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 p-3.5 space-y-3 text-left min-h-[470px] flex flex-col justify-between">
                  
                  {/* Dynamic Island Header */}
                  <div>
                    <div className="w-20 h-3 bg-slate-900 dark:bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-2">
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-bold font-serif text-slate-900 dark:text-white">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                        </span>
                        <span>Nagrik Live</span>
                      </div>
                      <span className="text-brand-600 dark:text-brand-400 font-mono text-[11px] font-semibold">
                        WARD 14 · PATNA
                      </span>
                    </div>

                    {/* Active Screen News Item */}
                    <div className="pt-2.5 space-y-2.5">
                      <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden shadow-xs group/card cursor-pointer">
                        <img
                          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80"
                          alt="Local Report Preview"
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        
                        {/* 5KM Geofence Pill */}
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-mono text-[10px] font-semibold flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-brand-400" />
                          <span>5KM RADIUS</span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white space-y-0.5">
                          <div className="text-xs font-bold font-serif leading-snug line-clamp-2">
                            {t.heroSimulatorHeadline2}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-0.5">
                            <span>Kankarbagh</span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Just now
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Video Story Byte */}
                      <div className="p-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1 hover:border-brand-500/40 transition-colors cursor-pointer group/byte">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current group-hover/byte:scale-125 transition-transform" />
                            <span>SHORT VIDEO</span>
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">Varanasi</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 font-serif">
                          {t.heroSimulatorHeadline1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Bar Navigation */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-around text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-brand-600 dark:text-brand-400 font-bold flex flex-col items-center gap-0.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Nearby</span>
                    </span>
                    <span className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                      <Play className="w-3.5 h-3.5" />
                      <span>Videos</span>
                    </span>
                    <span className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Alerts</span>
                    </span>
                    <span className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </span>
                  </div>

                </div>

                {/* Hardware Home Indicator */}
                <div className="w-16 h-1 bg-slate-400 dark:bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
