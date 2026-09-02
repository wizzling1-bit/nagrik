import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NagrikLogo } from '../components/NagrikLogo';
import {
  Play,
  FileText,
  MapPin,
  Smartphone,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Eye,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Calculator,
  Upload,
  Laptop,
  CheckCircle,
  CreditCard,
  Building
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'creator' | 'admin') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [monthlyViews, setMonthlyViews] = useState<number>(50000);

  return (
    <div className="bg-[#FFFDFB] text-slate-900 overflow-hidden selection:bg-orange-100 selection:text-orange-900 font-sans">
      {/* =================================================================== */}
      {/* 1. HERO SECTION (1:1 DiskWala Layout in Nagrik Brand Orange)         */}
      {/* =================================================================== */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Soft Radial Orange Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-orange-100/70 via-orange-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FDBA74]/60 text-[#C2410C] text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E36138] animate-pulse" />
            <span>India's Hyperlocal Citizen Journalism Network</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-4xl sm:text-6xl md:text-[64px] font-black tracking-tight text-stone-900 leading-[1.12]">
            Report Ground News. <span className="text-[#E36138]">Empower Citizens.</span> Earn Fairly.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-stone-600 text-base sm:text-lg font-medium leading-relaxed">
            Citizen journalists and local stringers publish ground video investigations via Creator Studio. Citizens discover verified local news on the mobile app — with transparent <strong className="text-stone-900 font-bold">$1.50+ CPM monetization</strong> from your very first view.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('creator')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#E36138] hover:bg-[#D24E25] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>Start Reporting — Free</span>
            </button>

            <a
              href="#app-download"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-[#EFECE6] text-stone-800 border border-[#E3E0D4] font-bold text-sm shadow-2xs transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#E36138]" />
              <span>Explore Citizen App</span>
            </a>
          </div>

          {/* Small Terms Agreement Notice */}
          <div className="text-[11px] text-stone-400 font-medium">
            By continuing you agree to our <Link to="/terms?tab=terms" className="underline hover:text-[#E36138] transition">Terms & Conditions</Link> and <Link to="/terms?tab=journalism" className="underline hover:text-[#E36138] transition">Journalistic Charter</Link>
          </div>

          {/* 3 Indicators Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 text-xs font-bold text-stone-700">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E36138]" />
              <span>100% IP & Source Ownership</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#E36138]" />
              <span>Real-Time View Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#E36138]" />
              <span>Instant UPI / Bank Disbursals</span>
            </div>
          </div>

          {/* Store Download Badges */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a href="#app-download" className="hover:opacity-90 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10 w-auto"
              />
            </a>
            <a href="#app-download" className="hover:opacity-90 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>

        {/* =================================================================== */}
        {/* DUAL DEVICE SHOWCASE: CREATOR DESKTOP + CONSUMER MOBILE APP         */}
        {/* =================================================================== */}
        <div className="relative max-w-6xl mx-auto mt-14 px-2 sm:px-4">
          
          {/* Ambient Warm Backlight Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-orange-400/20 via-amber-300/15 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
            
            {/* 1. LAPTOP DESKTOP MOCKUP (Creator Studio Workstation) */}
            <div className="w-full lg:w-[78%] shrink-0">
              <div className="bg-stone-900 p-2 sm:p-3 rounded-t-3xl rounded-b-lg border-4 border-stone-800 shadow-2xl relative">
                
                {/* Laptop Top Camera Notch */}
                <div className="w-2.5 h-2.5 rounded-full bg-stone-800 mx-auto mb-2 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-stone-950" />
                </div>

                {/* Laptop Screen (Browser Window) */}
                <div className="bg-[#FAF9F5] rounded-2xl overflow-hidden border border-stone-800 text-stone-900 text-left select-none">
                  
                  {/* Browser Window Header */}
                  <div className="bg-[#EFECE6] px-4 py-2.5 border-b border-[#DBD7C9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div className="ml-2 hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-[#FAF9F5] border border-[#DBD7C9] text-[11px] font-mono text-stone-600">
                        <span className="text-stone-400">https://</span>
                        <span className="font-bold text-stone-800">nagrik.news/creator/studio</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E36138] animate-pulse" />
                      <span className="text-[11px] font-black text-[#C2410C]">Creator Studio ($1.50 CPM Active)</span>
                    </div>
                  </div>

                  {/* Creator Studio Inner Layout */}
                  <div className="flex min-h-[380px] sm:min-h-[420px]">
                    
                    {/* Mini Sidebar */}
                    <div className="w-48 sm:w-56 bg-[#FAF9F5] border-r border-[#E3E0D4] p-3 hidden sm:flex flex-col justify-between shrink-0">
                      <div className="space-y-4">
                        <div className="pb-3 border-b border-[#E3E0D4] pt-1 px-1">
                          <NagrikLogo size="sm" variant="horizontal" hideSubtitle />
                        </div>

                        {/* Mini Profile Card */}
                        <div className="p-2 bg-[#FAF8F5] border border-[#E3E0D4] rounded-xl flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E36138] to-[#EA580C] text-white font-black text-xs flex items-center justify-center">
                            R
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[11px] font-bold text-stone-900 truncate">Rahul Kumar</div>
                            <div className="text-[9px] text-stone-500 font-mono">Patna Bureau</div>
                          </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="space-y-1">
                          <div className="px-2 text-[9px] font-bold text-stone-400 uppercase tracking-wider">Content</div>
                          <div className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-stone-600 flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                            <span>Analytics</span>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-stone-600 flex items-center gap-2">
                            <Upload className="w-3.5 h-3.5 text-stone-400" />
                            <span>Upload Files</span>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-[#E36138]" />
                              <span>File Manager</span>
                            </div>
                            <span className="text-[9px] bg-[#FFEDD5] text-[#9A3412] px-1.5 py-0.5 rounded-full font-mono">3</span>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="px-2 text-[9px] font-bold text-stone-400 uppercase tracking-wider">Disbursals</div>
                          <div className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-stone-600 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                            <span>UPI Billing ($75.00)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#FFF7ED] rounded-xl border border-[#FDBA74]/60 text-[10px]">
                        <div className="font-bold text-[#C2410C]">Instant UPI Payout</div>
                        <div className="text-stone-600 text-[9px] mt-0.5">Ready for disbursal: <strong>$24.50</strong></div>
                      </div>
                    </div>

                    {/* Main Content Workspace */}
                    <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-hidden bg-[#FAF8F5]">
                      
                      {/* Workspace Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-black text-stone-900 text-sm sm:text-base">File Manager & Ground Reports</h3>
                          <p className="text-[11px] text-stone-500 hidden sm:block">Manage verified ground reports, views, and instant CPM revenue.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-[#EFECE6] text-stone-700 font-bold text-[10px] border border-[#DBD7C9]">
                            3 Reports Live
                          </span>
                        </div>
                      </div>

                      {/* 3 Overview Mini Cards */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-2.5 bg-[#FAF9F5] border border-[#E3E0D4] rounded-xl">
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Total Views</div>
                          <div className="text-sm sm:text-base font-black text-stone-900 font-mono">51,066</div>
                        </div>
                        <div className="p-2.5 bg-[#FFF7ED] border border-[#FDBA74]/60 rounded-xl">
                          <div className="text-[9px] font-bold text-[#C2410C] uppercase">Earned Revenue</div>
                          <div className="text-sm sm:text-base font-black text-[#E36138] font-mono">$76.52</div>
                        </div>
                        <div className="p-2.5 bg-[#FAF9F5] border border-[#E3E0D4] rounded-xl">
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Fixed CPM</div>
                          <div className="text-sm sm:text-base font-black text-[#C2410C] font-mono">$1.50 / 1K</div>
                        </div>
                      </div>

                      {/* Reports Table Mock */}
                      <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl overflow-hidden shadow-2xs">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#EFECE6] text-stone-600 border-b border-[#DBD7C9] font-bold">
                            <tr>
                              <th className="p-2.5">Report Title</th>
                              <th className="p-2.5 hidden sm:table-cell">Location</th>
                              <th className="p-2.5">Views</th>
                              <th className="p-2.5">Earned</th>
                              <th className="p-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E3E0D4] font-medium text-stone-700">
                            <tr>
                              <td className="p-2.5">
                                <div className="font-bold text-stone-900 truncate max-w-[140px] sm:max-w-xs">Patna Flyover Construction Audit</div>
                                <div className="text-[9px] text-[#C2410C]">Local Infrastructure</div>
                              </td>
                              <td className="p-2.5 hidden sm:table-cell text-stone-500">Patna, Bihar</td>
                              <td className="p-2.5 font-mono font-bold text-stone-900">18,450</td>
                              <td className="p-2.5 font-mono font-bold text-[#C2410C]">$27.60</td>
                              <td className="p-2.5 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60">
                                  Approved
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2.5">
                                <div className="font-bold text-stone-900 truncate max-w-[140px] sm:max-w-xs">Muzaffarpur Smart Drainage Overhaul</div>
                                <div className="text-[9px] text-[#C2410C]">Civic Governance</div>
                              </td>
                              <td className="p-2.5 hidden sm:table-cell text-stone-500">Muzaffarpur</td>
                              <td className="p-2.5 font-mono font-bold text-stone-900">12,400</td>
                              <td className="p-2.5 font-mono font-bold text-[#C2410C]">$18.60</td>
                              <td className="p-2.5 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60">
                                  Approved
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2.5">
                                <div className="font-bold text-stone-900 truncate max-w-[140px] sm:max-w-xs">Ganga Aarti Citizen Crowd Management</div>
                                <div className="text-[9px] text-[#C2410C]">Culture & Safety</div>
                              </td>
                              <td className="p-2.5 hidden sm:table-cell text-stone-500">Patna Ghats</td>
                              <td className="p-2.5 font-mono font-bold text-stone-900">20,216</td>
                              <td className="p-2.5 font-mono font-bold text-[#C2410C]">$30.32</td>
                              <td className="p-2.5 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60">
                                  Approved
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Laptop Base Stand */}
                <div className="h-3 bg-stone-800 rounded-b-xl -mx-2 sm:-mx-3 mt-1 flex items-center justify-center">
                  <div className="w-16 h-1 bg-stone-700 rounded-full" />
                </div>
              </div>
            </div>

            {/* 2. SMARTPHONE MOBILE MOCKUP (Consumer News App) */}
            <div className="w-64 sm:w-72 lg:w-80 lg:-ml-24 lg:mt-16 z-20 shrink-0 transform lg:hover:-translate-y-2 transition duration-300">
              <div className="bg-stone-950 p-2.5 rounded-[44px] border-4 border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative">
                
                {/* Phone Top Speaker & Camera Dynamic Island */}
                <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* Mobile Phone Screen */}
                <div className="bg-[#FAF9F5] rounded-[34px] overflow-hidden border border-stone-900 text-stone-900 text-left select-none p-3 space-y-3">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 px-1 font-bold">
                    <span>10:42</span>
                    <div className="flex items-center gap-1.5 text-[9px]">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#E3E0D4] pt-0.5">
                    <NagrikLogo size="sm" variant="horizontal" hideSubtitle />
                    <span className="w-6 h-6 rounded-full bg-[#EFECE6] border border-[#DBD7C9] flex items-center justify-center text-[10px] font-bold text-[#E36138]">
                      🔔
                    </span>
                  </div>

                  {/* Hyperlocal Location Pill */}
                  <div className="flex items-center justify-between bg-[#FFF7ED] border border-[#FDBA74]/60 p-2 rounded-xl text-[10px]">
                    <div className="flex items-center gap-1 font-bold text-[#C2410C]">
                      <MapPin className="w-3 h-3 text-[#E36138]" />
                      <span>Patna, Bihar</span>
                    </div>
                    <span className="text-[9px] font-semibold text-stone-500">Live Hyperlocal Feed</span>
                  </div>

                  {/* Live News Video Card */}
                  <div className="bg-white border border-[#E3E0D4] rounded-2xl overflow-hidden shadow-2xs space-y-2 pb-2">
                    <div className="aspect-video bg-stone-900 relative flex items-center justify-center overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
                        alt="News Report"
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#E36138] text-white text-[9px] font-black rounded-full flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>LIVE 4K</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs shadow-md">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                    </div>

                    <div className="px-2.5 space-y-1">
                      <div className="text-[11px] font-bold text-stone-900 line-clamp-2 leading-tight">
                        Patna Smart Drainage Project: Ground Inspection at Bailey Road
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-stone-500 font-medium">
                        <span>Rahul Kumar (Reporter)</span>
                        <span className="font-mono font-bold text-[#E36138]">18.4k views</span>
                      </div>
                    </div>
                  </div>

                  {/* App Download Button */}
                  <div className="pt-1">
                    <a
                      href="#app-download"
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#E36138]" />
                      <span>Install Consumer App</span>
                    </a>
                  </div>

                </div>

                {/* Phone Bottom Home Bar */}
                <div className="w-28 h-1 bg-stone-800 rounded-full mx-auto mt-2" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. TRUSTED PAYOUT PARTNERS (Manual Bank & UPI Only)                 */}
      {/* =================================================================== */}
      <section id="payout-methods" className="py-16 px-4 sm:px-6 bg-white border-y border-slate-200 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-xs font-black uppercase tracking-widest text-[#E36138]">
            DIRECT REVENUE DISBURSAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            UPI & Manual Bank Transfer Payouts
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            Earnings are disbursed directly to your verified UPI handle or direct bank account with zero platform deduction fees.
          </p>

          {/* 3 Orange/Amber Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Instant UPI Settlements</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-semibold">
              <Building className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Manual Bank Transfer (NEFT/IMPS)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Low Minimum Payout ($10.00 / ₹850)</span>
            </span>
          </div>

          {/* Payout Logos Row (UPI & Bank Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto">
            {[
              { name: 'UPI VPA', badge: 'Instant', icon: Zap },
              { name: 'PhonePe', badge: 'UPI App', icon: Smartphone },
              { name: 'Google Pay', badge: 'UPI App', icon: CreditCard },
              { name: 'Manual Bank Transfer', badge: 'NEFT / IMPS', icon: Building }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center gap-2 hover:border-orange-300 hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xs group-hover:bg-orange-50 group-hover:text-[#E36138] transition">
                    <Icon className="w-5 h-5 text-[#E36138]" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] font-semibold text-[#E36138]">{item.badge}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. ONE ECOSYSTEM, TWO POWERFUL PLATFORMS                            */}
      {/* =================================================================== */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Everything You Need</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              One Ecosystem, Two Powerful Platforms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Publishers upload, manage, and monetize content in the Creator Studio. Consumers stream, bookmark, and discover stories seamlessly on the app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            {/* Tool 1: Creator Studio */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xs hover:shadow-lg hover:border-orange-300 transition space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E36138] flex items-center justify-center font-bold shadow-xs">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Creator Studio</h3>
                  <div className="text-xs font-bold text-[#E36138] uppercase tracking-wider mt-0.5">FOR PUBLISHERS</div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Full control over your video & story uploads, real-time verified view analytics, $1.50 CPM earnings, and instant UPI payout requests.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('creator')}
                  className="text-xs font-bold text-[#E36138] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Creator Studio Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tool 2: Mobile App */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xs hover:shadow-lg hover:border-orange-300 transition space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E36138] flex items-center justify-center font-bold shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Mobile App</h3>
                  <div className="text-xs font-bold text-[#E36138] uppercase tracking-wider mt-0.5">FOR CONSUMERS</div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fast HD video playback, hyperlocal civic feeds, offline story downloads, and instant WhatsApp sharing for your viewers on Android & iOS.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="#features"
                  className="text-xs font-bold text-[#E36138] hover:underline flex items-center gap-1.5"
                >
                  <span>Explore Consumer Features</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. EXCLUSIVE FEATURES (Monetize from Day One & Multi Upload)        */}
      {/* =================================================================== */}
      <section id="why-nagrik" className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div className="space-y-6">
            <div className="text-xs font-black uppercase tracking-widest text-[#E36138]">
              EXCLUSIVE FEATURES EXPLAINED
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              Features No Other Platform Offers
            </h3>

            {/* Monetize from Day One Banner */}
            <div className="bg-[#FFF7ED] border border-orange-200 rounded-3xl p-8 space-y-4 max-w-3xl mx-auto">
              <h4 className="text-2xl font-black text-[#D24E25]">Monetize from Day One</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Unlike other platforms, there's no subscriber or view threshold to start monetizing. Your content starts generating value from the very first view.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-orange-200 text-[#D24E25] text-xs font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-[#E36138]" />
                  <span>Low Minimum Payout ($10.00 / ₹850)</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-orange-200 text-[#D24E25] text-xs font-semibold">
                  <ArrowRight className="w-3.5 h-3.5 text-[#E36138]" />
                  <span>Instant UPI & Bank Payouts</span>
                </span>
              </div>
            </div>

            {/* Multiple Ways to Upload */}
            <div className="pt-8 space-y-6">
              <h4 className="text-xl font-black text-slate-900">Seamless Ways to Publish</h4>
              <p className="text-xs text-slate-500">Choose whatever suits your workflow</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E36138] mx-auto flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="font-black text-sm text-slate-900">Web Creator Studio</div>
                  <p className="text-xs text-slate-500">Upload directly from your browser</p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E36138] mx-auto flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="font-black text-sm text-slate-900">Direct Video Dropzone</div>
                  <p className="text-xs text-slate-500">Drag & drop 4K/HD video & cover images</p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E36138] mx-auto flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="font-black text-sm text-slate-900">Mobile Reporting Flow</div>
                  <p className="text-xs text-slate-500">Instant capture & ground news upload</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. PUBLISHER VS CONSUMER DUAL CARDS                                 */}
      {/* =================================================================== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Publishers Card */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#E36138]">FOR CREATORS</div>
              <h3 className="text-2xl font-black text-slate-900">Publishers</h3>
              <p className="text-xs text-slate-500">Upload files, share links, and monetize your content</p>
            </div>

            <ul className="space-y-3 text-xs font-medium text-slate-700">
              {[
                'Unlimited Cloud Storage',
                'Monetization from 1st View',
                'Low Payout Threshold ($10.00 / ₹850)',
                'Fair Monetization Rates ($1.50 CPM)',
                'Realtime View Count & Analytics',
                'Fast UPI & Bank Disbursals',
                'Creator Studio Dashboard',
                'Direct Video & Photo Upload',
                'Instant Thumbnail & Cover Flow',
                'Hyperlocal Geo-Tagging'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#E36138] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onNavigate('creator')}
              className="w-full py-3.5 rounded-2xl bg-[#E36138] hover:bg-[#D24E25] text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Start Publishing — Free
            </button>
          </div>

          {/* Consumers Card */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#E36138] flex items-center gap-1">
                <span>FOR VIEWERS</span>
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Consumers</h3>
              <p className="text-xs text-slate-500">Watch, download, and enjoy content on the app</p>
            </div>

            <ul className="space-y-3 text-xs font-medium text-slate-700">
              {[
                'Android & iOS App',
                'No SignUp Required',
                'Direct Link to App',
                'Fast Video Streaming',
                'Advanced Video Player',
                'Micro Dramas & Short Stories',
                'Download & Share Files',
                'Minimal Ads',
                'No Permissions Required',
                'Premium Subscription Options'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#E36138] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#app-download"
              className="w-full block text-center py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
            >
              Download Consumer App
            </a>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. PUBLISHER RATES & REVENUE CALCULATOR                             */}
      {/* =================================================================== */}
      <section id="rates" className="py-20 px-4 sm:px-6 bg-[#FAF9F5] border-y border-[#E3E0D4] text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60">
              <Calculator className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Transparent Revenue Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
              Publisher Rates & Revenue Calculator
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Calculate your projected earnings based on guaranteed $1.50+ CPM flat-rate monetization for verified local ground reporting.
            </p>
          </div>

          {/* Calculator Interactive Box */}
          <div className="bg-[#FAF8F5] border border-[#E3E0D4] p-8 sm:p-10 rounded-3xl space-y-8 shadow-xs text-left">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Estimated Monthly Views:</span>
                <span className="text-2xl font-black text-[#E36138] font-mono bg-[#FFF7ED] border border-[#FDBA74]/60 px-4 py-1.5 rounded-2xl inline-block">
                  {monthlyViews.toLocaleString()} <span className="text-sm font-sans font-bold text-stone-600">views</span>
                </span>
              </div>

              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full h-3 bg-[#EFECE6] rounded-lg appearance-none cursor-pointer accent-[#E36138]"
              />

              <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                <span>5,000 views</span>
                <span>250,000 views</span>
                <span>500,000 views</span>
              </div>
            </div>

            {/* 3 Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E3E0D4] text-center">
              <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E3E0D4] space-y-1.5 shadow-2xs">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Fixed Base CPM</div>
                <div className="text-2xl font-black text-[#C2410C] font-mono">$1.50 / 1K</div>
                <div className="text-[11px] text-stone-500 font-medium">Per 1,000 Verified Views</div>
              </div>

              <div className="p-5 bg-[#FFF7ED] rounded-2xl border-2 border-[#FDBA74] space-y-1.5 shadow-xs transform sm:-translate-y-1">
                <div className="text-[10px] text-[#C2410C] uppercase font-black tracking-wider">Estimated Monthly Revenue</div>
                <div className="text-3xl font-black text-[#E36138] font-mono">
                  ${((monthlyViews / 1000) * 1.5).toFixed(2)}
                </div>
                <div className="text-xs text-[#9A3412] font-mono font-black">≈ ₹{(((monthlyViews / 1000) * 1.5) * 85).toFixed(0)} INR</div>
              </div>

              <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E3E0D4] space-y-1.5 shadow-2xs">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Minimum Disbursal</div>
                <div className="text-2xl font-black text-stone-900 font-mono">$10.00</div>
                <div className="text-[11px] text-stone-500 font-medium">Instant NPCI UPI / Bank Transfer</div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onNavigate('creator')}
                className="px-8 py-3.5 rounded-2xl bg-[#E36138] hover:bg-[#D24E25] text-white font-black text-xs shadow-md shadow-orange-500/20 transition cursor-pointer inline-flex items-center gap-2 transform hover:scale-105 duration-200"
              >
                <span>Start Earning Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. EXCLUSIVE FEATURES SECTION                                       */}
      {/* =================================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-[#FAF9F5] text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60">
              <Sparkles className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Exclusive Features Explained</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-stone-900">
              Features No Other Platform Offers
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Built specifically for independent ground reporters, citizen journalists, and local community voices.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-7 bg-[#FAF8F5] border border-[#E3E0D4] rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center font-black">
                <Zap className="w-6 h-6 text-[#E36138]" />
              </div>
              <h4 className="text-lg font-black text-stone-900">Monetize from Day One</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Unlike YouTube or legacy news networks, there are zero subscriber counts or 4,000-hour watch requirements. Your investigative reporting generates revenue from the very first verified view.
              </p>
            </div>

            <div className="p-7 bg-[#FAF8F5] border border-[#E3E0D4] rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center font-black">
                <MapPin className="w-6 h-6 text-[#E36138]" />
              </div>
              <h4 className="text-lg font-black text-stone-900">Hyperlocal Geotagging</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every story is indexed by State, City/District, and Local Ward. Your civic reporting reaches citizens who actually live in the affected locality for real-world impact.
              </p>
            </div>

            <div className="p-7 bg-[#FAF8F5] border border-[#E3E0D4] rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center font-black">
                <CreditCard className="w-6 h-6 text-[#E36138]" />
              </div>
              <h4 className="text-lg font-black text-stone-900">Instant UPI & Direct Bank Disbursals</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Payouts above $10.00 USD are automatically converted to INR and credited to your verified UPI ID (Google Pay, PhonePe, Paytm) or IMPS Bank Account within 24 hours.
              </p>
            </div>

            <div className="p-7 bg-[#FAF8F5] border border-[#E3E0D4] rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6 text-[#E36138]" />
              </div>
              <h4 className="text-lg font-black text-stone-900">100% Intellectual Property Ownership</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                You maintain complete ownership and editorial freedom over your footage and investigation archives. No exclusive lock-ins or restrictive copyright transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ)                                 */}
      {/* =================================================================== */}
      <section id="faq" className="py-20 px-4 sm:px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-slate-500">Everything you need to know about ground reporting and earnings.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does Nagrik calculate and pay for views?',
                a: 'Nagrik operates on a transparent $1.50 CPM model. For every 1,000 eligible, unique views generated on your uploaded reports, you earn $1.50. To protect against bots and fraud, our system counts verified views per unique device.'
              },
              {
                q: 'What is the minimum withdrawal limit and how do I receive money?',
                a: 'The minimum withdrawal threshold is just $10.00 (approx. ₹850 INR). Once your balance crosses $10.00, you can request an instant payout directly from your Creator Studio to your UPI VPA (GPay/PhonePe/Paytm) or Bank account via NEFT/IMPS.'
              },
              {
                q: 'Who can register as a Citizen Reporter?',
                a: 'Anyone! Whether you are a local citizen with a smartphone reporting civic issues, a journalism student, or a seasoned correspondent, you can register for free, submit local coverage, and start monetizing without any subscriber threshold.'
              },
              {
                q: 'How long does editorial verification take?',
                a: 'Our automated AI scanner runs in real-time, and our regional editorial desk reviews submissions within 15 to 45 minutes to ensure strict adherence to facts, zero fake news, and community safety guidelines.'
              },
              {
                q: 'Is there any fee or subscription cost to use Nagrik?',
                a: 'No. Nagrik is 100% free for both citizen reporters and readers. We generate revenue through local business sponsorships and advertiser campaigns, sharing the majority margin with our content creators.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4 cursor-pointer hover:text-[#E36138] transition"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#E36138] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
