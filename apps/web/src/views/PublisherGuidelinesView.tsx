'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Camera,
  MapPin,
  Clock,
  Scale,
  DollarSign,
  ArrowRight,
  AlertOctagon,
  Ban,
  Lock
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const PublisherGuidelinesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'eligibility', label: '1. Publisher Eligibility & Identity' },
    { id: 'accuracy-sources', label: '2. Accurate Reporting & Sources' },
    { id: 'original-work', label: '3. Original Work & IP Ownership' },
    { id: 'media-rights', label: '4. Image & Video Rights' },
    { id: 'headlines-location', label: '5. Headlines & Location Accuracy' },
    { id: 'conflicts-sponsorship', label: '6. Conflicts of Interest & Sponsored Content' },
    { id: 'political-rules', label: '7. Political Content Rules' },
    { id: 'ai-disclosure', label: '8. AI-Assisted Reporting Disclosure' },
    { id: 'prohibited-practices', label: '9. Prohibited Practices & Fake Views' },
    { id: 'account-security', label: '10. Account Security & Verification' },
    { id: 'enforcement-appeals', label: '11. Enforcement, Suspensions & Appeals' }
  ];

  return (
    <LegalLayout
      title="Publisher & Creator Guidelines"
      hindiTitle="प्रकाशक एवं संवाददाता मार्गदर्शिका"
      subtitle="Operational, legal, and ethical responsibilities for ground stringers, community correspondents, and independent publishers on Nagrik."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="publisher-guidelines"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Users className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Publisher Code of Responsibility</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            As a Nagrik publisher or citizen stringer, you are the voice of your locality. With that privilege comes solemn legal and journalistic responsibility. You are legally responsible for the truthfulness and copyright compliance of all materials you publish.
          </p>
        </div>

        {/* 1. ELIGIBILITY & IDENTITY */}
        <section id="eligibility" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Publisher Eligibility &amp; Identity Responsibility
            </h2>
          </div>
          <p>
            To register as a Nagrik contributor and publish content:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>You must be at least 18 years of age and legally competent under the Indian Contract Act, 1872.</li>
            <li>You must provide verified identification details, phone number, and legitimate personal information during onboarding.</li>
            <li>You may not operate sock-puppet accounts, impersonate public officials, or publish under false pretenses.</li>
            <li>You are personally and legally responsible for all dispatches, media, and comments submitted through your publisher account.</li>
          </ul>
        </section>

        {/* 2. ACCURATE REPORTING & SOURCES */}
        <section id="accuracy-sources" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Accurate Reporting &amp; Source Requirements
            </h2>
          </div>
          <p>
            Contributors must witness the events they report or verify them directly with credible primary sources:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Always confirm names, dates, localities, and casualty numbers before hitting publish.</li>
            <li>When reporting on allegations against local contractors, hospitals, or government officials, always offer the subject an opportunity to respond.</li>
            <li>Clearly identify your sources unless protecting a vulnerable whistleblower under severe threat.</li>
          </ul>
        </section>

        {/* 3. ORIGINAL WORK & IP */}
        <section id="original-work" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Original Work &amp; Intellectual Property Ownership
            </h2>
          </div>
          <p>
            <strong>You own your footage.</strong> Nagrik operates on an author-first copyright framework:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>You retain 100% intellectual property ownership of your original video footage, audio, and text.</li>
            <li>By uploading to Nagrik, you grant us a worldwide, non-exclusive, royalty-free license to host, transcode, stream, distribute, and display your report across our apps, web portals, and social channels.</li>
            <li>You remain free to license or sell your original footage to other media outlets or documentary filmmakers.</li>
          </ul>
        </section>

        {/* 4. MEDIA RIGHTS */}
        <section id="media-rights" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Image &amp; Video Rights
            </h2>
          </div>
          <p>
            Never upload footage, photographs, or audio clips recorded by other journalists, television news channels, or private individuals without written consent or clear statutory license.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Stripping third-party watermarks or recording a TV broadcast with your phone to pass it off as your own field work is a severe violation resulting in immediate account termination.
          </p>
        </section>

        {/* 5. HEADLINES & LOCATION */}
        <section id="headlines-location" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Headline Integrity &amp; Location Accuracy
            </h2>
          </div>
          <p>
            Hyperlocal news relies on spatial precision. Publishers must:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Tag the exact locality, town, and district where the event actually occurred. Never spoof GPS coordinates or tag an unrelated city for extra views.</li>
            <li>Write clear, factual headlines. Do not use sensationalist clickbait, exaggerated claims (e.g., <em>"MUST WATCH! SHOCKING!!"</em>), or misleading thumbnails.</li>
            <li>Ensure the publication date corresponds to the actual timing of the incident.</li>
          </ul>
        </section>

        {/* 6. CONFLICTS & SPONSORSHIP */}
        <section id="conflicts-sponsorship" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Disclosure of Conflicts &amp; Sponsored Content
            </h2>
          </div>
          <p>
            You must disclose any commercial, political, or personal interest in subjects you cover:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Never accept gifts, cash payments, or hospitality from local politicians or businesses in exchange for favorable coverage or suppressing negative reports.</li>
            <li>If a business pays you to cover an opening or product launch, the dispatch MUST be explicitly tagged as "Sponsored" using our studio tools.</li>
            <li>Extortion or blackmailing local officials with the threat of negative news dispatches is a serious criminal offense that will be reported to the police.</li>
          </ul>
        </section>

        {/* 7. POLITICAL CONTENT RULES */}
        <section id="political-rules" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Political Content Rules
            </h2>
          </div>
          <p>
            Political news must remain balanced and factual. Publishers must not act as de facto mouthpieces for political parties or candidates. During elections, contributors must comply with the Model Code of Conduct set by the Election Commission of India and refrain from publishing unverified exit polls or campaign propaganda masked as unbiased news.
          </p>
        </section>

        {/* 8. AI-ASSISTED REPORTING */}
        <section id="ai-disclosure" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> AI-Assisted Reporting Disclosure
            </h2>
          </div>
          <p>
            If generative AI tools are used to assist in drafting copy, organizing research, or translating spoken audio, the publisher must ensure all factual statements have been verified by a human reporter. The use of generative AI imagery or voice synthesis to depict real events or real individuals is strictly banned.
          </p>
        </section>

        {/* 9. PROHIBITED PRACTICES */}
        <section id="prohibited-practices" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">9.</span> Prohibited Practices &amp; View Fraud
            </h2>
          </div>
          <p>
            Nagrik employs algorithmic fraud detection to protect community advertisers and readers. The following practices result in immediate ban and forfeiture of earnings:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Fake Engagement:</strong> Using automated bots, click farms, VPN refreshers, or incentivized view groups to artificially inflate view counts.</li>
            <li><strong>Duplicate Submissions:</strong> Uploading the same video multiple times with different titles to game the feed.</li>
            <li><strong>Content Scraping:</strong> Mass downloading reports from other platforms to republish on Nagrik.</li>
            <li><strong>Spam &amp; Commercial Flooding:</strong> Flooding the local wire with repetitive commercial announcements.</li>
          </ul>
        </section>

        {/* 10. ACCOUNT SECURITY */}
        <section id="account-security" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">10.</span> Account Security &amp; Banking Details
            </h2>
          </div>
          <p>
            Publishers are responsible for maintaining the confidentiality of their login credentials and OTPs. Payout bank accounts and UPI VPA IDs must belong to the registered publisher. Sharing or selling publisher accounts to third parties is strictly prohibited.
          </p>
        </section>

        {/* 11. ENFORCEMENT & APPEALS */}
        <section id="enforcement-appeals" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">11.</span> Enforcement, Suspensions &amp; Appeals
            </h2>
          </div>
          <p>
            Violations of these guidelines will trigger warnings, temporary suspension, or permanent de-platforming depending on severity. If you believe an enforcement action was taken in error, you may file a formal appeal with supporting facts by emailing <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a>.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
