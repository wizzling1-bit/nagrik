'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Lock,
  DollarSign,
  Scale,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const TermsView: React.FC = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialTab = searchParams ? searchParams.get('tab') || 'terms' : 'terms';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [cmsPages, setCmsPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/cms`);
        const data = await res.json();
        if (data.success && data.pages && data.pages.length > 0) {
          setCmsPages(data.pages);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic legal pages, using defaults:', err);
      }
    };
    fetchLegalPages();
  }, []);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const defaultTabs = [
    {
      id: 'terms',
      label: language === 'hi' ? 'उपयोग के नियम' : 'Terms of Service',
      icon: FileText
    },
    {
      id: 'privacy',
      label: language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy',
      icon: Lock
    },
    {
      id: 'creator',
      label: language === 'hi' ? 'प्रकाशक समझौता' : 'Creator Agreement',
      icon: DollarSign
    },
    {
      id: 'dmca',
      label: language === 'hi' ? 'कॉपीराइट व DMCA' : 'DMCA & Copyright',
      icon: ShieldCheck
    }
  ];

  // Merge CMS pages with default tabs for complete navigation
  const tabsToRender = defaultTabs.map((t) => {
    const custom = cmsPages.find((p) => p.slug === t.id);
    return {
      ...t,
      label: custom?.title || t.label,
      content: custom?.content,
      version: custom?.version,
      updatedAt: custom?.updatedAt || custom?.updated_at
    };
  });

  // Also include any extra custom CMS pages added by admin
  const extraPages = cmsPages.filter(
    (p) => !['terms', 'privacy', 'creator', 'dmca'].includes(p.slug)
  );
  extraPages.forEach((p) => {
    tabsToRender.push({
      id: p.slug,
      label: p.title,
      icon: Scale,
      content: p.content,
      version: p.version,
      updatedAt: p.updatedAt || p.updated_at
    });
  });

  const activeDoc = tabsToRender.find((t) => t.id === activeTab) || tabsToRender[0];

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-[#DE5227]/20 text-[#DE5227] dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#DE5227]" />
            <span>{language === 'hi' ? 'कानूनी एवं नीतिगत नियम' : 'Legal & Platform Governance'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white">
            {language === 'hi' ? (
              <>नियम एवं <span className="text-[#DE5227]">नीतियां</span></>
            ) : (
              <>Terms & <span className="text-[#DE5227]">Policies</span></>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
            {language === 'hi'
              ? 'अंतिम अपडेट: सितंबर 2026 • संस्करण 1.0 • सभी नागरिक संवाददाताओं, प्रकाशकों और ऐप उपयोगकर्ताओं के लिए लागू।'
              : `Last Updated: ${activeDoc?.updatedAt ? new Date(activeDoc.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'September 2026'} • Version ${activeDoc?.version || '1.0'} • Effective for all Citizen Reporters, Publishers, and App Users.`}
          </p>
        </div>

        {/* Legal Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabsToRender.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/20'
                    : 'bg-[#FAF8F5] dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-[#F2ECE1] dark:hover:bg-slate-800 border border-stone-200/90 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          
          {/* Dynamic Content from CMS */}
          {activeDoc?.content ? (
            <div className="space-y-6">
              <div className="border-b border-stone-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-serif">{activeDoc.label}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
                    {language === 'hi' ? 'आधिकारिक मंच घोषणा एवं संचालन समझौता' : 'Official platform charter & governance agreement'}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>v{activeDoc.version || '1.0'}</span>
                </div>
              </div>

              <div className="space-y-4 whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {activeDoc.content}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: TERMS OF SERVICE */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-serif">1. Terms of Service</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">Agreement between Nagrik News Platform and You</p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">1.1 Platform Purpose</h3>
                    <p>
                      Nagrik is an open, decentralized citizen journalism and content monetization ecosystem. By accessing our website, creator workstation, or mobile apps, you acknowledge and agree to comply with these terms.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">1.2 Content Authenticity & Citizen Reporting</h3>
                    <p>
                      All reports, ground video streams, and photos submitted must represent real, truthful, and verified events. Fabricated news, deepfakes, hate speech, or defamatory reporting against individuals will lead to immediate permanent suspension and account forfeiture.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">1.3 User Responsibility & Accounts</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your creator account credentials and for all activities that occur under your account. You agree not to upload malware, copyrighted unauthorized streams, or malicious code.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">1.4 Service Modifications</h3>
                    <p>
                      Nagrik reserves the right to modify, suspend, or discontinue any feature, rate schedule, or service at any time with prior notice provided on the Creator Studio announcement desk.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-serif">2. Privacy Policy</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">How we protect your personal data, identity, and payout details</p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">2.1 Information We Collect</h3>
                    <p>
                      We collect basic information required to process publisher payouts and verify ground reports:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <li><strong className="text-slate-950 dark:text-white">Creator Profile:</strong> Full name, verified email, and phone number.</li>
                      <li><strong className="text-slate-950 dark:text-white">Payout Details:</strong> UPI VPA ID (e.g. <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 font-mono">username@okhdfcbank</code>) and Bank Account Number / IFSC code for NEFT settlements.</li>
                      <li><strong className="text-slate-950 dark:text-white">Geo-Location Metadata:</strong> Latitude/longitude data attached during ground reporting to establish news location validity.</li>
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">2.2 Protection of Financial Details</h3>
                    <p>
                      Your banking information is encrypted at rest using AES-256 standards and is never shared with third-party advertising brokers. Payout transactions are routed exclusively through Reserve Bank of India (RBI) authorized banking gateways.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">2.3 Anonymous Whistleblower Protection</h3>
                    <p>
                      Reporters may mark sensitive civic whistleblower submissions as anonymous. When selected, public news streams strip creator metadata while preserving internal cryptographic location audit trails.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: CREATOR & MONETIZATION AGREEMENT */}
              {activeTab === 'creator' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-serif">3. Creator & Monetization Agreement</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">Terms governing $1.50 CPM publisher earnings, UPI disbursals, and rights</p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">3.1 Revenue Model & Rate Policy</h3>
                    <p>
                      Nagrik pays active publishers a flat estimated rate of <strong className="text-[#DE5227]">$1.50 USD (~₹129 INR)</strong> per 1,000 verified human reads. A verified read requires at least 5 seconds of active user dwell time within the story modal or feed.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">3.2 Minimum Withdrawal Threshold</h3>
                    <p>
                      Creators can initiate a payout request once their approved contributor balance reaches <strong className="text-slate-950 dark:text-white">₹850 INR ($10 USD)</strong>. Disbursals are processed via UPI or direct bank transfer within 24 to 48 business hours with zero platform deduction.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">3.3 Intellectual Property & Content Rights</h3>
                    <p>
                      You retain 100% intellectual property ownership and copyright over your footage, photos, and writing. By uploading to Nagrik, you grant the platform a non-exclusive license to host, display, and stream your content.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: DMCA & COPYRIGHT */}
              {activeTab === 'dmca' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-serif">4. DMCA & Copyright Policy</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">Reporting intellectual property infringement and takedown procedures</p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">4.1 Notice and Takedown Procedure</h3>
                    <p>
                      If you believe your copyrighted work has been uploaded without authorization, you may submit a formal takedown request to our legal desk at <a href="mailto:support@nagrik.news" className="text-[#DE5227] font-mono">support@nagrik.news</a>.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm">4.2 Required Information</h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <li>Identification of the copyrighted work claimed to have been infringed.</li>
                      <li>URL or exact description of where the infringing material is located on Nagrik.</li>
                      <li>Your contact information (name, address, telephone number, email).</li>
                      <li>A statement that you have a good faith belief that the use is not authorized.</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
