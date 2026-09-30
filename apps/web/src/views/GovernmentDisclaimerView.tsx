'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  FileCheck2,
  ExternalLink,
  Scale,
  CheckCircle2,
  ArrowRight,
  Info,
  Globe2,
  AlertTriangle
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';
import { LEGAL_CONFIG } from '@/config/legalConstants';

export const GovernmentDisclaimerView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'non-affiliation', label: '1. Non-Affiliation Declaration' },
    { id: 'no-government-services', label: '2. No Government Services' },
    { id: 'public-information', label: '3. Use of Public Information' },
    { id: 'official-sources-directory', label: '4. Official Sources Directory' },
    { id: 'user-verification', label: '5. User Verification Advisory' },
    { id: 'reporting-corrections', label: '6. Report Inaccuracies' }
  ];

  return (
    <LegalLayout
      title="Government Information Disclaimer"
      hindiTitle="सरकारी सूचना एवं गैर-संबद्धता अस्वीकरण"
      subtitle="Statutory statement clarifying that Nagrik is an independent journalistic platform operated by Wizzling Pvt Ltd and is not an official government application."
      category="Legal & Compliance"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="government-disclaimer"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── STATUTORY HIGHLIGHT BOX ── */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-3">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-[#DE5227] shrink-0" />
            <span>{language === 'hi' ? 'महत्वपूर्ण वैधानिक प्रकटीकरण' : 'Critical Statutory Disclosure'}</span>
          </div>
          <p className="leading-relaxed font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
            {language === 'hi' ? LEGAL_CONFIG.disclaimer.fullHi : LEGAL_CONFIG.disclaimer.fullEn}
          </p>
        </div>

        {/* 1. NON-AFFILIATION DECLARATION */}
        <section id="non-affiliation" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Non-Affiliation Declaration
            </h2>
          </div>
          <p>
            <strong>Nagrik</strong> is an independent digital news, community journalism, and civic information platform conceived, developed, and maintained exclusively by <strong>{LEGAL_CONFIG.companyName}</strong>, a private limited company incorporated under the laws of India.
          </p>
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#DE5227]" />
              <span>Independent Corporate Entity</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Nagrik is <strong>NOT</strong> owned, operated, authorized, funded, or partnered with the Government of India.</li>
              <li>Nagrik is <strong>NOT</strong> affiliated with or endorsed by any State Government, Union Territory Administration, District Administration, Municipal Corporation, Nagar Panchayat, Gram Panchayat, or statutory board.</li>
              <li>Nagrik does <strong>NOT</strong> hold any special authorization or designation as an official public service bulletin.</li>
            </ul>
          </div>
        </section>

        {/* 2. NO GOVERNMENT SERVICES */}
        <section id="no-government-services" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> No Government Services or Representation
            </h2>
          </div>
          <p>
            Nagrik functions strictly as a news reporting, video journalism, and civic awareness application. It does not provide or facilitate direct government services, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Issuance of birth, death, caste, income, or domicile certificates.</li>
            <li>Processing of passport, driving license, voter registration, or Aadhaar updates.</li>
            <li>Collection of taxes, municipal duties, water bills, or utility payments on behalf of the state.</li>
            <li>Adjudication of judicial disputes or police FIR registrations.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Citizens seeking official government services should visit designated portals such as <strong>india.gov.in</strong> or their respective State Service Delivery Gateways (SSDG).
          </p>
        </section>

        {/* 3. PUBLIC INFORMATION */}
        <section id="public-information" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Reporting of Public and Government Information
            </h2>
          </div>
          <p>
            In the ordinary course of journalistic reporting, Nagrik field stringers and editorial staff report on public administrative decisions, municipal projects, disaster warnings, meteorological advisories, and welfare schemes.
          </p>
          <p>
            When such information is published:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Information is sourced from <strong>publicly accessible official government websites</strong>, press conferences, official gazettes, or press releases issued by public information officers.</li>
            <li>The issuing department, municipal corporation, or meteorological bureau is clearly named in the article byline or metadata block.</li>
            <li>Where technically feasible, direct links to official circulars or authoritative URLs are provided for reader verification.</li>
          </ul>
        </section>

        {/* 4. OFFICIAL SOURCES DIRECTORY */}
        <section id="official-sources-directory" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Verified Official Sources Directory
            </h2>
          </div>
          <p>
            Below are examples of official public authorities whose data, weather bulletins, and public notices may be legitimately referenced by Nagrik news dispatches:
          </p>
          <div className="space-y-3 pt-1">
            {LEGAL_CONFIG.officialSources.map((source, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{source.name}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DE5227] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{source.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {source.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            For our complete attribution policy, please review our <Link href="/sources" className="text-[#DE5227] underline">Sources &amp; Attribution Policy</Link>.
          </p>
        </section>

        {/* 5. USER VERIFICATION ADVISORY */}
        <section id="user-verification" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> User Verification Advisory
            </h2>
          </div>
          <p>
            While Nagrik makes every reasonable effort to verify information and adhere to strict editorial standards, government policies, circulars, application deadlines, and civic rules may change rapidly.
          </p>
          <p>
            <strong>Readers and citizens are strongly advised to independently verify all critical government schemes, job vacancy notices, exam dates, disaster advisories, or statutory notices directly with the original issuing authority or official government portal before taking any action.</strong>
          </p>
        </section>

        {/* 6. REPORT INACCURACIES */}
        <section id="reporting-corrections" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Reporting Inaccuracies &amp; Contact Desk
            </h2>
          </div>
          <p>
            If you notice any inaccurate citation of government data or misleading representation in any story, please submit an immediate correction notice:
          </p>
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white">
              Direct Contact Channels
            </div>
            <div>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${LEGAL_CONFIG.contacts.supportEmail}`} className="text-[#DE5227] hover:underline font-mono">
                {LEGAL_CONFIG.contacts.supportEmail}
              </a>
            </div>
            <div>
              <strong>Helpline Phone:</strong>{' '}
              <a href={LEGAL_CONFIG.contacts.phoneTel} className="text-slate-800 dark:text-slate-200 hover:text-[#DE5227] font-mono">
                {LEGAL_CONFIG.contacts.phone}
              </a>
            </div>
            <div>
              <strong>Registered Bureau:</strong> {LEGAL_CONFIG.registeredAddress.fullFormatted}
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 font-bold text-[#DE5227] hover:underline"
              >
                <span>Visit Contact Desk</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:underline"
              >
                <span>Submit Content Report</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
