'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scale,
  Clock,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Building
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const GrievanceView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'statutory', label: '1. Statutory Mandate (IT Rules 2021)' },
    { id: 'officer', label: '2. Resident Grievance Officer (RGO)' },
    { id: 'process', label: '3. Complaint Submission Procedure' },
    { id: 'timelines', label: '4. Mandatory Statutory Timelines' },
    { id: 'three-tier', label: '5. Three-Tier Redressal Hierarchy' },
    { id: 'gac', label: '6. Grievance Appellate Committee (GAC)' }
  ];

  return (
    <LegalLayout
      title="Statutory Grievance Redressal Mechanism"
      hindiTitle="सांविधिक शिकायत निवारण तंत्र"
      subtitle="In compliance with Rule 11 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Digital Media Publisher Norms."
      category="Statutory Compliance"
      lastUpdated="September 2026"
      version="2026.2"
      activeSlug="grievance"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── STATUTORY CALLOUT ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-slate-800 dark:text-orange-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Scale className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>IT Rules 2021 Resident Grievance Desk</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            As a digital news publisher and intermediary platform operating in India, Nagrik maintains a dedicated Resident Grievance Officer located within India to receive and resolve complaints regarding content violations, defamation, copyright infringement, or ethics code breaches.
          </p>
        </div>

        {/* ── SECTION 1: STATUTORY MANDATE ── */}
        <section id="statutory" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Statutory Mandate & Legal Framework
            </h2>
          </div>
          <p>
            In strict compliance with <strong>Rule 11 and Rule 3(2)</strong> of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (as amended through 2026), and Part III governing digital news publishers, Nagrik adheres to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Norms of Journalistic Conduct issued by the Press Council of India (PCI).</li>
            <li>Programme Code prescribed under Section 5 of the Cable Television Networks (Regulation) Act, 1995.</li>
            <li>General ethics principles ensuring respect for judicial proceedings, communal harmony, and personal dignity.</li>
          </ul>
        </section>

        {/* ── SECTION 2: RGO PARTICULARS ── */}
        <section id="officer" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Resident Grievance Officer (RGO) Particulars
            </h2>
          </div>
          <p>
            Users, aggrieved citizens, or authorized public authorities can direct complaints and official legal notices to our appointed Resident Grievance Officer:
          </p>

          <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-stone-200/90 dark:border-slate-800 space-y-3 shadow-2xs font-mono text-xs text-slate-800 dark:text-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Designated Officer:</span>
                <strong className="text-slate-950 dark:text-white text-sm">Sh. Arvind Verma</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Designation:</span>
                <span className="text-slate-900 dark:text-white font-bold">Resident Grievance Officer & Legal Counsel</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DE5227] shrink-0" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Statutory Email:</span>
                  <a href="mailto:grievance@nagrik.news" className="text-[#DE5227] font-bold underline">
                    grievance@nagrik.news
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Desk Phone:</span>
                  <span className="text-slate-900 dark:text-white font-bold">+91 (612) 220-4912</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Registered Physical Bureau:</span>
                <span className="text-slate-900 dark:text-white">
                  Nagrik Media Trust, Bureau House, Fraser Road, Patna, Bihar – 800001, India
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: COMPLAINT PROCEDURE ── */}
        <section id="process" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Complaint Submission Procedure & Requirements
            </h2>
          </div>
          <p>
            To ensure rapid investigation and prevent frivolous claims, please provide the following details when emailing <a href="mailto:grievance@nagrik.news" className="text-[#DE5227] underline">grievance@nagrik.news</a>:
          </p>

          <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-950 dark:text-white text-xs">Required Complaint Format Checklist:</div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><strong>Complainant Particulars:</strong> Full legal name, official address, telephone number, and government-verified email address.</li>
              <li><strong>Exact URL / Content Link:</strong> The specific Nagrik article, video dispatch, or reporter profile link (e.g. <code className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 font-mono text-[11px]">https://nagrik.news/news/[id]</code>).</li>
              <li><strong>Clause of Violation:</strong> Specific provision of the Code of Ethics or statutory act violated (e.g. defamation, breach of privacy, copyright, inaccurate factual statement).</li>
              <li><strong>Substantiating Proof:</strong> Verifiable documentary evidence contradicting the published statement.</li>
              <li><strong>Declaration of Truth:</strong> A signed affirmation that the details submitted are accurate to the best of your knowledge.</li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 4: TIMELINES ── */}
        <section id="timelines" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Mandatory Statutory Timelines
            </h2>
          </div>
          <p>
            We strictly enforce the timeframes mandated under the IT Rules 2021:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 text-center space-y-1">
              <Clock className="w-5 h-5 text-[#DE5227] mx-auto" />
              <div className="text-lg font-black text-slate-950 dark:text-white font-mono">Within 24 Hours</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Statutory Acknowledgment</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Issuance of formal tracking ticket number to complainant.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 text-center space-y-1">
              <ShieldAlert className="w-5 h-5 text-rose-500 mx-auto" />
              <div className="text-lg font-black text-rose-600 font-mono">Within 24 Hours</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Interim Takedown (Rule 3(2)(b))</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Immediate disabling of non-consensual sexual imagery or deepfakes.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 text-center space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
              <div className="text-lg font-black text-emerald-600 font-mono">Within 15 Days</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Final Resolution & Order</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Formal reasoned order communicating decision to the complainant.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: THREE-TIER HIERARCHY ── */}
        <section id="three-tier" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Three-Tier Redressal Hierarchy
            </h2>
          </div>
          <p>
            Under Part III of the IT Rules 2021, news redressal operates across three tiers of oversight:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 flex items-start gap-2.5">
              <div className="font-bold text-[#DE5227] font-mono shrink-0">Level I:</div>
              <div><strong>Self-Regulation by Publisher:</strong> Internal investigation and resolution by Nagrik's Resident Grievance Officer.</div>
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 flex items-start gap-2.5">
              <div className="font-bold text-amber-600 font-mono shrink-0">Level II:</div>
              <div><strong>Self-Regulating Body of Publishers:</strong> Independent collective body of digital news publishers registered with the Ministry of Information & Broadcasting.</div>
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 flex items-start gap-2.5">
              <div className="font-bold text-emerald-600 font-mono shrink-0">Level III:</div>
              <div><strong>Oversight Mechanism:</strong> Inter-Departmental Committee established by the Ministry of Information and Broadcasting (MIB), Government of India.</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: GAC ESCALATION ── */}
        <section id="gac" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Appeal to the Grievance Appellate Committee (GAC)
            </h2>
          </div>
          <p>
            If you do not receive a response from our Resident Grievance Officer within 15 calendar days, or if you are dissatisfied with our decision, you have the statutory right under <strong>Rule 3A of the IT Rules 2021</strong> to appeal to the Central Government Grievance Appellate Committee:
          </p>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="font-bold text-blue-900 dark:text-blue-200 text-xs">Official GAC Digital Appeals Portal</div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300">File your appeal within 30 days of receiving the publisher order.</div>
            </div>
            <a
              href="https://gac.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition shadow-xs"
            >
              <span>Visit gac.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
