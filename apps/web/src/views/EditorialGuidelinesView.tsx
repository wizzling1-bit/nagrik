'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileText,
  Clock,
  ArrowRight,
  Eye,
  Users,
  AlertOctagon,
  HelpCircle,
  Camera,
  BookOpen
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const EditorialGuidelinesView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'sec-1', label: '1. Our Editorial Mission' },
    { id: 'sec-2', label: '2. Accuracy' },
    { id: 'sec-3', label: '3. Verification' },
    { id: 'sec-4', label: '4. Sources' },
    { id: 'sec-5', label: '5. Attribution' },
    { id: 'sec-6', label: '6. Multiple-Source Verification' },
    { id: 'sec-7', label: '7. Breaking News' },
    { id: 'sec-8', label: '8. Anonymous & Unverified Info' },
    { id: 'sec-9', label: '9. Headlines and Thumbnails' },
    { id: 'sec-10', label: '10. Images and Video' },
    { id: 'sec-11', label: '11. AI-Assisted Content' },
    { id: 'sec-12', label: '12. User/Publisher Content' },
    { id: 'sec-13', label: '13. Public-Interest Reporting' },
    { id: 'sec-14', label: '14. Crime Reporting' },
    { id: 'sec-15', label: '15. Children & Minors' },
    { id: 'sec-16', label: '16. Victims & Vulnerable People' },
    { id: 'sec-17', label: '17. Personal Information' },
    { id: 'sec-18', label: '18. Political & Election Coverage' },
    { id: 'sec-19', label: '19. Communal & Religious Sensitivity' },
    { id: 'sec-20', label: '20. Health & Emergency Info' },
    { id: 'sec-21', label: '21. Financial & Economic Info' },
    { id: 'sec-22', label: '22. Sponsored & Branded Content' },
    { id: 'sec-23', label: '23. Advertising Separation' },
    { id: 'sec-24', label: '24. Corrections' },
    { id: 'sec-25', label: '25. Editorial Independence' },
    { id: 'sec-26', label: '26. Conflicts of Interest' },
    { id: 'sec-27', label: '27. Plagiarism' },
    { id: 'sec-28', label: '28. Copyright' },
    { id: 'sec-29', label: '29. Content Removal' },
    { id: 'sec-30', label: '30. Reader Complaints' },
    { id: 'sec-31', label: '31. Editorial Accountability' },
    { id: 'sec-32', label: '32. Update & Revision Timestamps' }
  ];

  return (
    <LegalLayout
      title="Editorial Guidelines & Standards"
      hindiTitle="संपादकीय दिशानिर्देश एवं मानक"
      subtitle="The comprehensive charter governing accuracy, ethics, sourcing, and content verification across Nagrik's hyperlocal journalism network."
      category="Editorial Standards"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="editorial-guidelines"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── MISSION STATEMENT CALLOUT ── */}
        <div className="p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <ShieldCheck className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Nagrik Editorial Principles</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Nagrik follows these editorial principles to ensure honest, fair, and responsible local reporting. We do not claim external certifications or associations; our credibility rests on disciplined adherence to verifiable facts, transparent corrections, and public accountability.
          </p>
        </div>

        {/* 1. OUR EDITORIAL MISSION */}
        <section id="sec-1" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Our Editorial Mission
            </h2>
          </div>
          <p>
            Nagrik's mission is to empower citizens with truthful, ground-level information regarding civic infrastructure, local governance, municipal administration, public health, safety, and community developments. We strive to inform, not to sensationalize; to illuminate local reality, not to manufacture outrage.
          </p>
        </section>

        {/* 2. ACCURACY */}
        <section id="sec-2" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Accuracy
            </h2>
          </div>
          <p>
            Accuracy is paramount. Every statement presented as a fact must be grounded in observable reality, official public records, or credible eyewitness accounts. Speculation, hearsay, or emotional rhetoric must never be presented as established truth. When facts cannot be confirmed immediately, contributors must explicitly state what is known and what remains unverified.
          </p>
        </section>

        {/* 3. VERIFICATION */}
        <section id="sec-3" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Verification
            </h2>
          </div>
          <p>
            Reporters and contributors are expected to corroborate claims before submitting reports for publication. Verification includes inspecting physical locations, examining documents, speaking directly with people affected, and seeking official responses from concerned municipal or public authorities whenever administrative conduct is questioned.
          </p>
        </section>

        {/* 4. SOURCES */}
        <section id="sec-4" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Sources
            </h2>
          </div>
          <p>
            Stories should rely on primary sources: eyewitnesses who were physically present, documented government or judicial notices, authorized public officials, and verified data. Secondary sources such as social media chatter must be treated with skepticism and investigated thoroughly before publication.
          </p>
        </section>

        {/* 5. ATTRIBUTION */}
        <section id="sec-5" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Attribution
            </h2>
          </div>
          <p>
            Readers have a right to know where information comes from. Every article, quote, statistic, and external report must explicitly identify its author, agency, or authority. Original Nagrik field dispatches must carry the author's byline, while third-party reports or press releases must clearly name the publishing body.
          </p>
        </section>

        {/* 6. MULTIPLE-SOURCE VERIFICATION */}
        <section id="sec-6" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Multiple-Source Verification
            </h2>
          </div>
          <p>
            Controversial assertions, allegations of misconduct, or contentious disputes must not rely on a single voice. Contributors must endeavor to cross-verify claims across multiple independent eyewitnesses, official spokespersons, or verifiable records before publishing.
          </p>
        </section>

        {/* 7. BREAKING NEWS */}
        <section id="sec-7" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">7.</span> Breaking News
            </h2>
          </div>
          <p>
            In fast-moving situations, the impulse to be first must never compromise accuracy. It is better to wait for verified facts than to broadcast unconfirmed rumors. During breaking events, reports must be labeled as "Developing" and updated systematically as verifiable facts emerge.
          </p>
        </section>

        {/* 8. ANONYMOUS/UNVERIFIED INFORMATION */}
        <section id="sec-8" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">8.</span> Anonymous &amp; Unverified Information
            </h2>
          </div>
          <p>
            Anonymous sources may only be utilized when disclosing identity would expose the individual to severe personal danger, job termination, or retaliation, and when the information is of overwhelming public interest. The reporter must know the source's true identity, and the editorial desk must independently review the justification. Unverified claims from anonymous accounts will be rejected.
          </p>
        </section>

        {/* 9. HEADLINES AND THUMBNAILS */}
        <section id="sec-9" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">9.</span> Headlines and Thumbnails
            </h2>
          </div>
          <p>
            Headlines and cover thumbnails must accurately reflect the contents of the report. Sensationalist clickbait, exaggerated claims, distorted out-of-context quotes, and emotionally manipulative teasers are strictly prohibited.
          </p>
        </section>

        {/* 10. IMAGES AND VIDEO */}
        <section id="sec-10" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">10.</span> Images and Video
            </h2>
          </div>
          <p>
            Photographic and video evidence must represent authentic, unaltered field documentation. Color adjustments or cropping are permissible only for clarity. Adding or removing elements, staging events, recycling old archival clips as current events, or manipulating footage is an ethical violation that results in immediate rejection.
          </p>
        </section>

        {/* 11. AI-ASSISTED CONTENT */}
        <section id="sec-11" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">11.</span> AI-Assisted Content &amp; Synthetic Media
            </h2>
          </div>
          <p>
            AI tools may assist with grammar, transcription, translation, or outlining, but never in generating synthetic "facts", fake quotes, or fabricated events. Deceptive deepfakes, synthetic voice impersonations, and generative imagery presented as real documentary evidence are strictly banned and will result in permanent account termination.
          </p>
        </section>

        {/* 12. USER/PUBLISHER-SUBMITTED CONTENT */}
        <section id="sec-12" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">12.</span> User/Publisher-Submitted Content
            </h2>
          </div>
          <p>
            Reports submitted by community stringers or independent publishers are subject to pre-publication and post-publication moderation. Publishers bear legal responsibility for the accuracy of their submissions and must ensure they possess the necessary rights to any media included.
          </p>
        </section>

        {/* 13. PUBLIC-INTEREST REPORTING */}
        <section id="sec-13" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">13.</span> Public-Interest Reporting
            </h2>
          </div>
          <p>
            Nagrik prioritizes reporting that serves the common good: exposing safety hazards, monitoring public spending on infrastructure, highlighting public healthcare shortages, documenting environmental neglect, and celebrating grassroots civic accomplishments.
          </p>
        </section>

        {/* 14. CRIME REPORTING */}
        <section id="sec-14" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">14.</span> Crime Reporting
            </h2>
          </div>
          <p>
            Crime reports must be objective and strictly follow Indian criminal procedure laws. Accused individuals must be referred to as "accused" or "suspected" until convicted by a competent court of law. Reporters must not prejudge trials or publish sensationalist speculations that undermine judicial proceedings.
          </p>
        </section>

        {/* 15. CHILDREN & MINORS */}
        <section id="sec-15" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">15.</span> Children and Minors
            </h2>
          </div>
          <p>
            In strict compliance with Section 74 of the <strong>Juvenile Justice (Care and Protection of Children) Act, 2015</strong> and the <strong>POCSO Act, 2012</strong>, the identity, photographs, school, residence, or family details of any child who is a victim of an offense or in conflict with the law must NEVER be disclosed or recognizable in any publication.
          </p>
        </section>

        {/* 16. VICTIMS & VULNERABLE PEOPLE */}
        <section id="sec-16" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">16.</span> Victims &amp; Vulnerable People
            </h2>
          </div>
          <p>
            Victims of sexual assault, domestic violence, severe accidents, or personal tragedies must be treated with compassion and dignity. The identity of sexual assault victims must never be revealed, as mandated under Section 228A of the Indian Penal Code / Bharatiya Nyaya Sanhita. Graphic images of deceased bodies or severe trauma must not be published.
          </p>
        </section>

        {/* 17. PERSONAL INFORMATION */}
        <section id="sec-17" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">17.</span> Personal Information &amp; Doxxing
            </h2>
          </div>
          <p>
            Publishing private phone numbers, Aadhaar numbers, residential addresses, private communications, or confidential personal data without consent (doxxing) is strictly prohibited under the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and our platform terms.
          </p>
        </section>

        {/* 18. POLITICAL & ELECTION COVERAGE */}
        <section id="sec-18" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">18.</span> Political and Election Coverage
            </h2>
          </div>
          <p>
            Nagrik maintains non-partisan neutrality. Political coverage must give fair opportunity to opposing views, refrain from endorsing candidates or parties, and strictly respect Model Code of Conduct regulations set forth by the Election Commission of India. Paid political promotions must be explicitly labeled.
          </p>
        </section>

        {/* 19. COMMUNAL & RELIGIOUS SENSITIVITY */}
        <section id="sec-19" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">19.</span> Communal and Religious Sensitivity
            </h2>
          </div>
          <p>
            India is a pluralistic society. Content that incites communal discord, insults religious beliefs, promotes caste prejudice, or provokes inter-community hostility is strictly prohibited. When covering communal tensions, reports must rely exclusively on verified administrative briefings and avoid inflammatory rhetoric.
          </p>
        </section>

        {/* 20. HEALTH & EMERGENCY INFORMATION */}
        <section id="sec-20" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">20.</span> Health and Emergency Information
            </h2>
          </div>
          <p>
            Health reporting must be grounded in peer-reviewed medical guidance or directives issued by the Ministry of Health and Family Welfare (MoHFW) and public health authorities. Unproven medical cures, anti-vaccine conspiracy theories, and alarmist rumors during natural disasters or epidemics will be rejected.
          </p>
        </section>

        {/* 21. FINANCIAL & ECONOMIC INFORMATION */}
        <section id="sec-21" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">21.</span> Financial and Economic Information
            </h2>
          </div>
          <p>
            Reports discussing market schemes, local commercial disputes, or investments must never offer unlicensed investment advice or promote multi-level marketing (MLM) schemes, illegal chit funds, or unregulated betting applications.
          </p>
        </section>

        {/* 22. SPONSORED/BRANDED CONTENT */}
        <section id="sec-22" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">22.</span> Sponsored &amp; Branded Content
            </h2>
          </div>
          <p>
            Any content published in exchange for payment, goods, or commercial consideration must be clearly and prominently identified as "Sponsored", "Paid Partnership", or "Advertisement". It must never masquerade as independent news.
          </p>
        </section>

        {/* 23. ADVERTISING SEPARATION */}
        <section id="sec-23" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">23.</span> Advertising Separation
            </h2>
          </div>
          <p>
            Nagrik maintains an impenetrable firewall between advertising sales and editorial decisions. Commercial sponsors have no authority over news curation, headline selection, or investigations into their business practices.
          </p>
        </section>

        {/* 24. CORRECTIONS */}
        <section id="sec-24" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">24.</span> Corrections
            </h2>
          </div>
          <p>
            When we make an error, we correct it promptly and transparently. Substantive corrections will feature an explicit correction note indicating what was changed and why. See our dedicated <Link href="/corrections" className="text-[#DE5227] underline">Corrections Policy</Link>.
          </p>
        </section>

        {/* 25. EDITORIAL INDEPENDENCE */}
        <section id="sec-25" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">25.</span> Editorial Independence
            </h2>
          </div>
          <p>
            Our journalists and contributors must make decisions based solely on public interest and journalistic relevance, free from undue political, corporate, or personal pressure.
          </p>
        </section>

        {/* 26. CONFLICTS OF INTEREST */}
        <section id="sec-26" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">26.</span> Conflicts of Interest
            </h2>
          </div>
          <p>
            Contributors must disclose any financial, familial, or partisan political connection to a subject they are reporting on. If a significant conflict of interest exists, the reporter must recuse themselves from coverage.
          </p>
        </section>

        {/* 27. PLAGIARISM */}
        <section id="sec-27" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">27.</span> Plagiarism
            </h2>
          </div>
          <p>
            Copying text, footage, or investigative work from other media outlets or reporters without explicit credit is intellectual dishonesty. Plagiarized stories will be removed immediately and the offending account suspended.
          </p>
        </section>

        {/* 28. COPYRIGHT */}
        <section id="sec-28" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">28.</span> Copyright &amp; Intellectual Property
            </h2>
          </div>
          <p>
            All submitted media must be original or used under valid license or statutory fair dealing exceptions under the <strong>Indian Copyright Act, 1957</strong>. See our <Link href="/copyright" className="text-[#DE5227] underline">Copyright Policy</Link>.
          </p>
        </section>

        {/* 29. CONTENT REMOVAL */}
        <section id="sec-29" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">29.</span> Content Removal &amp; Retractions
            </h2>
          </div>
          <p>
            We retract or remove content that is found to be defamatory, legally prohibited, materially fabricated, or in violation of high-court injunctions. Retractions are accompanied by an explanatory notice to preserve the historical record.
          </p>
        </section>

        {/* 30. READER COMPLAINTS */}
        <section id="sec-30" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">30.</span> Reader Complaints &amp; Feedback
            </h2>
          </div>
          <p>
            Readers can challenge the accuracy or fairness of any story through our <Link href="/report" className="text-[#DE5227] underline">Reporting Flow</Link> or by writing to <a href="mailto:editor@nagrik.news" className="text-[#DE5227] underline">editor@nagrik.news</a>. All complaints receive formal review by our editorial desk.
          </p>
        </section>

        {/* 31. EDITORIAL ACCOUNTABILITY */}
        <section id="sec-31" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">31.</span> Editorial Accountability
            </h2>
          </div>
          <p>
            The ultimate responsibility for our editorial output rests with the Editorial Desk of Nagrik Media Trust. We welcome public scrutiny and continuously review our processes to elevate journalistic rigor.
          </p>
        </section>

        {/* 32. UPDATE/REVISION TIMESTAMPS */}
        <section id="sec-32" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">32.</span> Update and Revision Timestamps
            </h2>
          </div>
          <p>
            Articles display clear "Published" and, where applicable, "Updated" timestamps in standard Indian Standard Time (IST). Material revisions are noted transparently in the article body.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};
