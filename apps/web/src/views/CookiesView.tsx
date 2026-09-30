'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cookie,
  ShieldCheck,
  Sliders,
  Settings,
  Database,
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const CookiesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'overview', label: '1. What Are Cookies & Storage Tokens' },
    { id: 'categories', label: '2. Categories of Storage Employed' },
    { id: 'third-parties', label: '3. Third-Party Network Services' },
    { id: 'controls', label: '4. Managing Cookies in Your Browser' },
    { id: 'policy-updates', label: '5. Policy Updates & Contact' }
  ];

  return (
    <LegalLayout
      title="Cookie & Local Storage Policy"
      hindiTitle="कुकी एवं स्थानीय भंडारण नीति"
      subtitle="Effective 2026. Disclosing how Nagrik uses essential cookies, local storage tokens, and client telemetry to deliver secure, responsive civic journalism."
      category="Privacy & Technical Governance"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="cookies"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── CALLOUT ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-slate-800 dark:text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Cookie className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Zero Cross-Site Tracking Commitment</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-600 dark:text-slate-300 text-xs">
            Nagrik does not deploy invasive cross-site tracking pixels or commercial ad retargeting cookies. We use lightweight local storage primarily to preserve your selected ward, interface language, theme choice, and secure creator login session.
          </p>
        </div>

        {/* ── SECTION 1: WHAT ARE COOKIES ── */}
        <section id="overview" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> What Are Cookies & Local Storage Tokens?
            </h2>
          </div>
          <p>
            Cookies are small cryptographic text files placed on your browser or device when you visit web pages. Local Storage is a modern web browser mechanism that allows web applications to store key-value data directly on your device without transmitting it on every network request.
          </p>
          <p>
            We use these technologies to maintain secure authentication and provide a customized local experience without asking you to re-select your city on every page load.
          </p>
        </section>

        {/* ── SECTION 2: CATEGORIES ── */}
        <section id="categories" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Categories of Storage Employed
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#DE5227]" />
                  <span>Strictly Essential Tokens (Cannot be switched off)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
                  ESSENTIAL
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Required for core security, session validation, and account protection. These include Supabase JWT tokens, CSRF tokens, and API rate-limiting trackers. Without these, publisher login and report uploads cannot function.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  <span>Functional & Locality Preferences</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-mono text-[10px] font-bold">
                  FUNCTIONAL
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Remembers your selected city/ward (e.g. Patna, Varanasi, Gaya), chosen language (<code className="font-mono text-[11px]">hi</code> or <code className="font-mono text-[11px]">en</code>), and interface theme (<code className="font-mono text-[11px]">light</code> or <code className="font-mono text-[11px]">dark</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 dark:text-white text-xs flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dwell-Time & Monetization Telemetry</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-mono text-[10px] font-bold">
                  PERFORMANCE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tracks active reading dwell time (5+ seconds) to reliably calculate verified reads for $1.50 CPM publisher compensation. This telemetry is aggregated, pseudonymous, and never tied to personal behavioral advertising profiles.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: THIRD PARTIES ── */}
        <section id="third-parties" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Third-Party Network Services
            </h2>
          </div>
          <p>
            Certain external infrastructure partners may set cookies or inspect device headers solely to serve cached media assets and protect the network:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Edge Delivery & Security Network:</strong> Bot mitigation, DDoS shielding, and edge media streaming.</li>
            <li><strong>Google Fonts:</strong> Web typography delivery with zero cookie tracking.</li>
            <li><strong>Google AdMob SDK:</strong> Operates in non-personalized mode in strict accordance with Section 9 of the DPDP Act 2023.</li>
          </ul>
        </section>

        {/* ── SECTION 4: CONTROLS ── */}
        <section id="controls" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Managing Cookies in Your Browser
            </h2>
          </div>
          <p>
            You have the freedom to configure or delete cookies at any time through your browser preferences:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Google Chrome (Desktop & Mobile)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Settings → Privacy and Security → Third-party cookies → Block or Clear data.</div>
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Apple Safari (iOS & macOS)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Preferences → Privacy → Prevent cross-site tracking & Block all cookies.</div>
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Mozilla Firefox</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Settings → Privacy & Security → Enhanced Tracking Protection (Strict).</div>
            </div>
            <div className="p-3 bg-stone-100/70 dark:bg-slate-900/70 rounded-xl border border-stone-200/80 dark:border-slate-800">
              <div className="font-bold text-slate-950 dark:text-white">Microsoft Edge</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Settings → Cookies and site permissions → Manage and delete cookies.</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <em>Note: Disabling strictly essential cookies will prevent you from signing in to the Nagrik Publisher Studio or submitting ground dispatches.</em>
          </p>
        </section>

        {/* ── SECTION 5: CONTACT ── */}
        <section id="policy-updates" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Policy Updates & Inquiries
            </h2>
          </div>
          <p>
            We periodically review our storage practices to maintain compliance with emerging standards. Any substantial changes will be posted on this page with an updated version timestamp.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            For inquiries regarding our cookie governance, email <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline">wizzlingsupport@gmail.com</a> or write to Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, India.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
