import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  MapPin,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Eye,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Calculator,
  Upload,
  Radio,
  Clock,
  Award,
  Globe,
  Flame,
  Search,
  Volume2,
  QrCode,
  CheckCircle2,
  Share2,
  Activity,
  Layers,
  ArrowUpRight,
  Compass,
  Download,
  BellRing,
  Wallet,
  Camera,
  Check,
  Users,
  Navigation,
  ExternalLink,
  Cpu,
  RadioTower,
  Sliders,
  Heart,
  Mic,
  DollarSign,
  Lock,
  ChevronRight,
  Send,
  Video
} from 'lucide-react';
import { NagrikLogo } from '../components/NagrikLogo';
import { Card3D } from '../components/Card3D';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'creator' | 'admin') => void;
}

const CITIES_DATA = [
  { name: 'Patna', state: 'Bihar', activeStringers: 248, pulseSpeed: 'animate-pulse', activeRadius: '5.2 km' },
  { name: 'Varanasi', state: 'Uttar Pradesh', activeStringers: 194, pulseSpeed: 'animate-ping', activeRadius: '4.8 km' },
  { name: 'Lucknow', state: 'Uttar Pradesh', activeStringers: 182, pulseSpeed: 'animate-pulse', activeRadius: '6.1 km' },
  { name: 'Bengaluru', state: 'Karnataka', activeStringers: 310, pulseSpeed: 'animate-ping', activeRadius: '5.0 km' },
  { name: 'Delhi NCR', state: 'NCR', activeStringers: 420, pulseSpeed: 'animate-pulse', activeRadius: '7.5 km' },
  { name: 'Mumbai', state: 'Maharashtra', activeStringers: 365, pulseSpeed: 'animate-ping', activeRadius: '5.8 km' },
  { name: 'Pune', state: 'Maharashtra', activeStringers: 156, pulseSpeed: 'animate-pulse', activeRadius: '4.2 km' },
  { name: 'Kolkata', state: 'West Bengal', activeStringers: 215, pulseSpeed: 'animate-pulse', activeRadius: '5.4 km' }
];

