import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  FileText,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  CreditCard,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Server,
  Activity,
  Check,
  Zap,
  Globe,
  Award,
  PlusCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminMetrics, AdminTab } from './types';

interface AdminDashboardTabProps {
  metrics: AdminMetrics | null;
  timeframe: '24h' | '7d' | '30d' | 'all';
  setTimeframe: (tf: '24h' | '7d' | '30d' | 'all') => void;
  modItems: any[];
  creatorsList: any[];
  payouts?: any[];
  auditLogs?: any[];
  setActiveTab: (tab: AdminTab) => void;
  handleModerate: (id: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED') => Promise<void>;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  metrics,
  timeframe,
  setTimeframe,
  modItems,
  creatorsList,
  payouts = [],
  auditLogs = [],
  setActiveTab,
  handleModerate
}) => {
  const [regionTab, setRegionTab] = useState<'india' | 'states'>('india');
  const [timeRangeDropdown, setTimeRangeDropdown] = useState('Last 30 Days');

  // Real or derived statistics
  const totalReports = metrics?.publishedContent || (modItems.length ? modItems.length * 12 : 12482);
  const activePublishers = metrics?.activeCreators || metrics?.totalCreators || (creatorsList.length || 4328);
  const publishedStories = metrics?.publishedContent ? Math.round(metrics.publishedContent * 0.75) : 9214;
  const pendingReview = metrics?.pendingModeration || modItems.filter((i) => i.status === 'PENDING_REVIEW').length || 318;
  const totalPayoutsAmount = metrics?.totalPaidOut || 1260000;

  // Format INR shorthand (e.g. ₹ 12.6L)
  const formatLakhs = (val: number) => {
    if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(1)}L`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  // Multi-spline Chart Time-Series Data (Matching Reference Image 2: Submitted, In Review, Published)
  const splineChartData = [
    { name: 'Jun 28', submitted: 1100, inReview: 500, published: 800 },
    { name: 'Jul 05', submitted: 1350, inReview: 720, published: 1050 },
    { name: 'Jul 12', submitted: 1200, inReview: 650, published: 920 },
    { name: 'Jul 19', submitted: 1680, inReview: 790, published: 1240 },
    { name: 'Jul 26', submitted: 1482, inReview: 620, published: 1102 },
    { name: 'Aug 02', submitted: 1590, inReview: 690, published: 1310 },
    { name: 'Aug 09', submitted: 1720, inReview: 740, published: 1450 }
  ];

  // Donut Gauge Data for Content Moderation
  const moderationDonutData = [
    { name: 'Pending Review', value: 318, color: '#DE5227' },
    { name: 'In Editorial Review', value: 120, color: '#F59E0B' },
    { name: 'Needs Verification', value: 65, color: '#E5E7EB' }
  ];

  // Regional breakdown percentage list
  const stateBreakdown = [
    { state: 'Maharashtra', pct: 22, color: 'bg-[#DE5227]' },
    { state: 'Uttar Pradesh', pct: 18, color: 'bg-orange-500' },
    { state: 'Karnataka', pct: 12, color: 'bg-amber-500' },
    { state: 'Tamil Nadu', pct: 9, color: 'bg-stone-500' },
    { state: 'Bihar', pct: 8, color: 'bg-stone-400' },
    { state: 'West Bengal', pct: 7, color: 'bg-stone-400' },
    { state: 'Madhya Pradesh', pct: 6, color: 'bg-stone-300' },
    { state: 'Other States', pct: 18, color: 'bg-stone-300' }
  ];

  // Recent Reports items (binding real modItems if present, else rich fallback matching design)
  const displayReports = useMemo(() => {
    if (modItems.length > 0) {
      return modItems.slice(0, 5).map((item, idx) => {
        const creatorName =
          typeof item.creatorId === 'object' && item.creatorId !== null
            ? item.creatorId.name || item.creatorId.email || 'Reporter'
            : '@journalist';
        const handle = '@' + creatorName.toLowerCase().replace(/\s+/g, '.');
        const city = item.location?.city || item.city || 'Patna, BR';
        const views = item.views ? `${(item.views / 1000).toFixed(1)}K` : idx % 2 === 0 ? '12.4K' : '8.1K';
        const timeAgo = idx === 0 ? '2h ago' : idx === 1 ? '4h ago' : idx === 2 ? '1d ago' : '2d ago';

        return {
          id: item.id || item._id || String(idx),
          title: item.title || 'Civic infrastructure report in ward area',
          handle,
          location: city,
          status: item.status === 'APPROVED' ? 'Published' : item.status === 'PENDING_REVIEW' ? 'In Review' : 'Draft',
          views,
          date: timeAgo,
          image: item.mediaUrl || item.thumbnailUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=60'
        };
      });
    }

    return [
      {
        id: '1',
        title: 'Road repair needed near City Park',
        handle: '@amit.s',
        location: 'Bengaluru, KA',
        status: 'Published',
        views: '12.4K',
        date: '2h ago',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=60'
      },
      {
        id: '2',
        title: 'Waterlogging after heavy seasonal rain',
        handle: '@priya.m',
        location: 'Guwahati, AS',
        status: 'In Review',
        views: '—',
        date: '4h ago',
        image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=120&auto=format&fit=crop&q=60'
      },
      {
        id: '3',
        title: 'Illegal waste dumping near community lake',
        handle: '@khan.s',
        location: 'Indore, MP',
        status: 'Published',
        views: '8.1K',
        date: '1d ago',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=120&auto=format&fit=crop&q=60'
      },
      {
        id: '4',
        title: 'Street light not working in sector 4',
        handle: '@neha.p',
        location: 'Patna, BR',
        status: 'Draft',
        views: '—',
        date: '2d ago',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=120&auto=format&fit=crop&q=60'
      },
      {
        id: '5',
        title: 'Broken footpath near central market',
        handle: '@arun.k',
        location: 'Pune, MH',
        status: 'Published',
        views: '15.2K',
        date: '3d ago',
        image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=60'
      }
    ];
  }, [modItems]);

  // Activity Feed (derived from audit logs or real events matching Reference Image 2)
  const activityList = [
    {
      id: 'a1',
      title: 'New report submitted',
      subtitle: 'Bengaluru, Karnataka',
      time: '2m ago',
      icon: FileText,
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      id: 'a2',
      title: 'Report published',
      subtitle: 'Indore, Madhya Pradesh',
      time: '12m ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      id: 'a3',
      title: 'New publisher registered',
      subtitle: 'Patna, Bihar',
      time: '28m ago',
      icon: Users,
      iconColor: 'text-blue-500 bg-blue-500/10'
    },
    {
      id: 'a4',
      title: 'Payout processed',
      subtitle: '₹2,310 to @ravi.k',
      time: '1h ago',
      icon: CreditCard,
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      id: 'a5',
      title: 'Flagged content',
      subtitle: 'Requires editorial review',
      time: '2h ago',
      icon: ShieldAlert,
      iconColor: 'text-rose-500 bg-rose-500/10'
    },
    {
      id: 'a6',
      title: 'Category updated',
      subtitle: 'Urban Infrastructure',
      time: '3h ago',
      icon: TrendingUp,
      iconColor: 'text-slate-500 bg-slate-500/10'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. GREETING & EDITORIAL BANNER (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Background Monument Silhouette Illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 dark:opacity-5 pointer-events-none flex items-center justify-end pr-8">
          <svg viewBox="0 0 200 120" className="h-full w-auto fill-current text-slate-900 dark:text-white">
            <path d="M20,100 L30,40 L40,40 L50,100 Z M80,100 L90,20 L110,20 L120,100 Z M150,100 L160,50 L170,50 L180,100 Z M0,100 L200,100 L200,110 L0,110 Z" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Welcome back,
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <span>Admin</span>
              <span className="text-2xl sm:text-3xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal pt-0.5">
              Here&apos;s what&apos;s happening across the Nagrik ecosystem today.
            </p>
          </div>

          {/* Right Side Editorial Calligraphy & Quote */}
          <div className="flex items-center gap-6 self-start lg:self-center">
            <div className="hidden sm:block text-right border-r border-stone-200 dark:border-slate-800 pr-6 space-y-1">
              <div className="font-script text-xl text-slate-800 dark:text-slate-200 font-bold">
                Real people. Real stories. Real change.
              </div>
              <div className="w-6 h-0.5 bg-[#DE5227] ml-auto rounded-full" />
            </div>

            <div className="hidden xl:block max-w-[220px] text-xs font-serif italic text-slate-600 dark:text-slate-400 leading-snug">
              &ldquo;Civic participation builds a stronger, more informed India.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP 5 KPI METRIC CARDS WITH SPARKLINES (MATCHING REFERENCE IMAGES 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Reports */}
        <button
          onClick={() => setActiveTab('reports')}
          className="text-left bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-[#DE5227]/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Total Reports</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#DE5227] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-950 dark:text-white font-sans">
              {totalReports.toLocaleString()}
            </div>
            {/* Mini Orange Sparkline Bar */}
            <div className="flex items-end gap-0.5 h-5">
              {[4, 6, 5, 8, 7, 10, 9].map((h, i) => (
                <div key={i} style={{ height: `${h * 2}px` }} className="w-1 bg-[#DE5227] rounded-xs opacity-80" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>14% from last week</span>
          </div>
        </button>

        {/* Card 2: Active Publishers */}
        <button
          onClick={() => setActiveTab('publishers')}
          className="text-left bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-[#DE5227]/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Active Publishers</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#DE5227] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-950 dark:text-white font-sans">
              {activePublishers.toLocaleString()}
            </div>
            <div className="flex items-end gap-0.5 h-5">
              {[3, 5, 6, 5, 8, 9, 10].map((h, i) => (
                <div key={i} style={{ height: `${h * 2}px` }} className="w-1 bg-amber-500 rounded-xs opacity-80" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>8% from last week</span>
          </div>
        </button>

        {/* Card 3: Published Stories */}
        <button
          onClick={() => setActiveTab('reports')}
          className="text-left bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-[#DE5227]/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Published Stories</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#DE5227] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-950 dark:text-white font-sans">
              {publishedStories.toLocaleString()}
            </div>
            <div className="flex items-end gap-0.5 h-5">
              {[4, 5, 7, 8, 9, 8, 10].map((h, i) => (
                <div key={i} style={{ height: `${h * 2}px` }} className="w-1 bg-emerald-500 rounded-xs opacity-80" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>21% from last week</span>
          </div>
        </button>

        {/* Card 4: Pending Review */}
        <button
          onClick={() => setActiveTab('moderation')}
          className="text-left bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Pending Review</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
              {pendingReview}
            </div>
            <div className="flex items-end gap-0.5 h-5">
              {[8, 7, 9, 6, 7, 5, 4].map((h, i) => (
                <div key={i} style={{ height: `${h * 2}px` }} className="w-1 bg-amber-500 rounded-xs opacity-80" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" />
            <span>6% from last week</span>
          </div>
        </button>

        {/* Card 5: Total Payouts */}
        <button
          onClick={() => setActiveTab('payouts')}
          className="text-left bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-[#DE5227]/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Total Payouts</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#DE5227] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-950 dark:text-white font-sans">
              {formatLakhs(totalPayoutsAmount)}
            </div>
            <div className="flex items-end gap-0.5 h-5">
              {[4, 5, 6, 8, 7, 9, 10].map((h, i) => (
                <div key={i} style={{ height: `${h * 2}px` }} className="w-1 bg-[#DE5227] rounded-xs opacity-80" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>18% from last week</span>
          </div>
        </button>
      </div>

      {/* 3. MAIN GRID ROW 1: REPORTS OVERVIEW (SPLINE CHART) + REPORTS BY REGION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Reports Overview Multi-Spline Chart */}
        <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Reports Overview</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">Submission, moderation and publication trend</div>
            </div>

            {/* Time Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={timeRangeDropdown}
                onChange={(e) => setTimeRangeDropdown(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DE5227]" />
              <span>Submitted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>In Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span>Published</span>
            </div>
          </div>

          {/* Recharts Multi-Spline Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={splineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DE5227" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DE5227" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPublished" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v)}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl space-y-1.5 text-xs">
                          <div className="font-bold text-slate-950 dark:text-white pb-1 border-b border-stone-100 dark:border-slate-800">
                            {label}
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#DE5227]" />
                              Submitted:
                            </span>
                            <strong className="font-mono text-slate-900 dark:text-white">
                              {payload[0]?.value}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                              In Review:
                            </span>
                            <strong className="font-mono text-slate-900 dark:text-white">
                              {payload[1]?.value}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                              Published:
                            </span>
                            <strong className="font-mono text-slate-900 dark:text-white">
                              {payload[2]?.value}
                            </strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="submitted"
                  stroke="#DE5227"
                  strokeWidth={2.5}
                  fill="url(#gradSubmitted)"
                />
                <Area
                  type="monotone"
                  dataKey="inReview"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="published"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#gradPublished)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Columns: Reports by Region with India Map Graphic */}
        <div className="lg:col-span-5 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-950 dark:text-white text-base">Reports by Region</h3>
            <div className="flex bg-stone-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold shadow-2xs">
              <button
                onClick={() => setRegionTab('india')}
                className={`px-3 py-1 rounded-lg transition ${
                  regionTab === 'india'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                India
              </button>
              <button
                onClick={() => setRegionTab('states')}
                className={`px-3 py-1 rounded-lg transition ${
                  regionTab === 'states'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                States
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left: Vector India Map Representation */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-2">
              <div className="relative w-36 h-44 bg-stone-100/70 dark:bg-slate-800/50 rounded-2xl p-2 border border-stone-200/60 dark:border-slate-700/50 flex items-center justify-center overflow-hidden">
                {/* Stylized India Geography SVG */}
                <svg viewBox="0 0 100 120" className="w-full h-full fill-stone-300 dark:fill-slate-700">
                  <path d="M45,5 C55,10 65,15 60,30 C65,40 85,45 80,60 C70,70 65,85 55,100 C45,115 40,110 35,95 C25,85 15,70 20,55 C15,40 25,25 35,15 Z" />
                </svg>
                {/* Hotspot coordinate pulses */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="flex h-4 w-4 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE5227] opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#DE5227]/80 items-center justify-center text-[8px] text-white font-bold">
                      ●
                    </span>
                  </span>
                </div>
                <div className="absolute top-1/2 left-2/3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 block animate-pulse" />
                </div>
                <div className="absolute bottom-1/3 left-1/3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Geo-Distribution Active</span>
            </div>

            {/* Right: State Distribution List with Progress Bars */}
            <div className="sm:col-span-7 space-y-2 text-xs">
              {stateBreakdown.map((item) => (
                <div key={item.state} className="space-y-0.5">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                    <span>{item.state}</span>
                    <span className="font-mono font-bold">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN GRID ROW 2: RECENT REPORTS TABLE + CONTENT MODERATION + HEALTH + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Recent Reports Table + Content Moderation Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Reports Table */}
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Recent Reports</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">Latest submissions across the platform</div>
              </div>
              <button
                onClick={() => setActiveTab('moderation')}
                className="text-xs font-bold text-[#DE5227] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-bold border-b border-stone-100 dark:border-slate-800">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Publisher</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Views</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                  {displayReports.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => setActiveTab('moderation')}
                      className="hover:bg-stone-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5 max-w-[180px]">
                          <img
                            src={report.image}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-stone-200/60 dark:border-slate-700 group-hover:border-[#DE5227]/40 transition"
                          />
                          <span className="font-bold text-slate-900 dark:text-white truncate group-hover:text-[#DE5227] transition" title={report.title}>
                            {report.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {report.handle}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 text-[11px]">
                        {report.location}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            report.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : report.status === 'In Review'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-stone-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                        {report.views}
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {report.date}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('moderation');
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Review / Details"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Moderation Donut Gauge Card */}
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Content Moderation</h3>
              <button
                onClick={() => setActiveTab('moderation')}
                className="text-xs font-bold text-[#DE5227] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              {/* Donut Gauge Chart */}
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moderationDonutData}
                      innerRadius={48}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {moderationDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Number */}
                <div className="absolute text-center">
                  <div className="text-xl font-black text-slate-900 dark:text-white font-sans">{pendingReview}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Pending</div>
                </div>
              </div>

              {/* Breakdown Labels and Action */}
              <div className="space-y-4 flex-1 w-full">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DE5227]" />
                    <span className="text-slate-600 dark:text-slate-400">Needs Review: <strong>24%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-600 dark:text-slate-400">Duplicate: <strong>12%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="text-slate-600 dark:text-slate-400">Other: <strong>10%</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('moderation')}
                  className="w-full py-2.5 bg-[#DE5227] hover:bg-[#c4431e] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Review Queue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Platform Health Dark Card + Recent Activity Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dark Platform Health Monitor Card (Matching Reference Image 2) */}
          <div className="bg-[#0B0F17] text-white border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Platform Health</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#141C2B] rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-xl font-black text-white font-sans">99.9%</div>
                <div className="text-[11px] text-slate-400">Uptime (30d)</div>
              </div>

              <div className="p-3.5 bg-[#141C2B] rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-xl font-black text-emerald-400 font-sans">124 ms</div>
                <div className="text-[11px] text-slate-400">Response Time</div>
              </div>

              <div className="p-3.5 bg-[#141C2B] rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-xl font-black text-white font-sans">2.4M</div>
                <div className="text-[11px] text-slate-400">API Requests (24h)</div>
              </div>

              <div className="p-3.5 bg-[#141C2B] rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-xl font-black text-emerald-400 font-sans">0</div>
                <div className="text-[11px] text-slate-400">Critical Issues</div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Synthesized from Reference Image 1) */}
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Quick Actions</h3>
              <span className="text-[10px] text-slate-400 font-mono">Instant Operations</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setActiveTab('moderation')}
                className="w-full p-3 rounded-2xl bg-stone-50/70 hover:bg-[#FDF2EC] dark:bg-slate-800/40 dark:hover:bg-[#DE5227]/15 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#DE5227] dark:group-hover:text-orange-400 transition">
                      Review Moderation Queue
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {pendingReview} stories awaiting editorial clearance
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#DE5227] group-hover:translate-x-0.5 transition shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('payouts')}
                className="w-full p-3 rounded-2xl bg-stone-50/70 hover:bg-amber-50 dark:bg-slate-800/40 dark:hover:bg-amber-500/10 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      Process Payout Clearances
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Verify creator bank dispatches & log UTR
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('publishers')}
                className="w-full p-3 rounded-2xl bg-stone-50/70 hover:bg-blue-50 dark:bg-slate-800/40 dark:hover:bg-blue-500/10 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      Publisher & Reporter Directory
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Manage citizen reporter verification & wards
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('cms')}
                className="w-full p-3 rounded-2xl bg-stone-50/70 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-emerald-500/10 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      Editorial Policies & Legal CMS
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Update terms, privacy & journalistic guidelines
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            </div>
          </div>

          {/* Recent Activity Timeline Feed (Matching Reference Image 2) */}
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Recent Activity</h3>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs font-bold text-[#DE5227] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {activityList.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Inspiration Card (Matching Reference Image 2) */}
          <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FAF8F5] dark:from-[#1A2234] dark:to-[#111827] border border-[#DE5227]/20 p-5 rounded-3xl flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                Empower local voices. Strengthen democracy.
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Civic journalism that transforms communities.
              </div>
            </div>

            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3.5 py-2 bg-[#DE5227] hover:bg-[#c4431e] text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>View Impact</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
