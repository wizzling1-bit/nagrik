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
  FileText
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const PrivacyView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'fiduciary', label: '1. Data Fiduciary Particulars' },
    { id: 'categories', label: '2. Categories of Data Collected' },
    { id: 'mobile-permissions', label: '3. Mobile App & Device Permissions' },
    { id: 'dpdp-basis', label: '4. Legal Grounds Under DPDP Act 2023' },
    { id: 'storage-security', label: '5. Security, AES-256 & Processors' },
    { id: 'rights', label: '6. Data Principal Rights & Erasure' },
    { id: 'deletion-procedure', label: '7. Account Deletion Workflow' },
    { id: 'children', label: "8. Protection of Children's Data" },
    { id: 'dpo', label: '9. Data Protection Officer (DPO)' }
  ];

  return (
    <LegalLayout
      title="Privacy Policy & Data Protection Charter"
      hindiTitle="गोपनीयता नीति एवं डेटा सुरक्षा चार्टर"
      subtitle="Effective September 2026. Mandated under the Digital Personal Data Protection (DPDP) Act, 2023, IT Rules, 2021, and Google Play Store User Data Safety Guidelines."
      category="Compliance & Governance"
      lastUpdated="September 2026"
      version="2026.2"
      activeSlug="privacy"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT STATUTORY CALLOUT ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-amber-900 dark:text-amber-300 text-sm sm:text-base">
            <ShieldCheck className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>DPDP Act 2023 & Indian Data Sovereignty Notice</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-amber-100/90 text-xs">
            Nagrik processes your personal data strictly with unambiguous, informed consent and for verified journalistic and civic dissemination. We do not sell, rent, or trade your personal data with commercial data brokers. All financial data is encrypted under RBI guidelines.
          </p>
        </div>

        {/* ── SECTION 1: FIDUCIARY PARTICULARS ── */}
        <section id="fiduciary" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Data Fiduciary Particulars
            </h2>
          </div>
          <p>
            Under the provisions of Section 2(i) of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the entity determining the purpose and means of the processing of your personal data is:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Entity Name:</strong> Nagrik Media Trust / Naagrik Technologies</div>
            <div><strong className="text-slate-950 dark:text-white">Registration:</strong> Registered under Indian Trusts Act, 1882 (Media Bureau Reg. BR-NEWS-2024-098)</div>
            <div><strong className="text-slate-950 dark:text-white">Principal Office:</strong> Bureau House, Fraser Road, Patna, Bihar – 800001, India</div>
            <div><strong className="text-slate-950 dark:text-white">Official Contact:</strong> <a href="mailto:privacy@nagrik.news" className="text-[#DE5227] underline">privacy@nagrik.news</a></div>
          </div>
        </section>

        {/* ── SECTION 2: CATEGORIES OF DATA COLLECTED ── */}
        <section id="categories" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Categories of Personal Data Collected
            </h2>
          </div>
          <p>
            We adhere to the principle of <em>Data Minimisation</em> (Section 6(1) DPDP Act) and collect only information essential to establish verifiable news dispatches and process creator compensation:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Identity & Reporter Credentials</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full legal name, phone number, email address, and optional press portrait.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Banking & Payout Metadata</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                UPI Virtual Payment Address (VPA), Bank IFSC code, account number, and PAN number for TDS filings under Section 194C/194R.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Location Telemetry & Geofence</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Precise GPS coordinates (latitude/longitude), Local Government Directory (LGD) ward, and sub-district IDs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Journalistic Submissions</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Uploaded video footage, eyewitness audio recordings, municipal photo evidence, and story draft descriptions.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: MOBILE APP & DEVICE PERMISSIONS ── */}
        <section id="mobile-permissions" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Mobile Application Permissions & Play Store Disclosure
            </h2>
          </div>
          <p>
            In compliance with the <strong>Google Play Store 2026 User Data & Safety Policy</strong>, we explicitly disclose the justification for hardware permissions requested by the Nagrik Android and iOS applications:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Precise Location (<code className="font-mono text-[11px]">ACCESS_FINE_LOCATION</code>)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Why needed:</strong> Powers the <em>5km Hyperlocal Wire</em>, verifies that ground news reporters are physically present at the location of an incident, and filters emergency municipal alerts for your ward. We do not track your real-time path when the app is closed.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Camera Access (<code className="font-mono text-[11px]">CAMERA</code>)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Why needed:</strong> Enables citizen reporters to record authentic, tamper-evident civic video reports and capture photo evidence of municipal roadworks, healthcare, and water issues.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Microphone Access (<code className="font-mono text-[11px]">RECORD_AUDIO</code>)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Why needed:</strong> Captures clear audio during ground reporting and citizen interviews. Audio is recorded only when the user explicitly triggers video or voice recording.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Photo & Media Storage (<code className="font-mono text-[11px]">READ_MEDIA_IMAGES / VIDEO</code>)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Why needed:</strong> Allows reporters to select and upload previously recorded news footage or documents from their phone to Cloudflare R2 secure media storage.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: DPDP BASIS ── */}
        <section id="dpdp-basis" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Lawful Grounds Under DPDP Act 2023
            </h2>
          </div>
          <p>
            We process your data strictly under two lawful bases recognised by Sections 4, 6, and 7 of the Act:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-950 dark:text-white">Consent:</strong> When you register as a reader or creator, you give affirmative, unambiguous consent. You can withdraw your consent at any time through account settings.
            </li>
            <li>
              <strong className="text-slate-950 dark:text-white">Certain Legitimate Uses (Section 7):</strong> Fulfilling statutory payment obligations, deducting TDS, complying with court subpoenas, or preventing civic deepfake fraud.
            </li>
          </ul>
        </section>

        {/* ── SECTION 5: SECURITY & PROCESSORS ── */}
        <section id="storage-security" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Encryption, Storage & Sub-Processors
            </h2>
          </div>
          <p>
            All data in transit is protected using <strong>TLS 1.3 encryption</strong>, and sensitive records (such as banking information) are encrypted at rest with <strong>AES-256 GCM</strong>.
          </p>
          <p>
            We host data with leading enterprise infrastructure providers operating Indian edge locations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Cloudflare R2:</strong> Encrypted object storage for news video and image assets.</li>
            <li><strong>Supabase / PostgreSQL:</strong> Relational database storage with row-level security (RLS).</li>
            <li><strong>Google AdMob:</strong> Privacy-compliant ad delivery adhering to DPDP restrictions.</li>
          </ul>
        </section>

        {/* ── SECTION 6: DATA PRINCIPAL RIGHTS ── */}
        <section id="rights" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Rights of Data Principals (DPDP Act 2023)
            </h2>
          </div>
          <p>
            As a citizen utilizing the Nagrik platform, you possess statutory rights enforceable under Indian law:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Right to Access Information</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Request a complete summary of your personal data processed by us.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Right to Correction & Erasure</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Correct inaccurate records or request total deletion of your profile.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Right of Grievance Redressal</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct recourse to our Data Protection Officer and the Data Protection Board.</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Right to Nominate (Section 14)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Nominate an individual to exercise your rights in the event of death.</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: DELETION WORKFLOW ── */}
        <section id="deletion-procedure" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Self-Service Account Deletion Procedure
            </h2>
          </div>
          <p>
            In accordance with Google Play Store 2026 guidelines, users can initiate immediate deletion of their account and all associated personal data:
          </p>
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-2">
            <div className="font-bold text-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>How to request full data erasure:</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <li>In the Nagrik Mobile App: Go to <strong>Settings → Account Security → Delete Account & Purge Data</strong>.</li>
              <li>Via Web Portal: Send an email from your registered address to <a href="mailto:delete-account@nagrik.news" className="text-[#DE5227] underline">delete-account@nagrik.news</a> with subject "Request for Data Deletion".</li>
              <li>All telemetry, location trails, and payment VPAs will be irrevocably scrubbed within <strong>30 calendar days</strong>.</li>
            </ol>
          </div>
        </section>

        {/* ── SECTION 8: CHILDREN'S DATA ── */}
        <section id="children" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Protection of Children's Personal Data (Section 9 DPDP Act)
            </h2>
          </div>
          <p>
            Nagrik does not permit registration by or process the personal data of individuals under 18 years of age without verifiable parental consent. In strict adherence to Section 9(2) and Section 9(3) of the DPDP Act 2023, we undertake that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>We do not carry out any behavioral monitoring or profiling of children.</li>
            <li>We do not serve targeted advertisements to children.</li>
            <li>Any child reporter submission identified without parental authorisation is deleted immediately.</li>
          </ul>
        </section>

        {/* ── SECTION 9: DPO CONTACT & DPBI ── */}
        <section id="dpo" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">9.</span> Data Protection Officer (DPO) & DPBI Escalation
            </h2>
          </div>
          <p>
            If you have questions, concerns, or grievances regarding the processing of your personal data, you may reach out to our designated Data Protection Officer:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Officer Name:</strong> Sh. Arvind Verma</div>
            <div><strong className="text-slate-950 dark:text-white">Designation:</strong> Data Protection Officer & Compliance Director</div>
            <div><strong className="text-slate-950 dark:text-white">Email:</strong> <a href="mailto:dpo@nagrik.news" className="text-[#DE5227] underline">dpo@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">Office Address:</strong> Nagrik Bureau House, Fraser Road, Patna, Bihar – 800001</div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            If you are not satisfied with our redressal, you retain the statutory right under Section 13(3) of the DPDP Act 2023 to submit a complaint before the <strong>Data Protection Board of India (DPBI)</strong>.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
