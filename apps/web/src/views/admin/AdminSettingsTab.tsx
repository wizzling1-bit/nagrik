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
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="font-black text-stone-900 text-base">Platform Monetization & CPM Rules</h3>
        </div>
      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Creator Earning Rate (USD per 1,000 Views)
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.earningRatePer1000Views}
            onChange={(e) => setSettings({ ...settings, earningRatePer1000Views: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono focus:outline-none focus:border-[#E36138] shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Minimum Withdrawal Threshold (USD)
          </label>
          <input
            type="number"
            step="1"
            value={settings.minPayoutAmount}
            onChange={(e) => setSettings({ ...settings, minPayoutAmount: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono focus:outline-none focus:border-[#E36138] shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Max Counted Views Per Device Per Day (Ceiling Rule)
          </label>
          <input
            type="number"
            value={settings.maxCountedViewsPerVideo}
            onChange={(e) => setSettings({ ...settings, maxCountedViewsPerVideo: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono focus:outline-none focus:border-[#E36138] shadow-2xs"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black py-3 rounded-xl transition cursor-pointer shadow-sm"
        >
          Save Platform Rules
        </button>
      </form>
      </div>
    </div>
  );
};
