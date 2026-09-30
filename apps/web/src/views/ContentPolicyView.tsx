'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  ShieldAlert,
  FileCheck,
  RotateCcw,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileWarning
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const ContentPolicyView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'purpose', label: '1. Purpose & Scope' },
    { id: 'prohibited-content', label: '2. Prohibited Content Categories' },
    { id: 'moderation-process', label: '3. Moderation & Editorial Review' },
    { id: 'actions-enforcement', label: '4. Enforcement Actions & Penalties' },
    { id: 'emergency-removal', label: '5. Emergency Removal Protocol' },
    { id: 'repeat-violations', label: '6. Repeat Violator Policy' },
    { id: 'appeals', label: '7. Appeals & Account Reinstatement' }
  ];

  const prohibitedCategories = [
    {
      title: 'Illegal Content & Incitement',
      desc: 'Content that promotes illegal activities, sedition, terrorism, extremist propaganda, or incites riots or violent acts under Indian law.'
    },
    {
      title: 'Defamation & Malicious Slander',
      desc: 'Unsubstantiated, false, or malicious allegations intended to damage an individual’s or organization’s legal reputation.'
    },
    {
      title: 'Threats & Harassment',
      desc: 'Targeted hostility, stalking, violent threats, abusive intimidation, or coordinated harassment directed at any person.'
    },
    {
      title: 'Hate Speech & Communal Hostility',
      desc: 'Attacking, dehumanizing, or inciting discrimination against individuals or communities on the basis of religion, caste, gender, disability, or ethnicity.'
    },
    {
      title: 'Child Sexual Abuse Material (CSAM) & Endangerment',
      desc: 'Any depiction, exploitation, or endangerment of children or minors. Zero-tolerance policy with immediate reporting to law enforcement under POCSO.'
    },
    {
      title: 'Non-Consensual Sexual Content & Intimate Imagery',
      desc: 'Publishing non-consensual sexual images, voyeurism, deepfake pornography, or extortionate threats involving intimate media.'
    },
    {
      title: 'Gratuitous & Graphic Violence',
      desc: 'Graphic, gore-filled, or dehumanizing depictions of mutilated bodies, violent executions, or bloody accidents not required for legitimate news reporting.'
    },
    {
      title: 'Doxxing & Personal Data Abuse',
      desc: 'Publishing personal phone numbers, Aadhaar details, home addresses, bank accounts, or private communications without consent.'
    },
    {
      title: 'Fraud, Scams & Unregulated Betting',
      desc: 'Promoting pyramid schemes, fraudulent prize draws, illegal gambling apps, loan shark operations, or phishing links.'
    },
    {
      title: 'Malware & Malicious Links',
      desc: 'Distributing spyware, phishing URLs, malicious code, or files designed to compromise reader devices.'
    },
    {
      title: 'Deliberate Deception & Fabricated News',
      desc: 'Fabricating events, publishing fictional accounts disguised as actual occurrences, or inventing non-existent incidents.'
    },
    {
      title: 'Impersonation & False Identity',
      desc: 'Pretending to be a government official, police officer, certified doctor, or another individual or media organization.'
    },
    {
      title: 'Copyright Infringement & Plagiarism',
      desc: 'Re-uploading copyrighted broadcasts, watermark-stripped videos, or third-party journalism without license or fair dealing rights.'
    },
    {
      title: 'Spam & Commercial Flooding',
      desc: 'Repetitive submissions, keyword stuffing, duplicate videos, affiliate marketing links, or bulk promotional content.'
    },
    {
      title: 'Manipulated Media & Deceptive Deepfakes',
      desc: 'AI-generated voice clones, facial swaps, or heavily altered footage presented as authentic documentary reality.'
    },
    {
      title: 'Coordinated Inauthentic Behavior',
      desc: 'Using automated bots, fake engagement networks, or coordinated astroturfing to artificially inflate view counts or manufacture trends.'
    },
    {
      title: 'Dangerous Misinformation',
      desc: 'False health claims causing physical harm, fake disaster or flood warnings causing panic, or false electoral polling station notices.'
    }
  ];

  return (
    <LegalLayout
      title="Content Policy & Moderation Rules"
      hindiTitle="सामग्री नीति एवं मॉडरेशन नियम"
      subtitle="The comprehensive safety policy defining permissible and prohibited content across the Nagrik platform, mobile applications, and publisher studio."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="content-policy"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-slate-800 dark:text-rose-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Zero-Tolerance Platform Integrity Rule</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Nagrik is committed to public safety, accurate civic reporting, and respectful discourse. We do not permit hate speech, harassment, fabricated news, deepfakes, or unlawful material. Violators face immediate post rejection, publisher account suspension, and potential legal action.
          </p>
        </div>

        {/* 1. PURPOSE & SCOPE */}
        <section id="purpose" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Purpose &amp; Scope
            </h2>
          </div>
          <p>
            This Content Policy governs all text, video footage, photographs, audio recordings, headlines, descriptions, and user feedback published on <strong>nagrik.news</strong>, the Nagrik Android app, iOS app, and Creator Studio.
          </p>
          <p>
            By submitting content to Nagrik, every citizen stringer, independent publisher, and user agrees to comply with these rules. These standards apply equally to all contributors regardless of follower size or tenure.
          </p>
        </section>

        {/* 2. PROHIBITED CONTENT */}
        <section id="prohibited-content" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Prohibited Content Categories
            </h2>
          </div>
          <p>
            The following categories of content are strictly forbidden on Nagrik. Submitting any of the following constitutes a material violation of your publisher contract:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {prohibitedCategories.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1 text-left"
              >
                <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MODERATION PROCESS */}
        <section id="moderation-process" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Moderation &amp; Editorial Review
            </h2>
          </div>
          <p>
            Nagrik employs a hybrid review framework designed to protect readers while supporting rapid ground reporting:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Automated Pre-Screening:</strong> Checks incoming files for known illegal hashes, abusive language patterns, and duplicate file signatures.
            </li>
            <li>
              <strong>Human Editorial Desk Review:</strong> Experienced desk editors inspect story drafts, verify geolocation tags, evaluate headlines against the video footage, and confirm that sensitive assertions have adequate attribution.
            </li>
            <li>
              <strong>Community Reporting:</strong> Readers can flag inappropriate or inaccurate stories using the in-app "Report" tool or web portal at any time.
            </li>
          </ul>
        </section>

        {/* 4. ACTIONS & PENALTIES */}
        <section id="actions-enforcement" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Enforcement Actions &amp; Penalties
            </h2>
          </div>
          <p>
            Depending on the severity and intent of the violation, our moderation desk will take one or more of the following actions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3.5 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-amber-600">Content Rejection / Warning</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                For minor technical or headline issues, the post is returned to the publisher for correction with specific feedback.
              </p>
            </div>
            <div className="p-3.5 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-orange-600">Immediate Takedown &amp; Hold</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Content is unpublished from all public feeds pending editorial investigation, and pending payout credits are frozen.
              </p>
            </div>
            <div className="p-3.5 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-rose-600">Permanent Suspension</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Severe or malicious violations result in immediate permanent account termination, forfeiture of earnings, and blacklisting.
              </p>
            </div>
          </div>
        </section>

        {/* 5. EMERGENCY REMOVAL */}
        <section id="emergency-removal" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Emergency Removal Protocol
            </h2>
          </div>
          <p>
            In critical scenarios involving imminent threats to human life, ongoing communal riots, judicial injunctions, or child safety violations, our desk executes an <strong>Emergency Expedited Takedown</strong> within 2 hours of verified receipt.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Law enforcement orders and urgent statutory takedowns should be directed directly to <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a>.
          </p>
        </section>

        {/* 6. REPEAT VIOLATIONS */}
        <section id="repeat-violations" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Repeat Violator Policy
            </h2>
          </div>
          <p>
            Nagrik operates a strike system for publisher accounts:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Strike 1:</strong> Formal written warning and required resubmission of corrected content.</li>
            <li><strong>Strike 2:</strong> 14-day temporary publishing suspension and review of prior submissions.</li>
            <li><strong>Strike 3:</strong> Permanent termination of publisher status, account closure, and UPI payout de-linking.</li>
          </ul>
        </section>

        {/* 7. APPEALS */}
        <section id="appeals" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Appeals &amp; Account Reinstatement
            </h2>
          </div>
          <p>
            If you believe your content was removed or your publisher account suspended in error, you may file a formal appeal within 14 days by emailing <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a> with your account ID, article URL, and factual justification. An independent senior editor will review the case within 5 business days.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
