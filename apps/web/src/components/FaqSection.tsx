'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
    { q: t.faq6Q, a: t.faq6A },
    { q: t.faq7Q, a: t.faq7A }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAF9F6] dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
            {t.faqBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.faqTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.faqSubtitle}
          </p>
        </div>

        {/* Semantic Accessible Accordion with Smooth CSS Grid Animation */}
        <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-answer-${idx}`;
            const buttonId = `faq-question-${idx}`;

            return (
              <div key={idx} className="py-4 sm:py-5 group">
                <h3>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between text-left font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer py-1 focus:outline-hidden focus:ring-2 focus:ring-brand-500 rounded-lg"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.q}</span>
                    <span className="ml-4 shrink-0 text-slate-400">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                    </span>
                  </button>
                </h3>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
