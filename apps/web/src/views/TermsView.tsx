import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Lock,
  DollarSign,
  Scale,
  ArrowRight,
  Clock
} from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const TermsView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'terms';
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
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultTabs = [
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'creator', label: 'Creator Agreement', icon: DollarSign },
    { id: 'dmca', label: 'DMCA & Copyright', icon: ShieldCheck }
  ];

  // Merge CMS pages with default tabs for complete navigation
  const tabsToRender = defaultTabs.map(t => {
    const custom = cmsPages.find(p => p.slug === t.id);
    return {
      ...t,
      label: custom?.title || t.label,
      content: custom?.content,
      version: custom?.version,
      updatedAt: custom?.updatedAt || custom?.updated_at
    };
  });

  // Also include any extra custom CMS pages added by admin
  const extraPages = cmsPages.filter(p => !['terms', 'privacy', 'creator', 'dmca'].includes(p.slug));
  extraPages.forEach(p => {
    tabsToRender.push({
      id: p.slug,
      label: p.title,
      icon: Scale,
      content: p.content,
      version: p.version,
      updatedAt: p.updatedAt || p.updated_at
    });
  });

  const activeDoc = tabsToRender.find(t => t.id === activeTab) || tabsToRender[0];

  return (
    <div className="bg-[#FFFDFB] text-slate-900 py-12 md:py-20 px-4 sm:px-6 selection:bg-orange-100 selection:text-orange-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-semibold shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#E36138]" />
            <span>Legal & Platform Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Terms & <span className="text-[#E36138]">Policies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Last Updated: {activeDoc?.updatedAt ? new Date(activeDoc.updatedAt).toLocaleDateString() : 'September 2026'} • Version {activeDoc?.version || '1.0'} • Effective for all Citizen Reporters, Publishers, and App Users.
          </p>
        </div>

        {/* Legal Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabsToRender.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E36138] text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-left leading-relaxed text-xs sm:text-sm text-slate-600">
          {/* If the active tab has dynamic content from CMS, render it seamlessly */}
          {activeDoc?.content ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{activeDoc.label}</h2>
                  <p className="text-xs text-slate-400 mt-1">Official platform charter & governance agreement</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>v{activeDoc.version || '1.0'}</span>
                </div>
              </div>

              <div className="space-y-4 whitespace-pre-wrap font-sans text-stone-700 leading-relaxed text-sm">
                {activeDoc.content}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: TERMS OF SERVICE */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">1. Terms of Service</h2>
                    <p className="text-xs text-slate-400 mt-1">Agreement between Nagrik News Platform and You</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">1.1 Platform Purpose</h3>
                    <p>
                      Nagrik is an open, decentralized citizen journalism and content monetization ecosystem. By accessing our website, creator workstation, or mobile apps, you acknowledge and agree to comply with these terms.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">1.2 Content Authenticity & Citizen Reporting</h3>
                    <p>
                      All reports, ground video streams, and photos submitted must represent real, truthful, and verified events. Fabricated news, deepfakes, hate speech, or defamatory reporting against individuals will lead to immediate permanent suspension and account forfeiture.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">1.3 User Responsibility & Accounts</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your creator account credentials and for all activities that occur under your account. You agree not to upload malware, copyrighted unauthorized streams, or malicious code.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">1.4 Service Modifications</h3>
                    <p>
                      Nagrik reserves the right to modify, suspend, or discontinue any feature, rate schedule, or service at any time with prior notice provided on the Creator Studio announcement desk.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">2. Privacy Policy</h2>
                    <p className="text-xs text-slate-400 mt-1">How we protect your personal data, identity, and payout details</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">2.1 Information We Collect</h3>
                    <p>
                      We collect basic information required to process publisher payouts and verify ground reports:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                      <li><strong>Creator Profile:</strong> Full name, verified email, and phone number.</li>
                      <li><strong>Payout Details:</strong> UPI VPA ID (e.g. <code>username@okhdfcbank</code>) and Bank Account Number / IFSC code for NEFT settlements.</li>
                      <li><strong>Geo-Location Metadata:</strong> Latitude/longitude data attached during ground reporting to establish news location validity.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">2.2 Protection of Financial Details</h3>
                    <p>
                      Your banking information is encrypted at rest using AES-256 standards and is never shared with third-party advertising brokers. Payout transactions are routed exclusively through Reserve Bank of India (RBI) authorized banking gateways.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">2.3 Anonymous Whistleblower Protection</h3>
                    <p>
                      Citizen reporters who opt for anonymous whistleblowing have their personal metadata scrubbed from public viewer logs to protect journalistic sources.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: CREATOR AGREEMENT */}
              {activeTab === 'creator' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">3. Creator Monetization Agreement</h2>
                    <p className="text-xs text-slate-400 mt-1">Rates, view verification algorithms, and payout terms</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">3.1 Revenue Model & $1.50 CPM Rate</h3>
                    <p>
                      Nagrik pays a flat rate of <strong>$1.50 USD per 1,000 verified unique views</strong>. Monetization begins from the very first view with zero subscriber or channel threshold.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">3.2 Anti-Fraud & Bot Filtering</h3>
                    <p>
                      To protect advertiser budgets and sustain creator payouts, view counts are verified via automated browser fingerprinting and IP uniqueness checks. Artificially inflated views from click farms, proxy bots, or auto-refresh scripts will result in immediate earnings cancellation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">3.3 Minimum Payout & Disbursal Schedule</h3>
                    <p>
                      The minimum payout threshold is <strong>$10.00 USD (approx. ₹850 INR)</strong>. Payout requests submitted via UPI are settled within 2 to 24 hours. Manual bank transfers via NEFT/IMPS are completed within 1 to 2 business days.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: DMCA & COPYRIGHT */}
              {activeTab === 'dmca' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">4. DMCA & Copyright Policy</h2>
                    <p className="text-xs text-slate-400 mt-1">Intellectual property protection and takedown requests</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">4.1 Copyright Ownership</h3>
                    <p>
                      Publishers retain 100% intellectual property rights and copyright to their original video footage and written reports. By uploading to Nagrik, you grant us a worldwide license to host, stream, and distribute the content across our mobile and web applications.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">4.2 Filing a DMCA Notice</h3>
                    <p>
                      If you believe your copyrighted video or audio has been republished without authorization, please send a formal notice to our legal desk at <a href="mailto:dmca@nagrik.news" className="text-[#E36138] font-bold hover:underline">dmca@nagrik.news</a> with:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                      <li>Identification of the copyrighted material claimed to be infringed.</li>
                      <li>URL or link to the infringing post on Nagrik.</li>
                      <li>Your full contact details and an electronic signature.</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bottom Help Note */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Need assistance regarding our terms? Contact our legal team at <a href="mailto:legal@nagrik.news" className="text-slate-800 font-bold hover:underline">legal@nagrik.news</a>
            </div>

            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
