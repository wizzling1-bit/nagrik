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
  ArrowRight,
  Play,
  FileCheck2,
  Layers
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
      title: language === 'hi' ? 'सीधे मौके से रिकॉर्ड करें' : 'Record what is happening around you.',
      desc: language === 'hi'
        ? 'स्मार्टफोन से मौके की लाइव वीडियो और तस्वीरें रिकॉर्ड करें। सिस्टम स्वचालित रूप से स्थान व समय का सत्यापन करता है।'
        : 'Capture authentic eyewitness video, photos, and field notes with automated location coordinate stamping.',
      highlight: language === 'hi' ? 'स्थान सत्यापन' : 'Location Stamped'
    },
    {
      num: '02',
      tag: language === 'hi' ? 'आसान अपलोड' : 'UPLOAD EASILY',
      title: language === 'hi' ? 'क्रिएटर स्टूडियो में भेजें' : 'Send your story to Creator Studio.',
      desc: language === 'hi'
        ? 'अपने मोबाइल या ब्राउज़र से फ़ुटेज सबमिट करें। ऑटो-ट्रांसकोडिंग बिना गुणवत्ता खोए फ़ाइलों को सेकंडों में प्रोसेस करती है।'
        : 'Submit footage directly to Creator Studio with secure background transcoding and format optimization.',
      highlight: language === 'hi' ? 'त्वरित ट्रांसकोडिंग' : 'Fast Transcoding'
    },
    {
      num: '03',
      tag: language === 'hi' ? 'समीक्षा' : 'REVIEW',
      title: language === 'hi' ? 'प्रकाशन हेतु तैयार करें' : 'Prepare the report for publication.',
      desc: language === 'hi'
        ? 'प्रकाशन से पूर्व स्थानीय निर्देशांक और सामग्री मानकों की समीक्षा की जाती है ताकि विश्वसनीयता बनी रहे।'
        : 'Confirm location coordinates and editorial standards to ensure factual ground authenticity.',
      highlight: language === 'hi' ? 'मानक समीक्षा' : 'Quality Review'
    },
    {
      num: '04',
      tag: language === 'hi' ? 'प्रकाशन' : 'PUBLISH',
      title: language === 'hi' ? 'स्थानीय पाठकों तक पहुँचाएं' : 'Reach local audiences.',
      desc: language === 'hi'
        ? 'आपकी रिपोर्ट सीधे आपके क्षेत्र के स्थानीय नागरिकों और पाठकों के फ़ीड में प्रसारित होती है।'
        : 'Distribute eyewitness reporting directly into the feeds of local citizens living in the area.',
      highlight: language === 'hi' ? 'सीधा प्रसारण' : 'Direct Distribution'
    },
    {
      num: '05',
      tag: language === 'hi' ? 'ट्रैक' : 'TRACK',
      title: language === 'hi' ? 'रीयल-टाइम प्रभाव देखें' : 'Follow performance.',
      desc: language === 'hi'
        ? 'सत्यापित व्यूज, रीडर ड्वेल-टाइम और स्थानीय जुड़ाव को क्रिएटर स्टूडियो एनालिटिक्स में ट्रैक करें।'
        : 'Track verified reads, reader dwell-time, and locality reach in real time from your studio desk.',
      highlight: language === 'hi' ? 'सत्यापित व्यूज' : 'Verified Reads'
    },
    {
      num: '06',
      tag: language === 'hi' ? 'कमाई' : 'EARN',
      title: language === 'hi' ? 'पारदर्शी भुगतान प्राप्त करें' : 'Track eligible earnings.',
      desc: language === 'hi'
        ? 'सत्यापित पाठकों से होने वाली पारदर्शी आय को ट्रैक करें और सीधे UPI या बैंक खाते में निकासी प्राप्त करें।'
        : 'Track contributor earnings generated from eligible reads with direct UPI and bank disbursals.',
      highlight: language === 'hi' ? 'सीधा भुगतान' : 'Direct Payout'
    }
  ];

  // Scroll listener tracking scroll position on desktop without hijacking
  useEffect(() => {
    const handleScroll = () => {
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

  // Shared Product Canvas Body
  const renderCanvasBody = () => (
    <div className="rounded-xl bg-ink-900 border border-ink-800 p-5 sm:p-7 shadow-2xl text-white overflow-hidden relative min-h-[440px] sm:min-h-[480px] flex flex-col justify-between">
      
      {/* Product Canvas Topbar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-ink-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="text-ink-400 ml-2 text-[11px] font-sans">Nagrik Creator Studio</span>
        </div>
        <div className="flex items-center gap-2 text-ink-400">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[10px] tracking-wider uppercase font-semibold text-ink-300">
            CHAPTER {steps[activeStep].num} • {steps[activeStep].tag}
          </span>
        </div>
      </div>

      {/* Dynamic Stage Body (Morphs per active step) */}
      <div className="my-auto py-4">
        
        {/* ── CHAPTER 01: CAPTURE ── */}
        {activeStep === 0 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="relative rounded-lg overflow-hidden bg-ink-950 border border-ink-800 aspect-video max-h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"
                alt="On-scene recording"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

              {/* Viewfinder Elements */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>REC 00:24 • 1080p</span>
              </div>

              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Location Stamped</span>
              </div>

              {/* Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 border border-white/40 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-sans">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-white text-sm truncate">Civic Drainage Work Near Chowk</div>
                  <div className="text-ink-300 text-[11px] font-mono mt-0.5">Local Ward Beat</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-brand-500 text-white font-semibold text-[10px] shrink-0">
                  Field Capture
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAPTER 02: UPLOAD ── */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-5 rounded-lg bg-ink-950 border border-ink-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-400">STUDIO DROPZONE</span>
                <span className="text-brand-400 font-semibold">Uploading 94%</span>
              </div>

              {/* Upload Progress Bar */}
              <div className="w-full h-2 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-[94%] rounded-full transition-all duration-500" />
              </div>

              {/* File details card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-ink-900 border border-ink-800">
                <div className="w-9 h-9 rounded bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-medium text-white truncate font-mono text-xs">
                    GROUND_REPORT_2026_09_15.mp4
                  </div>
                  <div className="text-ink-400 text-[10px] font-mono mt-0.5">
                    42.8 MB • Adaptive stream processing
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">Ready</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-ink-300 pt-1">
                <div className="p-2.5 rounded bg-ink-900/80 border border-ink-800">
                  <span className="text-ink-400 block text-[10px]">COORDINATES</span>
                  <span className="text-white font-semibold text-xs">GPS Validated</span>
                </div>
                <div className="p-2.5 rounded bg-ink-900/80 border border-ink-800">
                  <span className="text-ink-400 block text-[10px]">INTELLECTUAL RIGHTS</span>
                  <span className="text-emerald-400 font-semibold text-xs">Creator Retained</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAPTER 03: REVIEW ── */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-5 rounded-lg bg-ink-950 border border-ink-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-mono uppercase font-semibold text-white">
                    EDITORIAL & LOCALITY CHECK
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 font-mono text-[10px] font-semibold border border-brand-500/20">
                  Review Complete
                </span>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-between">
                  <span className="text-ink-200">Local Beat GPS Validation</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-between">
                  <span className="text-ink-200">Authenticity & Duplication Check</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Original
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-between">
                  <span className="text-ink-200">Civic Guideline Compliance</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-ink-800 text-xs text-ink-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-ink-500" />
                  Standard Review Flow
                </span>
                <span className="text-emerald-400 font-medium">Ready for Distribution</span>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAPTER 04: PUBLISH ── */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-5 rounded-lg bg-ink-950 border border-ink-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase font-semibold text-white">
                    DISTRIBUTED TO LOCAL STREAM
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30">
                  Live in Locality
                </span>
              </div>

              {/* Published Story Card in Feed */}
              <div className="p-4 rounded-lg bg-ink-900 border border-ink-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-ink-400">
                  <span className="text-brand-400 font-semibold">● LIVE DISPATCH</span>
                  <span>Delivered to Local Feed</span>
                </div>
                <h4 className="font-serif text-lg font-semibold text-white leading-snug">
                  Civic Drainage Work Near Chowk Completed
                </h4>
                <p className="text-xs text-ink-300 leading-relaxed font-sans">
                  Eyewitness footage verified and streaming to resident app users in the designated municipal ward.
                </p>
                <div className="pt-2 border-t border-ink-800 flex items-center justify-between text-[11px] font-mono text-ink-400">
                  <span>Audience: Neighborhood Residents</span>
                  <span className="text-white font-medium">Instant Feed Push</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAPTER 05: TRACK ── */}
        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-5 rounded-lg bg-ink-950 border border-ink-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-mono uppercase font-semibold text-white">
                    READER ENGAGEMENT & METRICS
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-ink-800 text-ink-300 font-mono text-[10px] font-semibold">
                  Real-time Analytics
                </span>
              </div>

              {/* Analytics Tickers */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 text-left">
                  <div className="text-[10px] font-mono text-ink-400 uppercase">Verified Reads</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">14,820</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Live Counter</div>
                </div>

                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 text-left">
                  <div className="text-[10px] font-mono text-ink-400 uppercase">Dwell Time</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">2m 44s</div>
                  <div className="text-[10px] font-mono text-ink-400 mt-0.5">High Retention</div>
                </div>

                <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 text-left">
                  <div className="text-[10px] font-mono text-ink-400 uppercase">Locality Ratio</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-brand-400 mt-1">96.8%</div>
                  <div className="text-[10px] font-mono text-ink-400 mt-0.5">Nearby Readers</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-between text-xs font-mono">
                <span className="text-ink-400">Audience Verification:</span>
                <span className="text-white font-medium">Browser & IP Deduplication Applied</span>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAPTER 06: EARN ── */}
        {activeStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="p-5 rounded-lg bg-ink-950 border border-ink-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-mono uppercase font-semibold text-white">
                    CONTRIBUTOR SETTLEMENT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 font-mono text-[10px] font-semibold border border-brand-500/20">
                  Flat $1.50 CPM
                </span>
              </div>

              {/* Financial Ledger */}
              <div className="p-4 rounded-lg bg-ink-900 border border-ink-800 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-ink-400">
                  <span>Eligible Verified Reads</span>
                  <span className="text-white font-semibold">14,820</span>
                </div>
                <div className="flex items-center justify-between text-ink-400">
                  <span>Calculated Contributor Revenue</span>
                  <span className="text-emerald-400 font-semibold">$22.23 USD (~₹1,911 INR)</span>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-ink-800 text-sm font-semibold text-white">
                  <span>Approved Contributor Balance</span>
                  <span className="text-brand-400 font-serif font-bold text-base">₹3,450.00</span>
                </div>
              </div>

              {/* Payout Action Status */}
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                <div>
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Direct Payout Settlement
                  </div>
                  <div className="text-ink-400 text-[10px] mt-0.5">
                    Direct UPI / Bank Transfer • Zero platform deductions
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 self-start sm:self-auto">
                  Within 24 Hours
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Stage Bottom Step Indicator */}
      <div className="pt-3 border-t border-ink-800 flex items-center justify-between text-xs font-mono text-ink-400">
        <span className="text-[11px]">CHAPTER {steps[activeStep].num} OF 06</span>
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeStep === i ? 'w-6 bg-brand-500' : 'w-2 bg-ink-700 hover:bg-ink-600'
              }`}
              aria-label={`Go to chapter ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <section id="story" className="py-24 sm:py-32 bg-newspaper-100 dark:bg-ink-950 border-y border-newspaper-200 dark:border-ink-800 transition-colors duration-200">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-14 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span>02 / {language === 'hi' ? 'रिपोर्टिंग चक्र' : 'THE REPORTING LIFECYCLE'}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
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
          <p className="text-base sm:text-lg text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
            {language === 'hi'
              ? 'नागरिक क्रिएटर स्टूडियो स्वतंत्र संवाददाताओं को रिपोर्टिंग के हर चरण में सशक्त बनाता है—सत्यापन से लेकर सीधे वित्तीय निपटान तक।'
              : 'Every step of the reporting journey is designed for clarity, geographic relevance, and transparent contributor rewards.'}
          </p>
        </div>

        {/* Mobile / Tablet View (<1024px) */}
        <div className="block lg:hidden space-y-6 text-left">
          {/* Chapter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'bg-white dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 border border-newspaper-200 dark:border-ink-800'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-newspaper-500 dark:text-ink-400'}>{step.num}</span>
                  <span>{step.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Canvas */}
          {renderCanvasBody()}

          {/* Active Detail Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-newspaper-500 dark:text-ink-400">
                CHAPTER {steps[activeStep].num} • {steps[activeStep].tag}
              </span>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-newspaper-700 dark:text-ink-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>{steps[activeStep].highlight}</span>
              </div>
            </div>
            <h3 className="text-xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
              {steps[activeStep].desc}
            </p>
          </div>
        </div>

        {/* Desktop View (≥1024px): 2-Column Sticky Narrative + Live Canvas */}
        <div ref={containerRef} className="hidden lg:grid lg:grid-cols-12 gap-12 lg:gap-14 items-start relative">
          
          {/* Left Column: 6 Chapters */}
          <div className="lg:col-span-5 relative py-2 text-left">
            <div className="space-y-4 relative">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;

                return (
                  <div
                    key={step.num}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    onClick={() => setActiveStep(idx)}
                    className={`p-5 rounded-xl transition-all duration-200 cursor-pointer border ${
                      isActive
                        ? 'bg-white dark:bg-ink-900 border-newspaper-300 dark:border-ink-700 shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-ink-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold ${
                          isActive ? 'text-brand-500' : 'text-newspaper-400 dark:text-ink-500'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-[11px] font-mono font-semibold tracking-editorial-label uppercase text-newspaper-500 dark:text-ink-400">
                          {step.tag}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-newspaper-600 dark:text-ink-400 font-sans">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-500' : 'text-newspaper-400 dark:text-ink-600'}`} />
                        <span className="text-[11px]">{step.highlight}</span>
                      </div>
                    </div>

                    <h3 className={`text-xl font-serif font-semibold mb-1.5 leading-snug transition-colors ${
                      isActive ? 'text-newspaper-900 dark:text-ink-50' : 'text-newspaper-700 dark:text-ink-300'
                    }`}>
                      {step.title}
                    </h3>

                    <p className="text-sm text-newspaper-600 dark:text-ink-400 leading-relaxed font-normal">
                      {step.desc}
                    </p>
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
