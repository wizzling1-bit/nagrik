'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  ArrowRight,
  BookOpen,
  Camera
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const CopyrightView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'nagrik-ip', label: "1. Nagrik's Intellectual Property" },
    { id: 'publisher-ip', label: '2. Contributor Ownership & License' },
    { id: 'third-party-rights', label: '3. Third-Party Rights & Fair Dealing' },
    { id: 'takedown-notice', label: '4. Submitting a Copyright Takedown Notice' },
    { id: 'counter-notice', label: '5. Counter-Notice & Appeal Workflow' },
    { id: 'trademark-logo', label: '6. Trademark & Brand Asset Usage' },
    { id: 'repeat-infringer', label: '7. Repeat Infringer Policy' },
    { id: 'contact', label: '8. Designated Copyright Agent' }
  ];

  return (
    <LegalLayout
      title="Copyright & Intellectual Property Policy"
      hindiTitle="कॉपीराइट एवं बौद्धिक संपदा नीति"
      subtitle="How Nagrik protects intellectual property rights under the Indian Copyright Act, 1957, DMCA, and author-first licensing frameworks."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="copyright"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Scale className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Respect for Creative &amp; Journalistic Work</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Nagrik upholds the creative rights of journalists, videographers, photographers, and independent creators. We operate on an author-first framework where contributors retain 100% copyright in their original footage, and we act expeditiously to remove unauthorized infringing material.
          </p>
        </div>

        {/* 1. NAGRIK IP */}
        <section id="nagrik-ip" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Nagrik's Intellectual Property
            </h2>
          </div>
          <p>
            The Nagrik platform name, trademarks, logos, visual brand identity, software application code, user interfaces, database architecture, design systems, and editorial features are the proprietary property of <strong>Wizzling Pvt Ltd</strong>.
          </p>
          <p>
            You may not copy, reverse-engineer, modify, redistribute, or create derivative software products based on our proprietary web or mobile codebases without prior written consent.
          </p>
        </section>

        {/* 2. PUBLISHER IP */}
        <section id="publisher-ip" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Contributor Ownership &amp; License Grant
            </h2>
          </div>
          <p>
            When a citizen journalist, stringer, or independent publisher submits original reports, footage, or photographs to Nagrik:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>You Retain Ownership:</strong> You retain full copyright and intellectual property rights in all original text, photos, and video dispatches you create.</li>
            <li><strong>Non-Exclusive License:</strong> You grant Wizzling Pvt Ltd a worldwide, non-exclusive, transferable, royalty-free license to host, transcode, cache, stream, distribute, index, and display your submitted content across our web domains, mobile apps, syndication feeds, and social media channels.</li>
            <li><strong>Third-Party Commercialization:</strong> Because the license is non-exclusive, you remain free to license, sell, or broadcast your original camera footage to third-party television networks, documentary producers, or news publishers.</li>
          </ul>
        </section>

        {/* 3. THIRD-PARTY RIGHTS */}
        <section id="third-party-rights" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Third-Party Rights &amp; Statutory Fair Dealing
            </h2>
          </div>
          <p>
            Nagrik respects third-party intellectual property rights. Material authored by third parties may only be included in news dispatches when:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>The publisher holds explicit written permission or a valid commercial license.</li>
            <li>The use falls strictly within statutory <strong>Fair Dealing for News Reporting</strong> under Section 52(1)(a) of the <strong>Indian Copyright Act, 1957</strong> or fair use under international copyright law.</li>
            <li>Proper attribution and citation of the original source is clearly displayed.</li>
          </ul>
        </section>

        {/* 4. TAKEDOWN NOTICE */}
        <section id="takedown-notice" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Submitting a Copyright Takedown Notice
            </h2>
          </div>
          <p>
            If you are a copyright owner or authorized agent and believe that content hosted on Nagrik infringes your copyright, please send a formal written notice to our designated Copyright Agent at <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a> including:
          </p>
          <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Required Notice Particulars:</div>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>A physical or electronic signature of the person authorized to act on behalf of the copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed (or a representative list).</li>
              <li>Identification of the material claimed to be infringing, with the specific Nagrik URL (e.g., <em>https://nagrik.news/news/[id]</em>).</li>
              <li>Your contact information: full name, address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement, under penalty of perjury, that the information in the notification is accurate and that you are authorized to act on behalf of the owner.</li>
            </ol>
          </div>
        </section>

        {/* 5. COUNTER-NOTICE */}
        <section id="counter-notice" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Counter-Notice &amp; Appeal Workflow
            </h2>
          </div>
          <p>
            If a contributor believes their content was removed or disabled as a result of mistake or misidentification, they may file a counter-notice by emailing <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a> containing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Identification of the material that has been removed and the location where it previously appeared.</li>
            <li>A statement that the subscriber consents to the jurisdiction of the competent court in Patna, Bihar.</li>
            <li>A statement under penalty of perjury that the subscriber has a good faith belief that the material was removed by mistake.</li>
            <li>The subscriber’s physical or electronic signature and contact information.</li>
          </ul>
        </section>

        {/* 6. TRADEMARK & LOGO */}
        <section id="trademark-logo" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Trademark &amp; Brand Asset Usage
            </h2>
          </div>
          <p>
            You may not use the Nagrik name, logo, wordmark, or brand graphics in a way that falsely implies official employment, agency endorsement, or institutional sponsorship without a written agreement from Wizzling Pvt Ltd.
          </p>
        </section>

        {/* 7. REPEAT INFRINGER */}
        <section id="repeat-infringer" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Repeat Infringer Policy
            </h2>
          </div>
          <p>
            Under our publisher terms and statutory intermediary safe harbor rules, publisher accounts that receive multiple verified copyright takedown notices will be permanently terminated, and pending monetization credits will be forfeited.
          </p>
        </section>

        {/* 8. CONTACT */}
        <section id="contact" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Designated Copyright Agent
            </h2>
          </div>
          <p>
            All copyright notices and statutory inquiries should be addressed to:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Designated Officer:</strong> Copyright &amp; Legal Desk, Wizzling Pvt Ltd</div>
            <div><strong className="text-slate-950 dark:text-white">Registered Address:</strong> Koilwar, Arrah, Bhojpur, Bihar – 802163, India</div>
            <div><strong className="text-slate-950 dark:text-white">Direct Email:</strong> <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline">wizzlingsupport@gmail.com</a></div>
            <div><strong className="text-slate-950 dark:text-white">Helpline Phone:</strong> <a href="tel:+918890043675" className="text-[#DE5227] underline">+91 8890043675</a></div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
