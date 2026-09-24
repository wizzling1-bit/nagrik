'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  Search,
  RotateCcw,
  UserCheck,
  EyeOff,
  CheckCircle2,
  FileWarning,
  Scale
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const GuidelinesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'code-of-conduct', label: '1. Citizen Reporter Code of Conduct' },
    { id: 'red-lines', label: '2. Prohibited Content & Red Lines' },
    { id: 'synthetic-ai', label: '3. Deepfakes & Synthetic AI Rules' },
    { id: 'fact-checking', label: '4. Ground Verification Standards' },
    { id: 'corrections', label: '5. Corrections & Retractions Policy' },
    { id: 'whistleblowers', label: '6. Whistleblower & Source Protection' }
  ];

  return (
    <LegalLayout
      title="Editorial Standards & Community Guidelines"
      hindiTitle="संपादकीय मानक एवं सामुदायिक दिशा-निर्देश"
      subtitle="Effective 2026. Governing all citizen journalists, stringers, video contributors, and user commentary across the Nagrik hyperlocal platform."
      category="Journalistic Integrity"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="guidelines"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── CALLOUT ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <ShieldCheck className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Integrity Charter for Decentralized Citizen News</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-600 dark:text-slate-300 text-xs">
            Decentralization does not mean lawlessness. To maintain credibility across 700+ districts, every reporter and publisher on Nagrik is held to the highest standards of civic truth, non-partisanship, and legal accountability under Indian press laws.
          </p>
        </div>

        {/* ── SECTION 1: CODE OF CONDUCT ── */}
        <section id="code-of-conduct" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Citizen Reporter Code of Conduct
            </h2>
          </div>
          <p>
            When publishing ground dispatches, interviews, or photo documentation, contributors must adhere to four core tenets:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">A. Physical Ground Presence</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Never report on events you have not personally witnessed or verified within the geofenced cluster.</div>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">B. Clear Separation of Fact & Opinion</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Eyewitness reportage must document objective reality. Personal commentary must be explicitly tagged as Editorial Opinion.</div>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">C. Respect for Human Dignity</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Do not film victims of violence, road accidents, or medical emergencies in a sensationalist or dehumanizing manner.</div>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">D. Conflict of Interest Disclosure</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">If you hold a financial, familial, or partisan political affiliation with the subject of a report, it must be disclosed.</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: PROHIBITED CONTENT ── */}
        <section id="red-lines" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Prohibited Content & Non-Negotiable Red Lines
            </h2>
          </div>
          <p>
            Violations of the following categories result in <strong>immediate permanent blacklisting, forfeiture of pending earnings, and reporting to law enforcement authorities:</strong>
          </p>

          <div className="space-y-2.5">
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950 dark:text-rose-200 text-xs">Communal Incitement & Hate Speech</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Any content intended to promote disharmony, hatred, or violence between different religious, linguistic, caste, or regional groups under the Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950 dark:text-rose-200 text-xs">Defamation & Malicious Slander</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Publishing unverified personal allegations attacking the private character of individuals without municipal or judicial public records.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950 dark:text-rose-200 text-xs">Child Sexual Exploitation & Endangerment</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Zero tolerance for any depiction or exploitation involving minors. Reports immediately submitted to Cyber Crime authorities and NCMEC.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950 dark:text-rose-200 text-xs">Doxxing & Private Data Leaks</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Publishing unredacted Aadhaar numbers, private home addresses, phone numbers, or medical records without explicit written consent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: SYNTHETIC AI & DEEPFAKES ── */}
        <section id="synthetic-ai" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Synthetic Media, Generative AI & Deepfake Regulations
            </h2>
          </div>
          <p>
            In accordance with the <strong>2026 amendments to the IT Rules</strong>, Nagrik enforces strict verification against deceptive synthetic media:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Mandatory AI Tagging:</strong> Any video, voiceover, or graphic created or materially modified using generative AI must be declared upon upload and display a prominent <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 font-mono text-[10px]">AI-Generated / Synthetically Altered</code> visual badge.
            </li>
            <li>
              <strong>Prohibition on News Impersonation:</strong> Generative AI deepfakes depicting public figures, judicial officers, or government authorities speaking words they did not speak are banned unconditionally.
            </li>
            <li>
              <strong>Automated Detection:</strong> All video dispatches undergo cryptographic visual provenance checks to flag cloned audio and face-swapping artifacts.
            </li>
          </ul>
        </section>

        {/* ── SECTION 4: GROUND FACT CHECKING ── */}
        <section id="fact-checking" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Two-Source Verification & Ground Fact-Checking
            </h2>
          </div>
          <p>
            Before publishing municipal allegations of corruption, civic mismanagement, or community conflict, stringers must adhere to the <strong>Rule of Corroboration:</strong>
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Provide at least two independent eyewitness statements or on-record citizen interviews.</li>
            <li>Cite official tender documents, municipal notices, RTI applications, or public portal records where applicable.</li>
            <li>Make a documented effort to solicit a right-of-reply response from the concerned municipal ward counselor or administrative officer.</li>
          </ol>
        </section>

        {/* ── SECTION 5: CORRECTIONS & RETRACTIONS ── */}
        <section id="corrections" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Transparent Corrections & Retraction Protocol
            </h2>
          </div>
          <p>
            Journalists make mistakes; credible news platforms acknowledge and correct them. When a factual error is verified:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs space-y-2">
            <div>
              <strong className="text-slate-950 dark:text-white">Correction Banner:</strong> An amber editorial notice is pinned to the top of the article clearly explaining what was originally stated and how it has been updated.
            </div>
            <div>
              <strong className="text-slate-950 dark:text-white">Retraction Archive:</strong> If an entire report is proven fabricated, it is unpublished from the public wire, replaced by a formal retraction memorandum, and the contributor is permanently demoted.
            </div>
          </div>
        </section>

        {/* ── SECTION 6: WHISTLEBLOWERS ── */}
        <section id="whistleblowers" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Whistleblower & Source Confidentiality Protection
            </h2>
          </div>
          <p>
            Civic informants risking their safety to expose municipal graft, illegal sand mining, or healthcare neglect are protected by our cryptographic anonymity toggle:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>When marked as <em>Anonymous Civic Dispatch</em>, all public author attribution and avatar metadata are completely stripped.</li>
            <li>We do not disclose our confidential civic sources to third parties unless mandated by an explicit order from a constitutional court of law.</li>
          </ul>
        </section>

      </div>
    </LegalLayout>
  );
};
