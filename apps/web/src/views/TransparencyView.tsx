'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Video,
  FileText,
  Users,
  Radio,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const TransparencyView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'publishing-model', label: '1. The Nagrik Publishing Model' },
    { id: 'seven-tiers', label: '2. The 7 Streams of Content' },
    { id: 'display-transparency', label: '3. How Sourcing is Displayed on Articles' },
    { id: 'editorial-oversight', label: '4. Newsroom Editorial Oversight' },
    { id: 'financial-independence', label: '5. Financial & Revenue Transparency' }
  ];

  const streams = [
    {
      num: '1',
      title: 'Original Nagrik Ground Reporting',
      badge: 'ORIGINAL REPORTING',
      desc: 'Investigative stories, on-site interviews, and municipal checks produced directly by accredited Nagrik bureau correspondents and permanent field staff.'
    },
    {
      num: '2',
      title: 'Publisher & Independent Creator Dispatches',
      badge: 'COMMUNITY CORRESPONDENT',
      desc: 'Dispatches authored by verified citizen stringers and local independent media creators across districts, reviewed by our desk prior to public distribution.'
    },
    {
      num: '3',
      title: 'Third-Party & Aggregated News Agencies',
      badge: 'SYNDICATED / WIRE',
      desc: 'State or national news stories licensed or referenced from established regional wire services (such as PTI, ANI, or local syndicates), always displaying original source attribution.'
    },
    {
      num: '4',
      title: 'Public & Government Authority Notices',
      badge: 'OFFICIAL NOTICE',
      desc: 'District magistrate advisories, municipal corporation updates, health department alerts, and official government releases, citing official order numbers.'
    },
    {
      num: '5',
      title: 'Press Releases & Institutional Announcements',
      badge: 'PRESS RELEASE',
      desc: 'Statements issued by universities, public trusts, trade associations, or corporate entities, explicitly labeled to prevent confusion with independent journalism.'
    },
    {
      num: '6',
      title: 'Citizen Eyewitness Information & Tips',
      badge: 'COMMUNITY TIP',
      desc: 'Firsthand photo or video tips submitted by local residents witnessing an active civic event, evaluated for geographic proximity before wider broadcast.'
    },
    {
      num: '7',
      title: 'Field Video Reports & Ground Footage',
      badge: 'VIDEO DISPATCH',
      desc: 'Short-format and full-length documentary field footage showing local infrastructure, road conditions, hospital wards, and community hearings.'
    }
  ];

  return (
    <LegalLayout
      title="Transparency & Sourcing Disclosure"
      hindiTitle="पारदर्शिता एवं स्रोत प्रकटीकरण"
      subtitle="How news is gathered, categorized, verified, and transparently attributed across the Nagrik hyperlocal platform."
      category="Transparency"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="transparency"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Layers className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Open &amp; Transparent Publishing Framework</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            We believe that journalism cannot be trusted without full transparency about where each story originated. Nagrik clearly categorizes every report into one of seven transparent streams so you always know who created the content and how it was verified.
          </p>
        </div>

        {/* 1. PUBLISHING MODEL */}
        <section id="publishing-model" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> The Nagrik Publishing Model
            </h2>
          </div>
          <p>
            Nagrik combines professional bureau leadership with a decentralized network of verified ground stringers and community journalists. This allows us to deliver granular coverage of municipal wards and rural sub-districts that legacy television and print media often neglect.
          </p>
          <p>
            To avoid confusion between institutional reporting, independent creator dispatches, and official government advisories, our platform applies uniform attribution standards across web and mobile apps.
          </p>
        </section>

        {/* 2. THE 7 STREAMS */}
        <section id="seven-tiers" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> The 7 Streams of Content
            </h2>
          </div>
          <p>
            Every story published on Nagrik falls into one of these explicit categories:
          </p>

          <div className="space-y-3 pt-1">
            {streams.map((stream) => (
              <div
                key={stream.num}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5 text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#DE5227] text-white flex items-center justify-center font-mono text-[10px]">
                      {stream.num}
                    </span>
                    <span>{stream.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-stone-200/80 dark:border-slate-700">
                    {stream.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {stream.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. DISPLAY TRANSPARENCY */}
        <section id="display-transparency" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> How Sourcing is Displayed on Articles
            </h2>
          </div>
          <p>
            When you view any article or video dispatch on Nagrik, the header and metadata sections clearly display:
          </p>
          <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs font-mono space-y-2">
            <div><strong className="text-slate-900 dark:text-white">Published:</strong> Standard IST publication timestamp (e.g. 28 Sept 2026, 14:30 IST)</div>
            <div><strong className="text-slate-900 dark:text-white">Updated:</strong> Modification timestamp whenever facts or notes are amended</div>
            <div><strong className="text-slate-900 dark:text-white">By:</strong> Verified author or stringer name, linked to their verified profile</div>
            <div><strong className="text-slate-900 dark:text-white">Source:</strong> Originating agency or "Original Nagrik Reporting" with canonical link</div>
            <div><strong className="text-slate-900 dark:text-white">Location:</strong> Locality, Municipal Ward, Town, and District</div>
          </div>
        </section>

        {/* 4. EDITORIAL OVERSIGHT */}
        <section id="editorial-oversight" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Newsroom Editorial Oversight
            </h2>
          </div>
          <p>
            Community dispatches are reviewed by desk editors prior to public indexing. Content flagged by automated filters or reader reports is pulled for immediate human evaluation. Review our complete <Link href="/editorial-guidelines" className="text-[#DE5227] underline">Editorial Guidelines</Link> and <Link href="/corrections" className="text-[#DE5227] underline">Corrections Policy</Link>.
          </p>
        </section>

        {/* 5. FINANCIAL TRANSPARENCY */}
        <section id="financial-independence" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Financial &amp; Revenue Transparency
            </h2>
          </div>
          <p>
            Nagrik is funded through transparent digital advertising and transparent reader support. We do not accept political party donations or corporate propaganda retainers. Contributor payouts are calculated algorithmically based on genuine public readership and paid through verified banking channels.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
