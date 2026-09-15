'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Landmark,
  Wallet
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
  
  // Flat rate: $1.50 CPM per 1,000 verified reads, 1 USD ≈ ₹86 INR
  const earningsUSD = (effectiveViews / 1000) * 1.5;
  const earningsINR = Math.round(earningsUSD * 86);

  // Presets
  const presets = [10000, 25000, 50000, 100000, 250000, 500000];

  return (
    <section id="earnings" className="py-24 sm:py-32 bg-newspaper-100 dark:bg-ink-950 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-3 sm:space-y-4 mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span>05 / {language === 'hi' ? 'कमाई पारदर्शिता' : 'TRANSPARENT MONETIZATION'}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
          {language === 'hi'
            ? 'जानिए आपका काम क्या कमा सकता है।'
            : 'Know what your work can earn.'}
        </h2>
        <p className="text-base sm:text-lg text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
          {language === 'hi'
            ? 'सत्यापित स्थानीय व्यूज और नागरिक के मानक $1.50 CPM पर अपनी अनुमानित आय का आकलन करें। कोई छिपे हुए शुल्क नहीं।'
            : 'Estimate your potential contributor earnings based on verified reads and Nagrik’s standard flat $1.50 CPM rate.'}
        </p>
      </div>

      {/* Interactive Calculator Surface */}
      <div className="rounded-xl bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800 p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Controls & Slider */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Reads metric & Timeframe Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-newspaper-500 dark:text-ink-400 font-semibold tracking-editorial-label">
                  Estimated {timeframe} Reads
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-newspaper-900 dark:text-ink-50 mt-1">
                  {effectiveViews.toLocaleString()}{' '}
                  <span className="text-xs sm:text-sm font-normal text-newspaper-500 dark:text-ink-400 font-sans">verified reads</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-newspaper-200/70 dark:bg-ink-950 p-1 rounded-lg border border-newspaper-300/80 dark:border-ink-800 font-mono text-xs self-start sm:self-auto">
                {(['daily', 'monthly', 'annual'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-md capitalize transition font-medium cursor-pointer ${
                      timeframe === tf
                        ? 'bg-brand-500 text-white shadow-xs font-semibold'
                        : 'text-newspaper-600 dark:text-ink-400 hover:text-newspaper-900 dark:hover:text-white'
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
                className="w-full h-2 bg-newspaper-200 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              
              {/* Preset buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1 font-mono text-xs">
                <span className="text-newspaper-500 dark:text-ink-400 text-xs font-sans mr-1">Quick Presets:</span>
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyViews(preset)}
                    className={`px-3 py-1 rounded text-xs transition cursor-pointer font-mono ${
                      monthlyViews === preset
                        ? 'bg-brand-500 text-white font-semibold'
                        : 'bg-newspaper-200/80 dark:bg-ink-800 text-newspaper-700 dark:text-ink-300 hover:bg-newspaper-300 dark:hover:bg-ink-700'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Terms Overview */}
            <div className="p-4 rounded-lg bg-newspaper-50 dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-newspaper-600 dark:text-ink-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span>$1.50 Flat CPM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>$10 (~₹850) Minimum</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span>Zero Platform Deductions</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Live Payout Card with High-Contrast Serif Value */}
          <div className="lg:col-span-5 rounded-xl bg-newspaper-50 dark:bg-ink-950 border border-newspaper-300 dark:border-ink-800 p-6 sm:p-8 space-y-6 text-left">
            
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-newspaper-500 dark:text-ink-400 uppercase font-semibold tracking-editorial-label">
                Estimated Payout
              </span>
              <div className="flex items-center gap-1 bg-newspaper-200/80 dark:bg-ink-900 p-1 rounded-md border border-newspaper-300/80 dark:border-ink-800">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-0.5 rounded cursor-pointer text-xs font-medium transition ${
                    currency === 'INR' ? 'bg-brand-500 text-white font-semibold' : 'text-newspaper-600 dark:text-ink-400'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-0.5 rounded cursor-pointer text-xs font-medium transition ${
                    currency === 'USD' ? 'bg-brand-500 text-white font-semibold' : 'text-newspaper-600 dark:text-ink-400'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <div>
              {/* Large high-contrast display serif earnings figure */}
              <div className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-brand-600 dark:text-brand-400 tracking-serif-tight leading-none">
                {currency === 'INR' ? `₹${earningsINR.toLocaleString('en-IN')}` : `$${earningsUSD.toFixed(2)}`}
              </div>
              <div className="text-xs text-newspaper-500 dark:text-ink-400 font-mono mt-2">
                {currency === 'INR' ? `≈ $${earningsUSD.toFixed(2)} USD` : `≈ ₹${earningsINR.toLocaleString('en-IN')} INR`}
              </div>
            </div>

            {/* Direct Payout Channels */}
            <div className="pt-4 border-t border-newspaper-200 dark:border-ink-800 space-y-2 text-xs font-mono">
              <div className="text-newspaper-700 dark:text-ink-300 font-medium">Disbursed directly via:</div>
              <div className="flex flex-wrap gap-1.5 text-xs text-newspaper-600 dark:text-ink-300">
                <span className="px-2.5 py-1 rounded bg-newspaper-200/60 dark:bg-ink-900 border border-newspaper-300 dark:border-ink-800">PhonePe</span>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/60 dark:bg-ink-900 border border-newspaper-300 dark:border-ink-800">Google Pay</span>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/60 dark:bg-ink-900 border border-newspaper-300 dark:border-ink-800">Paytm</span>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/60 dark:bg-ink-900 border border-newspaper-300 dark:border-ink-800">UPI VPA</span>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/60 dark:bg-ink-900 border border-newspaper-300 dark:border-ink-800">NEFT / IMPS</span>
              </div>
            </div>

            <Link
              href="/creator"
              className="w-full py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs text-center shadow-xs transition block cursor-pointer"
            >
              Start Reporting — Free
            </Link>

            <div className="text-[11px] text-newspaper-500 dark:text-ink-400 font-sans leading-relaxed">
              Calculations are estimates based on verified unique reads. Contributor payouts require compliance with community authenticity guidelines.
            </div>

          </div>

        </div>

        {/* 4-Step Settlement Process */}
        <div className="mt-12 pt-8 border-t border-newspaper-200 dark:border-ink-800">
          <div className="text-xs font-mono font-semibold uppercase tracking-editorial-label text-newspaper-500 dark:text-ink-400 mb-6 text-left">
            HOW CONTRIBUTOR SETTLEMENT WORKS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            <div className="p-4 rounded-lg bg-newspaper-50 dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">01 • REPORT</div>
              <div className="font-serif font-semibold text-newspaper-900 dark:text-ink-50 text-sm">Publish Ground Reports</div>
              <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                Eligible verified reads begin accruing from your first published ground story.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-newspaper-50 dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">02 • THRESHOLD</div>
              <div className="font-serif font-semibold text-newspaper-900 dark:text-ink-50 text-sm">Reach $10 (~₹850)</div>
              <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                Accessible withdrawal threshold designed for real community reporters.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-newspaper-50 dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">03 • CONNECT</div>
              <div className="font-serif font-semibold text-newspaper-900 dark:text-ink-50 text-sm">Add UPI ID or Bank</div>
              <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                Provide your UPI address or bank account details for direct transfer.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-newspaper-50 dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-1.5">
              <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">04 • RECEIVE</div>
              <div className="font-serif font-semibold text-newspaper-900 dark:text-ink-50 text-sm">Direct Disbursal</div>
              <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                UPI settlements process in 2 to 24 hours with zero platform deduction.
              </p>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