const CAPABILITIES = [
  {
    id: 'radar',
    number: '01',
    title: '5km Ward Proximity Radar',
    tagline: 'Hyperlocal GPS Geofence',
    badge: 'WARD 14 • 1.2 KM',
    accentColor: '#E15024',
    icon: MapPin,
    description: 'Real-time GPS proximity feed delivering verified civic alerts, road disruptions, water pipeline updates, and neighborhood incidents strictly within 5 kilometers of your home.',
    highlights: ['5km strict GPS geofencing', 'Live emergency & infrastructure alerts', 'Cryptographic proximity radius']
  },
  {
    id: 'shorts',
    number: '02',
    title: '4K Short Video Newsfeed',
    tagline: 'Unfiltered Eyewitness Footage',
    badge: '4K 60FPS ULTRA HD',
    accentColor: '#F59E0B',
    icon: Play,
    description: 'Fast, vertical video bytes captured on ground by citizen reporters. No corporate studio teleprompters, no sensationalism — just raw verified facts from your city streets.',
    highlights: ['60 FPS vertical video reels', 'Zero studio filters or corporate bias', 'Direct eyewitness engagement & comments']
  },
  {
    id: 'report',
    number: '03',
    title: '1-Tap Incident Camera',
    tagline: 'Instant Ground Journalism',
    badge: 'GPS AUTO-TAG LOCKED',
    accentColor: '#EA580C',
    icon: Camera,
    description: 'Capture photo or 4K video evidence, dictate voice notes with AI speech-to-text, and publish instantly with automated cryptographic GPS geotagging & timestamp protection.',
    highlights: ['Automated GPS coordinates locking', 'AI voice note auto-transcription', 'Fact desk verification under 15 mins']
  },
  {
    id: 'wallet',
    number: '04',
    title: 'Direct Instant UPI Wallet',
    tagline: '$1.50 CPM Transparent Monetization',
    badge: 'INSTANT ₹850+ DISBURSAL',
    accentColor: '#10B981',
    icon: Wallet,
    description: 'Every verified unique read automatically credits your ledger at guaranteed $1.50 CPM flat rate. 1-tap withdrawal directly to GPay, PhonePe, or Paytm once balance hits ₹850.',
    highlights: ['Guaranteed $1.50 CPM flat rate from view #1', 'Direct UPI (GPay, PhonePe, Paytm) payouts', '100% intellectual property ownership retained']
  }
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState<'radar' | 'shorts' | 'report' | 'wallet'>('radar');
  const [monthlyViews, setMonthlyViews] = useState<number>(65000);
  const [calculatorTimeframe, setCalculatorTimeframe] = useState<'monthly' | 'annual' | 'daily'>('monthly');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Feature block refs for IntersectionObserver-based active step
  const featureBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStickyIndex, setActiveStickyIndex] = useState(0);

  // Hero Section-wide 3D Phone tracking state
  const heroSectionRef = useRef<HTMLElement>(null);
  const [phone3D, setPhone3D] = useState({
    rotateX: -4,
    rotateY: 10,
    rotateZ: -2,
    translateX: 0,
    translateY: 0,
    glareX: 50,
    glareY: 30,
    glareOpacity: 0.2,
    isHovering: false
  });

  // Dynamic calculations for $1.50 CPM
  const multiplier = calculatorTimeframe === 'annual' ? 12 : calculatorTimeframe === 'daily' ? 1 / 30 : 1;
  const effectiveViews = monthlyViews * multiplier;
  const calculatedUSD = ((effectiveViews / 1000) * 1.5).toFixed(2);
  const calculatedINR = Math.round(Number(calculatedUSD) * 85.5).toLocaleString('en-IN');

  // Track global scroll and sticky section scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((currentScrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver: detect which feature block is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    featureBlockRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStickyIndex(idx);
            setActiveFeature(CAPABILITIES[idx].id as any);
          }
        },
        { threshold: 0.45 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Section-Wide 3D Mouse Movement Handler
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroSectionRef.current) return;
    const rect = heroSectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    const maxTiltY = 32;
    const maxTiltX = 26;
    const maxOffsetX = 24;
    const maxOffsetY = 18;

    setPhone3D({
      rotateX: -normY * maxTiltX,
      rotateY: normX * maxTiltY,
      rotateZ: normX * 3.5,
      translateX: normX * maxOffsetX,
      translateY: normY * maxOffsetY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.4,
      isHovering: true
    });
  };

  const handleHeroMouseLeave = () => {
    setPhone3D({
      rotateX: -4,
      rotateY: 10,
      rotateZ: -2,
      translateX: 0,
      translateY: 0,
      glareX: 50,
      glareY: 30,
      glareOpacity: 0.2,
      isHovering: false
    });
  };

  // Jump to feature block by scrolling to it
  const handleStepJump = (idx: number) => {
    const el = featureBlockRefs.current[idx];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] min-h-screen overflow-hidden relative selection:bg-[#FED7AA] selection:text-[#74260E]">
      
      {/* Dynamic Top Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Light Geometric Dot Grid Background */}
      <div className="absolute inset-0 bg-light-dots pointer-events-none opacity-65" />

      {/* Radiant Soft Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] radial-light-glow-top pointer-events-none" />
      <div
        className="absolute top-[800px] right-[-50px] w-[550px] h-[550px] bg-gradient-to-bl from-orange-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none animate-glow-drift"
        style={{ transform: `translate3d(0, ${-scrollY * 0.1}px, 0)` }}
      />
      <div
        className="absolute top-[1900px] left-[-50px] w-[650px] h-[650px] bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none animate-glow-drift"
        style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
      />

      {/* =================================================================== */}
      {/* 1. HERO SECTION: FULL-SECTION 3D DYNAMIC SMARTPHONE LAUNCHPAD       */}
      {/* =================================================================== */}
      <section
        ref={heroSectionRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative pt-10 pb-8 md:pt-16 md:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 cursor-default"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Live Network Badge */}
            <RevealOnScroll direction="down" delay={50}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xs hover:border-[#E15024]/50 transition duration-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E15024] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E15024]" />
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono tracking-wide">
                  NAGRIK MOBILE APP • LIVE IN 100+ INDIAN CITIES
                </span>
              </div>
            </RevealOnScroll>

            {/* Massive Razor-Sharp Headline */}
            <RevealOnScroll direction="zoom" delay={150}>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.04]">
                  <span className="text-gradient-dark">
                    Hyperlocal News.
                  </span>
                  <br />
                  <span className="text-gradient-saffron drop-shadow-xs">
                    In Your Pocket.
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-slate-600 font-sans leading-relaxed max-w-xl">
                  Real-time ground truth strictly within 5 km of your home. Watch verified 4K short videos or report breaking civic incidents on the <strong>Nagrik Mobile App</strong>.
                </p>
              </div>
            </RevealOnScroll>

            {/* Download Badges & QR Code Trigger */}
            <RevealOnScroll direction="up" delay={250}>
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href="#app-download"
                    className="hover:scale-105 active:scale-98 transition duration-200 rounded-xl overflow-hidden inline-block shadow-md hover:shadow-xl border border-black/5"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-12 w-auto"
                    />
                  </a>
                  <a
                    href="#app-download"
                    className="hover:scale-105 active:scale-98 transition duration-200 rounded-xl overflow-hidden inline-block shadow-md hover:shadow-xl border border-black/5"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="h-12 w-auto"
                    />
                  </a>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#E15024] rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow-2xs hover:shadow-md cursor-pointer hover:text-[#E15024]"
                  >
                    <QrCode className="w-4 h-4 text-[#E15024]" />
                    <span>Scan QR Code</span>
                  </button>
                </div>

                {/* Creator Studio Prompt */}
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="text-slate-500">Are you an independent stringer or resident?</span>
                  <Link
                    to="/creator"
                    className="font-bold text-[#E15024] hover:text-[#C83F15] flex items-center gap-1 font-mono transition group"
                  >
                    <span>Open Creator Studio ($1.50 CPM)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            {/* High-End Telemetry Metric Badges */}
            <RevealOnScroll direction="up" delay={350}>
              <div className="grid grid-cols-3 gap-3.5 sm:gap-4 pt-6 border-t border-slate-200/90 max-w-xl">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-300 hover:-translate-y-1 transition duration-300">
                  <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">5 KM</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5">Ward Radius</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:-translate-y-1 transition duration-300">
                  <div className="text-2xl sm:text-3xl font-black font-display text-emerald-600 tracking-tight">$1.50</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5">Flat Rate / 1K Reads</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-300 hover:-translate-y-1 transition duration-300">
                  <div className="text-2xl sm:text-3xl font-black font-display text-[#E15024] tracking-tight">Instant</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5">UPI Disbursals</div>
                </div>
              </div>
            </RevealOnScroll>

          </div>

          {/* Right Hero Column: Full-Section Responsive 3D Holographic Smartphone */}
          <div className="lg:col-span-5 relative flex justify-center perspective-2000">
            <div
              className={`w-full max-w-sm preserve-3d will-change-transform ${
                !phone3D.isHovering ? 'animate-phone-auto-sway' : ''
              }`}
              style={{
                transform: phone3D.isHovering
                  ? `rotateX(${phone3D.rotateX}deg) rotateY(${phone3D.rotateY}deg) rotateZ(${phone3D.rotateZ}deg) translate3d(${phone3D.translateX}px, ${phone3D.translateY}px, 0)`
                  : undefined,
                transition: phone3D.isHovering ? 'transform 0.12s ease-out' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="relative preserve-3d">
                
                {/* 3D Floating Notification Badge 1 (Top Right) */}
                <div
                  className="absolute -top-5 -right-5 bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold font-mono z-30 border border-slate-700 animate-badge-1"
                  style={{
                    transform: `translate3d(${phone3D.translateX * 1.5}px, ${phone3D.translateY * 1.5}px, 75px)`,
                    transition: phone3D.isHovering ? 'transform 0.12s ease-out' : 'transform 0.8s ease-out'
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400">₹1,275 Disbursed</span>
                </div>

                {/* 3D Floating Notification Badge 2 (Bottom Left) */}
                <div
                  className="absolute -bottom-5 -left-5 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold z-30 border border-slate-200 animate-badge-2"
                  style={{
                    transform: `translate3d(${phone3D.translateX * 1.4}px, ${phone3D.translateY * 1.4}px, 65px)`,
                    transition: phone3D.isHovering ? 'transform 0.12s ease-out' : 'transform 0.8s ease-out'
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[#E15024]">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Ward 14 Alert</div>
                    <div className="text-xs font-bold leading-none text-slate-900">Pipeline Fixed</div>
                  </div>
                </div>

                {/* Smartphone Frame Chassis with 3D Depth Shadow */}
                <div
                  className="phone-light-chassis p-4 rounded-[52px] relative overflow-hidden preserve-3d"
                  style={{
                    boxShadow: phone3D.isHovering
                      ? `${-phone3D.rotateY * 1.5}px ${phone3D.rotateX * 1.5 + 30}px 70px -15px rgba(15, 23, 42, 0.4), 0 0 50px rgba(225, 80, 36, 0.2)`
                      : '0 30px 70px -15px rgba(15, 23, 42, 0.35), 0 0 50px rgba(225, 80, 36, 0.15)',
                    transition: 'box-shadow 0.2s ease-out'
                  }}
                >
                  
                  {/* Dynamic Island Notch with Live Audio Waveform */}
                  <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-between px-3 relative z-20 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="flex items-center gap-0.5">
                      <span className="waveform-bar" style={{ animationDelay: '0.1s' }} />
                      <span className="waveform-bar" style={{ animationDelay: '0.3s' }} />
                      <span className="waveform-bar" style={{ animationDelay: '0.2s' }} />
                      <span className="waveform-bar" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Interactive Smartphone Screen UI */}
                  <div className="bg-[#FAF9F6] rounded-[36px] overflow-hidden p-4 space-y-3 text-left border border-slate-300 min-h-[490px] flex flex-col justify-between scanline-overlay transition-all duration-300 shadow-inner relative">
                    
                    {/* Dynamic Specular Glare */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[36px] transition-opacity duration-300 overflow-hidden z-30"
                      style={{
                        opacity: phone3D.glareOpacity,
                        background: `radial-gradient(circle at ${phone3D.glareX}% ${phone3D.glareY}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 80%)`
                      }}
                    />

                    {/* App Top Bar */}
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px] font-mono font-bold">
                        <div className="flex items-center gap-1.5 text-slate-900">
                          <span className="w-2 h-2 rounded-full bg-[#E15024] animate-ping" />
                          <span>Nagrik Live</span>
                        </div>
                        <span className="text-[#E15024] bg-orange-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          5G • WARD 14
                        </span>
                      </div>

                      {/* Screen View */}
                      <div className="pt-2">
                        <div className="space-y-2.5 animate-in fade-in duration-300">
                          <div className="relative aspect-[9/10] bg-slate-900 rounded-2xl overflow-hidden shadow-md group">
                            <img
                              src="https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80"
                              alt="Ward Radar"
                              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            
                            {/* Sonar Sweep */}
                            <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-orange-500/40 flex items-center justify-center">
                              <div className="w-full h-full rounded-full border border-[#E15024] animate-radar-wave" />
                              <div className="w-2 h-2 rounded-full bg-[#E15024]" />
                            </div>

                            <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white font-mono text-[9px] font-bold flex items-center gap-1 border border-white/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>5KM WARD RADAR</span>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-11 h-11 rounded-full bg-[#E15024] text-white flex items-center justify-center shadow-xl">
                                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                              </div>
                            </div>

                            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-1">
                              <div className="text-xs font-bold leading-snug font-display line-clamp-2">
                                Varanasi Ghats Water Sensor Repair Completed
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1 border-t border-white/10">
                                <span>Aditi S. • Varanasi</span>
                                <span className="text-emerald-400 font-bold">1.2 km away</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="font-bold text-[#E15024]">PATNA METRO BREAKTHROUGH</span>
                              <span className="text-slate-400">12m ago</span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-800 line-clamp-1">
                              Tunnel Boring Machine crosses Fraser Road
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* App Bottom Bar */}
                    <div className="border-t border-slate-200 pt-2 flex items-center justify-around text-[10px] font-mono text-slate-400">
                      <span className="text-[#E15024] font-bold flex flex-col items-center gap-0.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Radar</span>
                      </span>
                      <span className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                        <Play className="w-3.5 h-3.5" />
                        <span>Shorts</span>
                      </span>
                      <span className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </span>
                      <span className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Wallet</span>
                      </span>
                    </div>
                  </div>

                  {/* Hardware Bottom Bar Indicator */}
                  <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QR Code Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E15024] flex items-center justify-center mx-auto shadow-2xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              Download Nagrik Mobile App
            </h3>
            <p className="text-xs text-slate-600 font-sans">
              Scan with your phone camera to download the Android APK or open iOS App Store.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block mx-auto shadow-inner">
              <QrCode className="w-40 h-40 text-slate-900 mx-auto" />
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Compatible with Android 8.0+ & iOS 14.0+
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. NATIVE APP CAPABILITIES — Apple-Style Sidebar Sticky             */}
      {/* =================================================================== */}
      <section id="features" className="relative bg-[#FAFAFC] border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <RevealOnScroll direction="up">
            <div className="text-center pt-16 pb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-[#E15024] text-xs font-bold font-mono border border-orange-200">
                <Layers className="w-3.5 h-3.5" />
                <span>NATIVE APP CAPABILITIES</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
                Engineered for<br className="hidden sm:block" /> Ground Reality.
              </h2>
              <p className="text-slate-500 text-sm font-sans max-w-md mx-auto leading-relaxed">
                Four native-grade capabilities built for Indian citizen journalists. Scroll to explore each one.
              </p>
            </div>
          </RevealOnScroll>

          {/* Tab Pills Quick Nav */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {CAPABILITIES.map((cap, idx) => (
              <button
                key={cap.id}
                onClick={() => handleStepJump(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                  activeStickyIndex === idx
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={activeStickyIndex === idx ? { backgroundColor: cap.accentColor, borderColor: cap.accentColor } : {}}
              >
                <span>{cap.number}</span>
                <span>{cap.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Main Layout: Left scrolling feature cards + Right sticky phone */}
          <div className="relative flex gap-8 xl:gap-16 items-start pb-20">

            {/* Left Column: Feature Text Blocks (scrollable) */}
            <div className="flex-1 space-y-0 min-w-0">
              {CAPABILITIES.map((cap, idx) => (
                <div
                  key={cap.id}
                  ref={(el) => { featureBlockRefs.current[idx] = el; }}
                  className="min-h-[80vh] flex items-center py-8"
                >
                  <div className={`w-full rounded-3xl border p-6 sm:p-8 space-y-5 transition-all duration-500 ${
                    activeStickyIndex === idx
                      ? 'bg-white border-transparent shadow-xl ring-1 ring-orange-100'
                      : 'bg-white/50 border-slate-100 shadow-sm'
                  }`}>

                    {/* Feature Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                            activeStickyIndex === idx ? 'scale-110' : ''
                          }`}
                          style={{ backgroundColor: cap.accentColor }}
                        >
                          {React.createElement(cap.icon, { className: 'w-7 h-7' })}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                            {cap.tagline}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                            {cap.title}
                          </h3>
                        </div>
                      </div>
                      <span
                        className="hidden sm:inline-flex shrink-0 text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border"
                        style={{
                          borderColor: `${cap.accentColor}50`,
                          color: cap.accentColor,
                          backgroundColor: `${cap.accentColor}12`
                        }}
                      >
                        {cap.badge}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {cap.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2.5 pt-3 border-t border-slate-100">
                      {cap.highlights.map((h, hi) => (
                        <div key={hi} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cap.accentColor}20` }}
                          >
                            <Check className="w-3 h-3" style={{ color: cap.accentColor }} />
                          </div>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{cap.number} / 04</span>
                      <div className="flex gap-1.5 items-center">
                        {CAPABILITIES.map((_, di) => (
                          <div
                            key={di}
                            className={`h-1.5 rounded-full transition-all duration-400 ${
                              di === idx ? 'w-6' : 'w-1.5 bg-slate-200'
                            }`}
                            style={di === idx ? { backgroundColor: cap.accentColor } : {}}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Phone Mockup */}
            <div className="hidden lg:flex flex-col items-center justify-center w-[280px] xl:w-[310px] flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
              
              {/* Feature indicator */}
              <div
                className="text-xs font-mono font-bold px-3 py-1.5 rounded-full mb-4 border transition-colors duration-300"
                style={{
                  color: CAPABILITIES[activeStickyIndex].accentColor,
                  backgroundColor: `${CAPABILITIES[activeStickyIndex].accentColor}12`,
                  borderColor: `${CAPABILITIES[activeStickyIndex].accentColor}40`
                }}
              >
                {CAPABILITIES[activeStickyIndex].number} — {CAPABILITIES[activeStickyIndex].title.split(' ').slice(0, 2).join(' ')}
              </div>

              {/* Phone Chassis */}
              <div className="phone-light-chassis p-3 rounded-[40px] shadow-2xl w-full relative">
                {/* Ambient glow behind phone */}
                <div
                  className="absolute -inset-4 rounded-[50px] blur-3xl opacity-20 transition-colors duration-700 pointer-events-none"
                  style={{ backgroundColor: CAPABILITIES[activeStickyIndex].accentColor }}
                />

                {/* Island */}
                <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-between px-2 relative z-20 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="flex items-center gap-0.5">
                    <span className="waveform-bar" style={{ animationDelay: '0.1s' }} />
                    <span className="waveform-bar" style={{ animationDelay: '0.3s' }} />
                    <span className="waveform-bar" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Screen */}
                <div className="bg-[#FAF9F6] rounded-[28px] overflow-hidden border border-slate-200 shadow-inner">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white/80">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E15024] animate-ping" />
                      <span>Nagrik Live</span>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase transition-colors duration-300"
                      style={{ color: CAPABILITIES[activeStickyIndex].accentColor, backgroundColor: `${CAPABILITIES[activeStickyIndex].accentColor}15` }}
                    >
                      {CAPABILITIES[activeStickyIndex].id}
                    </span>
                  </div>

                  {/* Screen content morphing */}
                  <div className="p-2.5 min-h-[300px] flex flex-col gap-2">
                    {activeStickyIndex === 0 && (
                      <div className="animate-in fade-in duration-400 space-y-2">
                        <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600&auto=format&fit=crop&q=80" alt="Ward Radar" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-white text-[8px] font-mono font-bold border border-white/10">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                            5KM WARD RADAR
                          </div>
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full border border-[#E15024]/60 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border border-[#E15024] animate-radar-wave" />
                            <Compass className="w-3 h-3 text-[#E15024] absolute animate-spin" style={{ animationDuration: '8s' }} />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white">
                            <div className="text-[10px] font-bold leading-tight">Varanasi Ghats Water Sensor Repair Completed</div>
                            <div className="flex justify-between text-[8px] text-slate-300 font-mono mt-0.5">
                              <span>Aditi S. • Varanasi</span><span className="text-emerald-400">1.2 km</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border border-slate-200 px-2.5 py-2">
                          <div className="flex justify-between text-[8px] font-mono mb-0.5">
                            <span className="font-bold text-[#E15024]">PATNA METRO ALERT</span>
                            <span className="text-slate-400">4m ago</span>
                          </div>
                          <div className="text-[9px] font-semibold text-slate-800">Tunnel Boring Machine crosses Fraser Road</div>
                        </div>
                      </div>
                    )}

                    {activeStickyIndex === 1 && (
                      <div className="animate-in fade-in duration-400 space-y-2">
                        <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=80" alt="4K Short" className="w-full h-full object-cover opacity-85" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-white text-[8px] font-mono font-bold border border-white/10">
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                            4K 60FPS
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-[#E15024] flex items-center justify-center shadow-xl">
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white">
                            <div className="text-[10px] font-bold">Monsoon Drainage Overhaul in Ward 7</div>
                            <div className="text-[8px] text-slate-300 font-mono">@rahul_ground • 24.8K Views</div>
                          </div>
                        </div>
                        <div className="bg-amber-50 rounded-lg border border-amber-200 px-2.5 py-1.5 flex justify-between">
                          <span className="text-[9px] font-bold text-amber-800 flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-[#E15024]" />Trending Ward 7</span>
                          <span className="text-[9px] font-bold text-[#E15024]">98% Verified</span>
                        </div>
                      </div>
                    )}

                    {activeStickyIndex === 2 && (
                      <div className="animate-in fade-in duration-400 space-y-2">
                        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden p-2.5 flex flex-col justify-between border border-slate-700">
                          <div className="flex justify-between text-[8px] font-mono">
                            <span className="bg-red-600 px-1 py-0.5 rounded text-white font-bold animate-pulse">● REC 4K</span>
                            <span className="text-slate-300">25.31°N 82.97°E</span>
                          </div>
                          <div className="border border-white/20 rounded-lg p-3 text-center relative">
                            <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-orange-500" />
                            <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-orange-500" />
                            <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-orange-500" />
                            <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-orange-500" />
                            <Camera className="w-5 h-5 text-orange-400 mx-auto" />
                            <div className="text-[8px] text-slate-400 mt-0.5">GPS Locked</div>
                          </div>
                          <button className="w-full py-1 bg-[#E15024] text-white text-[9px] font-bold rounded-lg">Dispatch to Bureau</button>
                        </div>
                        <div className="bg-slate-100 rounded-lg border border-slate-200 px-2.5 py-1.5 flex justify-between">
                          <span className="text-[9px] font-mono text-slate-600">Fact Check Desk</span>
                          <span className="text-[9px] font-bold text-emerald-600">&lt; 15 Mins</span>
                        </div>
                      </div>
                    )}

                    {activeStickyIndex === 3 && (
                      <div className="animate-in fade-in duration-400 space-y-2">
                        <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-3 flex flex-col justify-between border border-slate-800">
                          <div>
                            <div className="flex justify-between text-[8px] font-mono text-slate-400">
                              <span>STRINGER WALLET</span><span className="text-emerald-400">● ACTIVE</span>
                            </div>
                            <div className="text-lg font-black font-mono text-emerald-400 mt-1">₹3,420.50</div>
                            <div className="text-[8px] text-slate-400 font-mono">≈ $40.00 ($1.50 CPM)</div>
                          </div>
                          <div className="space-y-1 border-t border-slate-700 pt-1.5">
                            <div className="flex justify-between text-[8px] font-mono">
                              <span className="text-slate-300">Varanasi Story (28k)</span><span className="text-emerald-400">+₹3,590</span>
                            </div>
                            <div className="flex justify-between text-[8px] font-mono">
                              <span className="text-slate-300">Patna Alert (12k)</span><span className="text-emerald-400">+₹1,539</span>
                            </div>
                          </div>
                          <button className="w-full py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-bold rounded-lg flex items-center justify-center gap-1">
                            <Zap className="w-2.5 h-2.5" />Instant UPI Withdrawal
                          </button>
                        </div>
                        <div className="bg-emerald-50 rounded-lg border border-emerald-200 px-2.5 py-1.5 flex justify-between">
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">Min: ₹850</span>
                          <span className="text-[9px] font-bold text-emerald-700">Zero Fees</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Nav */}
                  <div className="border-t border-slate-200 px-2 py-2 flex justify-around bg-white/50">
                    {CAPABILITIES.map((cap, idx) => (
                      <span key={cap.id} className={`flex flex-col items-center gap-0.5 text-[8px] font-mono transition-colors duration-200 ${
                        activeStickyIndex === idx ? 'font-bold' : 'text-slate-400'
                      }`}
                      style={activeStickyIndex === idx ? { color: cap.accentColor } : {}}
                      >
                        {React.createElement(cap.icon, { className: 'w-3 h-3' })}
                        <span className="capitalize">{cap.id}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Home indicator */}
                <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
              </div>

            </div>
          </div>
        </div>
              <div className="flex items-center gap-2">
                {CAPABILITIES.map((cap, idx) => (
                  <button
                    key={cap.id}
                    onClick={() => handleStepJump(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      activeStickyIndex === idx
                        ? 'bg-[#E15024] text-white border-[#E15024] shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{cap.number}</span>
                    <span className="hidden sm:inline">{cap.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Active Capability Story Card */}
              <div className="bento-card-light p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-200 shadow-md animate-in fade-in zoom-in-95 duration-300 relative">
                
                {/* Header with Icon and Live Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors duration-300"
                      style={{ backgroundColor: CAPABILITIES[activeStickyIndex].accentColor }}
                    >
                      {React.createElement(CAPABILITIES[activeStickyIndex].icon, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {CAPABILITIES[activeStickyIndex].tagline}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                        {CAPABILITIES[activeStickyIndex].title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="hidden sm:inline-block text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-2xs"
                    style={{
                      borderColor: `${CAPABILITIES[activeStickyIndex].accentColor}40`,
                      color: CAPABILITIES[activeStickyIndex].accentColor,
                      backgroundColor: `${CAPABILITIES[activeStickyIndex].accentColor}10`
                    }}
                  >
                    {CAPABILITIES[activeStickyIndex].badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {CAPABILITIES[activeStickyIndex].description}
                </p>

                {/* Key Capability Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {CAPABILITIES[activeStickyIndex].highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${CAPABILITIES[activeStickyIndex].accentColor}20` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: CAPABILITIES[activeStickyIndex].accentColor }} />
                      </div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Scroll Indicator Guide */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Scroll down to advance feature</span>
                  <span className="font-bold text-slate-700">
                    Step {activeStickyIndex + 1} of {CAPABILITIES.length}
                  </span>
                </div>

              </div>

            </div>

            {/* Right Column: Seamlessly Morphing 3D Smartphone Simulator */}
            <div className="lg:col-span-5 relative flex justify-center perspective-2000">
              <div className="w-full max-w-[320px] preserve-3d">
                <div className="relative preserve-3d">
                  
                  {/* Smartphone Frame Chassis */}
                  <div className="phone-light-chassis p-2.5 rounded-[40px] relative overflow-hidden preserve-3d shadow-xl">
                    
                    {/* Dynamic Island Notch */}
                    <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-between px-2 relative z-20 shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <div className="flex items-center gap-0.5">
                        <span className="waveform-bar" style={{ animationDelay: '0.1s' }} />
                        <span className="waveform-bar" style={{ animationDelay: '0.3s' }} />
                        <span className="waveform-bar" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {/* Interactive Smartphone Screen UI Morphing on Scroll */}
                    <div className="bg-[#FAF9F6] rounded-[26px] overflow-hidden p-2.5 space-y-2 text-left border border-slate-300 min-h-[260px] flex flex-col justify-between scanline-overlay transition-all duration-500 shadow-inner">
                      
                      {/* App Top Bar */}
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-[10px] font-mono font-bold">
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E15024] animate-ping" />
                            <span>Nagrik Live</span>
                          </div>
                          <span className="text-[#E15024] bg-orange-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                            {CAPABILITIES[activeStickyIndex].id} active
                          </span>
                        </div>

                        {/* Morphing Screen Views */}
                        <div className="pt-1.5">
                          
                          {/* 1. Radar Screen */}
                          {activeStickyIndex === 0 && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                              <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-md group">
                                <img
                                  src="https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80"
                                  alt="Ward Radar"
                                  className="w-full h-full object-cover opacity-85"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                
                                <div className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full border border-orange-500/40 flex items-center justify-center">
                                  <div className="w-full h-full rounded-full border border-[#E15024] animate-radar-wave" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#E15024]" />
                                </div>

                                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-white font-mono text-[8px] font-bold flex items-center gap-1 border border-white/20">
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                                  <span>5KM WARD RADAR</span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-9 h-9 rounded-full bg-[#E15024] text-white flex items-center justify-center shadow-xl">
                                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                                  </div>
                                </div>

                                <div className="absolute bottom-2 left-2 right-2 text-white space-y-0.5">
                                  <div className="text-[11px] font-bold leading-tight font-display line-clamp-1">
                                    Varanasi Ghats Water Sensor Repair Completed
                                  </div>
                                  <div className="flex items-center justify-between text-[9px] text-slate-300 font-mono">
                                    <span>Aditi S. • Varanasi</span>
                                    <span className="text-emerald-400 font-bold">1.2 km away</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 bg-white border border-slate-200 rounded-xl space-y-0.5 shadow-2xs">
                                <div className="flex items-center justify-between text-[9px] font-mono">
                                  <span className="font-bold text-[#E15024]">PATNA METRO BREAKTHROUGH</span>
                                  <span className="text-slate-400">12m ago</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-800 line-clamp-1">
                                  Tunnel Boring Machine crosses Fraser Road
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. Shorts Reel Screen */}
                          {activeStickyIndex === 1 && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                              <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-md group">
                                <img
                                  src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80"
                                  alt="4K Short"
                                  className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                
                                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-white font-mono text-[8px] font-bold flex items-center gap-1 border border-white/20">
                                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                                  <span>4K 60FPS SHORT</span>
                                </div>

                                <div className="absolute right-2 bottom-6 flex flex-col items-center gap-1 text-white">
                                  <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-rose-400">
                                    <Heart className="w-3 h-3 fill-current" />
                                  </div>
                                  <span className="text-[8px] font-mono">3.4k</span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-[#E15024] text-white flex items-center justify-center shadow-xl">
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                  </div>
                                </div>

                                <div className="absolute bottom-2 left-2 right-10 text-white space-y-0.5">
                                  <div className="text-[11px] font-bold leading-tight font-display line-clamp-1">
                                    Monsoon Drainage Overhaul in Ward 7
                                  </div>
                                  <div className="text-[8px] text-slate-300 font-mono">
                                    @rahul_ground • 24.8K Views
                                  </div>
                                </div>
                              </div>

                              <div className="p-1.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-[10px] font-mono text-amber-900">
                                <span className="font-bold flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-[#E15024]" />
                                  Trending in Ward 7
                                </span>
                                <span className="font-bold text-[#E15024]">98% Verified</span>
                              </div>
                            </div>
                          )}

                          {/* 3. Camera Incident Screen */}
                          {activeStickyIndex === 2 && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                              <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-md p-2.5 flex flex-col justify-between text-white border border-slate-700">
                                <div className="flex items-center justify-between text-[8px] font-mono">
                                  <span className="bg-red-600 px-1 py-0.5 rounded text-white font-bold animate-pulse">● REC 4K</span>
                                  <span className="text-slate-300">25.3176° N, 82.9739° E</span>
                                </div>

                                <div className="border border-white/30 rounded-lg p-2 text-center my-auto relative">
                                  <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-orange-500" />
                                  <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-orange-500" />
                                  <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-orange-500" />
                                  <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-orange-500" />
                                  <Camera className="w-6 h-6 text-orange-400 mx-auto opacity-80" />
                                  <div className="text-[9px] font-mono mt-0.5 text-slate-300">GPS Timestamp Locked</div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono">
                                    <span className="flex items-center gap-1 text-slate-200">
                                      <Mic className="w-2.5 h-2.5 text-emerald-400" />
                                      Voice Dictation
                                    </span>
                                    <span className="text-emerald-400 font-bold">Auto-Transcribed</span>
                                  </div>
                                  <div className="w-full py-1 bg-[#E15024] text-white font-bold rounded-lg text-[10px] font-mono text-center shadow-md">
                                    Dispatch to Bureau Desk
                                  </div>
                                </div>
                              </div>

                              <div className="p-1.5 bg-slate-100 border border-slate-200 rounded-xl text-[9px] font-mono text-slate-700 flex items-center justify-between">
                                <span>Fact Check Desk</span>
                                <span className="font-bold text-emerald-600">&lt; 15 Mins Verification</span>
                              </div>
                            </div>
                          )}

                          {/* 4. Instant UPI Wallet Screen */}
                          {activeStickyIndex === 3 && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                              <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-3 flex flex-col justify-between text-white border border-slate-800 shadow-md">
                                <div>
                                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                                    <span>STRINGER WALLET</span>
                                    <span className="text-emerald-400 font-bold">● ACTIVE</span>
                                  </div>
                                  <div className="mt-1">
                                    <div className="text-[9px] text-slate-400 font-mono">Available UPI Balance</div>
                                    <div className="text-xl font-black font-mono text-emerald-400">
                                      ₹3,420.50
                                    </div>
                                    <div className="text-[8px] text-slate-400 font-mono">≈ $40.00 USD ($1.50 CPM)</div>
                                  </div>
                                </div>

                                <div className="space-y-1 border-t border-slate-800 pt-1">
                                  <div className="flex items-center justify-between text-[8px] font-mono">
                                    <span className="text-slate-300">Varanasi Story (28k reads)</span>
                                    <span className="text-emerald-400 font-bold">+₹3,590</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[8px] font-mono">
                                    <span className="text-slate-300">Patna Alert (12k reads)</span>
                                    <span className="text-emerald-400 font-bold">+₹1,539</span>
                                  </div>
                                </div>

                                <div className="w-full py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg text-[9px] font-mono text-center shadow-lg flex items-center justify-center gap-1">
                                  <Zap className="w-3 h-3 fill-current" />
                                  <span>Instant UPI Withdrawal</span>
                                </div>
                              </div>

                              <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[9px] font-mono text-emerald-800 flex items-center justify-between font-bold">
                                <span>Minimum: ₹850 ($10)</span>
                                <span>Zero Fees</span>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* App Bottom Bar */}
                      <div className="border-t border-slate-200 pt-1.5 flex items-center justify-around text-[9px] font-mono text-slate-400">
                        {CAPABILITIES.map((cap, idx) => (
                          <span
                            key={cap.id}
                            className={`flex flex-col items-center gap-0.5 ${
                              activeStickyIndex === idx ? 'text-[#E15024] font-bold' : ''
                            }`}
                          >
                            {React.createElement(cap.icon, { className: 'w-3 h-3' })}
                            <span className="capitalize">{cap.id}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hardware Bottom Bar Indicator */}
                    <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. 3D STRINGER REVENUE WORKSTATION ($1.50 CPM)                      */}
      {/* =================================================================== */}
      <section id="earnings" className="py-24 md:py-32 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left relative z-10">
          
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E15024]/20 border border-[#E15024]/40 text-[#E15024] text-xs font-bold font-mono">
                <Calculator className="w-3.5 h-3.5" />
                <span>3D STRINGER REVENUE SIMULATOR</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
                Transparent Payouts. From View #1.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                Calculate your projected earnings as a citizen stringer on Nagrik. Guaranteed <strong>$1.50 CPM flat rate</strong> disbursed straight to your UPI ID.
              </p>
            </div>
          </RevealOnScroll>

          {/* 3D Glass Calculator Card */}
          <RevealOnScroll direction="zoom" delay={150}>
            <Card3D depth={10} borderGlow={true}>
              <div className="glass-dark-card p-6 sm:p-10 rounded-3xl space-y-8 border border-white/10">
                
                {/* Header with Timeframe Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">
                      Estimated Verified Reads & Views ({calculatorTimeframe}):
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-[#E15024] mt-0.5">
                      {Math.round(effectiveViews).toLocaleString()} <span className="text-sm font-normal text-slate-400">verified views</span>
                    </div>
                  </div>

                  {/* Timeframe Switcher */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
                    {(['daily', 'monthly', 'annual'] as const).map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setCalculatorTimeframe(timeframe)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer font-bold ${
                          calculatorTimeframe === timeframe
                            ? 'bg-[#E15024] text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min={5000}
                    max={500000}
                    step={5000}
                    value={monthlyViews}
                    onChange={(e) => setMonthlyViews(Number(e.target.value))}
                    className="editorial-slider w-full cursor-pointer"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-400">Quick Presets:</span>
                    <div className="flex flex-wrap gap-2">
                      {[10000, 25000, 50000, 100000, 250000, 500000].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setMonthlyViews(preset)}
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg transition cursor-pointer border ${
                            monthlyViews === preset
                              ? 'bg-[#E15024] text-white border-[#E15024] font-bold'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {(preset / 1000).toFixed(0)}k views
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projections Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Guaranteed CPM Rate</div>
                    <div className="text-2xl font-black font-mono text-white">$1.50 / 1K</div>
                    <div className="text-[11px] text-slate-400">From the very 1st view</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#E15024]/20 to-orange-900/30 border border-[#E15024]/50 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-orange-300">Projected {calculatorTimeframe} Payout</div>
                    <div className="text-3xl font-black font-mono text-white">${calculatedUSD}</div>
                    <div className="text-xs font-bold text-orange-300 font-mono">≈ ₹{calculatedINR} INR</div>
                  </div>

                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Payout Method</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">Instant UPI</div>
                    <div className="text-[11px] text-slate-400">Direct to GPay / PhonePe</div>
                  </div>
                </div>

                {/* Creator Studio CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400 font-sans">
                    Zero subscriber barriers • 100% Intellectual property ownership retained
                  </div>
                  <button
                    onClick={() => onNavigate('creator')}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#E15024] to-[#C83F15] hover:from-[#C83F15] hover:to-[#B0340E] text-white rounded-xl font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 hover:scale-102"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Launch Creator Studio Workstation</span>
                  </button>
                </div>

              </div>
            </Card3D>
          </RevealOnScroll>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. LIVE 3D NATIONAL CITY RADAR (Active Bureaus)                     */}
      {/* =================================================================== */}
      <section id="city-radar" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12 text-left">
          
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E15024] font-mono">
                  <Radio className="w-4 h-4 text-[#E15024]" />
                  <span>HYPERLOCAL TELEMETRY</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 mt-1">
                  Active City Radar Bureaus
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-500 font-bold">
                100+ Indian Urban & Semi-Urban Clusters Online
              </div>
            </div>
          </RevealOnScroll>

          {/* 3D City Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CITIES_DATA.map((city, idx) => (
              <RevealOnScroll key={city.name} direction="up" delay={idx * 60}>
                <Card3D depth={12}>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-[#E15024] transition duration-300 space-y-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E15024] flex items-center justify-center font-black text-xs">
                        {city.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${city.pulseSpeed}`} />
                        LIVE
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold font-display text-slate-900">
                        {city.name}
                      </h4>
                      <div className="text-xs text-slate-500 font-mono">
                        {city.state}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span>{city.activeStringers} Stringers</span>
                      <span className="text-[#E15024] font-bold">{city.activeRadius} Grid →</span>
                    </div>
                  </div>
                </Card3D>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. HOW NAGRIK WORKS: 3-STEP PROTOCOL                                */}
      {/* =================================================================== */}
      <section className="py-24 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
                How Ground Truth Reaches You
              </h2>
              <p className="text-slate-600 text-sm">
                The decentralized 3-stage protocol powering hyperlocal journalism across India.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <RevealOnScroll direction="up" delay={100}>
              <Card3D depth={10}>
                <div className="p-7 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E15024] flex items-center justify-center font-black font-mono text-lg">
                      01
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-900">
                      Citizen Captures Evidence
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      A resident or independent stringer films breaking civic issues, infrastructure breakthroughs, or cultural events directly on the Nagrik app with GPS verification.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#E15024] font-bold pt-2 border-t border-slate-100">
                    1-Tap Camera & Audio Dispatch
                  </div>
                </div>
              </Card3D>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={200}>
              <Card3D depth={10}>
                <div className="p-7 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black font-mono text-lg">
                      02
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-900">
                      AI & Fact Desk Verification
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Automated media safety analysis, reverse-image hashing, and regional bureau confirmation validate footage in under 15 minutes to guarantee zero fake news.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 font-bold pt-2 border-t border-slate-100">
                    Cryptographic Timestamp Hash
                  </div>
                </div>
              </Card3D>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={300}>
              <Card3D depth={10}>
                <div className="p-7 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono text-lg">
                      03
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-900">
                      Ward Broadcast & $1.50 CPM
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Broadcasted in real-time to citizens living within a 5 km radius. The citizen reporter earns $1.50 per 1,000 reads, paid out directly via UPI.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 font-bold pt-2 border-t border-slate-100">
                    Instant UPI Disbursal
                  </div>
                </div>
              </Card3D>
            </RevealOnScroll>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CLEAN LUXURY FAQ ACCORDION                                       */}
      {/* =================================================================== */}
      <section id="faq" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
        <RevealOnScroll direction="up">
          <div className="border-b border-slate-200 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E15024] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#E15024]" />
              <span>TRANSPARENCY & POLICIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>
        </RevealOnScroll>

        <div className="divide-y divide-slate-200 pt-4">
          {[
            {
              q: 'Where do I consume local news and short videos?',
              a: 'All hyperlocal news, 4K short videos, and 5km ward radar dispatches are consumed directly on the Nagrik Mobile App (available on Android and iOS). The web portal serves as our Creator Studio workstation and transparent platform ledger.'
            },
            {
              q: 'How does Nagrik calculate and disburse stringer earnings?',
              a: 'Nagrik operates on a guaranteed $1.50 CPM flat rate. For every 1,000 verified unique device reads generated on your reports, $1.50 USD is credited to your ledger. Payouts are sent directly to your UPI ID (GPay/PhonePe/Paytm) or Bank Account once your balance reaches $10 (approx. ₹850 INR).'
            },
            {
              q: 'Who owns the intellectual property and raw footage rights?',
              a: 'You retain 100% intellectual property ownership of all photographs, footage, and investigation texts you publish on Nagrik. We hold non-exclusive publishing rights only.'
            },
            {
              q: 'Who is eligible to report local news on Nagrik?',
              a: 'Anyone! Whether you are a local resident reporting civic maintenance issues, an independent stringer, or a journalism student, registration is completely free with zero subscriber hurdles.'
            },
            {
              q: 'How does regional editorial verification work?',
              a: 'Automated AI checks verify media authenticity and safety instantly, and our regional desk confirms ground facts within 15 to 45 minutes to prevent misinformation before stories hit wide algorithmic distribution.'
            }
          ].map((faq, idx) => (
            <RevealOnScroll key={idx} direction="up" delay={idx * 70}>
              <div className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-display font-bold text-base sm:text-lg text-slate-900 hover:text-[#E15024] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#E15024] shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    {faq.a}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

    </div>
  );
};
