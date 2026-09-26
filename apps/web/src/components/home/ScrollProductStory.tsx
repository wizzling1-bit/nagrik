'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  TrendingUp,
  Wallet,
  MapPin,
  Clock,
  ShieldCheck,
  Eye,
  Radio,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export const ScrollProductStory: React.FC = () => {
  const { language } = useLanguage();
  const { rate } = useCurrency();
  const [activeStep, setActiveStep] = useState<number>(0);
  const activeStepRef = useRef<number>(0);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrollRef = useRef<boolean>(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    {
      num: '01',
      tag: language === 'hi' ? 'स्थानीय कैप्चर' : 'Capture on Location',
      title: language === 'hi' ? 'सीधे ग्राउंड से रिकॉर्ड करें' : 'Record eyewitness ground truth',
      desc: language === 'hi'
        ? 'स्मार्टफोन से मौके की लाइव वीडियो, तस्वीरें और ऑडियो रिकॉर्ड करें। सिस्टम ऑटोमैटिकली 5km वार्ड-स्तरीय GPS लोकेशन स्टैम्प कर देता है।'
        : 'Your phone\'s GPS locks your exact spot. Every report gets a location stamp that can\'t be faked or changed later.',
      highlight: language === 'hi' ? 'ऑटोमैटिक GPS जियोटैगिंग' : 'Automated GPS Geotagging'
    },
    {
      num: '02',
      tag: language === 'hi' ? 'सुरक्षित अपलोड' : 'Upload Securely',
      title: language === 'hi' ? 'स्टूडियो में तुरंत अपलोड करें' : 'Upload securely to creator studio',
      desc: language === 'hi'
        ? 'अपने मोबाइल या ब्राउज़र ड्रॉपज़ोन से फ़ुल एचडी वीडियो सबमिट करें। ऑटो-ट्रांसकोडिंग बिना गुणवत्ता खोए फ़ाइलों को सेकंडों में प्रोसेस करती है।'
        : 'Upload photos and video from the scene. Our system protects originals with watermarks and strips hidden data so no one can tamper with them.',
      highlight: language === 'hi' ? 'जीरो डेटा लॉस' : 'Zero Quality Loss'
    },
    {
      num: '03',
      tag: language === 'hi' ? 'समीक्षा व प्रकाशन' : 'Review & Publish',
      title: language === 'hi' ? 'जीपीएस व संपादकीय सत्यापन' : 'Geofence verification & review',
      desc: language === 'hi'
        ? 'हमारा इंजन डुप्लिकेट फुटेज जांचता है और 15-45 मिनट के भीतर तथ्य सत्यापन और नीतिगत समीक्षा पूरी कर लेता है।'
        : 'Three nearby reviewers cross-check your facts. No single person decides what gets published.',
      highlight: language === 'hi' ? '15-45 मिनट में स्वीकृति' : '15–45m Fast Review'
    },
    {
      num: '04',
      tag: language === 'hi' ? 'प्रदर्शन ट्रैक करें' : 'Track Performance',
      title: language === 'hi' ? 'स्थानीय पाठकों तक लाइव प्रसारण' : 'Real-time neighborhood reach & views',
      desc: language === 'hi'
        ? 'स्टोरी आपके वार्ड के स्थानीय पाठकों तक पहुंचती है। लाइव व्यूज, रीडर ड्वेल-टाइम और एंगेजमेंट को रियल टाइम में ट्रैक करें।'
        : 'Your verified report goes live on the Nagrik feed. Readers see exactly where and when it happened, with a full chain of proof.',
      highlight: language === 'hi' ? 'हाइपरलोकल रीच' : 'Hyperlocal 5km Radius'
    },
    {
      num: '05',
      tag: language === 'hi' ? 'पात्र रीच से कमाई' : 'Earn Day One',
      title: language === 'hi' ? 'पारदर्शी भुगतान प्राप्त करें' : 'Direct, transparent contributor earnings',
      desc: language === 'hi'
        ? `प्रत्येक 1,000 सत्यापित व्यू पर $1.00 (~₹${Math.round(rate)}) की फ्लैट दर से कमाई जुड़ती है। ₹${Math.round(rate * 10)} ($10) होते ही सीधे यूपीआई या बैंक में निकासी करें।`
        : 'Every view and share earns you real money. Our clear formula means you always know what you\'re owed.',
      highlight: language === 'hi' ? 'सीधा UPI ट्रांसफर' : 'Direct UPI & Bank Payouts'
    }
  ];

  // Smooth step selection with auto-scrolling
  const handleSelectStep = useCallback((index: number) => {
    activeStepRef.current = index;
    setActiveStep(index);

    if (progressLineRef.current) {
      const percent = (index / (steps.length - 1)) * 100;
      progressLineRef.current.style.height = `${percent}%`;
    }

    const targetEl = stepRefs.current[index];
    if (targetEl && window.innerWidth >= 1024) {
      isManualScrollRef.current = true;
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
      
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      manualScrollTimeoutRef.current = setTimeout(() => {
        isManualScrollRef.current = false;
      }, 700);
    }
  }, [steps.length]);

  // Butter-smooth scroll tracking with 0 React re-renders during continuous scrolling
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      // Only track scroll on desktop (lg: and above)
      if (window.innerWidth < 1024) return;
      if (isManualScrollRef.current) return;

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const stepElements = stepRefs.current;
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.44;

        let closestIndex = activeStepRef.current;
        let minDistance = Infinity;

        stepElements.forEach((el, index) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height * 0.35;
          const distance = Math.abs(elementCenter - triggerPoint);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        // Only update React state if active step actually changed
        if (closestIndex !== activeStepRef.current) {
          activeStepRef.current = closestIndex;
          setActiveStep(closestIndex);
        }

        // Direct hardware-accelerated DOM manipulation for zero-lag 120fps continuous fill
        const firstEl = stepElements[0];
        const lastEl = stepElements[stepElements.length - 1];
        if (firstEl && lastEl && progressLineRef.current) {
          const firstRect = firstEl.getBoundingClientRect();
          const lastRect = lastEl.getBoundingClientRect();
          const firstCenter = firstRect.top + 32;
          const lastCenter = lastRect.top + 32;
          const totalDistance = lastCenter - firstCenter;

          if (totalDistance > 0) {
            const currentDistance = triggerPoint - firstCenter;
            const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
            const percent = Math.min(Math.max(progress * 100, (closestIndex / (steps.length - 1)) * 100), 100);
            progressLineRef.current.style.height = `${percent}%`;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, [steps.length]);

  // Shared Product Canvas Body (used for both desktop sticky canvas & mobile interactive canvas)
  const renderCanvasBody = () => (
    <div className="rounded-3xl bg-[#0B0F17] border border-white/10 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)] text-white overflow-hidden relative min-h-[420px] sm:min-h-[480px] flex flex-col justify-between">
      
      {/* Product Canvas Topbar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-400 ml-2 hidden sm:inline">nagrik-studio-v1.4</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs">Live Preview</span>
        </div>
      </div>

      {/* Dynamic Stage Body (Morphs per active step) */}
      <div key={activeStep} className="my-auto py-3 sm:py-4 transition-all duration-300 animate-in fade-in zoom-in-[0.98]">
        
        {/* ── STAGE 01: CAPTURE LOCALLY ── */}
        {activeStep === 0 && (
          <div className="space-y-4 text-left">
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-video max-h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"
                alt="On-scene recording"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

              {/* Camera Viewfinder Elements */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>REC 00:18 • 1080p</span>
              </div>

              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-mono text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>GPS Stamped</span>
              </div>

              {/* Center Viewfinder Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/30 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Bottom Meta Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-xs font-sans">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-white text-xs sm:text-sm truncate">Road Repair Work Near Digha Chowk</div>
                  <div className="text-slate-300 text-xs font-mono">Patna Ward 12, Bihar</div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#DE5227] text-white font-bold text-xs shrink-0">
                  Eyewitness Byte
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 02: UPLOAD EASILY ── */}
        {activeStep === 1 && (
          <div className="space-y-3 sm:space-y-4 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#101622] border border-white/[0.08] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">STUDIO DROPZONE</span>
                <span className="text-emerald-400 font-bold">Uploading 94%</span>
              </div>

              {/* Upload Progress Bar */}
              <div className="w-full h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-[#DE5227] w-[94%] rounded-full transition-all duration-500" />
              </div>

              {/* File details card */}
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#141D2B] border border-white/10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#DE5227]/20 text-[#DE5227] flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-bold text-white truncate font-mono text-xs">
                    VID_20260915_PATNA_DIGHA_ROAD.mp4
                  </div>
                  <div className="text-slate-400 text-xs font-mono mt-0.5 truncate">
                    48.2 MB • Auto-transcoding adaptive stream
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">✓ RAW Verified</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs font-mono text-slate-400 pt-1">
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
                  <span className="text-slate-400 block text-xs">LOCALITY RADIUS</span>
                  <span className="text-white font-bold text-xs">5.0 km Ward Geofence</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06]">
                  <span className="text-slate-400 block text-xs">CONTENT LICENSE</span>
                  <span className="text-emerald-400 font-bold text-xs">100% Contributor IP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 03: REVIEW CAREFULLY ── */}
        {activeStep === 2 && (
          <div className="space-y-3 sm:space-y-4 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#101622] border border-white/[0.08] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#DE5227]" />
                  <span className="text-xs font-mono uppercase font-bold text-white">
                    VERIFICATION & GEOFENCING
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                  In Verification
                </span>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2 sm:space-y-2.5 text-xs font-mono">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141D2B] border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">GPS Locality Confirmation (5km)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141D2B] border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Anti-Duplicate Visual Scan</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 Matches
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141D2B] border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Civic Fact Verification</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eyewitness
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-mono gap-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Turnaround: 18 minutes
                </span>
                <span className="text-emerald-400 font-bold">Approved for Live Stream</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 04: PUBLISH & TRACK ── */}
        {activeStep === 3 && (
          <div className="space-y-3 sm:space-y-4 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#101622] border border-white/[0.08] space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase font-bold text-white">
                    BROADCASTED TO LOCAL FEED
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  ✓ Live
                </span>
              </div>

              {/* Live Analytics Tickers */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141D2B] border border-white/10 text-left">
                  <div className="text-xs font-mono text-slate-400 uppercase">Verified Reads</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">14,820</div>
                  <div className="text-xs font-mono text-emerald-400 mt-0.5">↑ 182/hr</div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141D2B] border border-white/10 text-left">
                  <div className="text-xs font-mono text-slate-400 uppercase">Dwell Time</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">2m 44s</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">94% read</div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141D2B] border border-white/10 text-left">
                  <div className="text-xs font-mono text-slate-400 uppercase">5km Ward Reach</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#DE5227] mt-1">96.8%</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">Patna 12</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Target Community:</span>
                <span className="text-white font-bold truncate ml-2">Patna Ward 12 & 13 Residents</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 05: EARN FAIRLY ── */}
        {activeStep === 4 && (
          <div className="space-y-3 sm:space-y-4 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#101622] border border-white/[0.08] space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#DE5227]" />
                  <span className="text-xs font-mono uppercase font-bold text-white">
                    EARNINGS SETTLEMENT
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DE5227]/20 text-[#DE5227] font-mono text-xs font-bold border border-[#DE5227]/30">
                  $1.00 CPM Flat
                </span>
              </div>

              {/* Financial Math Ledger */}
              <div className="p-3 sm:p-4 rounded-xl bg-[#141D2B] border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>14,820 Reads × $1.00 CPM</span>
                  <span className="text-white font-bold">$14.82 USD</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>1 USD ≈ ₹{rate.toFixed(2)} INR</span>
                  <span className="text-emerald-400 font-bold">₹{(14.82 * rate).toFixed(2)} INR</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs sm:text-sm font-bold text-white">
                  <span>Total Approved Balance</span>
                  <span className="text-[#DE5227] font-mono">₹{(40.12 * rate).toFixed(2)} INR</span>
                </div>
              </div>

              {/* Payout Action Status */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                <div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Direct UPI Transfer Initiated
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    To: rohan.stringer@oksbi • Zero deduction
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 self-start sm:self-auto">
                  Settled in 2h
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Stage Bottom Step Indicator */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 font-bold">STAGE {steps[activeStep].num}</span>
          <span className="text-slate-400">/ 05</span>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelectStep(i)}
              className="min-w-[24px] min-h-[24px] flex items-center justify-center"
              aria-label={`Go to stage ${i + 1}`}
            >
              <div className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeStep === i ? 'w-7 bg-gradient-to-r from-orange-500 to-[#DE5227] shadow-[0_0_8px_rgba(222,82,39,0.5)]' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <section id="story" className="py-20 sm:py-28 lg:py-32 bg-[#F5F0E8]/70 dark:bg-[#0A0D14]/80 backdrop-blur-xs border-y border-stone-300/70 dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-10 sm:mb-16 lg:mb-20 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-content-secondary">
            <span className="text-[#DE5227] font-bold text-base leading-none" aria-hidden="true">—</span>
            <span>{language === 'hi' ? 'ग्राउंड से आपके दर्शकों तक' : 'The Reporting Lifecycle'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
            {language === 'hi' ? (
              <>
                एक अखंड यात्रा।<br />
                ग्राउंड रिपोर्ट से पाठक तक।
              </>
            ) : (
              <>
                One continuous journey.<br />
                From field report to reader.
              </>
            )}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {language === 'hi'
              ? 'नागरिक क्रिएटर स्टूडियो स्वतंत्र संवाददाताओं को रिपोर्टिंग के हर चरण में सशक्त बनाता है—सत्यापन से लेकर सीधे वित्तीय निपटान तक।'
              : 'Each step is built for clarity, real locations, and fair pay from day one.'}
          </p>
        </div>

        {/* ── MOBILE / TABLET VIEW (<1024px): Interactive Pill Tabs + Live Canvas + Active Detail ── */}
        <div className="block lg:hidden space-y-6 text-left">
          
          {/* Scrollable Chapter Selector Pills with Redesigned Badges */}
          <div tabIndex={0} role="region" aria-label="Step navigation" className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 focus:outline-hidden">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;
              return (
                <button
                  key={step.num}
                  onClick={() => handleSelectStep(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#DE5227] to-[#C84318] text-white font-bold shadow-lg shadow-orange-500/25 ring-2 ring-[#DE5227]/40 scale-102'
                      : isPassed
                      ? 'bg-orange-50 dark:bg-[#DE5227]/10 text-[#C84318] dark:text-orange-300 border border-orange-200/80 dark:border-[#DE5227]/30'
                      : 'bg-surface-card text-slate-700 dark:text-slate-300 border border-stone-200/90 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isPassed
                      ? 'bg-[#DE5227]/15 text-[#C84318] dark:text-orange-300'
                      : 'bg-stone-100 dark:bg-white/[0.06] text-content-secondary'
                  }`}>
                    {step.num}
                  </span>
                  <span>{step.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Live Canvas on Mobile */}
          {renderCanvasBody()}

          {/* Active Chapter Narrative Card on Mobile */}
          <div className="p-6 rounded-2xl bg-surface-card border border-stone-200/90 dark:border-white/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-content-secondary">
                CHAPTER {steps[activeStep].num} • {steps[activeStep].tag}
              </span>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C84318] shrink-0" />
                <span>{steps[activeStep].highlight}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {steps[activeStep].desc}
            </p>
          </div>

        </div>

        {/* ── DESKTOP VIEW (≥1024px): 2-Column Sticky Narrative + Live Canvas ── */}
        <div ref={containerRef} className="hidden lg:grid lg:grid-cols-12 gap-12 lg:gap-14 items-start relative">
          
          {/* Left Column: 5 Sequential Narrative Chapters with Redesigned Stepper Spine */}
          <div className="lg:col-span-5 relative py-4 text-left">
            
            {/* Background Stepper Track Spine */}
            <div className="absolute left-6 -translate-x-1/2 top-10 bottom-12 w-[2px] bg-stone-300/80 dark:bg-white/10 pointer-events-none rounded-full" />

            {/* Active Glowing Stepper Fill Bar (Smooth Continuous Motion) */}
            <div
              ref={progressLineRef}
              className="absolute left-6 -translate-x-1/2 top-10 w-[2px] bg-gradient-to-b from-[#DE5227] via-amber-500 to-[#DE5227] pointer-events-none rounded-full transition-[height] duration-150 ease-out shadow-[0_0_12px_rgba(222,82,39,0.8)] will-change-[height]"
              style={{
                height: `${(activeStep / (steps.length - 1)) * 100}%`,
                maxHeight: 'calc(100% - 4.5rem)'
              }}
            />

            <div className="space-y-8 relative">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <div
                    key={step.num}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    onClick={() => handleSelectStep(idx)}
                    className={`relative pl-18 sm:pl-20 transition-all duration-300 cursor-pointer group`}
                  >
                    {/* Stepper Node Milestone Badge */}
                    <div
                      className={`absolute left-0 top-6 w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-sm font-black transition-all duration-300 z-10 select-none ${
                        isActive
                          ? 'bg-gradient-to-br from-[#DE5227] via-[#E85D32] to-[#B83810] text-white shadow-[0_0_24px_rgba(222,82,39,0.5),0_4px_12px_rgba(0,0,0,0.15)] ring-4 ring-[#DE5227]/25 dark:ring-[#DE5227]/35 scale-110 border border-orange-300/40'
                          : isPassed
                          ? 'bg-orange-50/90 dark:bg-[#DE5227]/15 border-2 border-[#DE5227]/60 text-[#DE5227] dark:text-orange-400 shadow-xs group-hover:scale-105 group-hover:border-[#DE5227]'
                          : 'bg-surface-card border-2 border-stone-200/90 dark:border-white/10 text-content-tertiary shadow-xs group-hover:border-orange-400/60 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:scale-105'
                      }`}
                    >
                      {/* Active Pulse Beacon Indicator */}
                      {isActive && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-white dark:border-[#141B29] shadow-xs" />
                        </span>
                      )}

                      {/* Completed Step Checkmark Micro-badge */}
                      {isPassed && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DE5227] text-white text-[9px] shadow-xs ring-2 ring-white dark:ring-[#0B0F17]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}

                      <span>{step.num}</span>
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
                        isActive
                          ? 'bg-surface-card border-stone-300/90 dark:border-white/20 shadow-xl shadow-orange-950/5 dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(222,82,39,0.08)] ring-1 ring-[#DE5227]/25 translate-x-1.5'
                          : 'bg-surface-muted dark:bg-[#0B0F17]/60 border-stone-200/70 dark:border-white/[0.08] hover:bg-surface-card dark:hover:bg-[#101520] hover:border-stone-300 dark:hover:border-white/15'
                      }`}
                    >
                      {/* Active Card Left Accent Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-[#DE5227] to-amber-500 rounded-r-full" />
                      )}

                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <span className={`text-xs font-mono font-bold ${
                          isActive ? 'text-[#C84318] dark:text-orange-400' : 'text-content-secondary'
                        }`}>
                          {step.tag}
                        </span>
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          isActive
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#C84318] dark:text-orange-300 border border-orange-200/80 dark:border-orange-900/50'
                            : 'text-content-secondary'
                        }`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C84318] dark:text-orange-400' : 'text-content-tertiary'}`} />
                          <span className="text-xs">{step.highlight}</span>
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold font-serif mb-2 leading-snug transition-colors ${
                        isActive ? 'text-slate-950 dark:text-white' : 'text-content-secondary'
                      }`}>
                        {step.title}
                      </h3>

                      <p className={`text-sm leading-relaxed font-normal ${isActive ? 'text-content-muted' : 'text-content-tertiary'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Living Product Visualization Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 pb-12 relative">
            {/* Organic Asymmetric Annotation Floating Over Stage */}
            <div className="absolute -top-7 right-4 z-20 select-none pointer-events-none hidden lg:block animate-scribble-float-2">
              <span className="font-script text-purple-700 dark:text-purple-300 text-xl font-bold rotate-2 block bg-surface-card/90 dark:bg-[#0F1420]/90 px-3.5 py-1 rounded-full border border-purple-300/60 dark:border-purple-800/60 shadow-xs">
                ~ from ground byte to national broadcast 📡
              </span>
            </div>
            {renderCanvasBody()}
          </div>

        </div>

      </div>
    </section>
  );
};
