'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Bookmark,
  Share2,
  Flag,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const CommunityGuidelinesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'scope', label: '1. Community Participation Scope' },
    { id: 'available-features', label: '2. Currently Available User Features' },
    { id: 'civic-conduct', label: '3. Standards of Civic Conduct' },
    { id: 'reporting-abuse', label: '4. Reporting Content & Abuse' },
    { id: 'moderation-appeals', label: '5. Moderation & Review' },
    { id: 'future-ugc', label: '6. Future Community Features' }
  ];

  return (
    <LegalLayout
      title="Community Guidelines"
      hindiTitle="सामुदायिक दिशानिर्देश"
      subtitle="Fostering a constructive, respectful, and safe civic environment for readers and contributors across Nagrik."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="community-guidelines"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Users className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Constructive Civic Dialogue</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Nagrik brings neighbors together around real local issues. We believe civic information should unite communities to solve local problems, not divide them through toxicity, harassment, or bad-faith disruption.
          </p>
        </div>

        {/* 1. SCOPE */}
        <section id="scope" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Community Participation Scope
            </h2>
          </div>
          <p>
            These Community Guidelines set expectations for all interactions on the Nagrik platform, including how readers interact with news stories, share dispatches, submit content reports, and engage with local reporters.
          </p>
        </section>

        {/* 2. AVAILABLE FEATURES */}
        <section id="available-features" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Currently Available User Features
            </h2>
          </div>
          <p>
            To protect users from toxic comment spam, trolling, and coordinated online harassment common on social media, public user participation on Nagrik is currently centered around verified journalistic mechanisms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Bookmarks &amp; Offline Reading</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Save vital community notices and investigations to your device for offline reference without tracking.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Civic Story Sharing</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Share authentic field dispatches with family, neighbors, and resident welfare associations (RWAs).
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-orange-500" />
                <span>Content &amp; Inaccuracy Reporting</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Submit factual challenges or safety concerns directly to our editorial desk using the in-app reporting flow.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Reader Engagement Signals</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Signal the relevance of stories to help community news find broader readership within your district.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CIVIC CONDUCT */}
        <section id="civic-conduct" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Standards of Civic Conduct
            </h2>
          </div>
          <p>
            All community members must adhere to the following standards when using our services or communicating with our newsroom:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Respect Local Diversity:</strong> Do not attack individuals based on religion, caste, gender, linguistic background, or geographic origin.</li>
            <li><strong>No Doxxing or Harassment:</strong> Do not threaten reporters, public servants, or fellow citizens, nor publish their private telephone numbers or personal addresses.</li>
            <li><strong>No Fraudulent Reporting:</strong> Do not submit frivolous, retaliatory, or bad-faith content reports aimed at suppressing legitimate public-interest reporting.</li>
          </ul>
        </section>

        {/* 4. REPORTING ABUSE */}
        <section id="reporting-abuse" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Reporting Content &amp; Abuse
            </h2>
          </div>
          <p>
            If you encounter content that violates these principles, contains hate speech, infringes copyright, or poses a danger to public safety, use our verified reporting flow:
          </p>
          <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-xs">Public Reporting Portal</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Directly alerts our moderation desk with immediate incident tracking.
              </p>
            </div>
            <Link
              href="/report"
              className="bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 5. MODERATION & REVIEW */}
        <section id="moderation-appeals" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Moderation &amp; Review
            </h2>
          </div>
          <p>
            All submitted reports are handled by our Editorial and Compliance Desk under the IT Rules, 2021. Inquiries receive formal acknowledgment within 24 hours, and substantive review within 15 days.
          </p>
        </section>

        {/* 6. FUTURE UGC */}
        <section id="future-ugc" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Future Community Features
            </h2>
          </div>
          <p>
            If and when interactive user comment threads or public forums are introduced, they will feature strict pre-moderation, user block controls, automated profanity filters, and clear community reporting mechanisms to preserve civil dialogue.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
