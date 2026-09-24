import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  DollarSign,
  ShieldAlert,
  Radio,
  Calculator,
  Zap,
  Info,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [formData, setFormData] = useState({
    earningRatePer1000Views: settings?.earningRatePer1000Views ?? 1.5,
    minPayoutAmount: settings?.minPayoutAmount ?? 10,
    maxCountedViewsPerVideo: settings?.maxCountedViewsPerVideo ?? 100000,
    adFeedFrequency: settings?.adFeedFrequency ?? 4,
    autoModerationThreshold: 0.85,
    flagThresholdForReview: 3,
    maintenanceMode: false,
    broadcastMessage: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        earningRatePer1000Views: settings.earningRatePer1000Views ?? prev.earningRatePer1000Views,
        minPayoutAmount: settings.minPayoutAmount ?? prev.minPayoutAmount,
        maxCountedViewsPerVideo: settings.maxCountedViewsPerVideo ?? prev.maxCountedViewsPerVideo,
        adFeedFrequency: settings.adFeedFrequency ?? prev.adFeedFrequency
      }));
    }
  }, [settings]);

  // Fetch settings on mount from Supabase
  const fetchCurrentSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const mapped = {
          earningRatePer1000Views: data.earning_rate_per_1000_views ?? 1.5,
          minPayoutAmount: data.min_payout_amount ?? 10,
          maxCountedViewsPerVideo: data.max_counted_views_per_video ?? 100000,
          adFeedFrequency: data.ad_feed_frequency ?? 4
        };
        setSettings(mapped);
        setFormData((prev) => ({
          ...prev,
          ...mapped
        }));
      }
    } catch (err) {
      console.error('Error fetching settings via Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'DEFAULT',
          earning_rate_per_1000_views: Number(formData.earningRatePer1000Views),
          min_payout_amount: Number(formData.minPayoutAmount),
          max_counted_views_per_video: Number(formData.maxCountedViewsPerVideo),
          ad_feed_frequency: Number(formData.adFeedFrequency),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) {
        console.error('Supabase update system settings error:', error);
        setToastMsg({ text: error.message || 'Failed to update system settings.', type: 'error' });
      } else {
        setSettings({
          earningRatePer1000Views: Number(formData.earningRatePer1000Views),
          minPayoutAmount: Number(formData.minPayoutAmount),
          maxCountedViewsPerVideo: Number(formData.maxCountedViewsPerVideo),
          adFeedFrequency: Number(formData.adFeedFrequency)
        });
        setToastMsg({
          text: 'Enterprise CPM rules and platform settings saved successfully.',
          type: 'success'
        });
      }
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      console.error(err);
      setToastMsg({ text: err.message || 'Error communicating with settings server.', type: 'error' });
      setTimeout(() => setToastMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setFormData({
      earningRatePer1000Views: 1.5,
      minPayoutAmount: 10,
      maxCountedViewsPerVideo: 100000,
      adFeedFrequency: 4,
      autoModerationThreshold: 0.85,
      flagThresholdForReview: 3,
      maintenanceMode: false,
      broadcastMessage: ''
    });
  };

  // Live Calculator based on current form input
  const sampleViews = 50000;
  const estimatedPayout = (sampleViews / 1000) * (formData.earningRatePer1000Views || 0);

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 border shadow-xs ${
            toastMsg.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {toastMsg.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Monetization & Creator Economics */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DE5227]/10 text-[#DE5227] border border-[#DE5227]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">
                  Creator Monetization & Platform CPM Rules
                </h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure revenue distribution and payout parameters for verified citizen journalists
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchCurrentSettings}
              disabled={isLoading}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#0B0F17] dark:hover:bg-[#1A2234] border border-stone-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh from Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#DE5227]' : ''}`} />
              <span className="hidden sm:inline">Sync Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Earning Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Creator Earning Rate (₹ per 1,000 Views)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.earningRatePer1000Views}
                  onChange={(e) =>
                    setFormData({ ...formData, earningRatePer1000Views: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Amount credited to verified creator balances per 1,000 eligible video views.
              </span>
            </div>

            {/* Minimum Payout Threshold */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Minimum Withdrawal Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={formData.minPayoutAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minPayoutAmount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Creators must accumulate at least this amount before requesting a bank or UPI payout.
              </span>
            </div>

            {/* Max Views Ceiling Rule */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Anti-Fraud View Ceiling (Max Counted Views per Video)
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={formData.maxCountedViewsPerVideo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCountedViewsPerVideo: parseInt(e.target.value, 10) || 0
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
              />
              <span className="text-[10px] text-slate-500">
                Guards against abnormal traffic spikes and automated bot farms by capping payable impressions per report.
              </span>
            </div>
          </div>

          {/* Live Simulator Widget */}
          <div className="p-4 bg-stone-100/60 dark:bg-[#0B0F17] rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#DE5227]" />
              <span className="text-slate-600 dark:text-slate-400">
                Rule Simulation: A viral ground report with <strong className="text-slate-900 dark:text-white">{sampleViews.toLocaleString()}</strong> views pays out:
              </span>
            </div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              ₹{estimatedPayout.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Section 2: Advertising & Feed Ingestion Rules */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200/60 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Feed Experience & Ad Delivery Rules
              </h3>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Control ad frequency and user experience in the citizen mobile feed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Ad Feed Frequency (1 Ad card per N items)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.adFeedFrequency}
                onChange={(e) =>
                  setFormData({ ...formData, adFeedFrequency: parseInt(e.target.value, 10) || 4 })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
              />
              <span className="text-[10px] text-slate-500">
                A sponsored hyper-local ad card will be smoothly rendered every {formData.adFeedFrequency} stories in the citizen mobile feed.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Advertiser Baseline CPM Rate (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="5"
                  defaultValue={120}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Default rate charged to local commercial sponsors for geo-targeted video impressions.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: AI & Content Moderation Safety Safeguards */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200/60 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Hyperlocal Moderation & AI Safeguards
              </h3>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Automated filtering and threshold controls for community civic reports
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                AI Auto-Approval Confidence Threshold
              </label>
              <select
                value={formData.autoModerationThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, autoModerationThreshold: parseFloat(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
              >
                <option value={0.95}>Strict (95% Confidence required)</option>
                <option value={0.85}>Balanced (85% Confidence - Recommended)</option>
                <option value={0.70}>Relaxed (70% Confidence)</option>
                <option value={1.0}>Manual Only (All reports require human review)</option>
              </select>
              <span className="text-[10px] text-slate-500">
                Reports scoring above this threshold by the AI safety model can be published directly.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Citizen Flag Threshold for Auto-Suspension
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.flagThresholdForReview}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    flagThresholdForReview: parseInt(e.target.value, 10) || 3
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] shadow-2xs"
              />
              <span className="text-[10px] text-slate-500">
                When a published video receives {formData.flagThresholdForReview} community flags, it is temporarily pulled from feeds for admin review.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Save Actions Bar */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-[#DE5227]" />
            <span>Changes take effect immediately across all client applications.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#DE5227] hover:bg-[#c4431e] disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Rules...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Enterprise Rules</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
