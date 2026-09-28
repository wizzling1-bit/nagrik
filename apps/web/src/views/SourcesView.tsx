'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Radio,
  ArrowRight
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const SourcesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'attribution-principles', label: '1. Core Attribution Principles' },
    { id: 'original-reporting', label: '2. Original Nagrik Ground Reporting' },
    { id: 'third-party', label: '3. Third-Party Content & Wire Services' },
    { id: 'government-releases', label: '4. Government & Public Authorities' },
    { id: 'press-releases', label: '5. Press Releases & Corporate Notices' },
    { id: 'user-submissions', label: '6. Community & Stringer Submissions' },
    { id: 'republishing-limits', label: '7. Republishing & Syndication Limits' },
    { id: 'links-preservation', label: '8. Hyperlink & Citation Integrity' }
  ];

  return (
    <LegalLayout
      title="Sources & Attribution Policy"
      hindiTitle="स्रोत एवं श्रेय नीति"
      subtitle="How Nagrik attributes news dispatches, identifies original field work, credits third-party sources, and preserves citation transparency."
      category="Editorial Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="sources"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <BookOpen className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Honest Sourcing &amp; Provenance</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Every citizen has the right to know who produced the news they read. Nagrik clearly identifies the origin of every report—distinguishing original field investigations from syndicated wire material, government circulars, and community eyewitness submissions.
          </p>
        </div>

        {/* 1. CORE ATTRIBUTION PRINCIPLES */}
        <section id="attribution-principles" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Core Attribution Principles
            </h2>
          </div>
          <p>
            Transparency of sources is the cornerstone of public trust. Nagrik enforces three foundational rules across all published materials:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Clear Provenance:</strong> Every article must display its author, publishing stringer, agency, or official authority.</li>
            <li><strong>No False Claims of Originality:</strong> Aggregating or summarizing a report from another publication must never be claimed as original Nagrik reporting.</li>
            <li><strong>Direct Attribution:</strong> Quotations, statistics, and legal findings must be directly attributed to their source in the body of the article.</li>
          </ul>
        </section>

        {/* 2. ORIGINAL REPORTING */}
        <section id="original-reporting" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Original Nagrik Ground Reporting
            </h2>
          </div>
          <p>
            When a dispatch is researched, filmed, and authored directly on the ground by an accredited Nagrik stringer or bureau correspondent, it is labeled as:
          </p>
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3 text-xs">
            <span className="px-2 py-1 bg-emerald-600 text-white rounded-md font-mono font-bold text-[10px]">ORIGINAL REPORTING</span>
            <span className="text-emerald-950 dark:text-emerald-300">
              Produced directly by Nagrik field correspondents through firsthand interviews and physical on-site documentation.
            </span>
          </div>
        </section>

        {/* 3. THIRD-PARTY CONTENT */}
        <section id="third-party" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Third-Party Content &amp; Wire Services
            </h2>
          </div>
          <p>
            When Nagrik republishes or references reporting from established regional news agencies, newspapers, or digital outlets:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>The original media house is prominently named in the article byline or metadata block (e.g., <em>"Source: PTI / ANI / Local Agency"</em>).</li>
            <li>Direct canonical hyperlinks to the original reporting are included whenever technically and legally feasible.</li>
            <li>Republishing third-party news does not imply that Nagrik has independently re-verified all underlying field assertions.</li>
          </ul>
        </section>

        {/* 4. GOVERNMENT RELEASES */}
        <section id="government-releases" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Government &amp; Public Authorities
            </h2>
          </div>
          <p>
            Official circulars, disaster advisories, police FIR summaries, and municipal bulletins are explicitly identified by the issuing government department:
          </p>
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-blue-950 dark:text-blue-200">Official Public Authority Bulletin</div>
            <p className="text-blue-900 dark:text-blue-300 text-[11px]">
              Attributed to the specific administrative organ (e.g., <em>District Magistrate Office, Municipal Corporation, State Health Society</em>) along with the official reference or notification number.
            </p>
          </div>
        </section>

        {/* 5. PRESS RELEASES */}
        <section id="press-releases" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Press Releases &amp; Corporate Notices
            </h2>
          </div>
          <p>
            Material provided by corporations, NGOs, political parties, or public relations representatives must be clearly identified as a <strong>Press Release</strong>. Press release copy must never be presented as independent investigative reporting.
          </p>
        </section>

        {/* 6. USER SUBMISSIONS */}
        <section id="user-submissions" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Community &amp; Stringer Submissions
            </h2>
          </div>
          <p>
            Reports submitted by citizen stringers and independent local creators undergo desk review and are labeled with the contributor's verified name and locality. We do not claim every community dispatch is independently audited by a central laboratory; readers are given honest context regarding the grassroots nature of the reporting.
          </p>
        </section>

        {/* 7. REPUBLISHING LIMITS */}
        <section id="republishing-limits" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Republishing &amp; Syndication Limits
            </h2>
          </div>
          <p>
            Nagrik contributors are prohibited from scraping, wholesale copy-pasting, or re-hosting third-party articles without authorization. Any aggregated content must comply strictly with fair dealing exceptions under the <strong>Indian Copyright Act, 1957</strong> and include significant original context or analysis.
          </p>
        </section>

        {/* 8. LINKS PRESERVATION */}
        <section id="links-preservation" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Hyperlink &amp; Citation Integrity
            </h2>
          </div>
          <p>
            Where digital source URLs exist (such as official court orders, government gazette notifications, or original research reports), our publishing system preserves outbound links to allow readers to verify primary documents directly.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
