'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radio,
  ShieldCheck,
  Users,
  Video,
  MapPin,
  Mail,
  FileText,
  Building2,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const AboutView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'mission', label: '1. What Nagrik Is & Our Purpose' },
    { id: 'hyperlocal', label: '2. Hyperlocal Focus & Coverage Scope' },
    { id: 'content-types', label: '3. Types of Content We Publish' },
    { id: 'ecosystem', label: '4. Publisher & Creator Ecosystem' },
    { id: 'video-journalism', label: '5. Field Video Journalism' },
    { id: 'public-interest', label: '6. Public-Interest Information' },
    { id: 'ownership', label: '7. Legal Entity & Ownership' },
    { id: 'contact', label: '8. Official Contact Channels' }
  ];

  return (
    <LegalLayout
      title="About Nagrik"
      hindiTitle="नागरिक के बारे में"
      subtitle="A hyperlocal news and citizen journalism platform dedicated to ground-level civic reporting, municipal transparency, and public-interest dispatches across India."
      category="About"
      lastUpdated="September 2026"
      version="2026.2"
      activeSlug="about"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── INTRO BANNER ── */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#DE5227] to-[#B83E18] text-white space-y-3 shadow-lg shadow-orange-950/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-mono font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>INDIAN HYPERLOCAL NEWS PLATFORM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif leading-tight">
            Connecting citizens to the real issues that shape their everyday lives.
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            Nagrik is built on the belief that everyday local realities—from neighborhood sanitation and drinking water pipelines to district hospital facilities, local governance decisions, and road safety—matter just as much as national headlines. We aim to provide accurate and useful local information.
          </p>
        </div>

        {/* ── SECTION 1: WHAT NAGRIK IS ── */}
        <section id="mission" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> What Nagrik Is &amp; Our Purpose
            </h2>
          </div>
          <p>
            <strong>Nagrik</strong> (<em>nagrik.news</em>) is an Indian digital news and media platform operating via web and mobile interfaces. Founded by independent media professionals, community journalists, and technologists, Nagrik was created to give local communities a reliable, direct voice.
          </p>
          <p>
            Our core purpose is to bridge the information gap in municipal, rural, and sub-district reporting. While national and state television channels and major print dailies often prioritize political debates and metropolitan events, Nagrik focuses directly on grassroots community issues that affect citizens directly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Community-Centric</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Centered on the challenges, achievements, and everyday civic needs of residents.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Transparent Provenance</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Clear author bylines, source attribution, and honest correction policies on every report.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Public Accountability</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Serving as a constructive conduit between the public and municipal administration.</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: HYPERLOCAL FOCUS ── */}
        <section id="hyperlocal" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Hyperlocal Focus &amp; Geographic Scope
            </h2>
          </div>
          <p>
            Nagrik organizes reporting hierarchically across localities, wards, cities, and administrative districts:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-950 dark:text-white">Locality &amp; Ward Coverage:</strong> Direct reporting on neighborhood roadworks, street lighting, drainage, water supply, and municipal health centers.
            </li>
            <li>
              <strong className="text-slate-950 dark:text-white">Town &amp; City Dispatches:</strong> Coverage of municipal corporation meetings, public transport updates, local market developments, and citywide civil initiatives.
            </li>
            <li>
              <strong className="text-slate-950 dark:text-white">District &amp; Rural Clusters:</strong> Coverage of district collectorate advisories, agriculture updates, rural development schemes, and regional infrastructure projects across Bihar, Uttar Pradesh, and neighboring regions.
            </li>
          </ul>
        </section>

        {/* ── SECTION 3: TYPES OF CONTENT ── */}
        <section id="content-types" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Types of Content We Publish
            </h2>
          </div>
          <p>
            Nagrik publishes a wide range of civic and public-interest material:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Civic &amp; Municipal Reports</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Ground inquiries into public services, civil infrastructure repairs, water supply quality, and local governance accountability.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Official Notices &amp; Public Advisories</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Weather advisories, district emergency notices, vaccination drives, traffic detours, and government beneficiary welfare announcements.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Community &amp; Cultural Life</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Coverage of local festivals, community education initiatives, public sports tournaments, and grassroots civic achievements.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Public Safety &amp; Emergency Updates</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Factual reporting on local incidents, flood warnings, fire emergencies, and traffic updates, handled with ethical restraint.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: PUBLISHER & CREATOR ECOSYSTEM ── */}
        <section id="ecosystem" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> The Publisher &amp; Creator Ecosystem
            </h2>
          </div>
          <p>
            Nagrik operates an open, accountable publisher network that empowers local stringers, independent journalists, and citizen contributors:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Verified Identity:</strong> Contributors submit identification details before publishing to prevent anonymity misuse and ensure individual accountability.
            </li>
            <li>
              <strong>Editorial Standards:</strong> Every contributor is required to abide by our <Link href="/editorial-guidelines" className="text-[#DE5227] underline">Editorial Guidelines</Link> and <Link href="/publisher-guidelines" className="text-[#DE5227] underline">Publisher Guidelines</Link>.
            </li>
            <li>
              <strong>Author Intellectual Property:</strong> Creators retain the copyright to their original footage and work, while granting Nagrik the non-exclusive license to host and distribute it.
            </li>
            <li>
              <strong>Transparent Monetization:</strong> Active publishers are compensated transparently based on genuine public readership engagement, paid directly via Indian banking/UPI rails.
            </li>
          </ul>
        </section>

        {/* ── SECTION 5: VIDEO JOURNALISM ── */}
        <section id="video-journalism" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Ground Field Video Journalism
            </h2>
          </div>
          <p>
            Video is at the heart of Nagrik. Field reporters capture on-camera interviews with local residents, record visual proof of public infrastructure conditions, and deliver short-format video dispatches that are easily accessible to citizens on smartphones across rural and urban India.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            All submitted videos undergo pre-publication and post-publication reviews to filter out deceptive edits, unverified claims, graphic violence, or synthetic media (deepfakes).
          </p>
        </section>

        {/* ── SECTION 6: PUBLIC INTEREST INFORMATION ── */}
        <section id="public-interest" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Public-Interest Information &amp; Editorial Neutrality
            </h2>
          </div>
          <p>
            Nagrik maintains an independent editorial line. We do not accept political party funding, corporate PR syndication disguised as news, or sponsored bias. When articles cover political figures, municipal elections, or public disputes, our contributors are required to present balanced perspectives and seek comments from relevant public authorities where feasible.
          </p>
        </section>

        {/* ── SECTION 7: LEGAL ENTITY & OWNERSHIP ── */}
        <section id="ownership" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Legal Entity &amp; Ownership Particulars
            </h2>
          </div>
          <p>
            In compliance with Indian media disclosure standards, the legal entity owning and operating the Nagrik digital news platform is:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1.5 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Operating Entity:</strong> Nagrik Media Trust</div>
            <div><strong className="text-slate-950 dark:text-white">Headquarters / Principal Office:</strong> Bureau House, Fraser Road, Patna, Bihar – 800001, India</div>
            <div><strong className="text-slate-950 dark:text-white">Domain:</strong> nagrik.news</div>
            <div><strong className="text-slate-950 dark:text-white">Jurisdiction:</strong> Republic of India</div>
          </div>
        </section>

        {/* ── SECTION 8: CONTACT ── */}
        <section id="contact" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Official Contact &amp; Bureau Desks
            </h2>
          </div>
          <p>
            Citizens, publishers, and authorities can reach our teams directly via verified email channels:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">General Information</div>
              <a href="mailto:contact@nagrik.news" className="text-[#DE5227] font-bold underline">contact@nagrik.news</a>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Editorial Desk &amp; Corrections</div>
              <a href="mailto:editor@nagrik.news" className="text-[#DE5227] font-bold underline">editor@nagrik.news</a>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Publisher Support</div>
              <a href="mailto:publishers@nagrik.news" className="text-[#DE5227] font-bold underline">publishers@nagrik.news</a>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Resident Grievance Officer</div>
              <a href="mailto:grievance@nagrik.news" className="text-[#DE5227] font-bold underline">grievance@nagrik.news</a>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE5227] hover:underline"
            >
              <span>Visit Public Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
