'use client';

import React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  DollarSign,
  ArrowRight,
  Eye,
  Ban
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const AdvertisingView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'purpose-revenue', label: '1. Commercial Purpose & Platform Sustainability' },
    { id: 'editorial-firewall', label: '2. Absolute Editorial Independence Firewall' },
    { id: 'labeling-transparency', label: '3. Mandatory Labeling of Sponsored Content' },
    { id: 'prohibited-categories', label: '4. Prohibited Advertising Categories' },
    { id: 'ad-networks', label: '5. Programmatic Ads & Google AdMob/UMP' },
    { id: 'complaints-feedback', label: '6. Misleading Ads & Reader Complaints' }
  ];

  return (
    <LegalLayout
      title="Advertising & Sponsored Content Policy"
      hindiTitle="विज्ञापन एवं प्रायोजित सामग्री नीति"
      subtitle="The strict standards governing commercial advertisements, native promotions, and editorial independence on the Nagrik platform."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="advertising"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Megaphone className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Integrity in Commercial Partnerships</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Nagrik exists to serve citizens with truthful news. While commercial advertising enables us to compensate ground reporters and maintain free public access, we maintain an uncompromising barrier between commercial sponsors and editorial investigations.
          </p>
        </div>

        {/* 1. PURPOSE & SUSTAINABILITY */}
        <section id="purpose-revenue" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Commercial Purpose &amp; Platform Sustainability
            </h2>
          </div>
          <p>
            Nagrik displays digital advertisements to support operating costs, cloud media hosting, and direct compensation to ground citizen stringers across hundreds of Indian districts. Advertising revenue allows us to keep local news 100% free and open to all citizens without restrictive paywalls.
          </p>
        </section>

        {/* 2. EDITORIAL FIREWALL */}
        <section id="editorial-firewall" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Absolute Editorial Independence Firewall
            </h2>
          </div>
          <p>
            Our editorial integrity is not for sale:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Zero Editorial Control:</strong> Advertisers and sponsors have no voice, review rights, or veto power over news investigations, headlines, or story selection.</li>
            <li><strong>No Paid Suppression:</strong> We will never suppress, tone down, or remove critical reporting regarding a business or municipal contractor in exchange for advertising spend.</li>
            <li><strong>Staff Independence:</strong> Editorial desk reporters do not sell advertising, and advertising sales representatives have no say in the newsroom.</li>
          </ul>
        </section>

        {/* 3. LABELING & TRANSPARENCY */}
        <section id="labeling-transparency" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Mandatory Labeling of Sponsored Content
            </h2>
          </div>
          <p>
            Advertising must never masquerade as independent journalism:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3.5 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold">SPONSORED / प्रायोजित</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Any article or video published on behalf of a paying sponsor is clearly tagged with a persistent badge in both Hindi and English.
              </p>
            </div>
            <div className="p-3.5 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold">AD / विज्ञापन</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Banner and in-feed commercial placements are framed and labeled distinctly from editorial news cards.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PROHIBITED AD CATEGORIES */}
        <section id="prohibited-categories" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Prohibited Advertising Categories
            </h2>
          </div>
          <p>
            We strictly reject advertising campaigns promoting the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Tobacco products, cigarettes, pan masala, and related surrogate ads.</li>
            <li>Unregulated betting, gambling apps, online rummy/poker involving cash wagering, and binary options scams.</li>
            <li>Get-rich-quick schemes, illegal multi-level marketing (MLM), unlicensed financial investments, or predatory lending apps.</li>
            <li>Counterfeit pharmaceuticals, miracle medical cures, or unproven medical remedies.</li>
            <li>Hate speech, weapon sales, explosive materials, or sexually explicit services.</li>
          </ul>
        </section>

        {/* 5. PROGRAMMATIC & ADMOB */}
        <section id="ad-networks" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Programmatic Ads &amp; Google AdMob / UMP Consent
            </h2>
          </div>
          <p>
            Our mobile application integrates with <strong>Google AdMob</strong> utilizing the official <strong>User Messaging Platform (UMP)</strong> SDK. This allows mobile readers to customize or withdraw ad consent at any time via App Settings → Ad Privacy Choices.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Programmatic ad networks must comply with Google Play Developer policies and Indian privacy regulations under the DPDP Act 2023.
          </p>
        </section>

        {/* 6. COMPLAINTS */}
        <section id="complaints-feedback" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Misleading Ads &amp; Reader Complaints
            </h2>
          </div>
          <p>
            If you encounter an advertisement that appears deceptive, offensive, or fraudulent on Nagrik, please report it immediately to our advertising compliance desk at <a href="mailto:contact@nagrik.news?subject=Ad%20Complaint" className="text-[#DE5227] underline font-bold">contact@nagrik.news</a>. We will investigate and block offending ad units across our inventory within 24 hours.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
