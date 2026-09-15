'use client';

import React from 'react';
import {
  Camera,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: t.howStep1Num,
      title: t.howStep1Title,
      description: t.howStep1Desc,
      icon: Camera
    },
    {
      num: t.howStep2Num,
      title: t.howStep2Title,
      description: t.howStep2Desc,
      icon: ShieldCheck
    },
    {
      num: t.howStep3Num,
      title: t.howStep3Title,
      description: t.howStep3Desc,
      icon: Radio
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FAF9F6] dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left space-y-2">
          <div className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
            {t.howBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.howTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.howSubtitle}
          </p>
        </div>

        {/* 3 Step Editorial Cards with Interactive Hover and Step Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="card-hover-effect group p-7 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 hover:border-brand-500/40 dark:hover:border-brand-500/40 flex flex-col justify-between cursor-default relative overflow-hidden"
              >
                {/* Step Top Ambient Glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-500 group-hover:scale-110 transition-transform duration-300 origin-left inline-block">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 group-hover:bg-brand-500 group-hover:text-white group-hover:rotate-6 transition-all duration-300 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
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
