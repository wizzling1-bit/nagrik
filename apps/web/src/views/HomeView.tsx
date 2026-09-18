'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  MapPin,
  Eye,
  Lock,
  Play,
  QrCode,
  Users,
  Landmark,
  Bell,
  Search,
  LayoutDashboard,
  FileEdit,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  Home,
  Radio,
  Clock,
  ArrowUpRight,
  BadgeCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollProductStory } from '../components/home/ScrollProductStory';
import { ProductEcosystem } from '../components/home/ProductEcosystem';
import { EarningsCalculator } from '../components/home/EarningsCalculator';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface HomeViewProps {
  onNavigate?: (view: 'home' | 'creator' | 'admin') => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  const { language } = useLanguage();

  // Living Product Lifecycle Simulation in Hero Laptop Mockup
  const [simStep, setSimStep] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // App Download Modal
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Accessible dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQrModal) {
        setShowQrModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQrModal]);

  // FAQs curated from verified product documentation
  const faqs = [
    {
      q: language === 'hi' ? 'नागरिक कंट्रीब्यूटर कमाई की गणना कैसे करता है?' : 'How does Nagrik calculate contributor earnings?',
      a: language === 'hi'
        ? 'नागरिक प्रत्येक 1,000 सत्यापित व्यू पर $1.00 (लगभग ₹86) की पारदर्शी फ्लैट दर से भुगतान करता है। कोई सब्सक्राइबर या वॉच-टाइम थ्रेशोल्ड नहीं है। आपकी पहली प्रकाशित व सत्यापित स्टोरी और पहले व्यू से ही अनुमानित कमाई जुड़ने लगती है।'
        : 'Nagrik pays a flat rate of $1.00 (~₹86) per 1,000 verified reads. You earn from your very first verified view — no follower minimums or watch-time gates needed.'
    },
    {
      q: language === 'hi' ? 'न्यूनतम भुगतान सीमा (Minimum Payout Threshold) क्या है?' : 'What is the minimum payout threshold?',
      a: language === 'hi'
        ? 'न्यूनतम निकासी सीमा केवल ₹850 ($10 USD) है। जैसे ही आपका स्वीकृत बैलेंस इस आंकड़े तक पहुँचता है, आप तत्काल निकासी का अनुरोध कर सकते हैं।'
        : 'The minimum withdrawal is ₹850 ($10). Once your balance reaches this amount, you can request a direct payout at any time.'
    },
    {
      q: language === 'hi' ? 'भुगतान कैसे और कब प्राप्त होता है?' : 'How do I receive payouts and what is the processing time?',
      a: language === 'hi'
        ? 'भुगतान सीधे आपके UPI VPA (Google Pay, PhonePe, Paytm, BHIM) या NEFT/IMPS बैंक ट्रांसफर के माध्यम से किया जाता है। UPI निकासी सामान्यतः 2 से 24 घंटों में और बैंक ट्रांसफर 24 से 48 व्यावसायिक घंटों में प्रोसेस हो जाते हैं।'
        : 'Payouts go straight to your UPI address or bank account. UPI transfers take 2 to 24 hours. Bank transfers take 24 to 48 hours, with zero platform fees.'
    },
    {
      q: language === 'hi' ? 'नागरिक पर कौन रिपोर्टर या स्ट्रिंगर बन सकता है?' : 'Who can become a reporter or stringer?',
      a: language === 'hi'
        ? 'कोई भी नागरिक, स्वतंत्र पत्रकार, कॉलेज छात्र या स्थानीय कैमरामैन जो अपने वार्ड या शहर की वास्तविक घटनाओं की ग्राउंड रिपोर्टिंग करना चाहता है, वह 60 सेकंड में निःशुल्क पंजीकरण कर सकता है।'
        : 'Anyone can sign up for free in 60 seconds. We welcome citizens, freelance journalists, students, and videographers who want to share verified local stories.'
    },
    {
      q: language === 'hi' ? 'संपादकीय व जीपीएस समीक्षा में कितना समय लगता है?' : 'How long does editorial and GPS verification take?',
      a: language === 'hi'
        ? 'हमारा स्वचालित जीपीएस जियोफेंसिंग इंजन अपलोड होते ही 5km दायरे का सत्यापन कर लेता है। संपादकीय तथ्य-जांच और सामग्री समीक्षा सामान्यतः 15 से 45 मिनट के भीतर पूरी हो जाती है।'
        : 'GPS confirms your location right as you upload. Editors fact-check and approve reports within 15 to 45 minutes.'
    },
    {
      q: language === 'hi' ? 'अपलोड की गई सामग्री का कॉपीराइट किसके पास रहता है?' : 'Who owns the content I upload?',
      a: language === 'hi'
        ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा और कॉपीराइट स्वामी बने रहते हैं। नागरिक को केवल अपने वेब और ऐप पर सामग्री प्रसारित करने का गैर-अनन्य (non-exclusive) वितरण लाइसेंस मिलता है।'
        : 'You keep 100% copyright over your work. Nagrik only gets permission to publish and show your story to local readers.'
    },
    {
      q: language === 'hi' ? 'हाइपरलोकल जियोटैगिंग कैसे काम करती है?' : 'How does hyperlocal geotagging work?',
      a: language === 'hi'
        ? 'जब आप स्टोरी सबमिट करते हैं, तो सिस्टम स्वचालित रूप से आपके मोबाइल या ब्राउज़र से GPS निर्देशांक (अक्षांश/देशांतर) लेकर स्टोरी के साथ 5km वार्ड का टैग लगा देता है, ताकि केवल वास्तविक स्थानीय दर्शक इसे देख सकें।'
        : 'When you submit a story, GPS locks your location. We stamp these coordinates so your report reaches readers within 5km of where it happened.'
    },
    {
      q: language === 'hi' ? 'क्या नागरिक प्लेटफ़ॉर्म का उपयोग करने के लिए कोई शुल्क है?' : 'Is there any fee to use Nagrik Creator Studio?',
      a: language === 'hi'
        ? 'बिल्कुल नहीं। नागरिक क्रिएटर स्टूडियो 100% निःशुल्क है। कोई प्लेटफ़ॉर्म शुल्क नहीं, कोई छिपे हुए शुल्क नहीं और कोई मासिक सदस्यता नहीं है।'
        : 'No. Nagrik Creator Studio is 100% free. There are no platform fees, subscriptions, or hidden charges.'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-[#DE5227] selection:text-white">

      {/* ════════════════════════════════════════════════════════════════════
          01. HERO: DUAL-DEVICE SHOWCASE (CREATOR STUDIO + NAGRIK MOBILE APP)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative isolate pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        
        {/* Tactile editorial illumination & subtle contours */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Soft ambient radial warmth */}
          <div className="absolute top-[8%] right-[4%] w-[680px] h-[680px] bg-gradient-to-tr from-[#EADBCC]/55 via-[#F5EAE0]/30 to-transparent rounded-full blur-3xl dark:from-orange-950/15 dark:via-slate-900/10" />
          
          {/* Abstract Geographic Elevation Contours */}
          <svg className="absolute -top-12 -right-16 w-[1150px] h-[860px] opacity-[0.055] dark:opacity-[0.04] text-slate-900 dark:text-white" viewBox="0 0 1000 800" fill="none" stroke="currentColor">
            <path d="M 100 120 C 350 80, 550 240, 850 140 C 950 100, 1050 190, 1200 170" strokeWidth="0.8" />
            <path d="M 50 200 C 320 160, 520 320, 820 220 C 920 180, 1020 270, 1200 250" strokeWidth="0.8" />
            <path d="M 0 280 C 290 240, 490 400, 790 300 C 890 260, 990 350, 1200 330" strokeWidth="0.8" />
            <path d="M -50 360 C 260 320, 460 480, 760 380 C 860 340, 960 430, 1200 410" strokeWidth="0.8" />
            <path d="M -100 440 C 230 400, 430 560, 730 460 C 830 420, 930 510, 1200 490" strokeWidth="0.8" />
            <path d="M -150 520 C 200 480, 400 640, 700 540 C 800 500, 900 590, 1200 570" strokeWidth="0.8" />
            {/* Concentric Ward Geofence Distance Rings */}
            <circle cx="720" cy="400" r="140" strokeDasharray="3 5" strokeWidth="0.75" />
            <circle cx="720" cy="400" r="240" strokeDasharray="4 7" strokeWidth="0.6" />
            <circle cx="720" cy="400" r="340" strokeDasharray="4 9" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 xl:gap-14 relative z-10 w-full">
          
          {/* Left Column: Authoritative Editorial Headline, CTAs & Proof Points (approx 45%) */}
          <div className="w-full lg:w-[45%] xl:w-[44%] shrink-0 space-y-6 sm:space-y-7 text-left">
            
            {/* Level 1: Refined Editorial Eyebrow Badge + Handwritten Editorial Note */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 dark:bg-slate-800/80 border border-stone-300/80 dark:border-slate-700/60 text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#DE5227] animate-pulse" aria-hidden="true" />
                <span>
                  {language === 'hi'
                    ? 'स्थानीय ग्राउंड रिपोर्टिंग • स्वतंत्र पत्रकारिता'
                    : 'Hyperlocal Ground Journalism • Creator Studio'}
                </span>
              </div>
              <span className="font-script text-amber-700 dark:text-amber-300 text-lg sm:text-xl font-semibold rotate-3 select-none pointer-events-none animate-scribble-bob">
                ~ every street has a voice 🎙️
              </span>
            </div>

            {/* Level 2: Dominant Editorial Headline (Newsreader Serif) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.04] sm:leading-[1.02]">
              {language === 'hi' ? (
                <>
                  ग्राउंड न्यूज़ रिपोर्ट करें।<br />
                  <span className="italic font-normal text-slate-700 dark:text-slate-200">
                    नागरिकों को सशक्त करें।
                  </span><br />
                  उचित कमाई करें।
                </>
              ) : (
                <>
                  Report Ground News.<br />
                  <span className="italic font-normal text-slate-700 dark:text-slate-200 inline-block">
                    Empower Citizens.
                  </span><br />
                  Earn Fairly.
                </>
              )}
            </h1>

            {/* Level 3: Authoritative Lede Paragraph */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal">
              {language === 'hi'
                ? 'नागरिक क्रिएटर स्टूडियो के ज़रिए तस्वीरें, वीडियो और स्थानीय स्टोरीज़ प्रकाशित करें। अपने क्षेत्र के असली दर्शकों तक पहुँचें और पारदर्शी भुगतान प्राप्त करें।'
                : 'Publish photos, videos and local stories through Nagrik Creator Studio. Reach real audiences in your area and earn through transparent payouts.'}
            </p>

            {/* Level 4: Primary & Secondary Action Cluster */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <Link
                href="/creator"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5"
              >
                <span>{language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#story"
                className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2.5"
              >
                <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                  <Play className="w-2.5 h-2.5 fill-slate-700 dark:fill-slate-300 ml-0.5" />
                </div>
                <span>{language === 'hi' ? 'देखें यह कैसे काम करता है' : 'Explore Creator Studio'}</span>
              </a>

              <span className="font-script text-indigo-600 dark:text-indigo-300 text-lg sm:text-xl font-semibold -rotate-2 select-none pointer-events-none animate-scribble-float-1 pl-1 hidden sm:inline-block">
                ⤷ zero gatekeepers, post in 60s ✍️
              </span>
            </div>

            {/* Level 5: Credibility Proof Bar with Structural Hierarchy */}
            <div className="pt-5 border-t border-stone-300/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-left">
              {/* Proof 1 */}
              <div className="flex items-center gap-2.5 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-2 rounded-xl bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>स्थानीय दर्शक<br />5km वार्ड</> : <>5km Ward<br />Audience</>}
                </div>
              </div>

              {/* Proof 2 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-2 rounded-xl bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0 font-serif font-black text-sm">
                  ₹
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-black text-slate-900 dark:text-white">$1.00 CPM</div>
                  <div className="text-xs text-content-secondary whitespace-nowrap">
                    {language === 'hi' ? 'प्रति 1,000 व्यू' : 'flat payout rate'}
                  </div>
                </div>
              </div>

              {/* Proof 3 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-2 rounded-xl bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>सीधा UPI /<br />बैंक ट्रांसफर</> : <>Direct UPI /<br />Bank Payouts</>}
                </div>
              </div>

              {/* Proof 4 */}
              <div className="flex items-center gap-2.5 sm:pl-3">
                <div className="p-2 rounded-xl bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>100% बौद्धिक<br />स्वामित्व</> : <>100% Content<br />Copyright</>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Creator Studio Product Visualization (approx 55%) */}
          <div className="w-full lg:w-[55%] xl:w-[56%] relative pt-2 sm:pt-4 lg:pt-6 flex flex-col items-center lg:items-end justify-center">


            {/* Dual Device Container */}
            <div className="relative z-10 w-full flex justify-center lg:justify-end items-end pr-2 sm:pr-6 lg:pr-8 pb-1">
              
              {/* Handwritten Editorial Accent in whitespace above laptop */}
              <div className="absolute -top-7 sm:-top-9 right-6 sm:right-12 z-20 select-none pointer-events-none hidden sm:block animate-scribble-sway">
                <span className="font-script text-rose-600 dark:text-rose-400 text-xl sm:text-2xl font-semibold -rotate-4 block">
                  ~ filmed by everyday citizens, verified in 5km 📹
                </span>
              </div>

              {/* ── DEVICE 1: LAPTOP MOCKUP (CREATOR STUDIO DASHBOARD) ── */}
              <div className="w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[690px] xl:max-w-[730px] rounded-t-2xl bg-[#1E2430] p-2.5 sm:p-3 shadow-2xl border border-slate-700/60 relative">
                
                {/* Webcam Notch & Living Studio Status Light */}
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300" role="status" aria-label="Studio Engine Status: Live">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    <span className="font-semibold tracking-wide">Studio Engine • Live</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((stepIdx) => (
                      <button
                        key={stepIdx}
                        onClick={() => setSimStep(stepIdx)}
                        aria-label={`Cycle step ${stepIdx + 1}`}
                        className="min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer"
                      >
                        <span className={`h-1.5 rounded-full transition-all ${
                          simStep === stepIdx ? 'w-4 bg-[#C84318]' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Laptop Display Screen */}
                <div className="rounded-xl bg-[#FAF8F5] text-slate-900 overflow-hidden font-sans text-left border border-slate-200/90 shadow-inner">
                  
                  {/* Studio Topbar */}
                  <div className="px-3 py-2 bg-[#FAF8F5] border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#C84318] text-white font-serif font-black text-xs flex items-center justify-center">
                        N
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900">
                        Nagrik Creator Studio
                      </span>
                      <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-stone-200/70 text-slate-700 border border-stone-300/60">
                        Patna Ward 12
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-500" />
                      <div className="relative">
                        <Bell className="w-3.5 h-3.5 text-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C84318] absolute -top-0.5 -right-0.5" />
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                        alt="Rohan"
                        className="w-5 h-5 rounded-full border border-slate-300 object-cover"
                      />
                    </div>
                  </div>

                  {/* Studio Body: Sidebar + Main Area */}
                  <div className="flex min-h-[285px] sm:min-h-[305px] lg:min-h-[320px]">
                    
                    {/* Left Sidebar (Desktop / Tablet) */}
                    <div className="hidden sm:block w-26 bg-[#FAF8F5] border-r border-slate-200/70 p-2 space-y-0.5 text-xs font-medium text-slate-600 shrink-0">
                      <div className="bg-[#F2ECE1] text-slate-900 font-bold rounded-lg px-2 py-1 flex items-center gap-1.5">
                        <LayoutDashboard className="w-3 h-3 text-[#DE5227]" />
                        <span>Dashboard</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <FileEdit className="w-3 h-3" />
                        <span>Create Report</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <FileText className="w-3 h-3" />
                        <span>My Reports</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <Wallet className="w-3 h-3" />
                        <span>Earnings</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <BarChart3 className="w-3 h-3" />
                        <span>Analytics</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <Settings className="w-3 h-3" />
                        <span>Settings</span>
                      </div>
                    </div>

                    {/* Main Studio Viewport */}
                    <div className="flex-1 p-2 sm:p-2.5 lg:p-3 space-y-2 bg-[#FAF9F6] overflow-hidden pr-2 sm:pr-3">
                      
                      {/* Dynamic Simulation Ticker Toast */}
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono shadow-xs border border-slate-800" role="status" aria-live="polite">
                        <div className="flex items-center gap-2 truncate pr-2">
                          {simStep === 0 && (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" aria-hidden="true" />
                              <span className="text-amber-100 font-semibold truncate">Stage 1: Report Submitted (Digha Chowk • 5km Ward)</span>
                            </>
                          )}
                          {simStep === 1 && (
                            <>
                              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" aria-hidden="true" />
                              <span className="text-blue-100 font-semibold truncate">Stage 2: 5km GPS & Fact Review Verified</span>
                            </>
                          )}
                          {simStep === 2 && (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                              <span className="text-emerald-200 font-semibold truncate">Stage 3: Published to Ward 12 Feed (Views Growing)</span>
                            </>
                          )}
                          {simStep === 3 && (
                            <>
                              <span className="w-2 h-2 rounded-full bg-[#DE5227] shrink-0" aria-hidden="true" />
                              <span className="text-orange-100 font-semibold truncate">Stage 4: $1.00 CPM Disbursed • UPI Payout Ready</span>
                            </>
                          )}
                        </div>
                        <span className="text-slate-400 text-xs shrink-0 font-mono font-bold">
                          {simStep + 1}/4
                        </span>
                      </div>

                      {/* Welcome & Upload Action */}
                      <div className="flex items-center justify-between pr-2 sm:pr-8 lg:pr-10">
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-bold font-serif text-slate-900 truncate">
                            Good morning, Rohan
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            Active ward: Digha Ghat • 5km radius
                          </div>
                        </div>
                        <Link
                          href="/creator"
                          className="px-2.5 py-1 rounded-lg bg-[#C84318] hover:bg-[#A83410] text-white font-bold text-xs flex items-center gap-1 shadow-xs shrink-0 cursor-pointer transition-transform active:scale-95"
                          title="Open Creator Studio"
                        >
                          <Plus className="w-3 h-3" />
                          <span>New Report</span>
                        </Link>
                      </div>

                      {/* 4 Metric Cards (2 cols on mobile, 4 on desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 pr-2 sm:pr-8 lg:pr-10">
                        <div className="bg-[#FAF8F5] rounded-lg p-1.5 border border-slate-200/60 shadow-xs text-left">
                          <div className="text-xs text-slate-600 uppercase font-mono font-bold">Total Views</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '126,840' : '125,430'}
                          </div>
                          <div className="text-xs text-emerald-700 font-bold font-mono">
                            {simStep >= 2 ? '↑ 14%' : '↑ 12%'}
                          </div>
                        </div>

                        <div className="bg-[#FAF8F5] rounded-lg p-1.5 border border-slate-200/60 shadow-xs text-left">
                          <div className="text-xs text-slate-600 uppercase font-mono font-bold">Estimated</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '$126.84' : '$125.43'}
                          </div>
                          <div className="text-xs text-emerald-700 font-bold font-mono">
                            {simStep >= 2 ? '+$1.41' : '↑ 8%'}
                          </div>
                        </div>

                        <div className="bg-[#FAF8F5] rounded-lg p-1.5 border border-slate-200/60 shadow-xs text-left">
                          <div className="text-xs text-slate-600 uppercase font-mono font-bold">Published</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '43' : '42'}
                          </div>
                          <div className="text-xs text-slate-600 font-mono font-medium">Verified</div>
                        </div>

                        <div className="bg-[#FAF8F5] rounded-lg p-1.5 border border-slate-200/60 shadow-xs text-left">
                          <div className="text-xs text-slate-600 uppercase font-mono font-bold">Threshold</div>
                          <div className="text-xs sm:text-sm font-black text-emerald-700 font-mono">₹850</div>
                          <div className="text-xs text-emerald-700 font-bold font-mono">✓ Ready</div>
                        </div>
                      </div>

                      {/* Recent Reports List with Morphing Status Badge */}
                      <div className="bg-[#FAF8F5] rounded-lg border border-slate-200/70 p-2 space-y-1.5 shadow-xs pr-2 sm:pr-6 lg:pr-8">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs">
                          <span className="font-bold text-slate-900">Recent Reports</span>
                          <Link
                            href="/creator"
                            className="text-slate-700 hover:text-[#C84318] font-semibold flex items-center gap-0.5 cursor-pointer transition"
                          >
                            View all →
                          </Link>
                        </div>

                        {/* Report Row 1 (Simulated Active Item) */}
                        <div className="flex items-center justify-between text-xs gap-1.5 sm:gap-2 py-0.5 transition-colors duration-200 bg-orange-50/70 rounded-md px-1.5 -mx-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=120&auto=format&fit=crop&q=80"
                              alt="Road Repair"
                              className="w-6 h-6 rounded-md object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
                                Road Repair Near Digha Chowk
                              </div>
                              <div className="text-slate-600 text-xs flex items-center gap-1 truncate font-medium">
                                <span>Patna</span>
                                <span>•</span>
                                <span className="text-[#C84318] font-mono font-semibold">5km Ward</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-slate-600 font-mono flex items-center gap-0.5 font-medium">
                              <Eye className="w-3 h-3" /> {simStep >= 2 ? '1.4K reads' : '0 reads'}
                            </span>
                            {simStep === 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300 font-bold text-xs">
                                Submitted
                              </span>
                            )}
                            {simStep === 1 && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 font-bold text-xs flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> In Review
                              </span>
                            )}
                            {simStep >= 2 && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Published
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Report Row 2 */}
                        <div className="flex items-center justify-between text-xs gap-1.5 sm:gap-2 py-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80"
                              alt="Water Supply"
                              className="w-6 h-6 rounded-md object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
                                Water Pipeline Upgrades
                              </div>
                              <div className="text-slate-600 text-xs font-medium">
                                Varanasi • 1d ago
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-slate-600 font-mono flex items-center gap-0.5 font-medium">
                              <Eye className="w-3 h-3" /> 8.7K
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs">
                              ✓ Live
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Laptop Chassis Bottom Base & Notch */}
                <div className="h-3.5 bg-gradient-to-b from-[#2D3545] to-[#1A1F2B] rounded-b-xl border-t border-slate-700/80 flex items-center justify-center mt-0.5 shadow-md">
                  <div className="w-16 h-1 bg-[#12161F] rounded-b-md" />
                </div>

              </div>

              {/* ── DEVICE 2: SMARTPHONE MOCKUP (PORTRAIT iPHONE) ── */}
              <div className="absolute -right-3 sm:-right-1 lg:right-0 bottom-0 z-20 w-[118px] sm:w-[138px] lg:w-[146px] h-[240px] sm:h-[285px] lg:h-[300px] rounded-[24px] bg-slate-950 p-1 sm:p-1.5 border-2 sm:border-[2.5px] border-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col">
                
                {/* Dynamic Island Notch */}
                <div className="w-10 h-2.5 bg-black rounded-full mx-auto mb-1 flex items-center justify-end pr-1 shrink-0">
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                </div>

                {/* Phone Screen */}
                <div className="rounded-[18px] bg-[#FAF8F5] overflow-hidden text-left font-sans flex flex-col flex-1 border border-stone-200/60 shadow-inner">
                  
                  {/* App Header */}
                  <div className="px-2.5 py-1 bg-[#FAF8F5] border-b border-stone-200/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-sm bg-[#C84318] text-white font-sans font-black text-xs flex items-center justify-center">
                        N
                      </div>
                      <span className="font-sans font-bold text-xs text-slate-900 tracking-tight">
                        Nagrik
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded flex items-center gap-0.5 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      5KM
                    </span>
                  </div>

                  {/* App Tabs */}
                  <div className="px-2.5 py-1 bg-[#FAF8F5] flex items-center gap-2 text-xs font-semibold border-b border-stone-200/60 shrink-0">
                    <span className="text-[#C84318] border-b-2 border-[#C84318] pb-0.5 font-bold">
                      For You
                    </span>
                    <span className="text-slate-600">Ward 12</span>
                    <span className="text-slate-600">Saved</span>
                  </div>

                  {/* Main Story Reel/Card (Indian Street Scene) */}
                  <div className="flex-1 relative overflow-hidden bg-slate-900">
                    <img
                      src="/cleaner-streets-phone.jpg"
                      alt="Local Ward Citizen News Story"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Story Title & Meta Overlay Synced to Lifecycle */}
                    <div className="absolute bottom-1.5 left-2 right-2 text-white space-y-0.5 transition-all duration-300">
                      <div className="font-bold text-xs leading-tight font-serif">
                        {simStep === 0 && 'Digha Chowk Work\nRecording Ground Byte'}
                        {simStep === 1 && '5km Ward Geofence\nGPS Matched & Verified'}
                        {simStep === 2 && 'Road Repair Live\n1.4K Neighborhood Reads'}
                        {simStep === 3 && '$1.00 CPM Settled\nDirect UPI Ready'}
                      </div>
                      <div className="text-xs text-slate-200 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Patna Ward 12</span>
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Navigation Bar */}
                  <div className="px-2.5 py-1.5 bg-[#FAF8F5] border-t border-stone-200/60 flex items-center justify-around text-slate-500 shrink-0">
                    <div className="text-slate-800">
                      <Home className="w-3 h-3" />
                    </div>
                    <div>
                      <FileText className="w-3 h-3 text-slate-400" />
                    </div>
                    {/* Floating Center Orange + Button */}
                    <div className="w-4.5 h-4.5 rounded-full bg-[#DE5227] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Plus className="w-3 h-3" />
                    </div>
                    <div>
                      <MapPin className="w-3 h-3 text-content-tertiary" />
                    </div>
                    <div>
                      <div className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300" />
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          02. SIGNATURE SCROLL-DRIVEN PRODUCT STORY ("From the ground to your audience")
          ════════════════════════════════════════════════════════════════════ */}
      <ScrollProductStory />

      {/* ════════════════════════════════════════════════════════════════════
          03. WHY NAGRIK: EDITORIAL NUMBERED LIST (NO 4-CARD GRIDS)
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <section id="why" className="py-24 sm:py-32 border-t border-stone-200/80 dark:border-slate-800/80 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Editorial Headline, Manifesto & Pull Quote */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-content-secondary">
                <span className="text-[#DE5227] font-bold text-base leading-none">—</span>
                <span>{language === 'hi' ? 'नागरिक क्यों चुनें' : 'Why Reporters Choose Nagrik'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
                {language === 'hi'
                  ? 'ज़मीनी रिपोर्टिंग करने वालों के लिए विशेष रूप से निर्मित।'
                  : 'Built for people who report from the ground.'}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'पारंपरिक डिजिटल प्लेटफ़ॉर्म स्थानीय मुद्दों को राष्ट्रीय शोर के नीचे दबा देते हैं और रचनाकारों की कमाई को कठिन एल्गोरिदम की शर्तों में बांध देते हैं। नागरिक को पहले दिन से ज़मीनी संवाददाताओं को सीधा अधिकार देने के लिए तैयार किया गया है।'
                  : 'Big platforms bury local news under national noise and block creators from earning. Nagrik gives ground reporters direct reach, fair pay from day one, and full ownership of their work.'}
              </p>

              {/* Editorial Pull Quote */}
              <div className="p-5 rounded-2xl bg-surface-card dark:bg-surface-card border border-stone-200/80 dark:border-slate-800 shadow-xs text-sm text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
                <span className="text-[#DE5227] font-sans font-bold not-italic mr-1.5 text-base">&ldquo;</span>
                {language === 'hi'
                  ? 'हम एल्गोरिदम से स्थानीय आवाज़ों को दबाते नहीं हैं। हम उन्हें सीधे उसी 5km दायरे में पहुँचाते हैं जहाँ वे सबसे अधिक मायने रखती हैं।'
                  : 'We never hide local voices under viral clickbait. We deliver eyewitness stories straight to the 5km area where they matter most.'}
                <span className="text-[#DE5227] font-sans font-bold not-italic ml-1 text-base">&rdquo;</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/creator"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-[#DE5227] dark:hover:text-[#DE5227] group transition-colors"
                >
                  <span>{language === 'hi' ? 'क्रिएटर स्टूडियो एक्सप्लोर करें' : 'Explore Creator Studio capabilities'}</span>
                  <ArrowRight className="w-4 h-4 text-[#DE5227] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Handwritten Editorial Accent in Whitespace */}
              <div className="pt-3 select-none pointer-events-none">
                <span className="font-script text-2xl sm:text-3xl text-rose-600 dark:text-rose-400 font-semibold -rotate-3 block leading-tight animate-scribble-float-1">
                  ⤷ "Real news begins where mainstream media stops looking." 📍
                </span>
              </div>
            </div>

            {/* Right Column: Numbered Editorial Thesis Flow */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              {/* 01: Monetize from Day One */}
              <div className="p-6 sm:p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-stone-200/90 dark:border-slate-800 space-y-3 text-left hover:border-[#DE5227]/40 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 shadow-2xs group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-[#C84318] dark:text-orange-400">
                      01
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white group-hover:text-[#C84318] dark:group-hover:text-orange-400 transition-colors">
                      {language === 'hi' ? 'पहले दिन से कमाई (Day-One Monetization)' : 'Monetize from Day One'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/15 text-[#C84318] dark:text-orange-400 font-mono text-xs font-bold shrink-0 border border-orange-500/30">
                    FLAT $1.00 CPM
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'कोई 1,000 सब्सक्राइबर या 4,000 घंटे की वॉच-टाइम की बाध्यता नहीं। आपकी पहली प्रकाशित स्टोरी और पहले सत्यापित व्यू से ही $1.00 CPM (~₹86 प्रति 1,000 व्यू) की दर से पारदर्शी कमाई शुरू हो जाती है।'
                    : 'No subscriber goals and no watch-time minimums. Earn a flat $1.00 (~₹86) per 1,000 verified reads starting from your first story.'}
                </p>
              </div>

              {/* 02: Hyperlocal Geotagging */}
              <div className="p-6 sm:p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-stone-200/90 dark:border-slate-800 space-y-3 text-left hover:border-sky-400/50 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 shadow-2xs group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-400">
                      02
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                      {language === 'hi' ? '5km हाइपरलोकल जियोटैगिंग' : 'Hyperlocal Geotagging & Ward Verification'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-400 font-mono text-xs font-bold shrink-0 border border-sky-500/30">
                    5KM GEOFENCE
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'प्रत्येक अपलोड के साथ स्वचालित 5km GPS निर्देशांक सुरक्षित रूप से स्टैम्प किए जाते हैं। आपकी रिपोर्ट केवल उन स्थानीय नागरिकों तक पहुंचाई जाती है जिनके लिए वह सीधे तौर पर प्रासंगिक है।'
                    : 'GPS confirms your location automatically when you upload. Stories go straight to neighbors living within that 5km radius.'}
                </p>
                <div className="flex justify-end pt-1 select-none pointer-events-none">
                  <span className="font-script text-sky-700 dark:text-sky-400 text-lg font-semibold rotate-2 animate-scribble-sway">
                    ~ verified within 5km radius 🛰️
                  </span>
                </div>
              </div>

              {/* 03: Fast UPI & Bank Payouts */}
              <div className="p-6 sm:p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-stone-200/90 dark:border-slate-800 space-y-3 text-left hover:border-emerald-400/50 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 shadow-2xs group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                      03
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {language === 'hi' ? 'सीधा UPI और बैंक भुगतान' : 'Fast UPI & Direct Bank Payouts'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold shrink-0 border border-emerald-500/30">
                    2–24H UPI / IMPS
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'जैसे ही आपका बैलेंस न्यूनतम ₹850 ($10) तक पहुँचता है, आप Google Pay, PhonePe, Paytm या बैंक IMPS के माध्यम से 2 से 24 घंटे में सीधा ट्रांसफर प्राप्त कर सकते हैं।'
                    : 'Get paid directly via PhonePe, Google Pay, Paytm, or bank transfer once your balance reaches just ₹850 ($10).'}
                </p>
              </div>

              {/* 04: Full Content Ownership */}
              <div className="p-6 sm:p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-stone-200/90 dark:border-slate-800 space-y-3 text-left hover:border-amber-400/50 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 shadow-2xs group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400">
                      04
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {language === 'hi' ? '100% सामग्री स्वामित्व व कॉपीराइट' : '100% Content Ownership & Rights'}
                    </h3>
                    <span className="font-script text-amber-700 dark:text-amber-300 text-lg sm:text-xl font-medium -rotate-2 select-none pointer-events-none hidden sm:inline-block animate-scribble-bob">
                      ~ your story, always your copyright 📜
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold shrink-0 border border-amber-500/30">
                    100% IP RETENTION
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा स्वामी बने रहते हैं। नागरिक को केवल एक गैर-अनन्य वितरण लाइसेंस मिलता है। आप अपनी सामग्री कहीं भी दोबारा प्रकाशित कर सकते हैं।'
                    : 'You keep 100% copyright over your videos, photos, and writing. Nagrik only gets permission to display your work to local readers.'}
                </p>
              </div>

            </div>

          </div>

        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          04. PRODUCT ECOSYSTEM: THE NAGRIK CIVIC NETWORK
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <ProductEcosystem onOpenAppModal={() => setShowQrModal(true)} />
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          05. TRANSPARENT EARNINGS: ESTIMATED REVENUE CALCULATOR & PAYOUT FLOW
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <EarningsCalculator />
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          06. TRUST & PUBLISHER JOURNEY: YOUR REPORTING. YOUR RIGHTS.
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <section id="trust" className="py-24 sm:py-32 border-t border-stone-200/80 dark:border-slate-800/80 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
          <div className="space-y-12 lg:space-y-16">
            
            {/* Editorial Section Header */}
            <div className="max-w-3xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-content-secondary">
                <span className="text-[#DE5227] font-bold text-base leading-none">—</span>
                <span>{language === 'hi' ? 'भरोसा और अधिकार' : 'Editorial Rigor & Citizen Trust'}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
                {language === 'hi'
                  ? 'पारदर्शी प्रणाली। वास्तविक पाठक। शून्य बिचौलिया।'
                  : 'Transparent metrics. Real readers. Zero intermediaries.'}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'नागरिक निष्पक्ष पत्रकारिता और स्थानीय सत्यापन पर आधारित है। यहां आपके काम की पूरी सुरक्षा और तुरंत पारदर्शी भुगतान की गारंटी है।'
                  : 'Every ground report on Nagrik is anchored by cryptographic geotagging, rigorous anti-fraud filtering, and guaranteed direct financial disbursals.'}
              </p>
            </div>

            {/* 3 Trust Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-muted dark:bg-surface-elevated text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-surface-muted dark:bg-surface-elevated text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                    GPS ANCHORED
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
                  {language === 'hi' ? 'जियोलोकेशन सत्यापन' : '5km Geofence Security'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'अपलोड के समय 5km GPS निर्देशांक स्वचालित रूप से सत्यापित होते हैं, जिससे फर्जी और भ्रामक रिपोर्टिंग पर पूरी तरह रोक लगती है।'
                    : 'Real-time GPS validation stamps footage to the exact 5km radius where the event occurred, eliminating misinformation and fabricated reporting.'}
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-muted dark:bg-surface-elevated text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <Eye className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-surface-muted dark:bg-surface-elevated text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                    ANTI-BOT METRICS
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
                  {language === 'hi' ? 'सत्यापित मानव व्यूज' : 'Verified Human Readership'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'नकली बॉट्स और क्लिक फ़ार्म को रोकने के लिए सत्यापन तकनीकों का उपयोग किया जाता है ताकि केवल वास्तविक नागरिक जुड़ाव का भुगतान हो।'
                    : 'Automated deduplication and uniqueness checks filter fake traffic, ensuring that contributor earnings represent genuine citizen reads.'}
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-muted dark:bg-surface-elevated text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <Landmark className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-surface-muted dark:bg-surface-elevated text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                    ZERO COMMISSION
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
                  {language === 'hi' ? 'प्रत्यक्ष वित्तीय निपटान' : 'Zero Platform Deduction'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? 'कोई छिपा हुआ प्लेटफ़ॉर्म शुल्क नहीं। आपकी स्वीकृत कमाई सीधे आपके बैंक या UPI पते पर स्थानांतरित की जाती है।'
                    : 'Zero platform escrow cuts or transaction penalties. The entire approved contributor balance goes straight to your UPI or bank account.'}
                </p>
              </div>

            </div>

            {/* 6-Step Publisher Roadmap */}
            <div className="pt-12 border-t border-edge-subtle/80 space-y-8">
              <div className="max-w-2xl space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-content-secondary">
                  {language === 'hi' ? '6-चरणीय रोडमैप' : 'The Publisher Roadmap'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
                  {language === 'hi' ? 'स्थानीय रिपोर्टर बनने का आसान रास्ता' : 'From first signup to automated monthly earnings.'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Step 1 */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-2 hover:border-stone-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-content-secondary">STEP 01</span>
                    <span className="font-script text-indigo-600 dark:text-indigo-300 text-base font-semibold rotate-3 select-none pointer-events-none animate-scribble-bob">
                      ~ takes 60 seconds ⏱️
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'निःशुल्क खाता बनाएं' : 'Create Contributor Account'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'मोबाइल नंबर या ईमेल से तुरंत 60 सेकंड में साइनअप करें। किसी पूर्व पत्रकारिता प्रमाण पत्र की आवश्यकता नहीं।'
                      : 'Sign up in under 60 seconds with your email or phone number. No prior press accreditation required.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-2 hover:border-stone-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-content-secondary">STEP 02</span>
                    <span className="text-xs font-mono text-content-tertiary uppercase">Locality Beat</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'अपना वार्ड या शहर चुनें' : 'Claim Your Locality Beat'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'अपने शहर या नगरपालिका वार्ड को प्राथमिक रिपोर्टिंग क्षेत्र के रूप में चुनें जहां आप सक्रिय रहते हैं।'
                      : 'Designate your municipal ward or neighborhood as your primary beat for targeted audience reach.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-2 hover:border-stone-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-content-secondary">STEP 03</span>
                    <span className="text-xs font-mono text-content-tertiary uppercase">Payout Setup</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'भुगतान विवरण जोड़ें' : 'Link UPI / Bank Account'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'त्वरित स्वचालित निकासी के लिए अपना PhonePe, Google Pay, Paytm या बैंक खाता विवरण जोड़ें।'
                      : 'Add your UPI address or bank account details so eligible earnings settle with zero delays.'}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-2 hover:border-stone-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-content-secondary">STEP 04</span>
                    <span className="text-xs font-mono text-content-tertiary uppercase">Publish</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'ग्राउंड रिपोर्ट्स अपलोड करें' : 'File Ground Reports'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'मौके के वीडियो, तस्वीरें और विवरण अपलोड करें। सिस्टम स्वचालित रूप से स्थान का सत्यापन करता है।'
                      : 'Submit video bytes, photos, or text notes via mobile companion or web creator studio.'}
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-card border border-edge-subtle space-y-2 hover:border-stone-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-content-secondary">STEP 05</span>
                    <span className="text-xs font-mono text-content-tertiary uppercase">Verification</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'जियोवेरिफिकेशन व समीक्षा' : 'Geoverification & Live Stream'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? '15-45 मिनट में त्वरित संपादकीय समीक्षा के बाद आपकी स्टोरी 5km दायरे के सभी नागरिकों तक पहुँच जाती है।'
                      : 'Editorial review and 5km geolocation confirmation ensure prompt, trusted hyper-local distribution.'}
                  </p>
                </div>

                {/* Step 6: Highlighted Goal State with Orange Accent */}
                <div className="p-6 rounded-2xl bg-surface-card dark:bg-surface-elevated border-2 border-[#DE5227] dark:border-[#DE5227]/80 space-y-2 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#C84318] dark:text-orange-400">STEP 06</span>
                    <div className="flex items-center gap-2">
                      <span className="font-script text-emerald-700 dark:text-emerald-400 text-lg font-bold -rotate-2 select-none pointer-events-none hidden sm:inline-block animate-scribble-float-1">~ ₹850 reached? Instant UPI! 💸</span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-orange-500/15 text-[#C84318] dark:text-orange-300 font-bold uppercase">Goal State</span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-950 dark:text-white font-serif">
                    {language === 'hi' ? 'स्वचालित भुगतान प्राप्त करें' : 'Receive Direct Payouts'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? '₹850 सीमा पार करते ही सीधे अपने UPI पते पर पारदर्शी भुगतान प्राप्त करें।'
                      : 'Request instant withdrawal once above the ₹850 threshold with disbursal in 2 to 24 hours.'}
                  </p>
                </div>

              </div>

              {/* Active City Ward Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-content-secondary">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE REPORTING HUBS:
                  </span>
                  {['Patna Ward 12', 'Varanasi Ghats', 'Lucknow Gomti Nagar', 'Jaipur Malviya Nagar', 'Indore Vijay Nagar', 'Pune Kothrud'].map((hub) => (
                    <span
                      key={hub}
                      className="px-3 py-1 rounded-lg bg-surface-muted text-slate-800 dark:text-slate-200 border border-stone-300/60 dark:border-slate-700/60 font-medium hover:border-[#DE5227] transition-colors flex items-center gap-1.5 cursor-default"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{hub}</span>
                    </span>
                  ))}
                </div>
                <span className="font-script text-teal-700 dark:text-teal-400 text-xl font-semibold rotate-2 select-none pointer-events-none hidden md:inline-block animate-scribble-sway">
                  ~ boots on the ground in 36 states 🇮🇳
                </span>
              </div>

            </div>

          </div>
        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          07. CLEAN FAQ ACCORDION
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <section id="faq" className="py-20 sm:py-28 lg:py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 sm:space-y-12 transition-colors duration-200">
          <div className="space-y-3 sm:space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-content-secondary">
              <span className="text-[#DE5227] font-bold text-base leading-none">—</span>
              <span>{language === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Everything you need to know.'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
              {language === 'hi'
                ? 'नागरिक कंट्रीब्यूटर कमाई, बौद्धिक संपदा और प्रकाशन प्रक्रियाओं के बारे में स्पष्ट और पारदर्शी उत्तर।'
                : 'Clear, transparent answers about Nagrik contributor earnings, non-exclusive rights, and publishing workflows.'}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4" role="region" aria-label="Frequently Asked Questions Accordion">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? 'bg-surface-card dark:bg-surface-card border-stone-300 dark:border-slate-700 shadow-sm ring-1 ring-[#DE5227]/20'
                      : 'bg-surface-card/80 dark:bg-surface-card/70 border-stone-200/90 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    id={`faq-question-${idx}`}
                    aria-controls={`faq-answer-${idx}`}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-950 dark:text-white cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DE5227]"
                  >
                    <span className="group-hover:text-[#DE5227] dark:group-hover:text-orange-400 transition-colors font-serif">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#DE5227] border-[#DE5227] text-white rotate-180 shadow-xs'
                        : 'border-stone-200 dark:border-slate-700 bg-surface-muted dark:bg-surface-elevated text-slate-600 dark:text-slate-400 group-hover:border-stone-400 rotate-0'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-stone-200/60 dark:border-slate-800/80 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Handwritten Community Note at Bottom of FAQ */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left select-none pointer-events-none">
            <span className="font-script text-rose-600 dark:text-rose-400 text-xl sm:text-2xl font-semibold -rotate-2 animate-scribble-sway">
              ~ still have doubts? real editors answer within 24h 💬
            </span>
            <span className="font-script text-content-secondary text-lg rotate-1 hidden sm:inline-block">
              100% open policies, no asterisks
            </span>
          </div>

        </section>
      </RevealOnScroll>



      {/* ════════════════════════════════════════════════════════════════════
          MODAL: QR CODE QUICK SCAN MODAL FOR CONSUMER APP
          ════════════════════════════════════════════════════════════════════ */}
      {showQrModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQrModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div className="bg-surface-card dark:bg-surface-card rounded-2xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl relative border border-stone-200/90 dark:border-slate-800 text-slate-900 dark:text-white animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-content-tertiary hover:text-slate-700 dark:hover:text-white font-bold text-lg p-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#DE5227] rounded-md"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-surface-muted dark:bg-surface-elevated text-slate-800 dark:text-slate-100 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 id="qr-modal-title" className="text-xl font-bold font-serif">
              {language === 'hi' ? 'नागरिक ऐप डाउनलोड' : 'Download Nagrik App'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'अपने फोन के कैमरे से इस क्यूआर कोड को स्कैन करें और 100% निःशुल्क ऐप इंस्टॉल करें।'
                : 'Scan this QR code with your mobile camera to install the 100% free consumer app.'}
            </p>

            <div className="p-4 bg-surface-card dark:bg-surface-card rounded-2xl border-2 border-dashed border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center space-y-2">
              <div className="w-36 h-36 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-xs font-mono text-content-secondary">Scan to download APK</span>
            </div>

            <div className="p-3 bg-stone-100/70 dark:bg-surface-muted rounded-2xl border border-stone-200 dark:border-slate-800">
              <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                v1.2.0 Production Release
              </div>
              <div className="text-xs text-content-secondary mt-0.5 font-mono">
                Direct APK / Google Play / App Store
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
