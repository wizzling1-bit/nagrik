'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  MapPin,
  Camera,
  Mic,
  Smartphone,
  CreditCard,
  Trash2,
  Mail,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Server,
  Bell,
  Eye,
  Bookmark
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const PrivacyView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'fiduciary', label: '1. Data Fiduciary Particulars' },
    { id: 'anonymous-access', label: '2. Anonymous Reader Access & Device IDs' },
    { id: 'categories', label: '3. Categories of Data Collected' },
    { id: 'location-telemetry', label: '4. Location Information (Approximate & Precise)' },
    { id: 'mobile-permissions', label: '5. Mobile App Permissions (Play Store Compliance)' },
    { id: 'service-providers', label: '6. Actual Service Providers & Infrastructure' },
    { id: 'dpdp-basis', label: '7. Lawful Grounds Under DPDP Act 2023' },
    { id: 'storage-retention', label: '8. Storage, Security & Retention' },
    { id: 'rights', label: '9. Data Principal Rights & Erasure' },
    { id: 'deletion-procedure', label: '10. Account Deletion Workflow' },
    { id: 'children', label: "11. Protection of Children's Data" },
    { id: 'cookies-local', label: '12. Cookies & Local Client Storage' },
    { id: 'dpo', label: '13. Data Protection Officer (DPO) Contact' }
  ];

  return (
    <LegalLayout
      title="Privacy Policy & Data Protection Charter"
      hindiTitle="गोपनीयता नीति एवं डेटा सुरक्षा चार्टर"
      subtitle="Mandated under the Digital Personal Data Protection (DPDP) Act, 2023, Information Technology Rules, 2021, and Google Play Store User Data Safety Guidelines."
      category="Compliance & Governance"
      lastUpdated="September 2026"
      version="2026.3"
      activeSlug="privacy"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT STATUTORY CALLOUT ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-amber-900 dark:text-amber-300 text-sm sm:text-base">
            <ShieldCheck className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>DPDP Act 2023 &amp; Indian Data Sovereignty Notice</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-amber-100/90 text-xs">
            Nagrik processes your personal data strictly with unambiguous, informed consent and for verified journalistic and civic dissemination. We do not sell, rent, or trade personal information to data brokers. All financial data is encrypted and handled under Reserve Bank of India (RBI) directives.
          </p>
        </div>

        {/* 1. FIDUCIARY PARTICULARS */}
        <section id="fiduciary" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Data Fiduciary Particulars
            </h2>
          </div>
          <p>
            Under Section 2(i) of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the entity determining the purpose and means of the processing of your personal data is:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Data Fiduciary:</strong> Nagrik Media Trust</div>
            <div><strong className="text-slate-950 dark:text-white">Principal Office:</strong> Bureau House, Fraser Road, Patna, Bihar – 800001, India</div>
            <div><strong className="text-slate-950 dark:text-white">Official Data Privacy Desk:</strong> <a href="mailto:privacy@nagrik.news" className="text-[#DE5227] underline">privacy@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">Resident Grievance Officer:</strong> <a href="mailto:grievance@nagrik.news" className="text-[#DE5227] underline">grievance@nagrik.news</a></div>
          </div>
        </section>

        {/* 2. ANONYMOUS ACCESS */}
        <section id="anonymous-access" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Anonymous Reader Access &amp; Pseudonymous Device IDs
            </h2>
          </div>
          <p>
            Nagrik does not require general readers to register, create accounts, or provide phone numbers or email addresses to read articles, watch local video dispatches, or search community news.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            To provide technical reliability, prevent DDoS attacks, and remember your manually chosen district/ward and bookmarked stories, our mobile client generates an anonymous random UUID (stored locally as <code className="font-mono text-[11px]">x-device-id</code>). This device ID is not linked to your real identity.
          </p>
        </section>

        {/* 3. CATEGORIES OF DATA COLLECTED */}
        <section id="categories" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Categories of Personal Data Collected
            </h2>
          </div>
          <p>
            We adhere to the principle of <em>Data Minimisation</em> (Section 6(1) DPDP Act) and collect only information strictly necessary for operational delivery:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Publisher Identity &amp; Contact</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full legal name, phone number, email address, profile photo, and bureau affiliation (required solely for publishing contributors).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Banking &amp; Payout Data (Publishers Only)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                UPI Virtual Payment Address (VPA), Bank Account Number, IFSC code, and PAN for statutory TDS compliance under Sections 194C/194R.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>Local Preferences &amp; Bookmarks</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Selected reading language (Hindi/English), chosen district/city/area, and bookmarked articles (stored client-side on your device).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Content Reports &amp; Inquiries</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When filing an error or content report: article URL, category of concern, explanatory details, and optional email for updates.
              </p>
            </div>
          </div>
        </section>

        {/* 4. LOCATION INFORMATION */}
        <section id="location-telemetry" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Location Information (Approximate vs. Precise)
            </h2>
          </div>
          <p>
            Because Nagrik is a hyperlocal platform, location is used to display news relevant to your community:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Manual Selection (Default):</strong> You can manually select your district, city, or municipal ward from our directory. No GPS permission is required for this.
            </li>
            <li>
              <strong>Optional Precise GPS (Field Reporters):</strong> When contributors upload on-the-scene news dispatches, the app requests permission to record GPS coordinates to tag where the civic incident occurred and verify proximity.
            </li>
            <li>
              <strong>No Background Tracking:</strong> Nagrik does NOT track your physical location in the background when the app is closed.
            </li>
          </ul>
        </section>

        {/* 5. MOBILE APP PERMISSIONS */}
        <section id="mobile-permissions" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Mobile Application Hardware Permissions
            </h2>
          </div>
          <p>
            In compliance with the <strong>Google Play Store User Data &amp; Safety Policy</strong>, our mobile application only requests permissions required for specific user actions:
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Location (ACCESS_FINE_LOCATION):</strong> Used only when opted in to discover nearby community dispatches and tag video dispatches.
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Camera (CAMERA):</strong> Used exclusively when a stringer records field reporting videos or takes photo evidence.
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Microphone (RECORD_AUDIO):</strong> Used only during active video recording to capture interview audio.
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Notifications (POST_NOTIFICATIONS):</strong> Used solely to alert you of urgent public safety advisories or breaking district news (opt-in).
            </div>
          </div>
        </section>

        {/* 6. SERVICE PROVIDERS & INFRASTRUCTURE */}
        <section id="service-providers" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Actual Service Providers &amp; Infrastructure
            </h2>
          </div>
          <p>
            We process data exclusively using enterprise cloud infrastructure providers under strict Data Processing Agreements (DPAs):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Supabase Inc. (Database &amp; Auth)</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                PostgreSQL database engine hosted in India (ap-south-1) with Row-Level Security (RLS) restricting access to authorized records.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Cloudflare R2 (Media Storage CDN)</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Encrypted object storage for public news videos, report thumbnails, and press images, delivered over global edge caching.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Google AdMob &amp; UMP</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Privacy-respecting ad delivery with User Messaging Platform (UMP) consent controls on mobile devices.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Firebase Cloud Messaging (FCM)</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Encrypted push notification delivery to alert opt-in mobile readers of major municipal or emergency notices.
              </p>
            </div>
          </div>
        </section>

        {/* 7. DPDP BASIS */}
        <section id="dpdp-basis" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Lawful Grounds Under DPDP Act 2023
            </h2>
          </div>
          <p>
            We process your personal data under two lawful grounds recognized by the DPDP Act:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Consent (Section 6):</strong> Given affirmatively when registering as a publisher, saving preferences, or opting in to push notifications. Consent may be withdrawn at any time.</li>
            <li><strong>Legitimate Uses (Section 7):</strong> Fulfilling statutory payout and tax (TDS) obligations under Indian tax laws, complying with court subpoenas, and safeguarding platform security against fraud.</li>
          </ul>
        </section>

        {/* 8. STORAGE & SECURITY */}
        <section id="storage-retention" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Storage, Security &amp; Data Retention
            </h2>
          </div>
          <p>
            All data in transit is encrypted using <strong>TLS 1.3</strong> protocols, and sensitive stored data (including publisher bank details) is protected with <strong>AES-256</strong> encryption at rest.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Publisher account records and tax withholding data are retained for statutory periods mandated under Indian financial law (typically 7 years for taxation audits). General server logs are rotated and deleted within 90 days.
          </p>
        </section>

        {/* 9. RIGHTS OF DATA PRINCIPALS */}
        <section id="rights" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">9.</span> Rights of Data Principals (DPDP Act 2023)
            </h2>
          </div>
          <p>
            As a citizen utilizing Nagrik, you possess statutory rights enforceable under Indian law:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Right to Access Information</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Request a summary of personal data being processed about you.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Right to Correction &amp; Erasure</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Correct inaccurate information or request total deletion of your profile.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Right of Grievance Redressal</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Direct recourse to our Data Protection Officer and the Data Protection Board.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Right to Nominate (Section 14)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Nominate a representative to exercise your rights in the event of death or incapacity.</div>
            </div>
          </div>
        </section>

        {/* 10. DELETION PROCEDURE */}
        <section id="deletion-procedure" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">10.</span> Account &amp; Data Deletion Workflow
            </h2>
          </div>
          <p>
            In compliance with Google Play Store User Data Safety rules and the DPDP Act, you can request full erasure of your account and personal data at any time:
          </p>
          <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs space-y-2">
            <p>
              Send an email to <a href="mailto:privacy@nagrik.news?subject=Data%20Deletion%20Request" className="text-[#DE5227] font-bold underline">privacy@nagrik.news</a> from your registered email address with the subject line <em>"Data Deletion Request"</em>.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upon verifying identity, our team purges your profile, contact details, device links, and authentication tokens within 7 business days, retaining only statutory tax ledger records required by law.
            </p>
          </div>
        </section>

        {/* 11. PROTECTION OF CHILDREN */}
        <section id="children" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">11.</span> Protection of Children's Personal Data
            </h2>
          </div>
          <p>
            In strict compliance with Section 9 of the DPDP Act 2023, Nagrik does not knowingly collect personal data from or process the behavioral data of children under 18 years of age without verifiable parental consent. Nagrik does not engage in targeted advertising directed at children.
          </p>
        </section>

        {/* 12. COOKIES & LOCAL STORAGE */}
        <section id="cookies-local" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">12.</span> Cookies &amp; Local Client Storage
            </h2>
          </div>
          <p>
            Our web platform uses strictly necessary cookies and local storage tokens solely to maintain user sessions, remember theme preference (Dark/Light mode), and preserve your selected reading language. We do not use third-party tracking cookies across external websites. See our <Link href="/cookies" className="text-[#DE5227] underline">Cookie Policy</Link>.
          </p>
        </section>

        {/* 13. DPO CONTACT */}
        <section id="dpo" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">13.</span> Data Protection Officer (DPO) &amp; Privacy Contact
            </h2>
          </div>
          <p>
            For any inquiries, rights requests, or concerns regarding how Nagrik processes your data, please contact our compliance desk:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Data Protection Officer:</strong> Legal &amp; Compliance Wing, Nagrik Media Trust</div>
            <div><strong className="text-slate-950 dark:text-white">Office Address:</strong> Bureau House, Fraser Road, Patna, Bihar – 800001, India</div>
            <div><strong className="text-slate-950 dark:text-white">Direct Email:</strong> <a href="mailto:privacy@nagrik.news" className="text-[#DE5227] underline">privacy@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">Resident Grievance Officer:</strong> <a href="mailto:grievance@nagrik.news" className="text-[#DE5227] underline">grievance@nagrik.news</a></div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
