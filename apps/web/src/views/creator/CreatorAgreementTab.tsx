import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CreatorAgreementTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Nagrik Creator Agreement & Ethical Charter</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Terms of monetization, citizen journalism standards, and 100% IP ownership.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. $1.50 Tiered CPM Monetization</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Creators are paid a minimum of $1.50 USD per 1,000 verified unique hyperlocal views on ground reporting videos and investigative articles. Rates scale up to $2.00 CPM for high-impact coverage.
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. 100% Intellectual Property & Copyright</h3>
          <p className="text-slate-600 dark:text-slate-400">
            You retain 100% ownership of your recorded video clips, photographs, and journalism copy. Nagrik acts purely as a distribution and monetization network.
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Instant Disbursal via NPCI UPI & Bank IMPS</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Withdrawal requests exceeding $10.00 USD are processed to verified Indian UPI IDs or bank accounts within 24 hours.
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">4. Zero Tolerance for Misinformation</h3>
          <p className="text-slate-600 dark:text-slate-400">
            All reports must feature verifiable ground evidence from the tagged state, city, and locality. Fabricated reports lead to immediate suspension.
          </p>
        </div>
      </div>
    </div>
  );
};
