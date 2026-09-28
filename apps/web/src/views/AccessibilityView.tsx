'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  CheckCircle2,
  FileText,
  Volume2,
  Sliders,
  Type,
  SunMoon,
  Keyboard,
  Mail,
  ArrowRight
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';

export const AccessibilityView: React.FC = () => {
  const { language } = useLanguage();

  const tocItems: TocItem[] = [
    { id: 'commitment', label: '1. Our Accessibility Commitment' },
    { id: 'typography-contrast', label: '2. Typography, Contrast & Dual Modes' },
    { id: 'screen-readers', label: '3. Screen-Reader & Semantic HTML Support' },
    { id: 'keyboard-nav', label: '4. Keyboard Navigation on Web' },
    { id: 'media-controls', label: '5. Accessible Video & Media Controls' },
    { id: 'feedback-contact', label: '6. Reporting Accessibility Barriers' }
  ];

  return (
    <LegalLayout
      title="Accessibility Statement"
      hindiTitle="डिजिटल सुगमता विवरण"
      subtitle="Our commitment to making hyperlocal civic journalism readable, navigable, and inclusive for all citizens across India."
      category="Policies"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="accessibility"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* ── HIGHLIGHT BANNER ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#DE5227]/25 text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold font-serif text-slate-950 dark:text-white text-sm sm:text-base">
            <Eye className="w-4 h-4 text-[#DE5227] shrink-0" />
            <span>Inclusive News for Every Citizen</span>
          </div>
          <p className="leading-relaxed font-normal text-slate-700 dark:text-slate-300 text-xs">
            Democracy requires that news be accessible to everyone—regardless of visual, auditory, motor, or cognitive capabilities, or low-bandwidth smartphone constraints in rural India. We continuously audit our apps and web portals to remove digital barriers.
          </p>
        </div>

        {/* 1. COMMITMENT */}
        <section id="commitment" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> Our Accessibility Commitment
            </h2>
          </div>
          <p>
            Nagrik is designed with an accessible-first engineering philosophy. We aim to align our digital interfaces with internationally recognized accessibility best practices, incorporating thoughtful design patterns for diverse devices, screen sizes, and assistive technologies.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <em>Honesty Note:</em> While we work continuously toward optimal accessibility standards, we do not claim formal third-party WCAG certification. We invite direct user feedback to identify areas where improvements can be made.
          </p>
        </section>

        {/* 2. TYPOGRAPHY & CONTRAST */}
        <section id="typography-contrast" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Typography, Contrast &amp; Dual Modes
            </h2>
          </div>
          <p>
            Visual legibility is critical for reading local news in diverse lighting conditions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Bilingual Typography</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Optimized typefaces supporting crisp Devanagari Hindi characters alongside clean Latin fonts.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <SunMoon className="w-3.5 h-3.5 text-amber-500" />
                <span>High-Contrast Dark &amp; Light</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Tailored background and text contrast ratios engineered to reduce eye strain and ensure readability under harsh sunlight.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-stone-200/80 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>Scalable System Text</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Support for dynamic system font scaling on Android and iOS devices without breaking layouts.
              </p>
            </div>
          </div>
        </section>

        {/* 3. SCREEN READERS */}
        <section id="screen-readers" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Screen-Reader &amp; Semantic HTML Support
            </h2>
          </div>
          <p>
            Our web platform uses semantic HTML5 elements (<code className="font-mono text-[11px]">&lt;main&gt;</code>, <code className="font-mono text-[11px]">&lt;nav&gt;</code>, <code className="font-mono text-[11px]">&lt;article&gt;</code>, <code className="font-mono text-[11px]">&lt;header&gt;</code>), explicit heading structures (<code className="font-mono text-[11px]">h1</code> through <code className="font-mono text-[11px]">h3</code>), and descriptive ARIA landmarks to facilitate effortless navigation with screen readers like TalkBack, VoiceOver, and NVDA.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Photographs and illustrations include descriptive alternative text (<code className="font-mono text-[11px]">alt</code> attributes) wherever relevant.
          </p>
        </section>

        {/* 4. KEYBOARD NAVIGATION */}
        <section id="keyboard-nav" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">4.</span> Keyboard Navigation on Web
            </h2>
          </div>
          <p>
            All core web interactions—browsing headlines, switching language, navigating policy documents, and submitting forms—are operable using standard keyboard controls (such as <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800 font-mono text-[11px]">Tab</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800 font-mono text-[11px]">Shift+Tab</kbd>, and <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800 font-mono text-[11px]">Enter</kbd>) with clearly defined visual focus rings.
          </p>
        </section>

        {/* 5. MEDIA CONTROLS */}
        <section id="media-controls" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">5.</span> Accessible Video &amp; Media Controls
            </h2>
          </div>
          <p>
            Field video dispatches feature clear native player controls with play, pause, progress scrubbing, volume adjustment, full-screen toggles, and mute defaults. We encourage our ground stringers to provide spoken Hindi summaries to aid individuals with visual impairments.
          </p>
        </section>

        {/* 6. REPORTING BARRIERS */}
        <section id="feedback-contact" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">6.</span> Reporting Accessibility Barriers
            </h2>
          </div>
          <p>
            If you encounter any difficulty accessing content or navigating any feature on Nagrik, please let our team know. We take accessibility issues seriously and prioritize software fixes:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Accessibility Help Desk:</strong> <a href="mailto:contact@nagrik.news?subject=Accessibility%20Barrier%20Report" className="text-[#DE5227] underline">contact@nagrik.news</a></div>
            <div><strong className="text-slate-950 dark:text-white">Address:</strong> Nagrik Media Trust, Bureau House, Fraser Road, Patna, Bihar – 800001, India</div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};
