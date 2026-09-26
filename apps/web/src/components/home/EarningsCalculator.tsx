'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Landmark,
  Wallet,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export const EarningsCalculator: React.FC = () => {
  const { language } = useLanguage();
  const { rate, usdToInr, cpmRateText, isLoading: isCurrencyLoading } = useCurrency();
  
  // Interactive slider state
  const [monthlyViews, setMonthlyViews] = useState<number>(65000);
  const [timeframe, setTimeframe] = useState<'monthly' | 'annual' | 'daily'>('monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Multipliers
  const multiplier = timeframe === 'annual' ? 12 : timeframe === 'daily' ? 1 / 30 : 1;
  const effectiveViews = Math.round(monthlyViews * multiplier);
  
  // Flat rate: $1.00 CPM (per 1,000 verified reads) with real-time live currency conversion
  const earningsUSD = (effectiveViews / 1000) * 1.0;
  const earningsINR = Math.round(usdToInr(earningsUSD));

  // Quick preset pills
  const presets = [10000, 25000, 50000, 100000, 250000, 500000];

  // Calculate slider percentage for gradient fill
  const minViews = 5000;
  const maxViews = 500000;
  const sliderPercent = ((monthlyViews - minViews) / (maxViews - minViews)) * 100;

  return (
    <section id="earnings" className="py-24 sm:py-32 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-4 mb-14 sm:mb-18">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-content-secondary">
          <span className="text-[#DE5227] font-bold text-base leading-none">—</span>
          <span>{language === 'hi' ? 'कमाई पारदर्शिता' : 'Transparent Monetization'}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live FX: $1 = ₹{rate.toFixed(2)}
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
          {language === 'hi'
            ? 'जानिए आपका काम क्या कमा सकता है।'
            : 'Know what your work can earn.'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {language === 'hi'
            ? `सत्यापित स्थानीय व्यूज और नागरिक के मानक $1.00 CPM (लगभग ₹${Math.round(rate)} प्रति 1,000 व्यू) पर अपनी अनुमानित आय का आकलन करें।`
            : `Estimate your potential earnings based on verified local reads and Nagrik’s standard flat $1.00 CPM rate (~₹${rate.toFixed(2)}/1k reads). No hidden platform cuts.`}
        </p>
      </div>

      {/* ── FINTECH-GRADE CALCULATOR CONSOLE ── */}
      <div className="rounded-3xl bg-surface-card border border-stone-200/90 dark:border-white/[0.08] p-6 sm:p-10 lg:p-12 lg:pb-16 text-slate-900 dark:text-white shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-200 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#DE5227]/5 dark:bg-[#DE5227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          
          {/* Left Column (7 cols): Interactive View Slider & Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Read Count Metric & Timeframe Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-content-secondary font-bold tracking-wider">
                  Estimated {timeframe} Reads
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-slate-950 dark:text-white mt-1 break-words">
                  {effectiveViews.toLocaleString()}{' '}
                  <span className="text-xs sm:text-sm font-normal text-content-secondary font-sans">verified reads</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-surface-muted dark:bg-[#101520] p-1.5 rounded-xl border border-stone-200 dark:border-white/10 font-mono text-xs self-start sm:self-auto shadow-2xs">
                {(['daily', 'monthly', 'annual'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition font-bold cursor-pointer ${
                      timeframe === tf
                        ? 'bg-[#C84318] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider with visual progress track */}
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={minViews}
                  max={maxViews}
                  step="5000"
                  value={monthlyViews}
                  onChange={(e) => setMonthlyViews(Number(e.target.value))}
                  aria-label="Monthly views"
                  style={{
                    background: `linear-gradient(to right, #DE5227 0%, #DE5227 ${sliderPercent}%, var(--border-subtle) ${sliderPercent}%, var(--border-subtle) 100%)`
                  }}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[#DE5227] shadow-inner"
                />
              </div>
              
              {/* Preset buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1 font-mono text-xs">
                <span className="text-content-secondary text-xs font-sans mr-1 font-medium">Quick Presets:</span>
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyViews(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer font-mono font-bold ${
                      monthlyViews === preset
                        ? 'bg-[#C84318] text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-white/[0.12] border border-stone-200/80 dark:border-white/10'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k reads` : `${preset} reads`}
                  </button>
                ))}
                <span className="font-script text-amber-700 dark:text-amber-300 text-lg font-semibold -rotate-2 select-none pointer-events-none animate-scribble-sway ml-1 hidden sm:inline-block">
                  ~ drag slider to see live returns 📈
                </span>
              </div>
            </div>

            {/* Core Terms Ledger */}
            <div className="p-4 rounded-2xl bg-surface-muted dark:bg-[#101520] border border-stone-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#DE5227]" />
                <span>$1.00 Flat CPM (~₹{rate.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Zero Escrow Retainage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Daily Realtime Accrual</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Live Net Take-Home Payout Console */}
          <div className="lg:col-span-5 rounded-2xl bg-stone-50 dark:bg-[#121824] border border-stone-200/90 dark:border-white/10 p-6 sm:p-7 space-y-6 shadow-xs dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)] relative">
            
            {/* Ambient accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-[#DE5227] to-amber-500" />

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-content-secondary uppercase font-bold tracking-wider">Estimated Payout</span>
              <div className="flex items-center gap-1 bg-white dark:bg-[#0B0F17] p-1 rounded-xl border border-stone-200 dark:border-white/10 shadow-2xs">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition font-mono text-xs font-bold ${
                    currency === 'INR' ? 'bg-[#C84318] text-white shadow-2xs' : 'text-content-secondary hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition font-mono text-xs font-bold ${
                    currency === 'USD' ? 'bg-[#C84318] text-white shadow-2xs' : 'text-content-secondary hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-5.5 right-0 select-none pointer-events-none animate-scribble-bob hidden sm:block">
                <span className="font-script text-emerald-700 dark:text-emerald-400 text-lg font-bold rotate-2">
                  ~ 100% yours, zero cuts 💸
                </span>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-[#C84318] dark:text-orange-400 break-words tracking-tight">
                {currency === 'INR' ? `₹${earningsINR.toLocaleString('en-IN')}` : `$${earningsUSD.toFixed(2)}`}
              </div>
              <div className="text-xs text-content-secondary font-mono mt-1 font-medium">
                {currency === 'INR' ? `≈ $${earningsUSD.toFixed(2)} USD standard baseline` : `≈ ₹${earningsINR.toLocaleString('en-IN')} INR equivalent`}
              </div>
            </div>

            {/* Direct Payout Channels */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10 space-y-2.5 text-xs font-mono">
              <div className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#C84318] dark:text-orange-400" />
                <span>Disbursed directly via:</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 flex flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold">PhonePe</span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold">Google Pay</span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold">Paytm</span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold">BHIM UPI</span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold">NEFT / IMPS</span>
              </div>
            </div>

            <Link
              href="/creator"
              className="btn-primary w-full block text-center shadow-md hover:shadow-lg"
            >
              <span>Claim Contributor Profile</span>
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>

            <div className="text-xs text-content-secondary font-mono leading-relaxed">
              * Estimates are based on verified human reads. Actual earnings depend on report verification and community guidelines.
            </div>

          </div>

        </div>

        {/* ── 4-STEP PAYOUT STORY FLOW ── */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#E8DFD1] dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 text-left flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#DE5227]/10 dark:bg-[#DE5227]/20 flex items-center justify-center text-[#DE5227]">
                <Wallet className="w-3.5 h-3.5" />
              </span>
              <span>{language === 'hi' ? 'भुगतान प्रक्रिया (कोई विलंब नहीं)' : 'How Payouts Work (No Escrow Delays)'}</span>
            </div>
            <span className="font-script text-indigo-700 dark:text-indigo-300 text-xl font-semibold -rotate-1 select-none pointer-events-none hidden sm:inline-block animate-scribble-float-1">
              ~ no 30-day escrow, out in 2–24h ⚡
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
            {[
              {
                step: '01',
                tag: 'EARN',
                title: 'Publish Ground Reports',
                desc: 'Earn money from your very first published report at a flat $1.00 CPM.',
                highlight: false,
              },
              {
                step: '02',
                tag: 'THRESHOLD',
                title: `Reach ₹${Math.round(rate * 10)} ($10)`,
                desc: 'A low minimum threshold so local contributors can withdraw quickly without delay.',
                highlight: false,
              },
              {
                step: '03',
                tag: 'METHOD',
                title: 'Enter UPI or Bank',
                desc: 'Connect your personal PhonePe, Google Pay, Paytm, or bank account.',
                highlight: false,
              },
              {
                step: '04',
                tag: 'SETTLEMENT',
                title: 'Direct Disbursal in 2–24h',
                desc: 'Instant UPI settlements with zero fees or deductions from your pay.',
                highlight: true,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`relative p-5 sm:p-5.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-full group ${
                  item.highlight
                    ? 'bg-gradient-to-b from-emerald-500/10 via-[#F8F5EE] to-[#F8F5EE] dark:from-emerald-950/30 dark:via-[#0F1420] dark:to-[#0F1420] border-emerald-500/35 dark:border-emerald-500/40 hover:border-emerald-500/60 shadow-xs dark:shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                    : 'bg-[#F8F5EE] dark:bg-[#0F1420] border-[#E6DDD0] dark:border-white/[0.08] hover:border-[#DE5227]/40 dark:hover:border-white/20 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Step Pill & Stage */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center ${
                        item.highlight
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black'
                          : 'bg-orange-500/15 text-[#C84318] dark:text-orange-400 font-black'
                      }`}
                    >
                      {item.step}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        item.highlight
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
                          : 'bg-stone-200/80 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-stone-300/60 dark:border-white/10'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-[15px] font-serif pt-1">
                    {item.title}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
