'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EarningsCalculator: React.FC = () => {
  const { language } = useLanguage();
  
  // Interactive slider state
  const [monthlyViews, setMonthlyViews] = useState<number>(65000);
  const [timeframe, setTimeframe] = useState<'monthly' | 'annual' | 'daily'>('monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Multipliers
  const multiplier = timeframe === 'annual' ? 12 : timeframe === 'daily' ? 1 / 30 : 1;
  const effectiveViews = Math.round(monthlyViews * multiplier);
  
  // Flat rate: $1.50 CPM (per 1,000 verified reads), 1 USD ≈ ₹86 INR
  const earningsUSD = (effectiveViews / 1000) * 1.5;
  const earningsINR = Math.round(earningsUSD * 86);

  // Quick preset pills
  const presets = [10000, 25000, 50000, 100000, 250000, 500000];

  return (
    <section id="earnings" className="py-24 sm:py-32 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-4 mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 font-bold text-base leading-none">—</span>
          <span>{language === 'hi' ? 'कमाई पारदर्शिता' : 'TRANSPARENT MONETIZATION'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
          {language === 'hi'
            ? 'जानिए आपका काम क्या कमा सकता है।'
            : 'Know what your work can earn.'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {language === 'hi'
            ? 'सत्यापित स्थानीय व्यूज और नागरिक के मानक $1.50 CPM (लगभग ₹129 प्रति 1,000 व्यू) पर अपनी अनुमानित आय का आकलन करें।'
            : 'Estimate your potential earnings based on verified local reads and Nagrik’s standard flat $1.50 CPM rate. No hidden cuts.'}
        </p>
      </div>

      {/* ── FINTECH-GRADE CALCULATOR CONSOLE ── */}
      <div className="rounded-3xl bg-[#0D1424] border border-slate-800 p-6 sm:p-10 lg:p-12 text-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Interactive View Slider & Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Read Count Metric & Timeframe Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                  Estimated {timeframe} Reads
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white mt-1 break-words">
                  {effectiveViews.toLocaleString()}{' '}
                  <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">verified reads</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-[#141D30] p-1.5 rounded-xl border border-slate-700/80 font-mono text-xs self-start sm:self-auto">
                {(['daily', 'monthly', 'annual'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition font-bold cursor-pointer ${
                      timeframe === tf
                        ? 'bg-[#DE5227] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider with visual progress track */}
            <div className="space-y-4">
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#DE5227]"
              />
              
              {/* Preset buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1 font-mono text-xs">
                <span className="text-slate-400 text-[11px] font-sans mr-1">Quick Presets:</span>
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyViews(preset)}
                    className={`px-3 py-1 rounded-md text-[11px] transition cursor-pointer font-mono ${
                      monthlyViews === preset
                        ? 'bg-[#DE5227] text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Terms Ledger */}
            <div className="p-4 rounded-xl bg-[#141D30] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DE5227]" />
                <span>$1.50 Flat CPM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>₹850 ($10) Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Zero Deductions</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Live Payout Card */}
          <div className="lg:col-span-5 rounded-2xl bg-[#141D30] border border-slate-700/90 p-6 sm:p-8 space-y-6 text-left shadow-lg">
            
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase font-bold tracking-wider">Estimated Payout</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition ${
                    currency === 'INR' ? 'bg-[#DE5227] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition ${
                    currency === 'USD' ? 'bg-[#DE5227] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-[#DE5227] break-words">
                {currency === 'INR' ? `₹${earningsINR.toLocaleString('en-IN')}` : `$${earningsUSD.toFixed(2)}`}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                {currency === 'INR' ? `≈ $${earningsUSD.toFixed(2)} USD` : `≈ ₹${earningsINR.toLocaleString('en-IN')} INR`}
              </div>
            </div>

            {/* Direct Payout Channels */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-300 font-semibold">Disbursed directly via:</div>
              <div className="text-slate-400 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">PhonePe</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">Google Pay</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">Paytm</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">BHIM UPI</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">NEFT / IMPS</span>
              </div>
            </div>

            <Link
              href="/creator"
              className="w-full py-3.5 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs text-center shadow-md transition block cursor-pointer"
            >
              Claim Contributor Profile →
            </Link>

            <div className="text-[10px] text-slate-400 font-mono leading-tight">
              * Calculations are estimations based on verified unique human reads. Earnings are not financial guarantees and require compliance with community authenticity rules.
            </div>

          </div>

        </div>

        {/* ── 4-STEP PAYOUT STORY FLOW ── */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6 text-left">
            HOW DISBURSALS WORK (NO ESCROW DELAYS)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            <div className="p-4 rounded-xl bg-[#141D30] border border-slate-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-[#DE5227]">01 • EARN</div>
              <div className="font-bold text-white text-sm">Publish Ground Reports</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Views begin monetizing immediately from your first published story at $1.50 CPM.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-slate-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-[#DE5227]">02 • THRESHOLD</div>
              <div className="font-bold text-white text-sm">Reach ₹850 ($10)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modest withdrawal threshold designed for real everyday contributors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-slate-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-[#DE5227]">03 • SELECT METHOD</div>
              <div className="font-bold text-white text-sm">Enter UPI or Bank</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your personal PhonePe, Google Pay, Paytm, or direct account number.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141D30] border border-slate-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-emerald-400">04 • SETTLEMENT</div>
              <div className="font-bold text-white text-sm">Direct Disbursal in 2–24h</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant UPI settlements with zero platform processing fees or deductions.
              </p>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
