'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Radio,
  ShieldCheck,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const AboutView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'manifesto', label: '1. The Nagrik Manifesto' },
    { id: 'network', label: '2. The 5km Wire Network' },
    { id: 'verification', label: '3. 3-Tier Truth Verification' },
    { id: 'economics', label: '4. Creator Economic Sovereignty' },
    { id: 'independence', label: '5. Editorial Independence Pledge' },
    { id: 'governance', label: '6. Newsroom Governance & Bureaus' }
  ];

  return (
    <LegalLayout
      title="About Nagrik & The Citizen Journalism Manifesto"
      hindiTitle="नागरिक के बारे में एवं नागरिक पत्रकारिता घोषणापत्र"
      subtitle="Re-centering Indian journalism around ground reality. Sovereign, decentralized civic reporting powered by ordinary citizens and verified by local truth."
      category="About the Platform"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="about"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── MANIFESTO BANNER ── */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#DE5227] to-[#C84318] text-white space-y-3 shadow-lg shadow-orange-950/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-mono font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>DISPATCH FROM 700+ DISTRICTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif leading-tight">
            "Democracy lives or dies at the municipal ward boundary."
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            For decades, mainstream television and national daily newspapers have been captured by metropolitan prime-time debates, leaving the broken village road, the dry primary health center tap, and the municipal canal untreated. Nagrik restores news to where citizens actually breathe.
          </p>
        </div>

        {/* ── SECTION 1: THE MANIFESTO ── */}
        <section id="manifesto" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> The Nagrik Manifesto
            </h2>
          </div>
          <p>
            Founded by independent journalists, civic technologists, and regional stringers in Bihar and Uttar Pradesh, <strong>Nagrik</strong> was built on a single uncompromising thesis: <em>The person nearest to the event is the true reporter.</em>
          </p>
          <p>
            We replace bloated broadcast studios with lightweight, high-performance mobile and web technology that turns any verified citizen with a smartphone into an empowered local correspondent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Decentralized</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">No central corporate gatekeeper deciding which village deserves a headline.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Hyperlocal</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Granular news organized down to the Local Government Directory (LGD) ward.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-950 dark:text-white text-xs">Uncompromising</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero political party sponsorships, zero corporate PR syndication.</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: 5KM WIRE NETWORK ── */}
        <section id="network" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> The 5km Wire Network Architecture
            </h2>
          </div>
          <p>
            Traditional social media feeds optimize for viral outrage that travels thousands of kilometers away. Nagrik inverts this dynamic through our proprietary <strong>5km Wire</strong> geofencing engine:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-950 dark:text-white">Radial Relevance:</strong> When an active municipal issue or breaking civic update is reported, it instantly alerts verified readers within an immediate 5-kilometer radius.
            </li>
            <li>
              <strong className="text-slate-950 dark:text-white">Cross-District Hierarchies:</strong> Reports bubble up from Ward → Block/Sub-district → District → State only when corroborated by multiple independent community eyewitnesses.
            </li>
            <li>
              <strong className="text-slate-950 dark:text-white">Offline Resilience:</strong> In areas with intermittent connectivity, stringers record geotagged footage offline, which automatically syncs upon detecting cellular bandwidth.
            </li>
          </ul>
        </section>

        {/* ── SECTION 3: 3-TIER TRUTH VERIFICATION ── */}
        <section id="verification" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> The 3-Tier Truth Verification Protocol
            </h2>
          </div>
          <p>
            In an era polluted by AI hallucinations and paid WhatsApp propaganda, truth is engineered into our protocol before any story reaches public feeds:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#DE5227] flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                T1
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-950 dark:text-white">Tier 1: Cryptographic Provenance & Geotagging</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Every photo and video uploaded via the Nagrik mobile client is bound to hardware-verified device timestamps and encrypted GPS latitude/longitude coordinates to prevent recycled or recycled out-of-context archival media.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                T2
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-950 dark:text-white">Tier 2: Community Eyewitness Corroboration</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Local readers physically present within the same geographic cluster can upvote, corroborate, or dispute assertions with supplementary photographic evidence.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                T3
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-950 dark:text-white">Tier 3: Sovereign Newsroom Moderation Desk</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Senior editorial desk supervisors review stories flagged for sensitivity, defamation risk, or communal friction in strict accordance with the Norms of Journalistic Conduct under the Press Council of India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: CREATOR ECONOMICS ── */}
        <section id="economics" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Creator Economic Sovereignty
            </h2>
          </div>
          <p>
            Journalism cannot remain independent if ground stringers are starved. Unlike traditional agencies that pay ₹100 per story after months of chasing invoices, Nagrik provides automated, direct algorithmic compensation:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-[#DE5227] font-mono">$1.50 CPM</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">~₹129 per 1,000 Reads</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Transparent dwell-time accounting</div>
            </div>
            <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-emerald-600 font-mono">₹850 INR</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Low $10 Withdrawal Threshold</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Withdraw earnings to UPI in 24-48 hrs</div>
            </div>
            <div className="p-4 bg-stone-100/70 dark:bg-slate-900/70 rounded-2xl border border-stone-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-blue-600 font-mono">100%</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Full IP Rights Retained</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">You own your camera footage forever</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: EDITORIAL INDEPENDENCE PLEDGE ── */}
        <section id="independence" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Non-Partisan Editorial Independence Pledge
            </h2>
          </div>
          <p>
            Nagrik is not backed by political PACs, governmental syndicates, or commercial oligarchs. We pledge to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>Never suppress public municipal news in exchange for corporate advertising budgets.</li>
            <li>Maintain an absolute firewall between editorial content curation and commercial sponsorships.</li>
            <li>Publicly issue transparent corrections and retractions when reporting inaccuracies are verified.</li>
          </ul>
        </section>

        {/* ── SECTION 6: GOVERNANCE & BUREAUS ── */}
        <section id="governance" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Newsroom Governance & Bureaus
            </h2>
          </div>
          <p>
            Our principal editorial bureau operates out of Bihar, coordinating ground networks across Northern, Eastern, and Central India:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Headquarters:</strong> Nagrik Bureau House, Fraser Road, Patna, Bihar – 800001</div>
            <div><strong className="text-slate-950 dark:text-white">Editorial Bureau Desk:</strong> <a href="mailto:editor@nagrik.news" className="text-[#DE5227] underline">editor@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">Publisher Inquiries:</strong> <a href="mailto:publishers@nagrik.news" className="text-[#DE5227] underline">publishers@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">General Inquiries:</strong> <a href="mailto:contact@nagrik.news" className="text-[#DE5227] underline">contact@nagrik.news</a></div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
