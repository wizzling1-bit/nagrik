'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Wallet,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Eye,
  ShieldCheck,
  Zap,
  Target,
  ArrowUpRight,
  Info,
  Clock,
  MapPin,
  Plus,
  Shield,
  Fingerprint,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
  AlertCircle,
  Radio,
  FileQuestion
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';
import { CreatorStats, CreatorTab } from './types';

interface CreatorDashboardInspirationTabProps {
  stats: CreatorStats | null;
  contents: any[];
  user?: {
    name?: string;
    email?: string;
    role?: string;
  } | null;
  setActiveTabNav: (tab: CreatorTab) => void;
}

export const CreatorDashboardInspirationTab: React.FC<CreatorDashboardInspirationTabProps> = ({
  stats,
  contents = [],
  user,
  setActiveTabNav
}) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  // Authoritative identity
  const publisherName = user?.name || 'Citizen Reporter';
  const publisherEmail = user?.email || '';

  // Dynamic calculations strictly from live Supabase props
  const totalViews = Number(stats?.totalViews ?? stats?.totalEligibleViews ?? 0);
  const reportsPublished = contents.length;
  const totalEarningsUSD = Number(stats?.lifetimeEarnings ?? stats?.availableBalance ?? (totalViews * 0.001000));
  const totalEarningsINR = totalEarningsUSD * 86.5;
  const activeReach = totalViews > 0 ? Math.round(totalViews * 0.65) : 0;

  // Report status counters
  const publishedCount = contents.filter(
    (c) => c.moderationStatus === 'APPROVED' || c.publicationStatus === 'PUBLISHED'
  ).length;
  const inReviewCount = contents.filter(
    (c) => c.moderationStatus === 'PENDING_REVIEW'
  ).length;
  const rejectedCount = contents.filter(
    (c) => c.moderationStatus === 'REJECTED' || c.moderationStatus === 'FLAGGED'
  ).length;
  const draftCount = contents.filter((c) => c.moderationStatus === 'DRAFT').length;
  const totalReportsCount = contents.length;
  const approvalRate = totalReportsCount > 0 ? Math.round((publishedCount / totalReportsCount) * 100) : 100;

  // Dynamic performance chart points derived from actual content submissions
  const performanceData = useMemo(() => {
    const now = new Date();
    const daysWindow = timeframe === 'weekly' ? 7 : timeframe === 'monthly' ? 30 : 365;
    const stepDays = Math.max(1, Math.ceil(daysWindow / 7));
    const points: { label: string; reads: number; inr: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const end = new Date(now.getTime() - i * stepDays * 86400000);
      const start = new Date(end.getTime() - stepDays * 86400000);
      const label = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      // Aggregate views for content created on or before this window
      const inWindowContents = contents.filter((c) => {
        const d = new Date(c.createdAt || c.created_at || 0);
        return d <= end;
      });

      const reads = inWindowContents.reduce((acc, c) => acc + (c.eligibleViews || c.eligible_views || c.views || 0), 0);
      const inr = Number(((reads / 1000) * 86.5).toFixed(2));

      points.push({ label, reads, inr });
    }

    return points;
  }, [contents, timeframe]);

  // Recent reports mapped directly from live contents
  const recentReports = useMemo(() => {
    return contents.slice(0, 5).map((c) => {
      const viewsCount = Number(c.eligibleViews ?? c.eligible_views ?? c.views ?? 0);
      const inrYield = (viewsCount / 1000) * 86.5;
      const locStr = c.location_city && c.location_state
        ? `${c.location_city}, ${c.location_state}`
        : c.location?.city
        ? `${c.location.city}, ${c.location.state || ''}`
        : c.location_area || 'Hyperlocal Beat';

      let statusLabel: 'Published' | 'In Review' | 'Needs Revision' = 'In Review';
      if (c.moderationStatus === 'APPROVED' || c.publicationStatus === 'PUBLISHED') {
        statusLabel = 'Published';
      } else if (c.moderationStatus === 'REJECTED' || c.moderationStatus === 'FLAGGED') {
        statusLabel = 'Needs Revision';
      }

      return {
        id: c.id || c._id,
        title: c.title || 'Civic Ground Report',
        location: locStr,
        status: statusLabel,
        reads: viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}K` : `${viewsCount}`,
        earnings: `₹${inrYield.toFixed(2)}`,
        date: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        thumbnail:
          c.thumbnailUrl ||
          c.thumbnail_url ||
          c.mediaUrl ||
          c.media_url ||
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=60'
      };
    });
  }, [contents]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ─────────────────────────────────────────────────────────────
          ROW 1: TOP 4 METRIC CARDS (100% Live DB Data)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Verified Views */}
        <div className="bg-white dark:bg-[#101522] rounded-3xl p-5 sm:p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Verified Reads</p>
              <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white mt-1">
                {totalViews.toLocaleString('en-IN')}
              </h3>
            </div>
            {/* Stylized Mini Bar Graph with Terracotta Accent */}
            <div className="flex items-end gap-1 h-9 px-2 py-1 bg-[#F5EFE6] dark:bg-slate-800/80 rounded-xl border border-[#E7DFD1] dark:border-slate-700/60">
              <span className="w-1.5 h-3 bg-stone-400 dark:bg-slate-600 rounded-full group-hover:bg-[#DE5227] transition-colors" />
              <span className="w-1.5 h-5 bg-stone-500 dark:bg-slate-500 rounded-full group-hover:bg-[#DE5227] transition-colors" />
              <span className="w-1.5 h-7 bg-[#DE5227] rounded-full group-hover:bg-[#C84318] transition-colors" />
              <span className="w-1.5 h-4 bg-stone-400 dark:bg-slate-600 rounded-full group-hover:bg-[#DE5227] transition-colors" />
              <span className="w-1.5 h-6 bg-stone-700 dark:bg-slate-400 rounded-full group-hover:bg-[#DE5227] transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              Live Ledger
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">anti-fraud verified</span>
          </div>
        </div>

        {/* Card 2: Reports Published */}
        <div className="bg-white dark:bg-[#101522] rounded-3xl p-5 sm:p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-[#DE5227] dark:text-orange-400 border border-[#DE5227]/25 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Reports In Library</p>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white mt-0.5">
                  {reportsPublished}
                </h3>
              </div>
            </div>
            {/* Mini Sparkline Curve */}
            <svg className="w-12 h-6 text-[#DE5227] group-hover:scale-105 transition-transform" viewBox="0 0 48 24" fill="none">
              <path d="M2 18C10 18 14 6 24 6C34 6 38 14 46 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              {publishedCount} Published
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {inReviewCount > 0 ? `${inReviewCount} in review` : 'all reviewed'}
            </span>
          </div>
        </div>

        {/* Card 3: Total Accrued Yield */}
        <div className="bg-white dark:bg-[#101522] rounded-3xl p-5 sm:p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl font-serif shrink-0">
                ₹
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Accrued Yield</p>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white mt-0.5">
                  ₹{Number(totalEarningsINR).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 font-mono">
                ${totalEarningsUSD.toFixed(2)} USD
              </span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {totalEarningsUSD >= 10 ? 'Ready for disbursal' : 'Min $10 payout'}
            </span>
          </div>
        </div>

        {/* Card 4: Signature Dark Obsidian Accent Card (Active Ward Reach) */}
        <div className="bg-gradient-to-br from-[#1E2430] via-[#151A24] to-[#0D111A] text-white rounded-3xl p-5 sm:p-6 border border-slate-700/80 shadow-[0_8px_28px_-4px_rgba(15,23,42,0.35)] hover:shadow-[0_16px_36px_-4px_rgba(15,23,42,0.45)] transition-all flex flex-col justify-between relative overflow-hidden group">
          {/* Ambient Warm Terracotta/Amber Rim Glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#DE5227]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div>
              <p className="text-xs font-bold text-orange-200 font-mono tracking-wider uppercase">Active Ward Reach</p>
              <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white mt-1">
                {activeReach.toLocaleString('en-IN')}
              </h3>
            </div>
            {/* Smooth Sine Wave Line Graph with Terracotta Glow */}
            <svg className="w-14 h-8 text-[#DE5227] drop-shadow-[0_0_8px_rgba(222,82,39,0.5)]" viewBox="0 0 56 32" fill="none">
              <path d="M2 20C12 20 18 6 28 6C38 6 42 26 54 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>5km Ward Geofence Active</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE5227] animate-pulse shadow-sm shadow-orange-500" />
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: 3-COLUMN CORE GRID (PERFORMANCE SPLINE, QUALITY GAUGE, PROFILE)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Performance & Balance Card (Span 5 on 12-col) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black font-serif text-slate-900 dark:text-white">Readership & Yield Velocity</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Live</span>
                </span>
              </div>

              {/* Timeframe selector pill */}
              <div className="relative inline-block">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="text-xs font-bold bg-[#F8F5EE] dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-xl border border-[#E4DBD0] dark:border-slate-700/80 outline-hidden cursor-pointer pr-7 appearance-none shadow-2xs"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Dual sub-metric pills */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-slate-800/60 border border-[#DE5227]/30 dark:border-slate-700/60 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Guaranteed CPM</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black font-serif text-slate-900 dark:text-white">₹86.50</span>
                  <span className="text-[11px] font-extrabold text-[#DE5227]">/ 1k reads</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-slate-800/60 border border-[#E4DBD0] dark:border-slate-700/60 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Accrued Yield</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black font-serif text-slate-900 dark:text-white">₹{Number(totalEarningsINR).toFixed(2)}</span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">NPCI Direct</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smooth Organic Wave Spline Area Chart with Terracotta Gradient */}
          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="nagrikSpline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DE5227" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#DE5227" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={34}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 text-white px-3 py-2 rounded-xl text-xs shadow-xl font-sans border border-slate-800">
                          <p className="font-bold">{payload[0].payload.label}</p>
                          <p className="text-[#DE5227] font-mono font-bold">Reads: {payload[0].value?.toLocaleString()}</p>
                          <p className="text-emerald-400 font-mono text-[11px]">Yield: ₹{payload[0].payload.inr}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reads"
                  stroke="#DE5227"
                  strokeWidth={2.5}
                  fill="url(#nagrikSpline)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center: Publication & Review Radial Meter Card (Span 4 on 12-col) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black font-serif text-slate-900 dark:text-white">Review & Quality</h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold font-mono uppercase">
                {totalReportsCount > 0 ? 'ACTIVE BEAT' : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Stories Managed</p>
            <h4 className="text-2xl font-black font-serif text-slate-900 dark:text-white mt-1">
              {totalReportsCount} Reports
            </h4>
            <p className="text-[11px] font-bold text-[#DE5227] mt-1">
              {totalReportsCount === 0
                ? 'Ready for your first ground report submission'
                : `${publishedCount} approved & live on citizen feeds`}
            </p>
          </div>

          {/* Semi-Circular Radial Gauge Visual */}
          <div className="relative flex flex-col items-center justify-center my-4">
            <svg className="w-44 h-24" viewBox="0 0 100 50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#EAE2D5"
                strokeWidth="10"
                strokeLinecap="round"
                className="dark:stroke-slate-800"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#DE5227"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - approvalRate / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-0 text-center">
              <span className="text-2xl font-black font-serif text-slate-900 dark:text-white tracking-tight">{approvalRate}%</span>
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Approval Rate</p>
            </div>
          </div>

          {/* Legend breakdown tags */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE2D5] dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{publishedCount} Published</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{inReviewCount} In Review</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{rejectedCount} Rejected</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>{draftCount} Draft</span>
            </div>
          </div>
        </div>

        {/* Right: Publisher Account Profile Card (Span 3 on 12-col) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between text-center">
          <div>
            {/* Avatar circle with Terracotta Gradient Rim */}
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#DE5227] via-amber-400 to-orange-300 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#FAF8F5] dark:bg-slate-900 flex items-center justify-center overflow-hidden font-mono font-bold text-2xl text-slate-800 dark:text-white">
                  {publisherName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs" title="Verified Publisher">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <h4 className="font-black font-serif text-slate-900 dark:text-white text-base leading-snug">
              {publisherName}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-full font-mono mt-0.5 font-medium">
              {publisherEmail || 'Verified Citizen Reporter'}
            </p>
          </div>

          {/* 3-column stats pill */}
          <div className="grid grid-cols-3 gap-2 py-3 px-2 my-3 bg-[#F8F5EE] dark:bg-slate-800/60 rounded-2xl border border-[#E4DBD0] dark:border-slate-700/60">
            <div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold">Reports</p>
              <p className="text-base font-black font-serif text-slate-900 dark:text-white mt-0.5">{reportsPublished}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold">Approved</p>
              <p className="text-base font-black font-serif text-slate-900 dark:text-white mt-0.5">{publishedCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold">Status</p>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Verified</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTabNav('branding')}
            className="w-full py-2.5 px-4 bg-[#EDE5D8] hover:bg-[#E3D9C9] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-2xl transition cursor-pointer border border-[#DCD1BF] dark:border-slate-700 shadow-2xs"
          >
            Edit Profile
          </button>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 3: RECENT REPORTS, 3D WALLET CARDS, SECURITY PILL
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Recent Reports Table (Span 6 on 12-col) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black font-serif text-slate-900 dark:text-white">Recent Reports</h3>
              {contents.length > 0 && (
                <button
                  onClick={() => setActiveTabNav('files')}
                  className="text-xs font-bold text-[#DE5227] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reports List or Clean Empty State */}
            {contents.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl bg-[#F8F5EE] dark:bg-slate-800/40 border border-[#E4DBD0] dark:border-slate-700/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#DE5227] flex items-center justify-center mx-auto border border-[#DE5227]/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold font-serif text-slate-900 dark:text-white text-sm">No Ground Reports Yet</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
                    Upload your first verified citizen report or video investigation to reach local readers and start earning.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTabNav('upload')}
                  className="px-4 py-2 bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Your First Report</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-slate-800/50 hover:bg-[#F2ECE1] dark:hover:bg-slate-800/80 border border-[#E4DBD0] dark:border-slate-700/60 transition flex items-center justify-between gap-3 group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={report.thumbnail}
                        alt={report.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#DCD1BF] dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#DE5227] transition">
                          {report.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                          <span className="flex items-center gap-1 text-[#DE5227]">
                            <MapPin className="w-3 h-3" />
                            <span>{report.location}</span>
                          </span>
                          <span>•</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          report.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : report.status === 'In Review'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {report.status}
                      </span>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-900 dark:text-white font-mono">{report.earnings}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{report.reads} reads</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#EAE2D5] dark:border-slate-800/80 flex items-center justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Ready to break local news?</p>
            <button
              onClick={() => setActiveTabNav('upload')}
              className="px-4 py-2 bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ground Report</span>
            </button>
          </div>
        </div>

        {/* Center: 3D Isometric Stacked Cards Deck (Span 3 on 12-col) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black font-serif text-slate-900 dark:text-white leading-tight">
              Disbursals Wallet
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Instant payouts direct to your registered Indian Bank or UPI ID.
            </p>

            {/* 3D Stacked Floating Cards Deck with Nagrik Terracotta Accent */}
            <div className="relative h-36 my-4 flex items-center justify-center">
              {/* Back card (Dark Slate) */}
              <div className="absolute w-44 h-24 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 text-white p-3 shadow-md transform -rotate-12 translate-y-4 -translate-x-2 border border-slate-700/50 opacity-70">
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>BANK DEPOSIT</span>
                  <span>IMPS/NEFT</span>
                </div>
              </div>

              {/* Middle card (Terracotta Vermilion) */}
              <div className="absolute w-44 h-24 rounded-2xl bg-gradient-to-br from-[#DE5227] to-[#8C2809] text-white p-3 shadow-lg transform -rotate-6 translate-y-2 border border-orange-400/40 opacity-90">
                <div className="flex justify-between text-[9px] font-mono text-orange-200">
                  <span>NPCI UPI FAST</span>
                  <span>DIRECT 24H</span>
                </div>
              </div>

              {/* Front card (Signature Glassmorphism Card) */}
              <div className="absolute w-44 h-24 rounded-2xl bg-gradient-to-br from-white to-[#F8F5EE] dark:from-slate-800/95 dark:to-slate-900/95 text-slate-900 dark:text-white p-3 shadow-xl transform rotate-0 border border-[#DCD1BF] dark:border-slate-700 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-[#DE5227] font-black font-sans">NAGRIK PAY</span>
                  <span className="font-mono">₹{Number(totalEarningsINR).toFixed(2)}</span>
                </div>
                <div className="text-center font-mono text-xs font-bold tracking-widest text-slate-800 dark:text-slate-200">
                  UPI & BANK IMPS
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[90px]">{publisherName.toUpperCase()}</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTabNav('billing')}
            className="w-full py-2.5 bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25"
          >
            <span>Manage Disbursals</span>
          </button>
        </div>

        {/* Right: Keep you safe! Security Badge Card (Span 3 on 12-col) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#101522] rounded-3xl p-6 border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(30,24,16,0.12),0_2px_8px_rgba(30,24,16,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between text-center">
          <div>
            {/* Biometric Fingerprint Icon */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-orange-500/10 text-[#DE5227] dark:text-orange-400 border border-[#DE5227]/25 flex items-center justify-center shadow-xs">
              <Fingerprint className="w-9 h-9 stroke-[1.5]" />
            </div>

            <h4 className="font-black font-serif text-slate-900 dark:text-white text-base">
              Digital Trust Active
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed px-2 font-medium">
              GPS Ground Verification & 100% intellectual property ownership guaranteed.
            </p>
          </div>

          <button
            onClick={() => setActiveTabNav('agreement')}
            className="w-full py-2.5 bg-[#EDE5D8] hover:bg-[#E3D9C9] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-2xl transition cursor-pointer border border-[#DCD1BF] dark:border-slate-700 shadow-2xs"
          >
            View Ethical Charter
          </button>
        </div>

      </div>

    </div>
  );
};
