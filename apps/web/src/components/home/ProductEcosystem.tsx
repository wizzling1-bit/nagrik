'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Monitor,
  Users,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  MapPin,
  Sparkles,
  Radio,
  FileCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProductEcosystemProps {
  onOpenAppModal?: () => void;
}

export const ProductEcosystem: React.FC<ProductEcosystemProps> = ({ onOpenAppModal }) => {
  const { language } = useLanguage();

  return (
    <section id="ecosystem" className="py-20 sm:py-28 lg:py-32 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 font-bold text-base leading-none">—</span>
          <span>{language === 'hi' ? 'नागरिक नेटवर्क इकोसिस्टम' : 'THE NAGRIK CIVIC NETWORK'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
          {language === 'hi'
            ? 'एक एकीकृत ढांचा। दो विशिष्ट अनुभव।'
            : 'One connected civic network. Two purposeful tools.'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {language === 'hi'
            ? 'नागरिक ग्राउंड रिपोर्टर्स को उनके पड़ोस के नागरिकों से सीधे जोड़ता है। कोई बिचौलिया नहीं, कोई राष्ट्रीय शोर नहीं।'
            : 'How ground reporting travels from the street to the newsroom desk and directly into neighborhood hands within a 5km radius.'}
        </p>
      </div>

      {/* ── INTERCONNECTED ARCHITECTURAL FLOW (Phone → Studio → Audience) ── */}
      <div className="rounded-3xl bg-[#101726] border border-slate-800 p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden mb-12 sm:mb-16">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-center relative z-10">
          
          {/* NODE 1: ON-THE-SCENE REPORTER */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#162032] border border-slate-700/70 space-y-3 relative group hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                STAGE 01 • SCENE
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              Mobile Reporting Companion
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Eyewitness recording on the scene. Automatic 5km ward-level GPS coordinate stamping.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">1080p RAW</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">GPS Timestamp</span>
            </div>
          </div>

          {/* MOBILE DOWN CONNECTOR 1 -> 2 (Shown only on mobile/tablet) */}
          <div className="flex lg:hidden flex-col items-center justify-center py-1 text-slate-400">
            <span className="text-[10px] font-mono tracking-widest uppercase mb-1">Auto-Upload</span>
            <div className="w-0.5 h-6 bg-gradient-to-b from-slate-600 to-[#DE5227] relative">
              <ArrowDown className="w-3.5 h-3.5 text-[#DE5227] absolute -bottom-3 -left-1.5" />
            </div>
          </div>

          {/* DESKTOP ARROW 1 -> 2 (Desktop only indicator) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-slate-500 space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#DE5227] uppercase">Auto-Upload</span>
            <div className="w-full h-0.5 bg-gradient-to-r from-slate-600 to-[#DE5227] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#DE5227] rotate-45" />
            </div>
            <span className="text-[9px] font-mono text-slate-400">Transcode & Deduplicate</span>
          </div>

          {/* NODE 2: CREATOR STUDIO CONSOLE */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#162032] border border-slate-700/70 space-y-3 relative group hover:border-[#DE5227]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#DE5227]/15 text-[#DE5227] flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#DE5227]/20 text-[#DE5227] border border-[#DE5227]/30">
                STAGE 02 • DESK
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              Nagrik Creator Studio
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Curate reports, inspect live audience read analytics, and initiate instant UPI withdrawals.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">$1.50 CPM</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">UPI Disbursals</span>
            </div>
          </div>

          {/* MOBILE DOWN CONNECTOR 2 -> 3 (Shown only on mobile/tablet) */}
          <div className="flex lg:hidden flex-col items-center justify-center py-1 text-slate-400">
            <span className="text-[10px] font-mono tracking-widest uppercase mb-1">Broadcast</span>
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#DE5227] to-slate-600 relative">
              <ArrowDown className="w-3.5 h-3.5 text-slate-400 absolute -bottom-3 -left-1.5" />
            </div>
          </div>

          {/* DESKTOP ARROW 2 -> 3 (Desktop only indicator) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-slate-500 space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">Broadcast</span>
            <div className="w-full h-0.5 bg-gradient-to-r from-[#DE5227] to-slate-600 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45" />
            </div>
            <span className="text-[9px] font-mono text-slate-400">Within 5km Radius</span>
          </div>

          {/* NODE 3: LOCAL CITIZEN AUDIENCE */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#162032] border border-slate-700/70 space-y-3 relative group hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                STAGE 03 • AUDIENCE
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              Neighborhood Residents
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Local citizens read verified eyewitness stories, watch short bytes, and verify neighborhood civic truth.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">5km Ward Feed</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Verified Eyewitness</span>
            </div>
          </div>

        </div>

      </div>

      {/* ── TWO DISTINCT EXPERIENCES (SIDE-BY-SIDE ON DESKTOP, STACKED ON MOBILE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Creator Studio Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              FOR INDEPENDENT JOURNALISTS & STRINGERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
              Nagrik Creator Studio
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A comprehensive web console for filing eyewitness ground stories, reviewing 5km GPS geofencing metadata, tracking verified reader engagement, and receiving automated UPI payouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
              <span>Full 1080p RAW video dropzone</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
              <span>$1.50 CPM flat rate per 1k views</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
              <span>100% Contributor IP retention</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
              <span>Direct UPI & Bank withdrawals</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/80 dark:border-slate-800/80">
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            >
              <span>Launch Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Consumer Mobile App Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              FOR LOCAL CITIZENS & READERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
              Nagrik Citizen Mobile App
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A fast, lightweight mobile app delivering verified local news from within your 5km municipal radius. Real-time civic notifications, short eyewitness video reels, and zero national sensationalism.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
              <span>5km Hyperlocal feed radius</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
              <span>Instant civic alert notifications</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
              <span>Eyewitness video bytes & reels</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
              <span>100% Free • Zero subscription fees</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/80 dark:border-slate-800/80">
            <button
              onClick={onOpenAppModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
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
