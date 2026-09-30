'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Lock,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Globe,
  DollarSign
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const TermsView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'acceptance', label: '1. Acceptance & Platform Eligibility' },
    { id: 'app-web-usage', label: '2. App & Web Usage; Anonymous Access' },
    { id: 'publisher-accounts', label: '3. Publisher Accounts & Responsibilities' },
    { id: 'ownership-license', label: '4. Content Ownership & License to Nagrik' },
    { id: 'prohibited-activities', label: '5. Prohibited Activities' },
    { id: 'intellectual-property', label: '6. Nagrik Intellectual Property' },
    { id: 'advertising', label: '7. Advertising & Third-Party Services' },
    { id: 'availability', label: '8. Service Availability & Continuity' },
    { id: 'safe-harbor', label: '9. Intermediary Safe Harbor & Disclaimers' },
    { id: 'liability', label: '10. Limitation of Liability' },
    { id: 'termination', label: '11. Termination & Account Suspension' },
    { id: 'governing-law', label: '12. Governing Law & Dispute Jurisdiction' },
    { id: 'changes-contact', label: '13. Modifications & Contact Particulars' }
  ];

  return (
    <LegalLayout
      title="Terms of Service & Platform Charter"
      hindiTitle="सेवा की शर्तें एवं मंच घोषणापत्र"
      subtitle="Governing all access to the Nagrik digital news network, mobile applications, web portals, and Publisher Studio."
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
            <span>Binding Legal Agreement</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            By downloading our mobile app, reading local dispatches on nagrik.news, or registering as a publisher, you agree to be bound by these Terms of Service entered into with Wizzling Pvt Ltd. Please also review our <Link href="/privacy" className="text-[#DE5227] underline font-bold">Privacy Policy</Link>, <Link href="/editorial-guidelines" className="text-[#DE5227] underline font-bold">Editorial Guidelines</Link>, and <Link href="/content-policy" className="text-[#DE5227] underline font-bold">Content Policy</Link>.
          </p>
        </div>

        {/* 1. ACCEPTANCE & ELIGIBILITY */}
        <section id="acceptance" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Acceptance &amp; Platform Eligibility
            </h2>
          </div>
          <p>
            You must be at least 18 years of age to register as a citizen reporter, upload dispatches, or receive monetization payouts. By using this service, you represent that you possess the full legal capacity to enter into a valid contract under the <strong>Indian Contract Act, 1872</strong>.
          </p>
          <p>
            If you access Nagrik on behalf of a news bureau, institutional media house, or NGO, you warrant that you possess the legal authority to bind that entity to these Terms.
          </p>
        </section>

        {/* 2. APP & WEB USAGE */}
        <section id="app-web-usage" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> App &amp; Web Usage; Anonymous Public Access
            </h2>
          </div>
          <p>
            Nagrik believes civic information should be friction-free. General readers may browse articles, watch field video dispatches, and access public safety bulletins without creating an account or providing sensitive personal information.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Anonymous readers are assigned a pseudonymous device identifier solely for technical rate-limiting, bookmark storage on device, and caching local preferences.
          </p>
        </section>

        {/* 3. PUBLISHER ACCOUNTS */}
        <section id="publisher-accounts" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Publisher Accounts &amp; Contributor Responsibilities
            </h2>
          </div>
          <p>
            To upload video reports, write articles, or receive compensation, contributors must register a verified publisher account:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>You agree to provide accurate, current, and complete identification and contact details.</li>
            <li>You are solely responsible for maintaining the confidentiality of your login credentials and OTPs.</li>
            <li>You agree that all submissions represent authentic field documentation adhering to our <Link href="/editorial-guidelines" className="text-[#DE5227] underline">Editorial Guidelines</Link>.</li>
            <li>You warrant that you will not engage in extortion, blackmail, or paid suppression of negative stories.</li>
          </ul>
        </section>

        {/* 4. OWNERSHIP & LICENSE */}
        <section id="ownership-license" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Content Ownership &amp; License Grant to Nagrik
            </h2>
          </div>
          <p>
            <strong>You own what you create.</strong> Contributors retain 100% intellectual property ownership of their original camera footage, audio, and written dispatches.
          </p>
          <p>
            By uploading content to Nagrik, you grant Wizzling Pvt Ltd a non-exclusive, worldwide, royalty-free, transferable license to store, transcode, stream, distribute, index, and publicly display your work across our web, mobile, RSS, and social syndication channels.
          </p>
        </section>

        {/* 5. PROHIBITED ACTIVITIES */}
        <section id="prohibited-activities" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Prohibited Activities
            </h2>
          </div>
          <p>
            When utilizing Nagrik, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Publish content violating Indian criminal law, inciting communal violence, or defaming individuals.</li>
            <li>Upload deepfakes, synthetic voice clones, or manipulated footage presented as real events.</li>
            <li>Use automated scrapers, bots, or click farms to generate artificial view counts or fraudulent payout claims.</li>
            <li>Attempt to probe, scan, or breach the security of our Supabase database or Cloudflare infrastructure.</li>
            <li>Harass, stalk, or doxx journalists, public servants, or citizens.</li>
          </ul>
        </section>

        {/* 6. NAGRIK IP */}
        <section id="intellectual-property" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Nagrik Intellectual Property
            </h2>
          </div>
          <p>
            The Nagrik platform name, trademarks, logos, visual identity, Flutter mobile application software, web application codebase, and proprietary layout designs are the exclusive property of Wizzling Pvt Ltd.
          </p>
        </section>

        {/* 7. ADVERTISING */}
        <section id="advertising" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Advertising &amp; Third-Party Services
            </h2>
          </div>
          <p>
            Nagrik displays advertisements to support platform hosting and contributor payments. Advertisements are served via privacy-compliant networks (including Google AdMob) or direct sponsorship agreements.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Advertisers exercise zero control over editorial decisions. Third-party media links and external services are governed by their respective privacy terms.
          </p>
        </section>

        {/* 8. AVAILABILITY */}
        <section id="availability" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Service Availability &amp; Platform Continuity
            </h2>
          </div>
          <p>
            While we strive for continuous service uptime, Nagrik does not warrant uninterrupted or error-free operation. We reserve the right to modify, upgrade, or suspend portions of the platform for maintenance, security updates, or emergency administrative directives.
          </p>
        </section>

        {/* 9. SAFE HARBOR */}
        <section id="safe-harbor" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">9.</span> Intermediary Safe Harbor &amp; Disclaimers
            </h2>
          </div>
          <p>
            Nagrik operates as an intermediary under <strong>Section 79 of the Information Technology Act, 2000</strong>. Reports uploaded by independent contributors represent their firsthand observations and do not represent the institutional views of Wizzling Pvt Ltd.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            We act expeditiously to remove unlawful content upon receiving actual knowledge through court orders or verified government notices under the IT Rules, 2021.
          </p>
        </section>

        {/* 10. LIABILITY */}
        <section id="liability" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">10.</span> Limitation of Liability
            </h2>
          </div>
          <p>
            To the maximum extent permitted by applicable Indian law, Wizzling Pvt Ltd, its directors, officers, and employees shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from platform downtime, loss of data, or community disputes arising from local reporting.
          </p>
        </section>

        {/* 11. TERMINATION */}
        <section id="termination" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">11.</span> Termination &amp; Account Suspension
            </h2>
          </div>
          <p>
            We reserve the right to suspend or terminate any publisher account immediately and without prior notice in cases of deliberate fraud, repeated copyright infringement, defamatory publications, or criminal incitement.
          </p>
        </section>

        {/* 12. GOVERNING LAW */}
        <section id="governing-law" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">12.</span> Governing Law &amp; Dispute Jurisdiction
            </h2>
          </div>
          <p>
            These Terms shall be governed by, construed, and enforced in accordance with the laws of the <strong>Republic of India</strong>.
          </p>
          <p>
            Any dispute, controversy, or claim arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent civil courts in <strong>Patna, Bihar, India</strong>, following a mandatory 30-day amicable conciliation period.
          </p>
        </section>

        {/* 13. CHANGES & CONTACT */}
        <section id="changes-contact" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">13.</span> Modifications &amp; Contact Particulars
            </h2>
          </div>
          <p>
            We may update these Terms periodically to reflect evolving legal, regulatory, or operational requirements. Updated versions will display the revision timestamp at the top of this document. Continued use of Nagrik after updates constitutes acceptance of the revised Terms.
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Operating Entity:</strong> Wizzling Pvt Ltd</div>
            <div><strong className="text-slate-950 dark:text-white">Registered Address:</strong> Koilwar, Arrah, Bhojpur, Bihar – 802163, India</div>
            <div><strong className="text-slate-950 dark:text-white">Support &amp; Grievance Email:</strong> <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline">wizzlingsupport@gmail.com</a></div>
            <div><strong className="text-slate-950 dark:text-white">Helpline Phone:</strong> <a href="tel:+918890043675" className="text-[#DE5227] underline">+91 8890043675</a></div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
