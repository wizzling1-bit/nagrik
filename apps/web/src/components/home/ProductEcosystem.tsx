'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Monitor,
  Users,
  ArrowRight,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProductEcosystemProps {
  onOpenAppModal?: () => void;
}

export const ProductEcosystem: React.FC<ProductEcosystemProps> = ({ onOpenAppModal }) => {
  const { language } = useLanguage();

  return (
    <section id="ecosystem" className="py-24 sm:py-32 bg-newspaper-100 dark:bg-ink-950 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-3 sm:space-y-4 mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span>04 / {language === 'hi' ? 'नागरिक नेटवर्क' : 'THE CIVIC ECOSYSTEM'}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
          {language === 'hi'
            ? 'एक एकीकृत ढांचा। दो विशिष्ट अनुभव।'
            : 'One connected civic network. Two purposeful tools.'}
        </h2>
        <p className="text-base sm:text-lg text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
          {language === 'hi'
            ? 'नागरिक ग्राउंड रिपोर्टर्स को उनके पड़ोस के नागरिकों से सीधे जोड़ता है। कोई बिचौलिया नहीं, कोई राष्ट्रीय शोर नहीं।'
            : 'How ground reporting travels from the street to the newsroom desk and directly into neighborhood hands.'}
        </p>
      </div>

      {/* 3-Node Connected Architectural Flow */}
      <div className="rounded-xl bg-ink-900 border border-ink-800 p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden mb-12 sm:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          
          {/* Node 1: Mobile Reporting */}
          <div className="p-6 rounded-lg bg-ink-950 border border-ink-800 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-ink-900 text-ink-200 flex items-center justify-center border border-ink-800">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-ink-900 text-ink-300 border border-ink-800">
                STAGE 01 • SCENE
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-white">
              Mobile Reporting Companion
            </h3>
            <p className="text-xs text-ink-300 leading-relaxed font-normal">
              Eyewitness recording on the scene. Automated location coordinate stamping and rapid upload.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-ink-400">
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">HD Video Capture</span>
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">Location Stamped</span>
            </div>
          </div>

          {/* Desktop Arrow 1 -> 2 */}
          <div className="hidden lg:flex flex-col items-center justify-center text-ink-400 space-y-1">
            <span className="text-[10px] font-mono tracking-editorial-label text-brand-400 uppercase">Auto-Upload</span>
            <div className="w-full h-px bg-ink-700 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-brand-400 rotate-45" />
            </div>
            <span className="text-[10px] font-mono text-ink-400">Transcode & Review</span>
          </div>

          {/* Node 2: Creator Studio */}
          <div className="p-6 rounded-lg bg-ink-950 border border-brand-500/40 space-y-3 relative group shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Monitor className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-brand-500/15 text-brand-400 border border-brand-500/30">
                STAGE 02 • DESK
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-white">
              Nagrik Creator Studio
            </h3>
            <p className="text-xs text-ink-300 leading-relaxed font-normal">
              Curate reports, inspect live audience read analytics, and initiate direct UPI or bank withdrawals.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-ink-400">
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">$1.50 CPM</span>
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">Direct Disbursals</span>
            </div>
          </div>

          {/* Desktop Arrow 2 -> 3 */}
          <div className="hidden lg:flex flex-col items-center justify-center text-ink-400 space-y-1">
            <span className="text-[10px] font-mono tracking-editorial-label text-ink-300 uppercase">Broadcast</span>
            <div className="w-full h-px bg-ink-700 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-ink-400 rotate-45" />
            </div>
            <span className="text-[10px] font-mono text-ink-400">Local Locality Stream</span>
          </div>

          {/* Node 3: Neighborhood Audience */}
          <div className="p-6 rounded-lg bg-ink-950 border border-ink-800 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-ink-900 text-ink-200 flex items-center justify-center border border-ink-800">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-ink-900 text-ink-300 border border-ink-800">
                STAGE 03 • AUDIENCE
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-white">
              Neighborhood Readers
            </h3>
            <p className="text-xs text-ink-300 leading-relaxed font-normal">
              Local citizens read verified eyewitness stories, watch short bytes, and verify neighborhood civic truth.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-ink-400">
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">Locality Feed</span>
              <span className="px-2 py-0.5 rounded bg-ink-900 border border-ink-800">Verified Eyewitness</span>
            </div>
          </div>

        </div>
      </div>

      {/* Two Clean Architectural Panels (Studio + App) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Creator Studio Card */}
        <div className="p-8 sm:p-10 rounded-xl bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800 shadow-sm space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-semibold text-newspaper-500 dark:text-ink-400 tracking-editorial-label">
              FOR INDEPENDENT JOURNALISTS & STRINGERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
              Nagrik Creator Studio
            </h3>
          </div>

          <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
            A dedicated web console for filing eyewitness ground stories, reviewing location metadata, tracking verified reader engagement, and receiving automated payouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Full HD video dropzone</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
              <span>$1.50 CPM flat contributor rate</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
              <span>100% Contributor IP retention</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Direct UPI & Bank withdrawals</span>
            </div>
          </div>

          <div className="pt-4 border-t border-newspaper-200 dark:border-ink-800">
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Launch Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Consumer Mobile App Card */}
        <div className="p-8 sm:p-10 rounded-xl bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800 shadow-sm space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-semibold text-newspaper-500 dark:text-ink-400 tracking-editorial-label">
              FOR LOCAL CITIZENS & READERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
              Nagrik Citizen Mobile App
            </h3>
          </div>

          <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
            A fast, lightweight companion app delivering verified local news from within your neighborhood. Real-time civic updates, short eyewitness video reels, and zero national sensationalism.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-newspaper-600 dark:text-ink-400 shrink-0" />
              <span>Neighborhood feed radius</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-newspaper-600 dark:text-ink-400 shrink-0" />
              <span>Instant civic alert notifications</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-newspaper-600 dark:text-ink-400 shrink-0" />
              <span>Eyewitness video bytes & reels</span>
            </div>
            <div className="flex items-center gap-2 text-newspaper-700 dark:text-ink-300">
              <CheckCircle2 className="w-4 h-4 text-newspaper-600 dark:text-ink-400 shrink-0" />
              <span>100% Free • Zero subscription fees</span>
            </div>
          </div>

          <div className="pt-4 border-t border-newspaper-200 dark:border-ink-800">
            <button
              onClick={onOpenAppModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-newspaper-900 dark:bg-white text-white dark:text-ink-950 hover:bg-newspaper-800 dark:hover:bg-newspaper-100 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Download Citizen App (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
