'use client';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@/utils/navCompat';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Layers,
  UserCircle2,
  CreditCard,
  ShieldCheck,
  Compass,
  Globe,
  LogOut,
  X,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  Database,
  ShieldAlert,
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Plus,
  Sliders,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Shield
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CreatorDashboardInspirationTab } from './CreatorDashboardInspirationTab';
import { CreatorUploadTab } from './CreatorUploadTab';
import { CreatorFilesTab } from './CreatorFilesTab';
import { CreatorBrandingTab } from './CreatorBrandingTab';
import { CreatorBillingTab } from './CreatorBillingTab';
import { CreatorAgreementTab } from './CreatorAgreementTab';
import { CreatorOnboardingGuide } from './CreatorOnboardingGuide';
import { CreatorStats, CreatorTab } from './types';
import { supabase } from '@/lib/supabase';
const GUIDE_STORAGE_KEY = 'nagrik_creator_guide_completed';

interface CreatorLayoutProps {
  onBackToHome?: () => void;
}

export const CreatorLayout: React.FC<CreatorLayoutProps> = ({ onBackToHome }) => {
  const { token, user, isLoading, logout: handleSignOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar expanded / slider state (persisted in localStorage)
  const SIDEBAR_EXPANDED_KEY = 'nagrik_creator_sidebar_expanded';
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SIDEBAR_EXPANDED_KEY) === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(next));
      }
      return next;
    });
  };

  const handleLogout = () => {
    handleSignOut();
    navigate('/signin');
  };

  // Extract active tab from URL path (e.g. /creator/upload -> 'upload')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] || 'analytics';

  const validCreatorTabs = ['analytics', 'upload', 'files', 'branding', 'billing', 'agreement'] as const;

  const activeTabNav: CreatorTab = validCreatorTabs.includes(subRoute as CreatorTab)
    ? (subRoute as CreatorTab)
    : 'analytics';

  const setActiveTabNav = (tab: CreatorTab) => {
    navigate(`/creator/${tab}`);
    setMobileMenuOpen(false);
  };

  // Creator Data State
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);

  // Onboarding Guide State: Shown automatically on first entrance
  const [hasCompletedGuide, setHasCompletedGuide] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.location.search.includes('guide=true')) return false;
    return localStorage.getItem(GUIDE_STORAGE_KEY) === 'true';
  });

  const authEmail = user?.email || 'sohanmandal12095@gmail.com';
  const authName = user?.name || 'Sohan Mandal';

  const handleFinishGuide = (targetTab?: CreatorTab) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUIDE_STORAGE_KEY, 'true');
    }
    setHasCompletedGuide(true);
    if (targetTab) {
      setActiveTabNav(targetTab);
    }
  };

  const fetchDashboard = async () => {
    try {
      const creatorId = user?.id || (await supabase.auth.getUser()).data.user?.id;
      if (creatorId) {
        const { data: supaStats, error } = await supabase.rpc('get_creator_dashboard_stats', {
          p_creator_id: creatorId
        });
        if (!error && supaStats && (supaStats.success || supaStats.stats)) {
          const s = supaStats.stats || supaStats;
          setStats({
            totalStories: s.total_reports ?? s.totalStories ?? 0,
            totalContent: s.total_reports ?? s.totalContent ?? 0,
            totalViews: Number(s.total_views ?? s.totalViews ?? 0),
            totalEligibleViews: Number(s.total_eligible_views ?? s.totalEligibleViews ?? 0),
            lifetimeEarnings: Number(s.lifetime_earnings ?? s.lifetimeEarnings ?? 0),
            availableBalance: Number(s.available_balance ?? s.availableBalance ?? 0),
            totalPaid: Number(s.total_paid ?? s.totalPaid ?? 0),
            ratePer1000Views: Number(s.earning_rate_per_1000_views ?? s.ratePer1000Views ?? 1.0),
            pendingPayoutAmount: Number(s.pendingPayoutAmount ?? 0),
            approvedCount: Number(s.approved_reports ?? s.approvedCount ?? 0),
            pendingReviewCount: Number(s.pending_reports ?? s.pendingReviewCount ?? 0),
            rejectedContent: Number(s.rejected_reports ?? s.rejectedContent ?? 0)
          });
          return;
        }
      }

      // Supabase direct calculation fallback
      const { data: contentsData } = await supabase
        .from('contents')
        .select('views, eligible_views, total_earnings')
        .limit(100);
      
      if (contentsData) {
        const totalViews = contentsData.reduce((acc: number, c: any) => acc + (c.views || 0), 0);
        const totalEligibleViews = contentsData.reduce((acc: number, c: any) => acc + (c.eligible_views || 0), 0);
        const totalEarnings = contentsData.reduce((acc: number, c: any) => acc + (Number(c.total_earnings) || 0), 0);
        setStats({
          totalStories: contentsData.length,
          totalContent: contentsData.length,
          totalViews,
          totalEligibleViews,
          lifetimeEarnings: totalEarnings,
          availableBalance: totalEarnings,
          pendingPayoutAmount: 0,
          approvedCount: contentsData.length,
          pendingReviewCount: 0,
          rejectedContent: 0
        });
      }
    } catch (err) {
      console.warn('[CreatorLayout] Notice fetching dashboard stats via Supabase:', err);
    }
  };

  const fetchContents = async () => {
    try {
      const { data: supaContents, error } = await supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && supaContents) {
        const formatted = supaContents.map((c: any) => ({
          ...c,
          _id: c.id,
          mediaUrl: c.media_url,
          thumbnailUrl: c.thumbnail_url,
          moderationStatus: c.moderation_status,
          publicationStatus: c.publication_status,
          eligibleViews: c.eligible_views,
          totalEarnings: c.total_earnings,
          createdAt: c.created_at,
          publishedAt: c.published_at,
          category: c.category_id
        }));
        setContents(formatted);
      }
    } catch (err) {
      console.warn('[CreatorLayout] Notice fetching creator contents via Supabase:', err);
    }
  };

  const fetchPayouts = async () => {
    try {
      const { data: supaPayouts, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('requested_at', { ascending: false });
      if (!error && supaPayouts) {
        const formatted = supaPayouts.map((p: any) => ({
          ...p,
          _id: p.id,
          payoutMethodId: p.payout_method_id,
          requestedAt: p.requested_at,
          processedAt: p.processed_at,
          transactionRef: p.transaction_reference,
          rejectionReason: p.rejection_reason
        }));
        setPayoutRequests(formatted);
      }
    } catch (err) {
      console.warn('[CreatorLayout] Notice fetching payout requests via Supabase:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContents();
      fetchPayouts();
    }
  }, [token]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // If Not Authenticated as Creator/Publisher, redirect to /signin only after loading completes
  useEffect(() => {
    if (!isLoading && !token) {
      navigate('/signin?redirect=/creator');
    }
  }, [token, isLoading, navigate]);

  // While verifying session during initial load or page reload (SSR consistent)
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBE8E1] dark:bg-[#070A12] text-slate-900 dark:text-white p-6 font-sans">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Verifying Creator Session...</p>
        <span className="text-xs font-mono text-slate-500 mt-1">Nagrik Studio Security Verification</span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBE8E1] dark:bg-[#070A12] text-slate-900 dark:text-white p-6 font-sans">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Opening Creator Studio Sign In...</p>
        <span className="text-xs font-mono text-slate-500 mt-1">Redirecting to /signin</span>
      </div>
    );
  }

  if (!hasCompletedGuide) {
    return (
      <CreatorOnboardingGuide
        authName={authName}
        onFinish={handleFinishGuide}
      />
    );
  }

  interface NavItem {
    id: CreatorTab;
    label: string;
    desc: string;
    icon: any;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'analytics', label: 'Dashboard', desc: 'Analytics & Overview', icon: LayoutDashboard },
    { id: 'files', label: 'My Reports', desc: 'Content & Yields', icon: FileText },
    { id: 'upload', label: 'Publish Report', desc: 'Short Reel & 16:9', icon: Upload, badge: 'NEW' },
    { id: 'billing', label: 'Disbursals', desc: 'UPI & Earnings', icon: CreditCard },
    { id: 'branding', label: 'Profile', desc: 'Byline & Beat', icon: UserCircle2 },
    { id: 'agreement', label: 'Accord', desc: 'Ethical Charter', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen w-full bg-[#EAE2D5] dark:bg-[#070A11] text-slate-900 dark:text-slate-100 flex p-3 sm:p-5 lg:p-6 gap-4 sm:gap-6 antialiased font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white relative overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          AMBIENT EDITORIAL DEPTH LAYERS (Atmospheric Lighting + Dot Grid)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Warm Terracotta Ambient Glow at Top Left */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DE5227]/[0.08] dark:bg-[#DE5227]/[0.10] rounded-full blur-3xl" />
        {/* Soft Golden Amber Ambient Glow at Middle Right */}
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-500/[0.06] dark:bg-amber-500/[0.07] rounded-full blur-3xl" />
        {/* Warm Subtle Ground Glow at Bottom */}
        <div className="absolute -bottom-32 left-1/3 w-[32rem] h-96 bg-[#DE5227]/[0.05] dark:bg-[#DE5227]/[0.06] rounded-full blur-3xl" />
        {/* Tactile Editorial Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#C6B9A3_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#1E293B_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-45 dark:opacity-20" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. SLIDING NAVIGATION SIDEBAR / FLOATING DOCK
      ───────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col justify-between py-5 bg-white/95 dark:bg-[#101522]/95 backdrop-blur-md rounded-3xl border border-[#DCD1BF] dark:border-slate-800 shadow-[0_8px_30px_-4px_rgba(30,24,16,0.12)] shrink-0 sticky top-6 h-[calc(100vh-3rem)] z-30 transition-all duration-300 ease-in-out ${
          isSidebarExpanded
            ? 'w-64 lg:w-72 px-4 items-stretch'
            : 'w-16 lg:w-18 px-2 items-center'
        }`}
      >
        {/* Top: Header & Slider Section */}
        <div className="flex flex-col gap-4">
          
          {/* Top Brand Strip: Expanded vs Collapsed */}
          {isSidebarExpanded ? (
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD1BF]/60 dark:border-slate-800">
              <button
                onClick={() => setActiveTabNav('analytics')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
                title="Nagrik Publisher Studio"
              >
                <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-md shadow-orange-500/25 shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/nagrik-logo.png"
                    alt="Nagrik Logo"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-black font-serif text-slate-900 dark:text-white leading-tight">
                    नागरिक <span className="text-[#DE5227]">Studio</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Publisher Desk
                  </div>
                </div>
              </button>

              {/* Close / Collapse Button */}
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-[#F8F5EE] dark:hover:bg-slate-800 transition cursor-pointer"
                title="Turn section names OFF (Collapse sidebar)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => setActiveTabNav('analytics')}
                className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-orange-500/25 hover:scale-105 transition-transform cursor-pointer"
                title="Nagrik Publisher Studio"
              >
                <img
                  src="/nagrik-logo.png"
                  alt="Nagrik Logo"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </button>
            </div>
          )}

          {/* ── ON / OFF SLIDER TOGGLE SECTION ── */}
          {isSidebarExpanded ? (
            <div className="p-2.5 rounded-2xl bg-[#F8F5EE] dark:bg-slate-900/80 border border-[#DCD1BF] dark:border-slate-800 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-[#DE5227] dark:text-orange-400 flex items-center justify-center">
                  <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-none">
                    Section Names
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Slider View Active
                  </div>
                </div>
              </div>

              {/* Explicit Sliding Toggle Switch Button */}
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white dark:bg-slate-800 border border-[#DCD1BF] dark:border-slate-700 hover:border-[#DE5227] shadow-xs transition-all cursor-pointer group"
                title="Turn section names OFF (Collapse to icon dock)"
                role="switch"
                aria-checked="true"
              >
                <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                  ON
                </span>
                <div className="w-7 h-4 bg-[#DE5227] rounded-full p-0.5 transition-colors flex items-center justify-end shadow-inner">
                  <div className="w-3 h-3 bg-white rounded-full shadow-xs" />
                </div>
              </button>
            </div>
          ) : (
            /* Collapsed Compact ON/OFF Switch Pill */
            <button
              onClick={toggleSidebar}
              className="flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl bg-[#F8F5EE] dark:bg-slate-900 border border-[#DCD1BF] dark:border-slate-800 hover:border-[#DE5227] transition-all group cursor-pointer shadow-2xs"
              title="Turn Section Names ON (Slide Open Sidebar)"
              role="switch"
              aria-checked="false"
            >
              <span className="text-[8px] font-mono font-black text-slate-500 dark:text-slate-400 group-hover:text-[#DE5227]">
                OFF
              </span>
              <div className="w-7 h-4 bg-stone-300 dark:bg-slate-700 rounded-full p-0.5 transition-colors flex items-center justify-start group-hover:bg-[#DE5227]/30">
                <div className="w-3 h-3 bg-white rounded-full shadow-xs" />
              </div>
            </button>
          )}

          {/* Navigation Items Stack */}
          <nav className={`flex flex-col gap-1.5 ${isSidebarExpanded ? 'w-full' : 'items-center'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTabNav === item.id;
              
              if (!isSidebarExpanded) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id)}
                    className={`relative p-3 rounded-2xl transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/25'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#F5EFE6] dark:hover:bg-slate-800/80'
                    }`}
                    title={item.label}
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                    
                    {/* Hover Tooltip in collapsed mode */}
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                      {item.label}
                    </span>
                  </button>
                );
              }

              {/* Expanded Row Item with Section Name & Description */}
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTabNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-[#F8F5EE] dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F4EFE6] dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-[#DE5227]'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="truncate">
                      <div className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white font-serif'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[10px] leading-tight truncate ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400 font-mono mt-0.5'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge && (
                      <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#DE5227]'
                          : 'bg-[#DE5227]/15 text-[#DE5227] dark:text-orange-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Dock Stack: Expanded vs Collapsed */}
        <div className={`flex flex-col gap-2 pt-3 border-t border-[#DCD1BF]/60 dark:border-slate-800 ${isSidebarExpanded ? 'w-full' : 'items-center'}`}>
          {isSidebarExpanded ? (
            <>
              {/* Theme Toggle Button with Text */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#F8F5EE] dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{theme}</span>
              </button>

              {/* Sign Out Button with Text */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* User Profile Card */}
              <button
                onClick={() => setActiveTabNav('branding')}
                className="w-full flex items-center gap-2.5 p-2 rounded-2xl bg-[#F8F5EE] dark:bg-slate-900 border border-[#DCD1BF] dark:border-slate-800 text-left cursor-pointer hover:border-[#DE5227] transition shadow-2xs"
                title="Edit Reporter Profile"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DE5227] to-amber-400 p-0.5 shrink-0 shadow-xs">
                  <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-100 font-mono">
                    {authName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {authName}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Stringer</span>
                  </div>
                </div>
              </button>
            </>
          ) : (
            <>
              {/* Dark / Light Mode Toggle (Icon only) */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#F5EFE6] dark:hover:bg-slate-800 transition cursor-pointer relative group"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              {/* Logout Button (Icon only) */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer relative group"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Sign Out
                </span>
              </button>

              {/* User Avatar Circle */}
              <button
                onClick={() => setActiveTabNav('branding')}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DE5227] to-amber-400 p-0.5 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                title={authName}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-100 font-mono">
                  {authName.charAt(0).toUpperCase()}
                </div>
              </button>
            </>
          )}
        </div>

      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CANVAS WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6 relative z-10">

        {/* ── TOP HEADER ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Starburst Emblem + Greeting & Subtitle */}
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-2xl bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Nagrik Saffron/Vermilion Emblem */}
            <div className="w-11 h-11 rounded-2xl bg-[#DE5227] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-slate-900 dark:text-white">
                Good morning, {authName.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Keep reporting. Real stories create real change.
              </p>
            </div>
          </div>

          {/* Right: Search Pill & Notification Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3 self-end md:self-auto">
            
            {/* Pill Search Bar with Terracotta Circular Search Button */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search reports, insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-64 pl-4 pr-11 py-2.5 bg-white dark:bg-[#101522] rounded-full border border-[#DCD1BF] dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] focus:outline-none focus:ring-2 focus:ring-[#DE5227]/30 transition-all"
              />
              <button
                type="button"
                className="absolute right-1.5 w-7 h-7 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-xs"
                title="Search"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Support Message / Chat Pill Button */}
            <button
              onClick={() => navigate('/contact')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] hover:bg-[#F5EFE6] dark:hover:bg-slate-800 transition cursor-pointer relative"
              title="Publisher Desk Support"
            >
              <MessageSquare className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#DE5227]" />
            </button>

            {/* Notification Bell Pill Button */}
            <button
              onClick={() => setActiveTabNav('files')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] hover:bg-[#F5EFE6] dark:hover:bg-slate-800 transition cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#DE5227] animate-pulse" />
            </button>

            {/* Quick New Report Action */}
            <button
              onClick={() => setActiveTabNav('upload')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>New Report</span>
            </button>

            {/* Quick Switcher to Admin Console for Admin Users */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-xs transition cursor-pointer border border-slate-700"
                title="Open Sovereign Admin Command Center"
              >
                <Shield className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>Admin Console</span>
              </button>
            )}
          </div>

        </header>

        {/* ── TAB CONTENT SWITCHER ── */}
        <main className="w-full">
          {activeTabNav === 'analytics' && (
            <CreatorDashboardInspirationTab
              stats={stats}
              contents={contents}
              user={user}
              setActiveTabNav={setActiveTabNav}
            />
          )}

          {activeTabNav === 'upload' && (
            <CreatorUploadTab
              token={token}
              apiBase="/api"
              fetchDashboard={fetchDashboard}
              fetchContents={fetchContents}
              setActiveTabNav={setActiveTabNav}
            />
          )}

          {activeTabNav === 'files' && (
            <CreatorFilesTab
              contents={contents}
              token={token}
              apiBase="/api"
              fetchContents={fetchContents}
              fetchDashboard={fetchDashboard}
            />
          )}

          {activeTabNav === 'branding' && (
            <CreatorBrandingTab
              authEmail={authEmail}
              token={token}
              apiBase="/api"
            />
          )}

          {activeTabNav === 'billing' && (
            <CreatorBillingTab
              stats={stats}
              payoutRequests={payoutRequests}
              token={token}
              apiBase="/api"
              fetchDashboard={fetchDashboard}
              fetchPayouts={fetchPayouts}
            />
          )}

          {activeTabNav === 'agreement' && (
            <CreatorAgreementTab />
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div>© {new Date().getFullYear()} Wizzling Pvt Ltd • Verified Hyperlocal Journalism Platform</div>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Public Feed
            </button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Terms & Accord
            </button>
            <span>•</span>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              Support Desk
            </button>
          </div>
        </footer>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE DRAWER OVERLAY
      ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#F4EFE6] dark:bg-[#111827] h-full flex flex-col justify-between p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-slate-800">
                <NagrikLogo size="sm" variant="horizontal" hideSubtitle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-[#FAF8F5] dark:bg-slate-800 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Profile Card */}
              <div className="p-3 bg-[#FAF8F5] dark:bg-slate-900 rounded-2xl border border-stone-200/90 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#DE5227] text-white font-bold text-xs flex items-center justify-center">
                  {authName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{authName}</div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">{authEmail}</div>
                </div>
              </div>

              {/* Nav List */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTabNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTabNav(item.id)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                        isActive
                          ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-[#F2ECE1] dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-300 dark:border-slate-800 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>Theme</span>
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
