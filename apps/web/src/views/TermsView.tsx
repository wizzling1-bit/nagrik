'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Lock,
  DollarSign,
  ShieldCheck,
  Scale,
  Clock,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export const TermsView: React.FC = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialTab = searchParams ? searchParams.get('tab') || 'terms' : 'terms';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [cmsPages, setCmsPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_pages')
          .select('*')
          .eq('is_published', true);

        if (!error && data && data.length > 0) {
          setCmsPages(data);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic legal pages via Supabase, using defaults:', err);
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

  const tocItems: TocItem[] = [
    { id: 'acceptance', label: '1. Acceptance & Eligibility' },
    { id: 'reporting-rules', label: '2. Citizen Reporting Rules' },
    { id: 'monetization', label: '3. Contributor Monetization & UPI' },
    { id: 'intellectual-property', label: '4. 100% IP & Copyright Ownership' },
    { id: 'dmca', label: '5. DMCA & Copyright Act 1957 Takedown' },
    { id: 'liability', label: '6. Limitation of Liability' },
    { id: 'disputes', label: '7. Jurisdiction & Arbitration' }
  ];

  return (
    <LegalLayout
      title="Terms of Service & Platform Charter"
      hindiTitle="सेवा की शर्तें एवं मंच घोषणापत्र"
      subtitle="Effective September 2026. Governing all access to Nagrik website, Publisher Studio, and mobile applications across India."
      category="Legal & Terms"
      lastUpdated="September 2026"
      version="2026.2"
      activeSlug="terms"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT NOTICE ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-slate-800 dark:text-orange-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Scale className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Binding Legal Contract</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            By creating an account, browsing civic dispatches, or submitting ground reports on Nagrik, you enter into a binding agreement with Nagrik Media Trust. Please also read our dedicated <Link href="/privacy" className="text-[#DE5227] underline font-bold">Privacy Policy</Link>, <Link href="/guidelines" className="text-[#DE5227] underline font-bold">Editorial Standards</Link>, and <Link href="/grievance" className="text-[#DE5227] underline font-bold">Grievance Redressal</Link> procedures.
          </p>
        </div>

        {/* ── SECTION 1: ACCEPTANCE ── */}
        <section id="acceptance" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Acceptance & Platform Eligibility
            </h2>
          </div>
          <p>
            You must be at least 18 years of age to register as a citizen stringer, upload news reports, or receive monetization payouts. By using this service, you represent that you possess the full legal capacity to enter into these terms under the <strong>Indian Contract Act, 1872</strong>.
          </p>
          <p>
            If you are accessing the service on behalf of an institutional publisher, NGO, or media bureau, you warrant that you hold legitimate delegated authority to bind that entity.
          </p>
        </section>

        {/* ── SECTION 2: REPORTING RULES ── */}
        <section id="reporting-rules" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Citizen Reporting & Ground Authenticity Rules
            </h2>
          </div>
          <p>
            Nagrik exists to advance authentic public-interest civic reporting. Contributor privileges are subject to the following non-negotiable requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Authentic Physical Presence:</strong> You must not spoof device location or upload footage of events at which you were not physically present.</li>
            <li><strong>Prohibition of Deepfakes:</strong> Unlabeled synthetic media, voice clones, or deceptive AI-generated footage are strictly banned and will result in immediate permanent account termination.</li>
            <li><strong>No Extortion or Blackmail:</strong> Using Nagrik citizen credentials to threaten, extort, or demand kickbacks from municipal contractors, hospital staff, or citizens is a criminal offence that will be reported to the police.</li>
          </ul>
        </section>

        {/* ── SECTION 3: MONETIZATION ── */}
        <section id="monetization" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Contributor Monetization & UPI Settlement Terms
            </h2>
          </div>
          <p>
            Active publishers and citizen stringers earn compensation on verified public engagement under our transparent monetization charter:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-[#DE5227] font-mono text-sm">$1.50 CPM Baseline</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Calculated at approximately ₹129 INR per 1,000 verified human reads with 5+ seconds active dwell time.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-emerald-600 font-mono text-sm">₹850 INR Threshold</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Low $10 USD equivalent payout threshold. No platform commission deductions on creator earnings.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-blue-600 font-mono text-sm">24–48 Hr Disbursal</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Direct to your verified UPI VPA ID or Indian Bank Account via NEFT/IMPS rails.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Tax Withholding (TDS):</strong> In compliance with Sections 194C and 194R of the Income Tax Act, 1961, applicable TDS may be deducted for creators exceeding annual statutory thresholds, against their verified PAN.
          </p>
        </section>

        {/* ── SECTION 4: INTELLECTUAL PROPERTY ── */}
        <section id="intellectual-property" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> 100% Intellectual Property & Copyright Ownership
            </h2>
          </div>
          <p>
            <strong>You own your footage.</strong> Unlike legacy media corporations that claim exclusive copyright over your video dispatches, Nagrik operates on an author-first framework:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>You retain 100% copyright and intellectual property rights in all original photographs, video footage, and text submitted.</li>
            <li>You grant Nagrik a worldwide, non-exclusive, royalty-free license to host, transcode, stream, distribute, and display your report across our mobile applications, web portals, and RSS syndication feeds.</li>
            <li>You are free to license your original footage to third-party documentary filmmakers, news agencies, or television channels.</li>
          </ul>
        </section>

        {/* ── SECTION 5: DMCA & COPYRIGHT ── */}
        <section id="dmca" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> DMCA & Indian Copyright Act 1957 Takedown Protocol
            </h2>
          </div>
          <p>
            Nagrik respects third-party intellectual property and responds promptly to valid statutory infringement notices under the <strong>Indian Copyright Act, 1957</strong> and the <strong>DMCA (17 U.S.C. § 512)</strong>:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs space-y-2">
            <div>
              To submit a formal copyright takedown, email our designated Copyright & Legal Agent at <a href="mailto:copyright@nagrik.news" className="text-[#DE5227] font-bold underline">copyright@nagrik.news</a> with:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Identification of the copyrighted work claimed to be infringed.</li>
              <li>The exact URL on Nagrik where the infringing material is located.</li>
              <li>A statement of good faith belief that the use is unauthorized.</li>
              <li>Physical or electronic signature of the copyright owner or authorized representative.</li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 6: LIABILITY ── */}
        <section id="liability" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Limitation of Liability & Intermediary Safe Harbor
            </h2>
          </div>
          <p>
            Nagrik operates as an intermediary under <strong>Section 79 of the Information Technology Act, 2000</strong>. Content uploaded by citizen contributors reflects the independent observations of the respective stringers and does not represent the official stance of Nagrik Media Trust.
          </p>
          <p>
            To the maximum extent permitted by Indian law, Nagrik shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime or municipal actions arising from citizen journalism dispatches.
          </p>
        </section>

        {/* ── SECTION 7: DISPUTES ── */}
        <section id="disputes" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Governing Law & Dispute Resolution
            </h2>
          </div>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India.
          </p>
          <p>
            Any legal dispute, controversy, or claim arising out of these terms shall be submitted to the exclusive jurisdiction of the competent civil courts in <strong>Patna, Bihar</strong>, following an initial mandatory 30-day amicable conciliation period.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
