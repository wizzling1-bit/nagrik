import React, { useState } from 'react';
import { CheckCircle2, Sliders } from 'lucide-react';

interface AdminSettingsTabProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  token: string | null;
  apiBase: string;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  setSettings,
  token,
  apiBase
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg('System settings and CPM rules updated successfully!');
        setTimeout(() => setToastMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl space-y-4 animate-in fade-in duration-200">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">Platform Monetization & CPM Rules</h3>
        </div>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Creator Earning Rate (USD per 1,000 Views)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.earningRatePer1000Views}
              onChange={(e) => setSettings({ ...settings, earningRatePer1000Views: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Minimum Withdrawal Threshold (USD)
            </label>
            <input
              type="number"
              step="1"
              value={settings.minPayoutAmount}
              onChange={(e) => setSettings({ ...settings, minPayoutAmount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Max Counted Views Per Device Per Day (Ceiling Rule)
            </label>
            <input
              type="number"
              value={settings.maxCountedViewsPerVideo}
              onChange={(e) => setSettings({ ...settings, maxCountedViewsPerVideo: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-black py-3 rounded-xl transition cursor-pointer shadow-xs"
          >
            Save Platform Rules
          </button>
        </form>
      </div>
    </div>
  );
};
