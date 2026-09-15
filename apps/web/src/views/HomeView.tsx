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
  Sparkles,
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

  // FAQs curated from verified product documentation
  const faqs = [
    {
      q: language === 'hi' ? 'नागरिक कंट्रीब्यूटर कमाई की गणना कैसे करता है?' : 'How does Nagrik calculate contributor earnings?',
      a: language === 'hi'
        ? 'नागरिक प्रत्येक 1,000 सत्यापित व्यू पर $1.50 (लगभग ₹129) की पारदर्शी फ्लैट दर से भुगतान करता है। कोई सब्सक्राइबर या वॉच-टाइम थ्रेशोल्ड नहीं है। आपकी पहली प्रकाशित व सत्यापित स्टोरी और पहले व्यू से ही अनुमानित कमाई जुड़ने लगती है।'
        : 'Nagrik pays an estimated flat rate of $1.50 (~₹129 INR) per 1,000 verified reads. There are zero subscriber requirements and zero watch-time gates. Monetization begins from your very first verified view on your first published ground report.'
    },
    {
      q: language === 'hi' ? 'न्यूनतम भुगतान सीमा (Minimum Payout Threshold) क्या है?' : 'What is the minimum payout threshold?',
      a: language === 'hi'
        ? 'न्यूनतम निकासी सीमा केवल ₹850 ($10 USD) है। जैसे ही आपका स्वीकृत बैलेंस इस आंकड़े तक पहुँचता है, आप तत्काल निकासी का अनुरोध कर सकते हैं।'
        : 'The minimum withdrawal threshold is ₹850 ($10 USD). Once your approved contributor balance reaches this amount, you can initiate a direct withdrawal.'
    },
    {
      q: language === 'hi' ? 'भुगतान कैसे और कब प्राप्त होता है?' : 'How do I receive payouts and what is the processing time?',
      a: language === 'hi'
        ? 'भुगतान सीधे आपके UPI VPA (Google Pay, PhonePe, Paytm, BHIM) या NEFT/IMPS बैंक ट्रांसफर के माध्यम से किया जाता है। UPI निकासी सामान्यतः 2 से 24 घंटों में और बैंक ट्रांसफर 24 से 48 व्यावसायिक घंटों में प्रोसेस हो जाते हैं।'
        : 'Disbursals are sent directly to your UPI address (PhonePe, Google Pay, Paytm, BHIM) or via NEFT/IMPS direct bank transfer. UPI transfers settle within 2 to 24 hours, and bank transfers settle within 24 to 48 business hours with zero platform deduction.'
    },
    {
      q: language === 'hi' ? 'नागरिक पर कौन रिपोर्टर या स्ट्रिंगर बन सकता है?' : 'Who can become a reporter or stringer?',
      a: language === 'hi'
        ? 'कोई भी नागरिक, स्वतंत्र पत्रकार, कॉलेज छात्र या स्थानीय कैमरामैन जो अपने वार्ड या शहर की वास्तविक घटनाओं की ग्राउंड रिपोर्टिंग करना चाहता है, वह 60 सेकंड में निःशुल्क पंजीकरण कर सकता है।'
        : 'Any citizen, independent journalist, student, or local videographer who wants to report verifiable eyewitness stories from their city, ward, or neighborhood can sign up in 60 seconds for free.'
    },
    {
      q: language === 'hi' ? 'संपादकीय व जीपीएस समीक्षा में कितना समय लगता है?' : 'How long does editorial and GPS verification take?',
      a: language === 'hi'
        ? 'हमारा स्वचालित जीपीएस जियोफेंसिंग इंजन अपलोड होते ही 5km दायरे का सत्यापन कर लेता है। संपादकीय तथ्य-जांच और सामग्री समीक्षा सामान्यतः 15 से 45 मिनट के भीतर पूरी हो जाती है।'
        : 'Our automated GPS geofencing verifies the 5km radius instantly upon upload. Editorial fact-checking and policy review are completed within 15 to 45 minutes before live distribution.'
    },
    {
      q: language === 'hi' ? 'अपलोड की गई सामग्री का कॉपीराइट किसके पास रहता है?' : 'Who owns the content I upload?',
      a: language === 'hi'
        ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा और कॉपीराइट स्वामी बने रहते हैं। नागरिक को केवल अपने वेब और ऐप पर सामग्री प्रसारित करने का गैर-अनन्य (non-exclusive) वितरण लाइसेंस मिलता है।'
        : 'You retain 100% intellectual property rights and full copyright over your reports, videos, and photos. Nagrik only receives a non-exclusive license to host and stream your work to local readers.'
    },
    {
      q: language === 'hi' ? 'हाइपरलोकल जियोटैगिंग कैसे काम करती है?' : 'How does hyperlocal geotagging work?',
      a: language === 'hi'
        ? 'जब आप स्टोरी सबमिट करते हैं, तो सिस्टम स्वचालित रूप से आपके मोबाइल या ब्राउज़र से GPS निर्देशांक (अक्षांश/देशांतर) लेकर स्टोरी के साथ 5km वार्ड का टैग लगा देता है, ताकि केवल वास्तविक स्थानीय दर्शक इसे देख सकें।'
        : 'When you submit a report, GPS coordinates are validated and stamped into the submission metadata, ensuring your story is delivered directly to readers located within that 5km locality radius.'
    },
    {
      q: language === 'hi' ? 'क्या नागरिक प्लेटफ़ॉर्म का उपयोग करने के लिए कोई शुल्क है?' : 'Is there any fee to use Nagrik Creator Studio?',
      a: language === 'hi'
        ? 'बिल्कुल नहीं। नागरिक क्रिएटर स्टूडियो 100% निःशुल्क है। कोई प्लेटफ़ॉर्म शुल्क नहीं, कोई छिपे हुए शुल्क नहीं और कोई मासिक सदस्यता नहीं है।'
        : 'No. Nagrik Creator Studio is 100% free to use. There are zero platform fees, zero subscription costs, and zero hidden deductions from your contributor earnings.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-[#DE5227] selection:text-white">

      {/* ════════════════════════════════════════════════════════════════════
          01. HERO: DUAL-DEVICE SHOWCASE (CREATOR STUDIO + NAGRIK MOBILE APP)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative isolate pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        
        {/* Extremely subtle geographic elevation contours & tactile editorial illumination */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Soft ambient radial warmth */}
          <div className="absolute top-[8%] right-[4%] w-[680px] h-[680px] bg-gradient-to-tr from-[#EADBCC]/55 via-[#F5EAE0]/30 to-transparent rounded-full blur-3xl dark:from-orange-950/15 dark:via-slate-900/10" />
          
          {/* Abstract Geographic Elevation Contours (Ultra-faint 0.5px line, 5.5% opacity) */}
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
            
            {/* Level 1: Refined Editorial Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 dark:bg-slate-800/80 border border-stone-300/80 dark:border-slate-700/60 text-xs font-mono font-bold tracking-normal text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#DE5227] animate-pulse" aria-hidden="true" />
              <span>
                {language === 'hi'
                  ? 'स्थानीय ग्राउंड रिपोर्टिंग • स्वतंत्र पत्रकारिता'
                  : 'Hyperlocal Ground Journalism • Creator Studio'}
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
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-xl font-normal">
              {language === 'hi'
                ? 'नागरिक क्रिएटर स्टूडियो के ज़रिए तस्वीरें, वीडियो और स्थानीय स्टोरीज़ प्रकाशित करें। अपने क्षेत्र के असली दर्शकों तक पहुँचें और पारदर्शी भुगतान प्राप्त करें।'
                : 'Publish photos, videos and local stories through Nagrik Creator Studio. Reach real audiences in your area and earn through transparent payouts.'}
            </p>

            {/* Level 4: Primary & Secondary Action Cluster */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <Link
                href="/creator"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white font-bold text-base transition-all shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#story"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base hover:bg-stone-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                  <Play className="w-2.5 h-2.5 fill-slate-700 dark:fill-slate-300 ml-0.5" />
                </div>
                <span>{language === 'hi' ? 'देखें यह कैसे काम करता है' : 'Explore Creator Studio'}</span>
              </a>
            </div>

            {/* Level 5: Credibility Proof Bar with Structural Hierarchy */}
            <div className="pt-5 border-t border-stone-300/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-left">
              {/* Proof 1 */}
              <div className="flex items-center gap-2.5 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>स्थानीय दर्शक<br />5km वार्ड</> : <>5km Ward<br />Audience</>}
                </div>
              </div>

              {/* Proof 2 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0 font-serif font-black text-sm">
                  ₹
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white">$1.50 CPM</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {language === 'hi' ? 'प्रति 1,000 व्यू' : 'flat payout rate'}
                  </div>
                </div>
              </div>

              {/* Proof 3 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-1 sm:pr-2 sm:border-r sm:border-stone-300/80 dark:sm:border-slate-800/90">
                <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <Landmark className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>सीधा UPI /<br />बैंक ट्रांसफर</> : <>Direct UPI /<br />Bank Payouts</>}
                </div>
              </div>

              {/* Proof 4 */}
              <div className="flex items-center gap-2.5 sm:pl-3">
                <div className="p-1.5 rounded-lg bg-stone-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">
                  {language === 'hi' ? <>100% बौद्धिक<br />स्वामित्व</> : <>100% Content<br />Copyright</>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Creator Studio Product Visualization (approx 55%) */}
          <div className="w-full lg:w-[55%] xl:w-[56%] relative pt-2 sm:pt-4 lg:pt-6 flex flex-col items-center lg:items-end justify-center">

            {/* Architectural Heritage Riverfront Skyline Backdrop */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-[600px] pointer-events-none opacity-80 dark:opacity-25 z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen [mask-image:radial-gradient(circle_at_70%_60%,black_35%,transparent_72%)]">
              <img
                src="/varanasi-ghats-backdrop.jpg"
                alt="Indian Heritage Ghats Architecture"
                className="w-full h-full object-cover object-bottom-right scale-115 filter sepia-[0.3] contrast-110"
              />
            </div>

            {/* Dual Device Container */}
            <div className="relative z-10 w-full flex justify-center lg:justify-end items-end pr-2 sm:pr-6 lg:pr-8 pb-1">
              
              {/* ── DEVICE 1: LAPTOP MOCKUP (CREATOR STUDIO DASHBOARD) ── */}
              <div className="w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[690px] xl:max-w-[730px] rounded-t-2xl bg-[#1E2430] p-2.5 sm:p-3 shadow-2xl border border-slate-700/60 relative">
                
                {/* Webcam Notch & Living Studio Status Light */}
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300" aria-label="Studio Engine Status: Live">
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
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          simStep === stepIdx ? 'w-4 bg-[#DE5227]' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Laptop Display Screen */}
                <div className="rounded-lg bg-[#FAF9F6] text-slate-900 overflow-hidden font-sans text-left border border-slate-200/90 shadow-inner">
                  
                  {/* Studio Topbar */}
                  <div className="px-3 py-2 bg-white border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md bg-[#DE5227] text-white font-serif font-black text-[10px] flex items-center justify-center">
                        N
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900">
                        Nagrik Creator Studio
                      </span>
                      <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Patna Ward 12
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-3 h-3 text-slate-400" />
                      <div className="relative">
                        <Bell className="w-3 h-3 text-slate-600" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DE5227] absolute -top-0.5 -right-0.5" />
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
                    <div className="hidden sm:block w-24 sm:w-26 bg-white border-r border-slate-200/70 p-2 space-y-0.5 text-[9px] font-medium text-slate-600 shrink-0">
                      <div className="bg-slate-100 text-slate-900 font-bold rounded-md px-2 py-1 flex items-center gap-1.5">
                        <LayoutDashboard className="w-2.5 h-2.5 text-[#DE5227]" />
                        <span>Dashboard</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <FileEdit className="w-2.5 h-2.5" />
                        <span>Create Report</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <FileText className="w-2.5 h-2.5" />
                        <span>My Reports</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <Wallet className="w-2.5 h-2.5" />
                        <span>Earnings</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <BarChart3 className="w-2.5 h-2.5" />
                        <span>Analytics</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-slate-900 transition">
                        <Settings className="w-2.5 h-2.5" />
                        <span>Settings</span>
                      </div>
                    </div>

                    {/* Main Studio Viewport */}
                    <div className="flex-1 p-2 sm:p-2.5 lg:p-3 space-y-2 bg-[#FAF9F6] overflow-hidden pr-2 sm:pr-3">
                      
                      {/* Dynamic Simulation Ticker Toast */}
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-md flex items-center justify-between text-xs font-mono shadow-xs border border-slate-800" role="status" aria-live="polite">
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
                              <span className="text-orange-100 font-semibold truncate">Stage 4: $1.50 CPM Disbursed • UPI Payout Ready</span>
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
                          <div className="text-[10.5px] sm:text-xs font-bold font-serif text-slate-900 truncate">
                            Good morning, Rohan
                          </div>
                          <div className="text-[7.5px] sm:text-[8px] text-slate-500 truncate">
                            Active ward: Digha Ghat • 5km radius
                          </div>
                        </div>
                        <button className="px-2 sm:px-2.5 py-1 rounded-md bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-[8px] sm:text-[9px] flex items-center gap-1 shadow-xs shrink-0">
                          <Plus className="w-2.5 h-2.5" />
                          <span>New Report</span>
                        </button>
                      </div>

                      {/* 4 Metric Cards (2 cols on mobile, 4 on desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 pr-2 sm:pr-8 lg:pr-10">
                        <div className="bg-white rounded-md p-1 sm:p-1.5 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-left">
                          <div className="text-[6.5px] sm:text-[7px] text-slate-400 uppercase font-mono font-bold">Total Views</div>
                          <div className="text-[10px] sm:text-[11px] font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '126,840' : '125,430'}
                          </div>
                          <div className="text-[6.5px] sm:text-[7px] text-emerald-600 font-bold font-mono">
                            {simStep >= 2 ? '↑ 14%' : '↑ 12%'}
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-1 sm:p-1.5 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-left">
                          <div className="text-[6.5px] sm:text-[7px] text-slate-400 uppercase font-mono font-bold">Estimated</div>
                          <div className="text-[10px] sm:text-[11px] font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '$189.31' : '$187.20'}
                          </div>
                          <div className="text-[6.5px] sm:text-[7px] text-emerald-600 font-bold font-mono">
                            {simStep >= 2 ? '+$2.11' : '↑ 8%'}
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-1 sm:p-1.5 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-left">
                          <div className="text-[6.5px] sm:text-[7px] text-slate-400 uppercase font-mono font-bold">Published</div>
                          <div className="text-[10px] sm:text-[11px] font-black text-slate-900 font-mono transition-all">
                            {simStep >= 2 ? '43' : '42'}
                          </div>
                          <div className="text-[6.5px] sm:text-[7px] text-slate-400 font-mono">Verified</div>
                        </div>

                        <div className="bg-white rounded-md p-1 sm:p-1.5 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-left">
                          <div className="text-[6.5px] sm:text-[7px] text-slate-400 uppercase font-mono font-bold">Threshold</div>
                          <div className="text-[10px] sm:text-[11px] font-black text-emerald-600 font-mono">₹850</div>
                          <div className="text-[6.5px] sm:text-[7px] text-emerald-600 font-bold font-mono">✓ Ready</div>
                        </div>
                      </div>

                      {/* Recent Reports List with Morphing Status Badge */}
                      <div className="bg-white rounded-md border border-slate-200/70 p-1.5 sm:p-2 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] pr-2 sm:pr-6 lg:pr-8">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[8.5px] sm:text-[9px]">
                          <span className="font-bold text-slate-900">Recent Reports</span>
                          <span className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-0.5 cursor-pointer">
                            View all →
                          </span>
                        </div>

                        {/* Report Row 1 (Simulated Active Item) */}
                        <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] gap-1.5 sm:gap-2 py-0.5 transition-colors duration-200 bg-orange-50/40 rounded px-1 -mx-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=120&auto=format&fit=crop&q=80"
                              alt="Road Repair"
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
                                Road Repair Near Digha Chowk
                              </div>
                              <div className="text-slate-400 text-[6.5px] sm:text-[7px] flex items-center gap-1 truncate">
                                <span>Patna</span>
                                <span>•</span>
                                <span className="text-[#DE5227] font-mono font-semibold">5km Ward</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-slate-500 font-mono flex items-center gap-0.5">
                              <Eye className="w-2 h-2" /> {simStep >= 2 ? '1.4K reads' : '0 reads'}
                            </span>
                            {simStep === 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60 font-bold text-[6.5px] sm:text-[7px]">
                                Submitted
                              </span>
                            )}
                            {simStep === 1 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 font-bold text-[6.5px] sm:text-[7px] flex items-center gap-0.5">
                                <Clock className="w-2 h-2" /> In Review
                              </span>
                            )}
                            {simStep >= 2 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold text-[6.5px] sm:text-[7px] flex items-center gap-0.5">
                                <Check className="w-2 h-2" /> Published
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Report Row 2 */}
                        <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] gap-1.5 sm:gap-2 py-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80"
                              alt="Water Supply"
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
                                Water Pipeline Upgrades
                              </div>
                              <div className="text-slate-400 text-[6.5px] sm:text-[7px]">
                                Varanasi • 1d ago
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-slate-500 font-mono flex items-center gap-0.5">
                              <Eye className="w-2 h-2" /> 8.7K
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold text-[6.5px] sm:text-[7px]">
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
              <div className="absolute -right-3 sm:-right-1 lg:right-0 bottom-0 z-20 w-[115px] sm:w-[136px] lg:w-[144px] h-[235px] sm:h-[280px] lg:h-[295px] rounded-[20px] sm:rounded-[24px] bg-slate-950 p-1 sm:p-1.5 border-2 sm:border-[2.5px] border-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col">
                
                {/* Dynamic Island Notch */}
                <div className="w-9 h-2 bg-black rounded-full mx-auto mb-1 flex items-center justify-end pr-1 shrink-0">
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                </div>

                {/* Phone Screen */}
                <div className="rounded-[18px] bg-white overflow-hidden text-left font-sans flex flex-col flex-1 border border-slate-100 shadow-inner">
                  
                  {/* App Header */}
                  <div className="px-2 py-1 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-xs bg-[#DE5227] text-white font-sans font-black text-[7px] flex items-center justify-center">
                        N
                      </div>
                      <span className="font-sans font-bold text-[9px] text-slate-900 tracking-tight">
                        Nagrik
                      </span>
                    </div>
                    <Search className="w-2.5 h-2.5 text-slate-500" />
                  </div>

                  {/* App Tabs */}
                  <div className="px-2 py-0.5 bg-white flex items-center gap-2.5 text-[7px] font-semibold border-b border-slate-100 shrink-0">
                    <span className="text-[#DE5227] border-b-2 border-[#DE5227] pb-0.5 font-bold">
                      For You
                    </span>
                    <span className="text-slate-400">Nearby (5km)</span>
                    <span className="text-slate-400">Saved</span>
                  </div>

                  {/* Main Story Reel/Card (Indian Street Scene) */}
                  <div className="flex-1 relative overflow-hidden bg-slate-900">
                    <img
                      src="/cleaner-streets-phone.jpg"
                      alt="Cleaner Streets"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Story Title & Meta Overlay */}
                    <div className="absolute bottom-1.5 left-2 right-2 text-white space-y-0.5">
                      <div className="font-bold text-[8.5px] leading-tight font-serif">
                        Cleaner Streets<br />Brighter Neighborhoods
                      </div>
                      <div className="text-[6px] text-slate-300 font-mono">
                        Patna Ward 12 • 2h ago
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Navigation Bar */}
                  <div className="px-2 py-1 bg-white border-t border-slate-100 flex items-center justify-around text-slate-500 shrink-0">
                    <div className="text-slate-800">
                      <Home className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <FileText className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                    {/* Floating Center Orange + Button */}
                    <div className="w-4 h-4 rounded-full bg-[#DE5227] text-white flex items-center justify-center font-bold text-[9px] shadow-xs">
                      <Plus className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                    <div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
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
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                <span className="text-slate-400 font-bold text-base leading-none">—</span>
                <span>{language === 'hi' ? 'नागरिक क्यों चुनें' : 'WHY REPORTERS CHOOSE NAGRIK'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-[1.08]">
                {language === 'hi'
                  ? 'ज़मीनी रिपोर्टिंग करने वालों के लिए विशेष रूप से निर्मित।'
                  : 'Built for people who report from the ground.'}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'पारंपरिक डिजिटल प्लेटफ़ॉर्म स्थानीय मुद्दों को राष्ट्रीय शोर के नीचे दबा देते हैं और रचनाकारों की कमाई को कठिन एल्गोरिदम की शर्तों में बांध देते हैं। नागरिक को पहले दिन से ज़मीनी संवाददाताओं को सीधा अधिकार देने के लिए तैयार किया गया है।'
                  : 'Legacy platforms bury local reporting under national noise and lock monetization behind impossible barriers. Nagrik gives ground correspondents direct distribution, immediate monetization, and complete intellectual ownership.'}
              </p>

              {/* Editorial Pull Quote */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 shadow-xs text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
                <span className="text-[#DE5227] font-sans font-bold not-italic mr-1.5 text-base">&ldquo;</span>
                {language === 'hi'
                  ? 'हम एल्गोरिदम से स्थानीय आवाज़ों को दबाते नहीं हैं। हम उन्हें सीधे उसी 5km दायरे में पहुँचाते हैं जहाँ वे सबसे अधिक मायने रखती हैं।'
                  : 'We do not algorithmically suppress local voices under national clickbait. We deliver eyewitness journalism directly to the exact 5km ward where it matters most.'}
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
            </div>

            {/* Right Column: Numbered Editorial Thesis Flow */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10 divide-y divide-stone-200/80 dark:divide-slate-800/80">
              
              {/* 01: Monetize from Day One */}
              <div className="pt-8 first:pt-0 space-y-3 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      01
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? 'पहले दिन से कमाई (Day-One Monetization)' : 'Monetize from Day One'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-[#DE5227] dark:text-orange-400 font-mono text-[10px] sm:text-xs font-bold shrink-0 border border-[#DE5227]/20">
                    FLAT $1.50 CPM
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-10 sm:pl-11 font-normal">
                  {language === 'hi'
                    ? 'कोई 1,000 सब्सक्राइबर या 4,000 घंटे की वॉच-टाइम की बाध्यता नहीं। आपकी पहली प्रकाशित स्टोरी और पहले सत्यापित व्यू से ही $1.50 CPM की दर से पारदर्शी कमाई शुरू हो जाती है।'
                    : 'Zero subscriber requirements and zero watch-time gates. Every eligible verified read generates earnings at a flat $1.50 CPM (~₹129 INR per 1,000 reads) from your very first report.'}
                </p>
              </div>

              {/* 02: Hyperlocal Geotagging */}
              <div className="pt-8 space-y-3 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-400 dark:text-slate-600">
                      02
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? '5km हाइपरलोकल जियोटैगिंग' : 'Hyperlocal Geotagging & Ward Verification'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] sm:text-xs font-bold shrink-0 border border-stone-200 dark:border-slate-700">
                    5KM GEOFENCE
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-10 sm:pl-11 font-normal">
                  {language === 'hi'
                    ? 'प्रत्येक अपलोड के साथ स्वचालित 5km GPS निर्देशांक सुरक्षित रूप से स्टैम्प किए जाते हैं। आपकी रिपोर्ट केवल उन स्थानीय नागरिकों तक पहुंचाई जाती है जिनके लिए वह सीधे तौर पर प्रासंगिक है।'
                    : 'Automated 5km GPS metadata is validated on submission. Stories are distributed directly to neighbors and civic stakeholders located within that locality radius.'}
                </p>
              </div>

              {/* 03: Fast UPI & Bank Payouts */}
              <div className="pt-8 space-y-3 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-400 dark:text-slate-600">
                      03
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? 'सीधा UPI और बैंक भुगतान' : 'Fast UPI & Direct Bank Disbursals'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] sm:text-xs font-bold shrink-0 border border-stone-200 dark:border-slate-700">
                    2–24H UPI / IMPS
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-10 sm:pl-11 font-normal">
                  {language === 'hi'
                    ? 'जैसे ही आपका बैलेंस न्यूनतम ₹850 ($10) तक पहुँचता है, आप Google Pay, PhonePe, Paytm या बैंक IMPS के माध्यम से 2 से 24 घंटे में सीधा ट्रांसफर प्राप्त कर सकते हैं।'
                    : 'Direct disbursals via PhonePe, Google Pay, Paytm, BHIM, or direct NEFT/IMPS bank transfer once your verified balance reaches the modest ₹850 ($10) threshold.'}
                </p>
              </div>

              {/* 04: Full Content Ownership */}
              <div className="pt-8 space-y-3 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-400 dark:text-slate-600">
                      04
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? '100% सामग्री स्वामित्व व कॉपीराइट' : 'Full Content Ownership & Non-Exclusive Rights'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] sm:text-xs font-bold shrink-0 border border-stone-200 dark:border-slate-700">
                    100% IP RETENTION
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-10 sm:pl-11 font-normal">
                  {language === 'hi'
                    ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा स्वामी बने रहते हैं। नागरिक को केवल एक गैर-अनन्य वितरण लाइसेंस मिलता है। आप अपनी सामग्री कहीं भी दोबारा प्रकाशित कर सकते हैं।'
                    : 'You retain 100% intellectual property ownership and copyright over your footage, photos, and writing. Nagrik receives only a non-exclusive streaming license.'}
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
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                <span className="text-slate-400 font-bold text-base leading-none">—</span>
                <span>{language === 'hi' ? 'भरोसा और अधिकार' : 'EDITORIAL RIGOR & CITIZEN TRUST'}</span>
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
              
              <div className="p-7 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
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

              <div className="p-7 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <Eye className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
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

              <div className="p-7 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold">
                    <Landmark className="w-6 h-6 text-[#DE5227]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
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
            <div className="pt-12 border-t border-stone-200/80 dark:border-slate-800/80 space-y-8">
              <div className="max-w-2xl space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? '6-चरणीय रोडमैप' : 'THE PUBLISHER ROADMAP'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">
                  {language === 'hi' ? 'स्थानीय रिपोर्टर बनने का आसान रास्ता' : 'From first signup to automated monthly earnings.'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Step 1 */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">STEP 01</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Fast Signup</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'निःशुल्क खाता बनाएं' : 'Create Contributor Account'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'मोबाइल नंबर या ईमेल से तुरंत 60 सेकंड में साइनअप करें। किसी पूर्व पत्रकारिता प्रमाण पत्र की आवश्यकता नहीं।'
                      : 'Sign up in under 60 seconds with your email or phone number. No prior press accreditation required.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">STEP 02</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Locality Beat</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'अपना वार्ड या शहर चुनें' : 'Claim Your Locality Beat'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'अपने शहर या नगरपालिका वार्ड को प्राथमिक रिपोर्टिंग क्षेत्र के रूप में चुनें जहां आप सक्रिय रहते हैं।'
                      : 'Designate your municipal ward or neighborhood as your primary beat for targeted audience reach.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">STEP 03</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Payout Setup</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'भुगतान विवरण जोड़ें' : 'Link UPI / Bank Account'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'त्वरित स्वचालित निकासी के लिए अपना PhonePe, Google Pay, Paytm या बैंक खाता विवरण जोड़ें।'
                      : 'Add your UPI address or bank account details so eligible earnings settle with zero delays.'}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">STEP 04</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Publish</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'ग्राउंड रिपोर्ट्स अपलोड करें' : 'File Ground Reports'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? 'मौके के वीडियो, तस्वीरें और विवरण अपलोड करें। सिस्टम स्वचालित रूप से स्थान का सत्यापन करता है।'
                      : 'Submit video bytes, photos, or text notes via mobile companion or web creator studio.'}
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-stone-200/80 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">STEP 05</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Verification</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-slate-950 dark:text-white">
                    {language === 'hi' ? 'जियोवेरिफिकेशन व समीक्षा' : 'Geoverification & Live Stream'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? '15-45 मिनट में त्वरित संपादकीय समीक्षा के बाद आपकी स्टोरी 5km दायरे के सभी नागरिकों तक पहुँच जाती है।'
                      : 'Editorial review and 5km geolocation confirmation ensure prompt, trusted hyper-local distribution.'}
                  </p>
                </div>

                {/* Step 6: Highlighted Goal State with Orange Accent */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#151F30] border-2 border-[#DE5227] dark:border-[#DE5227]/80 space-y-2 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#DE5227] dark:text-orange-400">STEP 06</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DE5227]/20 text-[#DE5227] dark:text-orange-300 font-bold uppercase">Goal State</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950 dark:text-white font-serif">
                    {language === 'hi' ? 'स्वचालित भुगतान प्राप्त करें' : 'Receive Direct Payouts'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'hi'
                      ? '₹850 सीमा पार करते ही सीधे अपने UPI पते पर पारदर्शी भुगतान प्राप्त करें।'
                      : 'Request instant withdrawal once above the ₹850 threshold with disbursal in 2 to 24 hours.'}
                  </p>
                </div>

              </div>

              {/* Active City Ward Indicators */}
              <div className="pt-6 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300">ACTIVE REPORTING HUBS:</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Patna Ward 12</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Varanasi Ghats</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Lucknow Gomti Nagar</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Jaipur Malviya Nagar</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Indore Vijay Nagar</span>
                <span className="px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">Pune Kothrud</span>
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
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 font-bold text-base leading-none">—</span>
              <span>{language === 'hi' ? 'सामान्य प्रश्न' : 'FREQUENTLY ASKED QUESTIONS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Everything you need to know.'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {language === 'hi'
                ? 'नागरिक कंट्रीब्यूटर कमाई, बौद्धिक संपदा और प्रकाशन प्रक्रियाओं के बारे में स्पष्ट और पारदर्शी उत्तर।'
                : 'Clear, transparent answers about Nagrik contributor earnings, non-exclusive rights, and publishing workflows.'}
            </p>
          </div>

          <div className="divide-y divide-stone-200/80 dark:divide-slate-800/80">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-base sm:text-lg text-slate-950 dark:text-white cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-slate-900 dark:text-white' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-3 pr-2 sm:pr-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          08. FINAL HIGH-CONVERSION EDITORIAL CTA
          ════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" distance={28}>
        <section className="py-20 sm:py-28 lg:py-32 bg-[#0B0F17] text-white text-center border-t border-slate-800 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          
          {/* Subtle Warm Amber Glow Behind Main Title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#DE5227]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 relative z-10">
            
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-400">
                <span className="text-slate-500 font-bold text-base leading-none">—</span>
                <span>{language === 'hi' ? 'शुरुआत करें' : 'GET STARTED TODAY'}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
                {language === 'hi'
                  ? 'आपकी अगली स्थानीय खबर यहीं से शुरू होती है।'
                  : 'Your next local story starts here.'}
              </h2>
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                {language === 'hi'
                  ? 'अपना निःशुल्क खाता बनाएं, पहली ग्राउंड रिपोर्ट अपलोड करें और अपने शहर के विश्वसनीय रिपोर्टर बनें।'
                : 'Create your account, file your first ground report, and build your local reporting reputation with fair day-one payouts.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/creator"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 text-center"
              >
                {language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}
              </Link>
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-semibold text-base hover:bg-slate-800 transition cursor-pointer text-center"
              >
                {language === 'hi' ? 'मोबाइल ऐप डाउनलोड' : 'Download Mobile App'}
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400 pt-4 flex flex-wrap items-center justify-center gap-4">
              <span>● No subscriber minimums</span>
              <span>● 60-second registration</span>
              <span>● Direct UPI & Bank payouts</span>
              <span>● 100% content ownership</span>
            </div>

          </div>
        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: QR CODE QUICK SCAN MODAL FOR CONSUMER APP
          ════════════════════════════════════════════════════════════════════ */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl relative border border-stone-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg p-1 cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif">
              {language === 'hi' ? 'नागरिक ऐप डाउनलोड' : 'Download Nagrik App'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'अपने फोन के कैमरे से इस क्यूआर कोड को स्कैन करें और 100% निःशुल्क ऐप इंस्टॉल करें।'
                : 'Scan this QR code with your mobile camera to install the 100% free consumer app.'}
            </p>

            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-stone-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2">
              <div className="w-36 h-36 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Scan to download APK</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-[#0B0F17] rounded-2xl border border-stone-200 dark:border-slate-800">
              <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                v1.2.0 Production Release
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Direct APK / Google Play / App Store
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
