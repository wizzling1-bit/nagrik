'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ScrollProductStory: React.FC = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      num: '01',
      tag: language === 'hi' ? 'स्थानीय कैप्चर' : 'CAPTURE LOCALLY',
      title: language === 'hi' ? 'सीधे ग्राउंड से रिकॉर्ड करें' : 'Record eyewitness ground truth',
      desc: language === 'hi'
        ? 'स्मार्टफोन से मौके की लाइव वीडियो, तस्वीरें और ऑडियो रिकॉर्ड करें। सिस्टम ऑटोमैटिकली 5km वार्ड-स्तरीय GPS लोकेशन स्टैम्प कर देता है।'
        : 'Capture authentic eyewitness video bytes, photos, and field notes with automated 5km ward GPS coordinate stamping.',
      highlight: language === 'hi' ? 'ऑटोमैटिक GPS जियोटैगिंग' : 'Automated GPS Geotagging'
    },
    {
      num: '02',
      tag: language === 'hi' ? 'सुरक्षित अपलोड' : 'UPLOAD SECURELY',
      title: language === 'hi' ? 'स्टूडियो में तुरंत अपलोड करें' : 'Upload securely to creator studio',
      desc: language === 'hi'
        ? 'अपने मोबाइल या ब्राउज़र ड्रॉपज़ोन से फ़ुल एचडी वीडियो सबमिट करें। ऑटो-ट्रांसकोडिंग बिना गुणवत्ता खोए फ़ाइलों को सेकंडों में प्रोसेस करती है।'
        : 'Drag and drop RAW footage from browser or mobile companion with tamper-proof checksums and background transcoding.',
      highlight: language === 'hi' ? 'जीरो डेटा लॉस' : 'Zero Quality Loss'
    },
    {
      num: '03',
      tag: language === 'hi' ? 'समीक्षा व प्रकाशन' : 'REVIEW & PUBLISH',
      title: language === 'hi' ? 'जीपीएस व संपादकीय सत्यापन' : 'Geofence verification & review',
      desc: language === 'hi'
        ? 'हमारा इंजन डुप्लिकेट फुटेज जांचता है और 15-45 मिनट के भीतर तथ्य सत्यापन और नीतिगत समीक्षा पूरी कर लेता है।'
        : 'Instant 5km radius geofence validation, AI deduplication scan, and rapid 15–45 minute editorial fact-checking.',
      highlight: language === 'hi' ? '15-45 मिनट में स्वीकृति' : '15–45m Fast Review'
    },
    {
      num: '04',
      tag: language === 'hi' ? 'प्रदर्शन ट्रैक करें' : 'TRACK PERFORMANCE',
      title: language === 'hi' ? 'स्थानीय पाठकों तक लाइव प्रसारण' : 'Real-time neighborhood reach & views',
      desc: language === 'hi'
        ? 'स्टोरी आपके वार्ड के स्थानीय पाठकों तक पहुंचती है। लाइव व्यूज, रीडर ड्वेल-टाइम और एंगेजमेंट को रियल टाइम में ट्रैक करें।'
        : 'Live delivery to local resident feeds. Monitor verified reads, reader dwell-time, and ward reach in real time.',
      highlight: language === 'hi' ? 'हाइपरलोकल रीच' : 'Hyperlocal 5km Radius'
    },
    {
      num: '05',
      tag: language === 'hi' ? 'पात्र रीच से कमाई' : 'EARN FROM ELIGIBLE REACH',
      title: language === 'hi' ? 'पारदर्शी भुगतान प्राप्त करें' : 'Direct, transparent contributor earnings',
      desc: language === 'hi'
        ? 'प्रत्येक 1,000 सत्यापित व्यू पर $1.50 की फ्लैट दर से कमाई जुड़ती है। ₹850 ($10) होते ही सीधे यूपीआई या बैंक में निकासी करें।'
        : 'Earn a transparent $1.50 CPM flat rate per 1,000 verified reads. Direct disbursals via UPI once you reach ₹850.',
      highlight: language === 'hi' ? 'सीधा UPI ट्रांसफर' : 'Direct UPI & Bank Payouts'
    }
  ];

  // Scroll listener tracking scroll position on desktop without hijacking
  useEffect(() => {
    const handleScroll = () => {
      // Only track scroll on desktop (lg: and above)
      if (window.innerWidth < 1024) return;
      
      const stepElements = stepRefs.current;
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.45;

      stepElements.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shared Product Canvas Body (used for both desktop sticky canvas & mobile interactive canvas)
  const renderCanvasBody = () => (
    <div className="rounded-3xl bg-[#141B29] border border-slate-700/80 p-4 sm:p-6 shadow-2xl text-white overflow-hidden relative min-h-[420px] sm:min-h-[480px] flex flex-col justify-between">
      
      {/* Product Canvas Topbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-400 ml-2 hidden sm:inline">nagrik-studio-v1.4</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs">LIVE PRODUCT STATE</span>
        </div>
      </div>

      {/* Dynamic Stage Body (Morphs per active step) */}
      <div className="my-auto py-3 sm:py-4">
        
        {/* ── STAGE 01: CAPTURE LOCALLY ── */}
        {activeStep === 0 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video max-h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"
                alt="On-scene recording"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

              {/* Camera Viewfinder Elements */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[11px] font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>REC 00:18 • 1080p</span>
              </div>

              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[11px] font-mono text-emerald-400 flex items-center gap-1">
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
                  <div className="text-slate-400 text-[10px] sm:text-[11px] font-mono">Patna Ward 12, Bihar</div>
                </div>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#DE5227] text-white font-bold text-[10px] sm:text-xs shrink-0">
                  Eyewitness Byte
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 02: UPLOAD EASILY ── */}
        {activeStep === 1 && (
          <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">STUDIO DROPZONE</span>
                <span className="text-emerald-400 font-bold">Uploading 94%</span>
              </div>

              {/* Upload Progress Bar */}
              <div className="w-full h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-[#DE5227] w-[94%] rounded-full transition-all duration-500" />
              </div>

              {/* File details card */}
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#141C2E] border border-slate-700/80">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#DE5227]/20 text-[#DE5227] flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-bold text-white truncate font-mono text-[11px] sm:text-xs">
                    VID_20260915_PATNA_DIGHA_ROAD.mp4
                  </div>
                  <div className="text-slate-400 text-[9px] sm:text-[10px] font-mono mt-0.5 truncate">
                    48.2 MB • Auto-transcoding adaptive stream
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-bold shrink-0">✓ RAW Verified</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs font-mono text-slate-400 pt-1">
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] sm:text-[10px]">LOCALITY RADIUS</span>
                  <span className="text-white font-bold text-[11px] sm:text-xs">5.0 km Ward Geofence</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] sm:text-[10px]">CONTENT LICENSE</span>
                  <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">100% Contributor IP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 03: REVIEW CAREFULLY ── */}
        {activeStep === 2 && (
          <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#DE5227]" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-white">
                    VERIFICATION & GEOFENCING
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[9px] sm:text-[10px] font-bold border border-amber-500/30">
                  In Verification
                </span>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs font-mono">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141C2E] border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">GPS Locality Confirmation (5km)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141C2E] border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">Anti-Duplicate Visual Scan</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 Matches
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#141C2E] border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">Civic Fact Verification</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eyewitness
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-slate-400 font-mono gap-1">
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
          <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-white">
                    BROADCASTED TO LOCAL FEED
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
                  ✓ Live
                </span>
              </div>

              {/* Live Analytics Tickers */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141C2E] border border-slate-700/80 text-left">
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase">Verified Reads</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">14,820</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400 mt-0.5">↑ 182/hr</div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141C2E] border border-slate-700/80 text-left">
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase">Dwell Time</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">2m 44s</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-0.5">94% read</div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#141C2E] border border-slate-700/80 text-left">
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase">5km Ward Reach</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#DE5227] mt-1">96.8%</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-0.5">Patna 12</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-mono">
                <span className="text-slate-400">Target Community:</span>
                <span className="text-white font-bold truncate ml-2">Patna Ward 12 & 13 Residents</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 05: EARN FAIRLY ── */}
        {activeStep === 4 && (
          <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#DE5227]" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-white">
                    EARNINGS SETTLEMENT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#DE5227]/20 text-[#DE5227] font-mono text-[9px] sm:text-[10px] font-bold border border-[#DE5227]/30">
                  $1.50 CPM Flat
                </span>
              </div>

              {/* Financial Math Ledger */}
              <div className="p-3 sm:p-4 rounded-xl bg-[#141C2E] border border-slate-700/80 space-y-2 text-[11px] sm:text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>14,820 Reads × $1.50 CPM</span>
                  <span className="text-white font-bold">$22.23 USD</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>1 USD ≈ ₹86 INR</span>
                  <span className="text-emerald-400 font-bold">₹1,911.78 INR</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs sm:text-sm font-bold text-white">
                  <span>Total Approved Balance</span>
                  <span className="text-[#DE5227] font-mono">₹3,450.00 INR</span>
                </div>
              </div>

              {/* Payout Action Status */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] sm:text-xs font-mono gap-2">
                <div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Direct UPI Transfer Initiated
                  </div>
                  <div className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5">
                    To: rohan.stringer@oksbi • Zero deduction
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 self-start sm:self-auto">
                  Settled in 2h
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Stage Bottom Step Indicator */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>STAGE {steps[activeStep].num} OF 05</span>
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeStep === i ? 'w-5 sm:w-6 bg-[#DE5227]' : 'w-1.5 sm:w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to stage ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <section id="story" className="py-20 sm:py-28 lg:py-32 bg-[#F4EFE6] dark:bg-[#0B0F17] border-y border-stone-300/70 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-10 sm:mb-16 lg:mb-20 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            <span className="text-slate-400 font-bold text-base leading-none">—</span>
            <span>{language === 'hi' ? 'ग्राउंड से आपके दर्शकों तक' : 'THE REPORTING LIFECYCLE'}</span>
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
              : 'Every step of the reporting lifecycle is designed for clarity, geographic authenticity, and immediate contributor reward.'}
          </p>
        </div>

        {/* ── MOBILE / TABLET VIEW (<1024px): Interactive Pill Tabs + Live Canvas + Active Detail ── */}
        <div className="block lg:hidden space-y-6 text-left">
          
          {/* Scrollable Chapter Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#DE5227] text-white font-bold shadow-md shadow-orange-500/20'
                      : 'bg-white dark:bg-[#121927] text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>{step.num}</span>
                  <span>{step.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Live Canvas on Mobile */}
          {renderCanvasBody()}

          {/* Active Chapter Narrative Card on Mobile */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/90 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                CHAPTER {steps[activeStep].num} • {steps[activeStep].tag}
              </span>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DE5227] shrink-0" />
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
          
          {/* Left Column: 5 Sequential Narrative Chapters with Dynamic Stepper Spine */}
          <div className="lg:col-span-5 relative py-4 text-left">
            
            {/* Background Stepper Track */}
            <div className="absolute left-[15px] top-6 bottom-10 w-0.5 bg-stone-300/80 dark:bg-slate-800 pointer-events-none rounded-full" />

            {/* Active Glowing Stepper Fill Bar */}
            <div
              className="absolute left-[15px] top-6 w-0.5 bg-gradient-to-b from-[#DE5227] via-orange-500 to-[#DE5227] pointer-events-none rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(222,82,39,0.6)]"
              style={{
                height: `${(activeStep / (steps.length - 1)) * 100}%`,
                maxHeight: 'calc(100% - 3.5rem)'
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
                    onClick={() => setActiveStep(idx)}
                    className={`relative pl-12 transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? 'opacity-100 translate-x-2'
                        : 'opacity-45 hover:opacity-85'
                    }`}
                  >
                    {/* Stepper Node Waypoint */}
                    <div
                      className={`absolute left-0 top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-[#DE5227] border-[#DE5227] text-white shadow-lg shadow-orange-500/40 scale-110 ring-4 ring-[#DE5227]/20'
                          : isPassed
                          ? 'bg-stone-100 dark:bg-slate-900 border-[#DE5227] text-[#DE5227] shadow-xs'
                          : 'bg-white dark:bg-[#0B0F17] border-stone-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 group-hover:border-stone-400 dark:group-hover:border-slate-500'
                      }`}
                    >
                      {step.num}
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 border ${
                        isActive
                          ? 'bg-white dark:bg-[#121927] border-stone-300 dark:border-slate-700 shadow-xl shadow-stone-200/50 dark:shadow-none ring-1 ring-[#DE5227]/25'
                          : 'bg-stone-50/60 dark:bg-[#0E1422]/40 border-stone-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-[#121927]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">
                          {step.tag}
                        </span>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#DE5227]' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="text-xs">{step.highlight}</span>
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold font-serif mb-2 leading-snug transition-colors ${
                        isActive ? 'text-slate-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {step.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Living Product Visualization Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 pb-12">
            {renderCanvasBody()}
          </div>

        </div>

      </div>
    </section>
  );
};
