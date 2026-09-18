'use client';

import React, { useState } from 'react';
import { NagrikLogo } from '@/components/NagrikLogo';
import {
  Video,
  Smartphone,
  Tv,
  MapPin,
  ShieldCheck,
  DollarSign,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Upload,
  Layers,
  FileText,
  Compass,
  Check,
  Radio,
  Clock,
  Shield
} from 'lucide-react';
import { CreatorTab } from './types';

interface CreatorOnboardingGuideProps {
  authName?: string;
  onFinish: (targetTab?: CreatorTab) => void;
}

export const CreatorOnboardingGuide: React.FC<CreatorOnboardingGuideProps> = ({
  authName,
  onFinish
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      label: 'Welcome',
      title: 'Welcome to Nagrik Publisher Studio',
      subtitle: "India's premier hyperlocal citizen journalism network"
    },
    {
      id: 'formats',
      label: 'Video & Media Formats',
      title: 'Dual Video Formats & 2 GB Uploads',
      subtitle: 'Publish vertical reels, landscape documentaries, or written photo essays'
    },
    {
      id: 'geofence',
      label: 'Hyperlocal Geofencing',
      title: 'Pan-India 36 States & 5km Ward Engine',
      subtitle: 'Broadcast ground truth directly to readers living in your designated beat'
    },
    {
      id: 'monetization',
      label: 'Guaranteed Monetization',
      title: '$1.00 CPM Guaranteed Rate Card',
      subtitle: 'Transparent, anti-fraud earnings with zero platform deductions'
    },
    {
      id: 'payouts',
      label: 'Instant Disbursals',
      title: 'Direct Disbursals via UPI & Bank IMPS',
      subtitle: 'Low $10.00 threshold with automatic real-time INR conversion'
    },
    {
      id: 'ready',
      label: 'Get Started',
      title: "You're Ready to Report!",
      subtitle: 'Uphold the citizen journalist charter and start your first ground investigation'
    }
  ];

  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish('upload');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* 1. TOP GUIDE APP BAR */}
      <header className="h-16 px-4 sm:px-8 border-b border-stone-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NagrikLogo size="sm" hideSubtitle />
          <div className="h-4 w-px bg-stone-300 dark:bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-serif text-slate-800 dark:text-slate-200 hidden sm:inline">
              Publisher Studio Guide
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/20 font-mono">
              Onboarding
            </span>
          </div>
        </div>

        {/* Progress Pill & Skip Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <div className="w-24 h-1.5 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onFinish('analytics')}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Skip Guide & Enter Studio</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. STEP INDICATOR BAR */}
      <div className="bg-[#FAF8F5] dark:bg-[#111827]/50 border-b border-stone-200/60 dark:border-slate-800/60 px-4 sm:px-8 py-3 overflow-x-auto scrollbar-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[580px] gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                  isCurrent
                    ? 'bg-white dark:bg-slate-800 border border-brand-500/30 shadow-xs'
                    : isCompleted
                    ? 'hover:bg-white/60 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    : 'opacity-50 hover:opacity-80 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono shrink-0 transition ${
                    isCurrent
                      ? 'bg-brand-500 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-stone-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className={`text-xs font-bold truncate ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {step.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STEP CONTENT BODY */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl transition-all duration-300">
          
          {/* STEP 1: WELCOME */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-extrabold font-mono">
                  <Radio className="w-3.5 h-3.5" />
                  <span>COMMUNITY-FIRST CITIZEN JOURNALISM</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
                  Welcome to Nagrik Studio{authName ? `, ${authName}` : ''}!
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  You are now equipped with India’s most powerful hyperlocal publishing workspace. 
                  Investigate civic issues, publish high-impact ground reports, and earn direct guaranteed revenue from your community.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 space-y-3 shadow-2xs hover:border-brand-500/30 transition">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">5km Hyperlocal Engine</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Broadcast stories directly to residents living in your specific city and municipal ward. No viral clickbait algorithms.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 space-y-3 shadow-2xs hover:border-brand-500/30 transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">$1.00 CPM Guaranteed</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Earn $1.00 for every 1,000 verified reads. Transparent telemetry, anti-bot deduplication, and zero platform deductions.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 space-y-3 shadow-2xs hover:border-brand-500/30 transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">100% IP Ownership</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    You retain full intellectual property of your raw footage and articles. Nagrik is a sovereign distribution network.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VIDEO FORMATS & 2GB UPLOADS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-extrabold font-mono">
                  <Video className="w-3.5 h-3.5" />
                  <span>STEP 1: MEDIA EVIDENCE</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                  Dual Video Formats & Up to 2 GB Direct Uploads
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Choose between fast vertical citizen bytes or long-form investigative landscape journalism. Files stream directly to Cloudflare R2 media storage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Format 1: Shorts */}
                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border-2 border-brand-500/30 space-y-4 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Short Video / Shorts</h4>
                        <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-bold">9:16 Vertical Aspect Ratio</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-brand-500/15 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">
                      Reels & Bytes
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Designed for swift ground bytes, citizen interviews, pothole checks, and urgent civic alerts. Renders full-height in reader mobile feeds.
                  </p>

                  <div className="bg-stone-200/70 dark:bg-slate-900/80 rounded-xl p-3 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <span>Target Duration: 15s – 180s</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Up to 2 GB</span>
                  </div>
                </div>

                {/* Format 2: Long Video */}
                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border-2 border-stone-200 dark:border-slate-700 space-y-4 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-xs">
                        <Tv className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Long Video / Documentary</h4>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">16:9 Landscape Aspect Ratio</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                      Deep Dive
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    For in-depth ground investigations, hospital audits, school inspections, and full municipal townhall coverage.
                  </p>

                  <div className="bg-stone-200/70 dark:bg-slate-900/80 rounded-xl p-3 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <span>Target Duration: 3 min – 60 min+</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Up to 2 GB</span>
                  </div>
                </div>
              </div>

              {/* 2GB Upload Highlight */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 font-serif">
                    Direct Cloudflare R2 Upload Pipeline (2,048 MB Maximum Size)
                  </h5>
                  <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                    Uploads bypass intermediate application servers and stream with live progress tracking directly to Cloudflare R2 storage via presigned S3 URLs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HYPERLOCAL GEOFENCING */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-extrabold font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>STEP 3: GEOFENCE BEAT</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                  All 36 Indian States & 5km Ward Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Every ground report is pinned to a State, City, and Local Ward. This guarantees your report reaches readers right where the issue is happening.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  3-Tier Cascading Geofence Taxonomy
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">TIER 1</span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">All 36 States & UTs</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Bihar, Delhi NCR, Maharashtra, Karnataka, UP, etc.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">TIER 2</span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Major Cities & Towns</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Patna, Bengaluru, Mumbai, Lucknow, Gaya, etc.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 font-mono">TIER 3 (HYPERLOCAL)</span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Local Wards & Areas</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Kankarbagh Ward 14, Indiranagar Ward 82, etc.</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-100 dark:bg-slate-900/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                    <span>Quick-Select Chips & Autocomplete available for rapid ward tagging</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GUARANTEED MONETIZATION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold font-mono">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>TRANSPARENT TELEMETRY</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                  $1.00 CPM Guaranteed Rate Card
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Earn dependable income for genuine community investigations. No opaque revenue sharing or hidden commissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2.5 shadow-2xs">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">$1.00 USD</div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-serif">Per 1,000 Verified Reads</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Each verified read accrues directly to your creator balance in real-time as users engage with your ground report.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2.5 shadow-2xs">
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">3 Views Max</div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-serif">Anti-Fraud Deduplication</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    To maintain trusted advertisers and sponsor pools, views are capped at 3 monetized reads per device/IP every 24 hours.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <span>100% of reader contribution goes directly to reporting creators. 0% platform commission.</span>
                <span className="font-bold font-mono">Net 0% Fee</span>
              </div>
            </div>
          )}

          {/* STEP 5: INSTANT DISBURSALS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs font-extrabold font-mono">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>TREASURY & PAYOUTS</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                  Direct Disbursals via NPCI UPI & Bank IMPS
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Withdraw your accrued earnings as soon as your balance reaches the low $10.00 USD threshold.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2 shadow-2xs">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 font-mono">MINIMUM THRESHOLD</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">$10.00 USD</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Accessible threshold for frequent ground reporters</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">PAYOUT METHODS</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">UPI & Bank IMPS</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Google Pay, PhonePe, Paytm, or direct IFSC account</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2 shadow-2xs">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">INR CONVERSION</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">~₹86.50 / USD</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant conversion at transparent real-time forex rates</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-100 dark:bg-slate-800/50 border border-stone-200/80 dark:border-slate-700 flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Payout requests are verified by treasury auditors and settled within 24–48 banking hours with transparent UTR tracking codes.
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: READY TO REPORT */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200 text-center py-2">
              <div className="max-w-xl mx-auto space-y-3">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">
                  You’re Ready to Report!
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your Nagrik Publisher Studio is unlocked and ready. Start by publishing your first ground investigation, or explore your analytics command center.
                </p>
              </div>

              {/* Publisher Checklist */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#FAF9F6] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 text-left space-y-2.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-serif">
                  Publisher Agreement & Standards
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Uphold factual verification and avoid unverified rumors</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Specify accurate municipal ward geofencing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Retain 100% intellectual property ownership</span>
                </div>
              </div>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onFinish('upload')}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-black text-sm rounded-xl transition cursor-pointer shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish Your First Ground Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => onFinish('analytics')}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm rounded-xl transition cursor-pointer border border-stone-200 dark:border-slate-700"
                >
                  <span>Enter Studio Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. FOOTER CONTROLS */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentStep === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentStep
                      ? 'w-6 bg-brand-500'
                      : idx < currentStep
                      ? 'w-2.5 bg-brand-400'
                      : 'w-1.5 bg-stone-300 dark:bg-slate-700'
                  }`}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>

            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onFinish('upload')}
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* 5. IMMERSIVE BOTTOM BRAND FOOTER */}
      <footer className="py-4 text-center text-xs text-slate-400 font-mono">
        Nagrik Publisher Studio • Sovereign Citizen Journalism • Verified 5km Hyperlocal Beat
      </footer>

    </div>
  );
};
