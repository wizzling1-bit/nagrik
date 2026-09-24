import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Award, FileText, Check, Shield } from 'lucide-react';

export const CreatorAgreementTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              LEGAL CHARTER
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Version 2.4 Digital Trust
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Creator Accord & Ethical Charter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Terms of monetization, citizen reporting standards, and 100% intellectual property ownership.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
        
        {/* Verification Status Header */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Active Contributor Accord</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Valid for all registered citizen stringers and community publishers.</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
            ✓ STANDARDS COMPLIANT
          </span>
        </div>

        {/* 4 Sovereign Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Tenet 1 */}
          <div className="p-5 bg-[#F8F5EE] dark:bg-slate-900/60 rounded-2xl border border-[#DCD1BF] dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-[#DE5227] dark:text-orange-400 text-xs flex items-center justify-center font-mono font-black">
                1
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-serif">
                $1.00 Guaranteed CPM Monetization (~₹86.5/1k reads)
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
              Publishers receive <strong className="text-slate-900 dark:text-white font-mono">$1.00 USD per 1,000 verified unique reads</strong> ($0.001000 per read) on published ground reporting videos and investigative bulletins. Each device is eligible for up to 3 monetized views per video to prevent fraudulent loop farming.
            </p>
          </div>

          {/* Tenet 2 */}
          <div className="p-5 bg-[#F8F5EE] dark:bg-slate-900/60 rounded-2xl border border-[#DCD1BF] dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-[#DE5227] dark:text-orange-400 text-xs flex items-center justify-center font-mono font-black">
                2
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-serif">
                100% IP & Copyright Retention
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
              You retain complete and undivided intellectual property ownership over all recorded footage, audio bytes, photographs, and journalistic text. Nagrik acts strictly as a decentralized distribution and monetization facilitator.
            </p>
          </div>

          {/* Tenet 3 */}
          <div className="p-5 bg-[#F8F5EE] dark:bg-slate-900/60 rounded-2xl border border-[#DCD1BF] dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-[#DE5227] dark:text-orange-400 text-xs flex items-center justify-center font-mono font-black">
                3
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-serif">
                Instant Disbursals via NPCI UPI
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
              Withdrawal requests above the <strong className="text-slate-900 dark:text-white font-mono">$10.00 USD minimum threshold</strong> (~₹865 INR) are transferred directly to your verified Indian UPI ID (GPay, PhonePe, Paytm, BHIM) or Bank Account within 24 hours. Zero platform commission is deducted.
            </p>
          </div>

          {/* Tenet 4 */}
          <div className="p-5 bg-[#F8F5EE] dark:bg-slate-900/60 rounded-2xl border border-[#DCD1BF] dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-[#DE5227] dark:text-orange-400 text-xs flex items-center justify-center font-mono font-black">
                4
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-serif">
                Zero Tolerance for Fabricated Reports
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
              All ground stories must represent verifiable facts from the tagged municipal ward. Disseminating staged footage, hate speech, defamatory content, or deliberate civic panic results in immediate balance forfeiture and permanent exclusion from the Nagrik network.
            </p>
          </div>
        </div>

        {/* Cryptographic Seal Footer */}
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-stone-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Digital Cryptographic Charter • Version 2.4 (2026)</span>
          </span>
          <span className="text-[#DE5227] dark:text-orange-400 font-bold">
            Nagrik Media Foundation Trust
          </span>
        </div>
      </div>
    </div>
  );
};
