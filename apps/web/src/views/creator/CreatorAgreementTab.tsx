import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CreatorAgreementTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Nagrik Creator Agreement & Ethical Charter</h2>
          <p className="text-xs text-slate-500">Terms of monetization, citizen journalism standards, and 100% IP ownership.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 text-xs text-slate-700 leading-relaxed shadow-xs">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-sm">1. $1.50 Tiered CPM Monetization</h3>
          <p className="text-slate-600">
            Creators are paid a minimum of $1.50 USD per 1,000 verified unique hyperlocal views on ground reporting videos and investigative articles. Rates scale up to $2.00 CPM for high-impact coverage.
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">2. 100% Intellectual Property & Copyright</h3>
          <p className="text-slate-600">
            You retain 100% ownership of your recorded video clips, photographs, and journalism copy. Nagrik acts purely as a distribution and monetization network.
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">3. Instant Disbursal via NPCI UPI & Bank IMPS</h3>
          <p className="text-slate-600">
            Withdrawal requests exceeding $10.00 USD are processed to verified Indian UPI IDs or bank accounts within 24 hours.
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">4. Zero Tolerance for Misinformation</h3>
          <p className="text-slate-600">
            All reports must feature verifiable ground evidence from the tagged state, city, and locality. Fabricated reports lead to immediate suspension.
          </p>
        </div>
      </div>
    </div>
  );
};
