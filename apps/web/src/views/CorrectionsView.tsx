'use client';

import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Mail,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const CorrectionsView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'commitment', label: '1. Commitment to Truth & Accuracy' },
    { id: 'report-error', label: '2. How Users Can Report an Error' },
    { id: 'publisher-corrections', label: '3. Publisher Correction Requests' },
    { id: 'minor-vs-substantive', label: '4. Minor Edits vs. Substantive Corrections' },
    { id: 'review-process', label: '5. Editorial Review Workflow' },
    { id: 'timestamps-notes', label: '6. Timestamps & Correction Notes' },
    { id: 'retractions', label: '7. Retractions & Content Removals' },
    { id: 'serious-errors', label: '8. Handling Serious Errors & Defamation' }
  ];

  return (
    <LegalLayout
      title="Corrections & Retractions Policy"
      hindiTitle="त्रुटि सुधार एवं खंडन नीति"
      subtitle="How Nagrik handles factual inquiries, reader disputes, substantive article corrections, retractions, and public accountability."
      category="Editorial Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="corrections"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT CTA BANNER ── */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#DE5227] to-[#B83E18] text-white space-y-4 shadow-lg shadow-orange-950/20">
          <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" />
            <span>Honest Public Accountability</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif leading-tight">
            Spot a factual error or inaccurate report?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-2xl">
            Nagrik takes accuracy seriously. If an article, headline, statistic, or video contains inaccurate information, we want to know immediately so we can investigate and correct the record.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-stone-100 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-md"
            >
              <span>Report an Error Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="mailto:wizzlingsupport@gmail.com?subject=Correction%20Request"
              className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white underline font-mono"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email: wizzlingsupport@gmail.com</span>
            </a>
          </div>
        </div>

        {/* 1. COMMITMENT TO TRUTH */}
        <section id="commitment" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Commitment to Truth &amp; Accuracy
            </h2>
          </div>
          <p>
            Journalistic credibility is founded on truth. When errors of fact, misidentifications, incorrect dates, erroneous municipal data, or flawed attributions occur, Nagrik is committed to correcting them promptly, transparently, and without defensiveness.
          </p>
          <p>
            We believe that acknowledging mistakes openly reinforces trust with the communities we serve. We do not quietly delete stories or sweep errors under the rug.
          </p>
        </section>

        {/* 2. HOW USERS CAN REPORT AN ERROR */}
        <section id="report-error" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> How Readers Can Report an Error
            </h2>
          </div>
          <p>
            Any reader who spots an inaccuracy in our coverage can submit a correction notice via two official channels:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#DE5227]" />
                <span>Option A: Dedicated Online Reporting Flow</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use our structured reporting tool at <Link href="/report" className="text-[#DE5227] underline font-bold">/report</Link> to select the article, choose the "Incorrect Information" category, and provide the correct factual details.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Option B: Direct Editorial Desk Email</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Email our newsroom desk at <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a> with the headline, article URL, the specific passage in dispute, and supporting documentary evidence or primary sources.
              </p>
            </div>
          </div>
        </section>

        {/* 3. PUBLISHER CORRECTION REQUESTS */}
        <section id="publisher-corrections" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Publisher Correction Requests
            </h2>
          </div>
          <p>
            If a citizen stringer or publisher realizes that an uploaded dispatch contains an inadvertent error, they must not attempt to conceal it. Publishers can submit an edit request directly through the Publisher Studio or email <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a> specifying the article ID and the factual correction.
          </p>
        </section>

        {/* 4. MINOR VS SUBSTANTIVE */}
        <section id="minor-vs-substantive" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Minor Edits vs. Substantive Corrections
            </h2>
          </div>
          <p>
            We distinguish between minor typographical cleanups and substantive factual revisions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">Minor Clarifications / Typo Edits</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Typographical errors, grammatical formatting, punctuation, or minor spelling adjustments that do not alter the factual meaning of the story may be resolved directly without an appended correction note.
              </p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white">Substantive Factual Corrections</div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Changes affecting names, casualty numbers, locations, quotes, key allegations, official dates, or legal statuses. These ALWAYS require an explicit public Correction Note appended to the article.
              </p>
            </div>
          </div>
        </section>

        {/* 5. REVIEW WORKFLOW */}
        <section id="review-process" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Editorial Review Workflow
            </h2>
          </div>
          <p>
            Upon receiving a correction notice, our editorial desk initiates a verification review:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>The reporting editor reviews the disputed passage against primary video footage and source documents.</li>
            <li>If necessary, the desk contacts the original contributor and relevant public authorities for re-confirmation.</li>
            <li>If an error is verified, the article is updated immediately and an explicit Correction Note is inserted.</li>
            <li>The complainant is notified via email of the resolution within 48 hours of review completion.</li>
          </ol>
        </section>

        {/* 6. TIMESTAMPS & NOTES */}
        <section id="timestamps-notes" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Timestamps &amp; Correction Notes
            </h2>
          </div>
          <p>
            When a substantive correction is executed, the following modifications occur on the published story:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>The <strong>Updated</strong> timestamp is refreshed to the exact moment of modification.</li>
            <li>A prominent <strong>Correction Box</strong> is added either directly under the headline or at the conclusion of the story.</li>
            <li>The note explains clearly what was originally reported and what the verified facts are (e.g., <em>"Correction (28 Sept 2026): An earlier version of this report misstated the budget allocated for the municipal canal project. The sanctioned amount is ₹1.4 crore, not ₹14 crore. We regret the error."</em>).</li>
          </ul>
        </section>

        {/* 7. RETRACTIONS */}
        <section id="retractions" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Retractions &amp; Content Removals
            </h2>
          </div>
          <p>
            When an entire report is found to be fabricated, severely misleading, or legally prohibited, Nagrik issues a formal <strong>Retraction</strong>.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Rather than quietly generating a broken 404 page, the URL will display a notice explaining that the article has been retracted, the grounds for retraction, and any disciplinary measures taken against the contributor.
          </p>
        </section>

        {/* 8. SERIOUS ERRORS */}
        <section id="serious-errors" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Handling Serious Errors &amp; Defamation Claims
            </h2>
          </div>
          <p>
            Complaints involving allegations of criminal defamation or violations of judicial restraint are escalated immediately to our Legal Desk and Resident Grievance Officer (<a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline">wizzlingsupport@gmail.com</a>). Where necessary, temporary access holds are applied while factual determination is pending.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
