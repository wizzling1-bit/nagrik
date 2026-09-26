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
  Radio,
  FileCheck,
  CheckCircle2,
  DollarSign,
  Download,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface ProductEcosystemProps {
  onOpenAppModal?: () => void;
}

export const ProductEcosystem: React.FC<ProductEcosystemProps> = ({ onOpenAppModal }) => {
  const { language } = useLanguage();
  const { rate } = useCurrency();

  return (
    <section id="ecosystem" className="py-20 sm:py-28 lg:py-32 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-content-secondary">
          <span className="text-[#DE5227] font-bold text-base leading-none">—</span>
          <span>{language === 'hi' ? 'नागरिक नेटवर्क इकोसिस्टम' : 'The Nagrik Civic Network'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
          {language === 'hi'
            ? 'एक एकीकृत ढांचा। दो विशिष्ट अनुभव।'
            : 'One connected civic network. Two purposeful tools.'}
        </h2>
        <p className="text-base sm:text-lg text-content-secondary leading-relaxed font-normal">
          {language === 'hi'
            ? 'नागरिक ग्राउंड रिपोर्टर्स को उनके पड़ोस के नागरिकों से सीधे जोड़ता है। कोई बिचौलिया नहीं, कोई राष्ट्रीय शोर नहीं।'
            : 'How a street report reaches your neighborhood — verified and published within 5km.'}
        </p>
      </div>

      {/* ── INTERCONNECTED ARCHITECTURAL FLOW (Phone → Studio → Audience) ── */}
      <div className="rounded-3xl bg-surface-card border border-stone-200/90 dark:border-white/[0.08] p-6 sm:p-8 lg:p-10 text-slate-900 dark:text-white shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden mb-12 sm:mb-16 transition-all duration-200">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DE5227]/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Workflow Header Strip */}
        <div className="hidden sm:flex items-center justify-between pb-5 mb-6 border-b border-stone-200/80 dark:border-white/[0.08] text-xs font-mono relative z-10">
          <div className="flex items-center gap-2 text-content-secondary">
            <span className="w-2 h-2 rounded-full bg-[#DE5227] animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-slate-200 tracking-wide uppercase">
              {language === 'hi' ? 'एंड-टू-एंड हाइपरलोकल सत्यापन पाइपलाइन' : 'End-to-End Hyperlocal Verification Pipeline'}
            </span>
          </div>
          <span className="font-script text-blue-600 dark:text-blue-400 text-xl font-bold -rotate-2 select-none pointer-events-none animate-scribble-float-1">
            ~ connecting 4,000+ Indian wards 🇮🇳
          </span>
        </div>

        {/* Flow Pipeline: Horizontal Row on Desktop, Vertical Stack on Mobile */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-0 relative z-10">
          
          {/* NODE 1: ON-THE-SCENE REPORTER */}
          <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#101622] border border-stone-200/90 dark:border-white/[0.08] space-y-4 relative group hover:border-stone-300 dark:hover:border-white/20 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 flex flex-col justify-between shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                  STAGE 01 • SCENE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-950 dark:text-white">
                Mobile Reporting Companion
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed font-normal">
                Eyewitness recording on the scene. Automatic 5km ward-level GPS coordinate stamping.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono text-content-secondary">
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 font-semibold">1080p RAW Capture</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 font-semibold">GPS Timestamp</span>
            </div>
          </div>

          {/* CONNECTOR 1 -> 2 */}
          {/* Desktop Horizontal Connector */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4 w-36 shrink-0 text-content-secondary space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#DE5227] font-bold uppercase">
              Auto-Upload
            </span>
            <div className="w-full h-0.5 bg-gradient-to-r from-stone-300 dark:from-slate-600 via-[#DE5227] to-[#DE5227] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#DE5227] rotate-45" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#DE5227] animate-ping" />
            </div>
            <span className="text-xs font-mono text-content-secondary text-center leading-tight">
              Transcode & Dedupe
            </span>
          </div>

          {/* Mobile Vertical Connector */}
          <div className="flex lg:hidden flex-col items-center justify-center py-2 text-content-secondary">
            <span className="text-xs font-mono tracking-widest uppercase mb-1 text-[#DE5227] font-bold">
              Auto-Upload
            </span>
            <div className="w-0.5 h-7 bg-gradient-to-b from-slate-400 dark:from-slate-600 to-[#DE5227] relative">
              <ArrowDown className="w-3.5 h-3.5 text-[#DE5227] absolute -bottom-3 -left-1.5" />
            </div>
          </div>

          {/* NODE 2: CREATOR STUDIO CONSOLE (FEATURED) */}
          <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141B26] border-2 border-[#DE5227]/70 dark:border-[#DE5227] shadow-[0_4px_24px_rgba(222,82,39,0.12)] dark:shadow-[0_0_30px_rgba(222,82,39,0.2)] space-y-4 relative group hover:border-[#DE5227] transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-[#DE5227]/10 text-[#DE5227] border border-[#DE5227]/30">
                  STAGE 02 • DESK
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-950 dark:text-white">
                Nagrik Creator Studio
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed font-normal">
                Curate reports, inspect live audience read analytics, and initiate instant UPI withdrawals.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono text-content-secondary">
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 dark:bg-white/[0.06] border border-orange-200 dark:border-white/10 text-[#DE5227] font-bold">₹{Math.round(rate)} / $1.00 CPM</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-white/[0.05] border border-stone-200/80 dark:border-white/10 font-semibold">Direct UPI Disbursals</span>
            </div>
          </div>

          {/* CONNECTOR 2 -> 3 */}
          {/* Desktop Horizontal Connector */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4 w-36 shrink-0 text-content-secondary space-y-2">
            <span className="text-xs font-mono tracking-widest text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              Broadcast
            </span>
            <div className="w-full h-0.5 bg-gradient-to-r from-[#DE5227] via-emerald-500 to-emerald-500 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-emerald-500 rotate-45" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-xs font-mono text-content-secondary text-center leading-tight">
              Within 5km Radius
            </span>
          </div>

          {/* Mobile Vertical Connector */}
          <div className="flex lg:hidden flex-col items-center justify-center py-2 text-content-secondary">
            <span className="text-xs font-mono tracking-widest uppercase mb-1 text-emerald-600 dark:text-emerald-400 font-bold">
              Broadcast
            </span>
            <div className="w-0.5 h-7 bg-gradient-to-b from-[#DE5227] to-emerald-500 relative">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-500 absolute -bottom-3 -left-1.5" />
            </div>
          </div>

          {/* NODE 3: LOCAL CITIZEN AUDIENCE */}
          <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#101622] border border-stone-200/90 dark:border-white/[0.08] space-y-4 relative group hover:border-stone-300 dark:hover:border-white/20 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 flex flex-col justify-between shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-white/10">
                  STAGE 03 • AUDIENCE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-950 dark:text-white">
                Neighborhood Residents
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed font-normal">
                Local citizens read verified eyewitness stories, watch short bytes, and verify neighborhood civic truth.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono text-content-secondary">
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-white/[0.05] border border-stone-200/80 dark:border-white/10 font-semibold">5km Ward Feed</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-white/[0.05] border border-stone-200/80 dark:border-white/10 font-semibold">Verified Eyewitness</span>
            </div>
          </div>

        </div>

      </div>

      {/* ── TWO DISTINCT EXPERIENCES (SIDE-BY-SIDE ON DESKTOP, STACKED ON MOBILE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Creator Studio Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface-card border border-stone-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md dark:hover:border-white/20 dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-all duration-200 space-y-5 sm:space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-content-secondary tracking-wider">
                For Independent Journalists & Stringers
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
                  Nagrik Creator Studio
                </h3>
                <span className="font-script text-amber-700 dark:text-amber-300 text-lg font-bold rotate-2 select-none pointer-events-none hidden sm:inline-block animate-scribble-bob">
                  ~ built for stringers 🎙️
                </span>
              </div>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed font-normal">
              A web tool for filing stories, reviewing GPS data, tracking readers, and getting paid via UPI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
                <span>Full 1080p RAW video dropzone</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#DE5227] shrink-0" />
                <span>₹{Math.round(rate)} / $1.00 CPM per 1k reads</span>
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
          </div>

          <div className="pt-4 border-t border-stone-200/80 dark:border-white/[0.08]">
            <Link
              href="/creator"
              className="btn-primary inline-flex items-center gap-2 shadow-xs hover:shadow-md"
            >
              <span>Launch Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Consumer Mobile App Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface-card border border-stone-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md dark:hover:border-white/20 dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-all duration-200 space-y-5 sm:space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-content-secondary tracking-wider">
                For Local Citizens & Readers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
                Nagrik Citizen Mobile App
              </h3>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed font-normal">
              A fast mobile app for verified local news within 5km. Get civic alerts, short video reports, and no clickbait.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5km Hyperlocal feed radius</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant civic alert notifications</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Eyewitness video bytes & reels</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Free • Zero subscription fees</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3">
            <button
              onClick={onOpenAppModal}
              className="btn-secondary inline-flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
            >
              <span>Download Citizen App (Free)</span>
              <Download className="w-4 h-4" />
            </button>
            <span className="font-script text-emerald-600 dark:text-emerald-400 text-lg font-bold -rotate-2 select-none pointer-events-none hidden sm:inline-block animate-scribble-sway">
              ~ 100% free for neighbors 🏡
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
