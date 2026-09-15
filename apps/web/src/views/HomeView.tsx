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
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollProductStory } from '../components/home/ScrollProductStory';
import { ProductEcosystem } from '../components/home/ProductEcosystem';
import { EarningsCalculator } from '../components/home/EarningsCalculator';

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
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // App Download Modal State
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // FAQs verified from actual terms and contributor billing documentation
  const faqs = [
    {
      q: language === 'hi' ? 'नागरिक कंट्रीब्यूटर कमाई की गणना कैसे करता है?' : 'How does Nagrik calculate contributor earnings?',
      a: language === 'hi'
        ? 'नागरिक प्रत्येक 1,000 सत्यापित व्यू पर $1.50 (लगभग ₹129) की पारदर्शी दर से भुगतान करता है। कोई सब्सक्राइबर या वॉच-टाइम थ्रेशोल्ड नहीं है। आपकी पहली प्रकाशित व सत्यापित स्टोरी और पहले व्यू से ही अनुमानित कमाई जुड़ने लगती है।'
        : 'Nagrik pays an estimated flat rate of $1.50 (~₹129 INR) per 1,000 verified reads. There are zero subscriber requirements and zero watch-time gates. Monetization begins from your very first verified view on your first published ground report.'
    },
    {
      q: language === 'hi' ? 'न्यूनतम भुगतान सीमा (Minimum Payout Threshold) क्या है?' : 'What is the minimum payout threshold?',
      a: language === 'hi'
        ? 'न्यूनतम निकासी सीमा $10.00 USD (लगभग ₹850 INR) है। जैसे ही आपका स्वीकृत बैलेंस इस आंकड़े तक पहुँचता है, आप तत्काल निकासी का अनुरोध कर सकते हैं।'
        : 'The minimum withdrawal threshold is $10.00 USD (approx. ₹850 INR). Once your approved contributor balance reaches this amount, you can initiate a direct withdrawal.'
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
        ? 'कोई भी नागरिक, स्वतंत्र पत्रकार, कॉलेज छात्र या स्थानीय कैमरामैन जो अपने वार्ड या शहर की वास्तविक घटनाओं की ग्राउंड रिपोर्टिंग करना चाहता है, वह निःशुल्क पंजीकरण कर सकता है।'
        : 'Any citizen, independent journalist, student, or local videographer who wants to report verifiable eyewitness stories from their city, ward, or neighborhood can sign up for free.'
    },
    {
      q: language === 'hi' ? 'समीक्षा व सत्यापन प्रक्रिया कैसे काम करती है?' : 'How does the editorial and location review work?',
      a: language === 'hi'
        ? 'अपलोड के समय सिस्टम स्वचालित रूप से स्थान निर्देशांक का सत्यापन करता है। तथ्य-जांच और सामग्री मानकों की समीक्षा के बाद स्टोरी को स्थानीय पाठकों के फ़ीड में प्रसारित किया जाता है।'
        : 'Location coordinates are verified upon upload to validate ground authenticity. Editorial and guideline review are completed before the report is distributed to local resident feeds.'
    },
    {
      q: language === 'hi' ? 'अपलोड की गई सामग्री का कॉपीराइट किसके पास रहता है?' : 'Who owns the content I upload?',
      a: language === 'hi'
        ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा और कॉपीराइट स्वामी बने रहते हैं। नागरिक को केवल अपने वेब और ऐप पर सामग्री प्रसारित करने का गैर-अनन्य (non-exclusive) वितरण लाइसेंस मिलता है।'
        : 'You retain 100% intellectual property rights and full copyright over your reports, videos, and photos. Nagrik only receives a non-exclusive license to host and stream your work to local readers.'
    }
  ];

  return (
    <div className="min-h-screen bg-newspaper-100 dark:bg-ink-950 text-newspaper-900 dark:text-ink-100 transition-colors duration-200 font-sans selection:bg-brand-500 selection:text-white">

      {/* ════════════════════════════════════════════════════════════════════
          01. HERO: 45% EDITORIAL TEXT / 55% LIVING CREATOR STUDIO VISUAL
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative isolate pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        
        {/* Subtle Ambient Illumination */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <div className="absolute top-[8%] right-[4%] w-[680px] h-[680px] bg-brand-500/5 dark:bg-brand-500/5 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 xl:gap-16 relative z-10 w-full">
          
          {/* Left Column: Authoritative Editorial Headline, CTAs & Proof Points (approx 45%) */}
          <div className="w-full lg:w-[45%] xl:w-[44%] shrink-0 space-y-6 sm:space-y-7 text-left">
            
            {/* Level 1: Restrained Editorial Eyebrow (No puffy pill badge) */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span>
                01 / {language === 'hi'
                  ? 'स्थानीय ग्राउंड रिपोर्टिंग • क्रिएटर स्टूडियो'
                  : 'HYPERLOCAL JOURNALISM & CREATOR STUDIO'}
              </span>
            </div>

            {/* Level 2: Dominant Editorial Headline (Newsreader Serif with Controlled Line Breaks) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[68px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-display">
              {language === 'hi' ? (
                <>
                  ग्राउंड न्यूज़ रिपोर्ट करें।<br />
                  <span className="italic font-normal text-newspaper-700 dark:text-ink-200">
                    नागरिकों को सशक्त करें।
                  </span><br />
                  उचित कमाई करें।
                </>
              ) : (
                <>
                  Report Ground News.<br />
                  <span className="italic font-normal text-newspaper-700 dark:text-ink-200 inline-block">
                    Empower Citizens.
                  </span><br />
                  Earn Fairly.
                </>
              )}
            </h1>

            {/* Level 3: Authoritative Lede Paragraph */}
            <p className="text-newspaper-600 dark:text-ink-300 text-base sm:text-lg lg:text-[18px] leading-relaxed max-w-xl font-normal">
              {language === 'hi'
                ? 'नागरिक क्रिएटर स्टूडियो के ज़रिए तस्वीरें, वीडियो और स्थानीय स्टोरीज़ प्रकाशित करें। अपने क्षेत्र के असली पाठकों तक पहुँचें और पारदर्शी भुगतान प्राप्त करें।'
                : 'Publish photos, videos, and local stories through Nagrik Creator Studio. Reach real audiences in your area and earn through transparent payouts.'}
            </p>

            {/* Level 4: Primary & Secondary Action Cluster */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <Link
                href="/creator"
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#story"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white dark:bg-ink-900 border border-newspaper-300 dark:border-ink-700 text-newspaper-800 dark:text-ink-200 font-medium text-sm sm:text-base hover:bg-newspaper-50 dark:hover:bg-ink-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current text-newspaper-600 dark:text-ink-300" />
                <span>{language === 'hi' ? 'देखें यह कैसे काम करता है' : 'Explore Creator Studio'}</span>
              </a>
            </div>

            {/* Level 5: Credibility Proof Bar with Hairline Separation */}
            <div className="pt-5 border-t border-newspaper-200 dark:border-ink-800 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-left">
              {/* Proof 1 */}
              <div className="flex items-center gap-2.5 pr-2 sm:border-r sm:border-newspaper-200 dark:sm:border-ink-800">
                <div className="p-1.5 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-newspaper-900 dark:text-ink-100 leading-tight">
                  {language === 'hi' ? <>स्थानीय पाठक<br />सत्यापित बीट</> : <>Local Beat<br />Audience</>}
                </div>
              </div>

              {/* Proof 2 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-2 sm:border-r sm:border-newspaper-200 dark:sm:border-ink-800">
                <div className="p-1.5 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 shrink-0 font-serif font-bold text-xs">
                  ₹
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-newspaper-900 dark:text-ink-50">$1.50 CPM</div>
                  <div className="text-[10px] text-newspaper-500 dark:text-ink-400 whitespace-nowrap">
                    {language === 'hi' ? 'प्रति 1,000 व्यू' : 'flat payout rate'}
                  </div>
                </div>
              </div>

              {/* Proof 3 */}
              <div className="flex items-center gap-2.5 sm:pl-3 pr-2 sm:border-r sm:border-newspaper-200 dark:sm:border-ink-800">
                <div className="p-1.5 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-newspaper-900 dark:text-ink-100 leading-tight">
                  {language === 'hi' ? <>सीधा UPI /<br />बैंक ट्रांसफर</> : <>Direct UPI /<br />Bank Payouts</>}
                </div>
              </div>

              {/* Proof 4 */}
              <div className="flex items-center gap-2.5 sm:pl-3">
                <div className="p-1.5 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-newspaper-900 dark:text-ink-100 leading-tight">
                  {language === 'hi' ? <>100% बौद्धिक<br />स्वामित्व</> : <>100% Content<br />Copyright</>}
                </div>
              </div>
            </div>

            {/* Social Proof Sub-Ribbon */}
            <div className="pt-3 border-t border-newspaper-200 dark:border-ink-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono font-semibold tracking-wider uppercase text-newspaper-500 dark:text-ink-400 text-[11px] whitespace-nowrap">
                <span className="text-newspaper-400 font-bold">—</span>
                <span>{language === 'hi' ? 'स्थानीय कहानियाँ सशक्त समुदाय बनाती हैं' : 'LOCAL STORIES BUILD STRONGER COMMUNITIES'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img className="inline-block h-6 w-6 rounded-full ring-1 ring-white dark:ring-ink-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Reporter" />
                  <img className="inline-block h-6 w-6 rounded-full ring-1 ring-white dark:ring-ink-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Reporter" />
                  <img className="inline-block h-6 w-6 rounded-full ring-1 ring-white dark:ring-ink-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Reporter" />
                </div>
                <div className="text-left leading-tight">
                  <span className="font-bold text-newspaper-900 dark:text-ink-100 text-xs">50,000+</span>
                  <span className="text-newspaper-500 dark:text-ink-400 ml-1 text-xs whitespace-nowrap">{language === 'hi' ? 'सक्रिय रिपोर्टर्स' : 'Active reporters'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Authentic Creator Studio Interface (approx 55%) */}
          <div className="w-full lg:w-[55%] xl:w-[56%] relative flex flex-col items-center lg:items-end justify-center">
            
            {/* Dual Device Container */}
            <div className="relative z-10 w-full flex justify-center lg:justify-end items-end pr-2 sm:pr-4 pb-1">
              
              {/* DEVICE 1: LAPTOP MOCKUP (CREATOR STUDIO DASHBOARD) */}
              <div className="w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[690px] xl:max-w-[730px] rounded-t-xl bg-ink-900 p-2.5 sm:p-3 shadow-2xl border border-ink-800 relative">
                
                {/* Status bar */}
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-ink-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NAGRIK STUDIO • LIVE ENGINE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((stepIdx) => (
                      <button
                        key={stepIdx}
                        onClick={() => setSimStep(stepIdx)}
                        aria-label={`Cycle step ${stepIdx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          simStep === stepIdx ? 'w-4 bg-brand-500' : 'w-1.5 bg-ink-700 hover:bg-ink-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Display Screen */}
                <div className="rounded bg-newspaper-100 dark:bg-ink-950 text-newspaper-900 dark:text-ink-100 overflow-hidden font-sans text-left border border-newspaper-200 dark:border-ink-800 shadow-inner">
                  
                  {/* Topbar */}
                  <div className="px-3 py-2 bg-white dark:bg-ink-900 border-b border-newspaper-200 dark:border-ink-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-brand-500 text-white font-serif font-bold text-[10px] flex items-center justify-center">
                        N
                      </div>
                      <span className="text-xs font-semibold tracking-tight text-newspaper-900 dark:text-ink-50">
                        Nagrik Creator Studio
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-newspaper-200/70 dark:bg-ink-800 text-newspaper-700 dark:text-ink-300">
                        Patna Ward Beat
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Search className="w-3 h-3 text-newspaper-400 dark:text-ink-500" />
                      <div className="relative">
                        <Bell className="w-3 h-3 text-newspaper-600 dark:text-ink-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 absolute -top-0.5 -right-0.5" />
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                        alt="Reporter"
                        className="w-5 h-5 rounded-full border border-newspaper-300 dark:border-ink-700 object-cover"
                      />
                    </div>
                  </div>

                  {/* Body: Sidebar + Main Content */}
                  <div className="flex min-h-[280px] sm:min-h-[300px]">
                    
                    {/* Left Sidebar */}
                    <div className="hidden sm:block w-24 sm:w-28 bg-white dark:bg-ink-900 border-r border-newspaper-200 dark:border-ink-800 p-2 space-y-0.5 text-[10px] text-newspaper-600 dark:text-ink-400 shrink-0">
                      <div className="bg-newspaper-200/70 dark:bg-ink-800 text-newspaper-900 dark:text-ink-100 font-semibold rounded px-2 py-1 flex items-center gap-1.5">
                        <LayoutDashboard className="w-3 h-3 text-brand-500" />
                        <span>Dashboard</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-newspaper-900 dark:hover:text-white transition">
                        <FileEdit className="w-3 h-3" />
                        <span>Create Report</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-newspaper-900 dark:hover:text-white transition">
                        <FileText className="w-3 h-3" />
                        <span>My Reports</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-newspaper-900 dark:hover:text-white transition">
                        <Wallet className="w-3 h-3" />
                        <span>Earnings</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-newspaper-900 dark:hover:text-white transition">
                        <BarChart3 className="w-3 h-3" />
                        <span>Analytics</span>
                      </div>
                      <div className="px-2 py-1 flex items-center gap-1.5 hover:text-newspaper-900 dark:hover:text-white transition">
                        <Settings className="w-3 h-3" />
                        <span>Settings</span>
                      </div>
                    </div>

                    {/* Main Studio Viewport */}
                    <div className="flex-1 p-2.5 sm:p-3 space-y-2 bg-newspaper-100 dark:bg-ink-950 overflow-hidden pr-2 sm:pr-3">
                      
                      {/* Simulation Status Toast */}
                      <div className="bg-ink-900 text-white px-2.5 py-1 rounded flex items-center justify-between text-[9px] font-mono border border-ink-800">
                        <div className="flex items-center gap-1.5 truncate pr-2">
                          {simStep === 0 && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              <span className="text-amber-300 font-semibold truncate">Stage 1: Report Submitted (Location Stamped)</span>
                            </>
                          )}
                          {simStep === 1 && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              <span className="text-blue-300 font-semibold truncate">Stage 2: Editorial & Location Review Verified</span>
                            </>
                          )}
                          {simStep === 2 && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-emerald-300 font-semibold truncate">Stage 3: Published to Ward Reader Stream</span>
                            </>
                          )}
                          {simStep === 3 && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                              <span className="text-brand-300 font-semibold truncate">Stage 4: Real-time Reads & Payout Accruing</span>
                            </>
                          )}
                        </div>
                        <span className="text-ink-400 shrink-0 text-[8px]">AUTO-SYNC</span>
                      </div>

                      {/* Primary Studio Metric Strip */}
                      <div className="grid grid-cols-3 gap-1.5 text-left">
                        <div className="p-2 rounded bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800">
                          <div className="text-[9px] font-mono text-newspaper-500 dark:text-ink-400 uppercase">Verified Reads</div>
                          <div className="text-sm sm:text-base font-serif font-bold text-newspaper-900 dark:text-ink-50 mt-0.5">
                            {simStep === 0 ? '0' : simStep === 1 ? '184' : simStep === 2 ? '4,920' : '14,820'}
                          </div>
                        </div>

                        <div className="p-2 rounded bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800">
                          <div className="text-[9px] font-mono text-newspaper-500 dark:text-ink-400 uppercase">Rate</div>
                          <div className="text-sm sm:text-base font-serif font-bold text-newspaper-900 dark:text-ink-50 mt-0.5">
                            $1.50 CPM
                          </div>
                        </div>

                        <div className="p-2 rounded bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800">
                          <div className="text-[9px] font-mono text-newspaper-500 dark:text-ink-400 uppercase">Balance</div>
                          <div className="text-sm sm:text-base font-serif font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                            {simStep === 0 ? '₹0' : simStep === 1 ? '₹24' : simStep === 2 ? '₹635' : '₹1,912'}
                          </div>
                        </div>
                      </div>

                      {/* Active Report Row */}
                      <div className="p-2.5 rounded bg-white dark:bg-ink-900 border border-newspaper-200 dark:border-ink-800 space-y-1.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-newspaper-500 dark:text-ink-400 uppercase">Active Report</span>
                          <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            simStep === 0
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : simStep === 1
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {simStep === 0 ? 'In Review' : simStep === 1 ? 'Approved' : 'Live in Stream'}
                          </span>
                        </div>
                        <div className="text-xs font-serif font-semibold text-newspaper-900 dark:text-ink-50 truncate">
                          Civic Road Repair Work Near Digha Chowk
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-newspaper-500 dark:text-ink-400">
                          <span>Patna Locality Beat</span>
                          <span>{simStep === 3 ? 'Direct UPI Ready' : 'Verified Eyewitness'}</span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Base */}
                <div className="h-3 bg-ink-800 rounded-b border-t border-ink-700 flex items-center justify-center mt-0.5">
                  <div className="w-16 h-1 bg-ink-950 rounded-b" />
                </div>

              </div>

              {/* DEVICE 2: SMARTPHONE MOCKUP (PORTRAIT READER APP) */}
              <div className="absolute -right-2 sm:-right-1 lg:right-0 bottom-0 z-20 w-[115px] sm:w-[135px] lg:w-[140px] h-[235px] sm:h-[275px] rounded-xl bg-ink-950 p-1 border border-ink-800 shadow-2xl flex flex-col">
                
                {/* Notch */}
                <div className="w-8 h-1.5 bg-black rounded-full mx-auto mb-1 shrink-0" />

                {/* Phone Screen */}
                <div className="rounded bg-white dark:bg-ink-900 overflow-hidden text-left font-sans flex flex-col flex-1 border border-newspaper-200 dark:border-ink-800">
                  
                  {/* App Header */}
                  <div className="px-2 py-1 bg-white dark:bg-ink-900 border-b border-newspaper-200 dark:border-ink-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-brand-500 text-white font-serif font-bold text-[7px] flex items-center justify-center">
                        N
                      </div>
                      <span className="font-semibold text-[9px] text-newspaper-900 dark:text-ink-50">
                        Nagrik
                      </span>
                    </div>
                    <Search className="w-2.5 h-2.5 text-newspaper-500 dark:text-ink-400" />
                  </div>

                  {/* Main Story Card */}
                  <div className="flex-1 relative overflow-hidden bg-ink-950">
                    <img
                      src="/cleaner-streets-phone.jpg"
                      alt="Local Story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                    
                    <div className="absolute bottom-1.5 left-2 right-2 text-white space-y-0.5">
                      <div className="font-serif font-semibold text-[9px] leading-tight">
                        Civic Works Update
                      </div>
                      <div className="text-[7px] text-ink-300 font-mono">
                        Patna Ward Beat • Live
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Nav */}
                  <div className="px-2 py-1 bg-white dark:bg-ink-900 border-t border-newspaper-200 dark:border-ink-800 flex items-center justify-around text-newspaper-500 dark:text-ink-400 shrink-0">
                    <Home className="w-2.5 h-2.5 text-newspaper-900 dark:text-ink-50" />
                    <FileText className="w-2.5 h-2.5" />
                    <div className="w-3.5 h-3.5 rounded bg-brand-500 text-white flex items-center justify-center font-bold text-[8px]">
                      +
                    </div>
                    <MapPin className="w-2.5 h-2.5" />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          02. SIGNATURE SCROLL-DRIVEN PRODUCT STORY (6 Chapters)
          ════════════════════════════════════════════════════════════════════ */}
      <ScrollProductStory />

      {/* ════════════════════════════════════════════════════════════════════
          03. WHY NAGRIK: ASYMMETRIC EDITORIAL NUMBERED LIST (No 4-card grids)
          ════════════════════════════════════════════════════════════════════ */}
      <section id="why" className="py-24 sm:py-32 border-t border-newspaper-200 dark:border-ink-800 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left transition-colors duration-200">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Thesis & Pull Quote */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>03 / {language === 'hi' ? 'नागरिक क्यों चुनें' : 'WHY REPORTERS CHOOSE NAGRIK'}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
              {language === 'hi'
                ? 'ज़मीनी रिपोर्टिंग करने वालों के लिए विशेष रूप से निर्मित।'
                : 'Built for people who report from the ground.'}
            </h2>

            <p className="text-base sm:text-lg text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
              {language === 'hi'
                ? 'पारंपरिक डिजिटल प्लेटफ़ॉर्म स्थानीय मुद्दों को राष्ट्रीय शोर के नीचे दबा देते हैं और रचनाकारों की कमाई को जटिल शर्तों में बांध देते हैं। नागरिक को पहले दिन से ज़मीनी संवाददाताओं को सीधा अधिकार देने के लिए तैयार किया गया है।'
                : 'Legacy platforms bury local reporting under national noise and lock monetization behind high barriers. Nagrik gives ground correspondents direct distribution, fair compensation, and full content rights.'}
            </p>

            {/* Editorial Pull Quote */}
            <div className="p-5 rounded-lg bg-white dark:bg-ink-900 border-l-2 border-brand-500 border-y border-r border-newspaper-200 dark:border-ink-800 text-sm text-newspaper-700 dark:text-ink-300 italic font-serif leading-relaxed">
              &ldquo;{language === 'hi'
                ? 'हम एल्गोरिदम से स्थानीय आवाज़ों को दबाते नहीं हैं। हम उन्हें सीधे उसी क्षेत्र में पहुँचाते हैं जहाँ वे सबसे अधिक मायने रखती हैं।'
                : 'We do not algorithmically suppress local voices under national clickbait. We deliver eyewitness journalism directly to the local community where it matters most.'}&rdquo;
            </div>

            <div className="pt-2">
              <Link
                href="/creator"
                className="inline-flex items-center gap-2 text-sm font-semibold text-newspaper-900 dark:text-ink-50 hover:text-brand-500 dark:hover:text-brand-400 group transition-colors"
              >
                <span>{language === 'hi' ? 'क्रिएटर स्टूडियो एक्सप्लोर करें' : 'Explore Creator Studio capabilities'}</span>
                <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Numbered List */}
          <div className="lg:col-span-7 space-y-8 divide-y divide-newspaper-200 dark:divide-ink-800">
            
            {/* Item 01 */}
            <div className="pt-8 first:pt-0 space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-600 dark:text-brand-400">
                    01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                    {language === 'hi' ? 'पहले दिन से कमाई (Day-One Monetization)' : 'Day-One Contributor Monetization'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-semibold border border-brand-500/20 shrink-0">
                  $1.50 CPM
                </span>
              </div>
              <p className="text-base text-newspaper-600 dark:text-ink-300 leading-relaxed pl-11 font-normal">
                {language === 'hi'
                  ? 'कोई सब्सक्राइबर या वॉच-टाइम की बाध्यता नहीं। आपकी पहली प्रकाशित स्टोरी और पहले सत्यापित व्यू से ही $1.50 CPM की दर से पारदर्शी कमाई शुरू हो जाती है।'
                  : 'Zero subscriber hurdles and zero watch-time minimums. Every verified read generates earnings at a flat $1.50 CPM (~₹129 per 1,000 reads) from your very first report.'}
              </p>
            </div>

            {/* Item 02 */}
            <div className="pt-8 space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-newspaper-400 dark:text-ink-600">
                    02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                    {language === 'hi' ? 'हाइपरलोकल स्थान सत्यापन' : 'Hyperlocal Location Verification'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 font-mono text-xs font-semibold border border-newspaper-300 dark:border-ink-800 shrink-0">
                  GPS VALIDATED
                </span>
              </div>
              <p className="text-base text-newspaper-600 dark:text-ink-300 leading-relaxed pl-11 font-normal">
                {language === 'hi'
                  ? 'प्रत्येक अपलोड के साथ स्थान निर्देशांक सुरक्षित रूप से स्टैम्प किए जाते हैं ताकि स्टोरी केवल उन स्थानीय नागरिकों तक पहुंचे जिनके लिए वह सीधे तौर पर प्रासंगिक है।'
                  : 'Automated location metadata is validated on submission, ensuring stories reach neighbors and civic stakeholders in the relevant locality.'}
              </p>
            </div>

            {/* Item 03 */}
            <div className="pt-8 space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-newspaper-400 dark:text-ink-600">
                    03
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                    {language === 'hi' ? 'सीधा UPI और बैंक भुगतान' : 'Direct UPI & Bank Settlements'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 font-mono text-xs font-semibold border border-newspaper-300 dark:border-ink-800 shrink-0">
                  $10 (~₹850) MIN
                </span>
              </div>
              <p className="text-base text-newspaper-600 dark:text-ink-300 leading-relaxed pl-11 font-normal">
                {language === 'hi'
                  ? 'जैसे ही आपका बैलेंस न्यूनतम $10 (लगभग ₹850) तक पहुँचता है, आप Google Pay, PhonePe, Paytm या बैंक ट्रांसफर के माध्यम से 2 से 24 घंटे में सीधा भुगतान प्राप्त कर सकते हैं।'
                  : 'Direct disbursals via PhonePe, Google Pay, Paytm, BHIM, or direct NEFT/IMPS bank transfer once your verified balance reaches the accessible $10 (~₹850) threshold.'}
              </p>
            </div>

            {/* Item 04 */}
            <div className="pt-8 space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-newspaper-400 dark:text-ink-600">
                    04
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                    {language === 'hi' ? '100% सामग्री स्वामित्व व कॉपीराइट' : 'Full Contributor Content Ownership'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-700 dark:text-ink-300 font-mono text-xs font-semibold border border-newspaper-300 dark:border-ink-800 shrink-0">
                  100% IP RETAINED
                </span>
              </div>
              <p className="text-base text-newspaper-600 dark:text-ink-300 leading-relaxed pl-11 font-normal">
                {language === 'hi'
                  ? 'आप अपनी सभी तस्वीरों, वीडियो और रिपोर्ट के 100% बौद्धिक संपदा स्वामी बने रहते हैं। नागरिक को केवल एक गैर-अनन्य वितरण लाइसेंस मिलता है।'
                  : 'You retain 100% intellectual property ownership and copyright over your footage and reporting. Nagrik receives only a non-exclusive streaming license.'}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════════
          04. PRODUCT ECOSYSTEM: THE NAGRIK CIVIC NETWORK
          ════════════════════════════════════════════════════════════════════ */}
      <ProductEcosystem onOpenAppModal={() => setShowQrModal(true)} />

      {/* ════════════════════════════════════════════════════════════════════
          05. TRANSPARENT EARNINGS CALCULATOR
          ════════════════════════════════════════════════════════════════════ */}
      <EarningsCalculator />

      {/* ════════════════════════════════════════════════════════════════════
          06. TRUST & PUBLISHER JOURNEY: YOUR REPORTING. YOUR RIGHTS.
          ════════════════════════════════════════════════════════════════════ */}
      <section id="trust" className="py-24 sm:py-32 bg-newspaper-200/60 dark:bg-ink-900 border-y border-newspaper-300 dark:border-ink-800 transition-colors duration-200">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 text-left">
          
          {/* Section Header */}
          <div className="max-w-3xl space-y-3 sm:space-y-4 mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>06 / {language === 'hi' ? 'संपादकीय सत्यनिष्ठा व अधिकार' : 'EDITORIAL INTEGRITY & TRUST'}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
              {language === 'hi'
                ? 'आपकी रिपोर्टिंग। आपका हक। आपकी पारदर्शी कमाई।'
                : 'Your reporting. Your rights. Your earnings.'}
            </h2>
            <p className="text-base sm:text-lg text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
              {language === 'hi'
                ? 'स्वतंत्र ज़मीनी पत्रकारिता के लिए अनुबंधीय सम्मान, बौद्धिक संपदा की सुरक्षा और सुरक्षित भुगतान प्रणाली अनिवार्य है।'
                : 'Independent ground journalism requires contractual respect, verifiable reader metrics, and secure, direct disbursals.'}
            </p>
          </div>

          {/* 3 Core Trust Pillars in Clean Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            <div className="space-y-4 p-7 rounded-xl bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-newspaper-100 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200 border border-newspaper-200 dark:border-ink-800 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-newspaper-100 dark:bg-ink-900 text-newspaper-600 dark:text-ink-300">
                  NON-EXCLUSIVE
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                {language === 'hi' ? '100% सामग्री स्वामित्व' : '100% Content Ownership'}
              </h3>
              <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'नागरिक के पास कोई विशिष्ट अधिकार नहीं है। आप किसी भी समय अपनी रिपोर्ट कहीं भी साझा या लाइसेंस कर सकते हैं।'
                  : 'You retain full copyright. Nagrik holds only a non-exclusive distribution license. You are completely free to license or syndicate your footage.'}
              </p>
            </div>

            <div className="space-y-4 p-7 rounded-xl bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-newspaper-100 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200 border border-newspaper-200 dark:border-ink-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-newspaper-100 dark:bg-ink-900 text-newspaper-600 dark:text-ink-300">
                  VERIFIED AUDIENCE
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                {language === 'hi' ? 'सत्यापित पाठक सत्यापन' : 'Verified Reader Metrics'}
              </h3>
              <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'नकली बॉट्स और क्लिक फ़ार्म को रोकने के लिए सत्यापन तकनीकों का उपयोग किया जाता है ताकि केवल वास्तविक नागरिक जुड़ाव का भुगतान हो।'
                  : 'Automated deduplication and uniqueness checks filter fake traffic, ensuring that contributor earnings represent genuine citizen reads.'}
              </p>
            </div>

            <div className="space-y-4 p-7 rounded-xl bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-newspaper-100 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200 border border-newspaper-200 dark:border-ink-800 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-newspaper-100 dark:bg-ink-900 text-newspaper-600 dark:text-ink-300">
                  ZERO COMMISSION
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                {language === 'hi' ? 'प्रत्यक्ष वित्तीय निपटान' : 'Zero Platform Deduction'}
              </h3>
              <p className="text-sm text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'कोई छिपा हुआ प्लेटफ़ॉर्म शुल्क नहीं। आपकी स्वीकृत कमाई सीधे आपके बैंक या UPI पते पर स्थानांतरित की जाती है।'
                  : 'Zero platform escrow cuts or transaction penalties. The entire approved contributor balance goes straight to your UPI or bank account.'}
              </p>
            </div>

          </div>

          {/* 6-Step Publisher Roadmap */}
          <div className="pt-12 border-t border-newspaper-300 dark:border-ink-800 space-y-8">
            <div className="max-w-2xl space-y-1">
              <div className="text-xs font-mono font-semibold uppercase tracking-editorial-label text-newspaper-500 dark:text-ink-400">
                {language === 'hi' ? '6-चरणीय रोडमैप' : 'THE PUBLISHER ROADMAP'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                {language === 'hi' ? 'स्थानीय रिपोर्टर बनने का आसान रास्ता' : 'From first signup to automated monthly earnings.'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-newspaper-500 dark:text-ink-400">STEP 01</span>
                  <span className="text-[10px] font-mono text-newspaper-400 uppercase">Fast Signup</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'निःशुल्क खाता बनाएं' : 'Create Contributor Account'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                  {language === 'hi'
                    ? 'मोबाइल नंबर या ईमेल से तुरंत साइनअप करें। किसी पूर्व पत्रकारिता प्रमाण पत्र की आवश्यकता नहीं।'
                    : 'Sign up in under a minute with your email or phone number. No prior press accreditation required.'}
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-newspaper-500 dark:text-ink-400">STEP 02</span>
                  <span className="text-[10px] font-mono text-newspaper-400 uppercase">Locality Beat</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'अपना वार्ड या शहर चुनें' : 'Claim Your Locality Beat'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                  {language === 'hi'
                    ? 'अपने शहर या वार्ड को प्राथमिक रिपोर्टिंग क्षेत्र के रूप में चुनें जहां आप सक्रिय रहते हैं।'
                    : 'Designate your municipal ward or neighborhood as your primary beat for targeted audience reach.'}
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-newspaper-500 dark:text-ink-400">STEP 03</span>
                  <span className="text-[10px] font-mono text-newspaper-400 uppercase">Payout Setup</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'भुगतान विवरण जोड़ें' : 'Link UPI / Bank Account'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                  {language === 'hi'
                    ? 'त्वरित स्वचालित निकासी के लिए अपना PhonePe, Google Pay या बैंक खाता विवरण जोड़ें।'
                    : 'Add your UPI address or bank account details so eligible earnings settle with zero delays.'}
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-newspaper-500 dark:text-ink-400">STEP 04</span>
                  <span className="text-[10px] font-mono text-newspaper-400 uppercase">Publish</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'ग्राउंड रिपोर्ट्स अपलोड करें' : 'File Ground Reports'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                  {language === 'hi'
                    ? 'मौके के वीडियो, तस्वीरें और विवरण अपलोड करें। सिस्टम स्थान का सत्यापन करता है।'
                    : 'Submit video bytes, photos, or text notes via mobile companion or web creator studio.'}
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-newspaper-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-newspaper-500 dark:text-ink-400">STEP 05</span>
                  <span className="text-[10px] font-mono text-newspaper-400 uppercase">Engage</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'स्थानीय पाठक विश्वास बढ़ाएं' : 'Grow Local Readership'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-400 leading-relaxed">
                  {language === 'hi'
                    ? 'स्थानीय मुद्दों को निरंतर कवर करें और अपने वार्ड में विश्वसनीय रिपोर्टर के रूप में पहचान बनाएं।'
                    : 'Build loyal neighborhood readers who depend on your real-time updates and civic coverage.'}
                </p>
              </div>

              {/* Step 6: Highlighted Goal State with Nagrik Orange */}
              <div className="p-6 rounded-lg bg-white dark:bg-ink-950 border border-brand-500 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">STEP 06</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold uppercase">Goal State</span>
                </div>
                <h4 className="text-base font-serif font-semibold text-newspaper-900 dark:text-ink-50">
                  {language === 'hi' ? 'सीधा भुगतान प्राप्त करें' : 'Receive Direct Payouts'}
                </h4>
                <p className="text-xs text-newspaper-600 dark:text-ink-300 leading-relaxed font-normal">
                  {language === 'hi'
                    ? '$10 सीमा पार करते ही सीधे अपने UPI पते पर पारदर्शी भुगतान प्राप्त करें।'
                    : 'Request instant withdrawal once above the $10 (~₹850) threshold with disbursal in 2 to 24 hours.'}
                </p>
              </div>

            </div>

            {/* Active City Hubs */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-newspaper-500 dark:text-ink-400">
              <span className="font-semibold text-newspaper-700 dark:text-ink-300">ACTIVE REPORTING HUBS:</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Patna</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Varanasi</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Lucknow</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Jaipur</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Indore</span>
              <span className="px-2.5 py-1 rounded bg-newspaper-200/70 dark:bg-ink-900 text-newspaper-800 dark:text-ink-200">Pune</span>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          07. CLEAN FAQ ACCORDION
          ════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 sm:py-32 max-w-4xl mx-auto px-6 sm:px-8 text-left space-y-10 transition-colors duration-200">
        
        <div className="space-y-3 sm:space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-newspaper-600 dark:text-ink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span>07 / {language === 'hi' ? 'सामान्य प्रश्न' : 'FREQUENTLY ASKED QUESTIONS'}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-semibold tracking-serif-tight text-newspaper-900 dark:text-ink-50 leading-tight-serif">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Everything you need to know.'}
          </h2>
          <p className="text-base text-newspaper-600 dark:text-ink-300 font-normal">
            {language === 'hi'
              ? 'नागरिक कंट्रीब्यूटर कमाई, बौद्धिक संपदा और प्रकाशन प्रक्रियाओं के बारे में स्पष्ट और पारदर्शी उत्तर।'
              : 'Clear, transparent answers about Nagrik contributor earnings, content rights, and publishing workflows.'}
          </p>
        </div>

        <div className="divide-y divide-newspaper-200 dark:divide-ink-800">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-serif font-semibold text-lg sm:text-xl text-newspaper-900 dark:text-ink-50 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-newspaper-400 dark:text-ink-500 group-hover:text-newspaper-700 dark:group-hover:text-ink-200 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-500 dark:text-brand-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pt-3 pr-4 text-sm sm:text-base text-newspaper-600 dark:text-ink-300 leading-relaxed font-sans font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════════
          08. FINAL EDITORIAL CTA
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-ink-950 text-white text-center border-t border-ink-800 px-6 sm:px-8 relative overflow-hidden">
        
        {/* Ambient Warmth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-editorial-label uppercase text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>08 / {language === 'hi' ? 'शुरुआत करें' : 'GET STARTED TODAY'}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold tracking-serif-tight text-white leading-tight">
              {language === 'hi'
                ? 'आपकी अगली स्थानीय खबर यहीं से शुरू होती है।'
                : 'Your next local story starts here.'}
            </h2>
            <p className="text-base sm:text-lg text-ink-300 leading-relaxed max-w-2xl mx-auto font-normal">
              {language === 'hi'
                ? 'अपना निःशुल्क खाता बनाएं, पहली ग्राउंड रिपोर्ट अपलोड करें और अपने शहर के विश्वसनीय रिपोर्टर बनें।'
                : 'Create your account, file your first ground report, and build your local reporting reputation with fair day-one payouts.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/creator"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold text-sm sm:text-base shadow-sm transition-all text-center cursor-pointer"
            >
              {language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}
            </Link>
            <button
              onClick={() => setShowQrModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-200 hover:text-white font-medium text-sm sm:text-base hover:bg-ink-800 transition cursor-pointer text-center"
            >
              {language === 'hi' ? 'मोबाइल ऐप डाउनलोड' : 'Download Mobile App'}
            </button>
          </div>

          <div className="text-xs font-mono text-ink-400 pt-4 flex flex-wrap items-center justify-center gap-4">
            <span>● Zero subscriber minimums</span>
            <span>● 60-second registration</span>
            <span>● Direct UPI & Bank payouts</span>
            <span>● 100% content ownership</span>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: QR CODE SCAN MODAL FOR CONSUMER APP
          ════════════════════════════════════════════════════════════════════ */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-ink-900 rounded-xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl relative border border-newspaper-200 dark:border-ink-800 text-newspaper-900 dark:text-ink-100 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-newspaper-400 hover:text-newspaper-700 dark:hover:text-white font-bold text-base p-1 cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="w-11 h-11 rounded-lg bg-newspaper-100 dark:bg-ink-800 text-newspaper-800 dark:text-ink-100 flex items-center justify-center mx-auto border border-newspaper-200 dark:border-ink-700">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-semibold">
              {language === 'hi' ? 'नागरिक ऐप डाउनलोड' : 'Download Nagrik App'}
            </h3>
            <p className="text-xs text-newspaper-600 dark:text-ink-300 leading-relaxed">
              {language === 'hi'
                ? 'अपने फोन के कैमरे से इस क्यूआर कोड को स्कैन करें और 100% निःशुल्क ऐप इंस्टॉल करें।'
                : 'Scan this QR code with your mobile camera to install the 100% free consumer app.'}
            </p>

            <div className="p-4 bg-white rounded-lg border border-newspaper-200 dark:border-ink-700 flex flex-col items-center justify-center space-y-2">
              <div className="w-36 h-36 bg-ink-950 rounded p-3 flex flex-col items-center justify-center relative">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-[10px] font-mono text-newspaper-500">Scan to download APK</span>
            </div>

            <div className="p-3 bg-newspaper-50 dark:bg-ink-950 rounded border border-newspaper-200 dark:border-ink-800">
              <div className="text-xs font-mono font-semibold text-newspaper-700 dark:text-ink-300">
                Production Release
              </div>
              <div className="text-[11px] text-newspaper-500 dark:text-ink-400 mt-0.5">
                Direct APK / Google Play / App Store
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
