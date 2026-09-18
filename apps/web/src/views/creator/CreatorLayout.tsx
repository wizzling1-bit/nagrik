import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@/utils/navCompat';
import {
  BarChart3,
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
  ShieldAlert
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CreatorAuth } from './CreatorAuth';
import { CreatorAnalyticsTab } from './CreatorAnalyticsTab';
import { CreatorUploadTab } from './CreatorUploadTab';
import { CreatorFilesTab } from './CreatorFilesTab';
import { CreatorPlaylistsTab } from './CreatorPlaylistsTab';
import { CreatorBrandingTab } from './CreatorBrandingTab';
import { CreatorBillingTab } from './CreatorBillingTab';
import { CreatorAgreementTab } from './CreatorAgreementTab';
import { CreatorOnboardingGuide } from './CreatorOnboardingGuide';
import { CreatorStats, CreatorTab } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const GUIDE_STORAGE_KEY = 'nagrik_creator_guide_completed';

interface CreatorLayoutProps {
  onBackToHome?: () => void;
}

export const CreatorLayout: React.FC<CreatorLayoutProps> = ({ onBackToHome }) => {
  const { token, user, logout: handleSignOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    handleSignOut();
    navigate('/signin');
  };

  // Extract active tab from URL path (e.g. /creator/upload -> 'upload')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] || 'analytics';

  const validCreatorTabs = ['analytics', 'upload', 'files', 'playlists', 'branding', 'billing', 'agreement'] as const;

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
  const [playlists, setPlaylists] = useState<any[]>([]);

  // Onboarding Guide State: Shown automatically on first entrance
  const [hasCompletedGuide, setHasCompletedGuide] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.location.search.includes('guide=true')) return false;
    return localStorage.getItem(GUIDE_STORAGE_KEY) === 'true';
  });

  const authEmail = user?.email || '';
  const authName = user?.name || '';

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
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        const statsData = data.data?.stats || data.stats || data.data;
        if (statsData) {
          setStats(statsData);
        }
      }
    } catch (err) {
      console.warn('[CreatorLayout] Failed to fetch dashboard stats:', err);
    }
  };

  const fetchContents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        const contentList = data.data?.contents || data.contents || data.data || [];
        setContents(Array.isArray(contentList) ? contentList : []);
      }
    } catch (err) {
      console.warn('[CreatorLayout] Failed to fetch creator contents:', err);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/payout-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        const payoutList = data.data?.requests || data.requests || data.data || [];
        setPayoutRequests(Array.isArray(payoutList) ? payoutList : []);
      }
    } catch (err) {
      console.warn('[CreatorLayout] Failed to fetch payout requests:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContents();
      fetchPayouts();
    }
  }, [token]);

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [token, user, navigate]);

  // If Authenticated as Admin, redirect immediately
  if (token && user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-white p-6">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Opening Sovereign Admin Command Center...</p>
        <span className="text-xs font-mono text-slate-500">Redirecting to /admin</span>
      </div>
    );
  }

  // If Not Authenticated as Creator, redirect to separated /signin page
  useEffect(() => {
    if (!token) {
      navigate('/signin?redirect=/creator');
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE6] dark:bg-[#070A12] text-slate-900 dark:text-white p-6 font-sans">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Opening Creator Studio Sign In...</p>
        <span className="text-xs font-mono text-slate-500 mt-1">Redirecting to /signin</span>
      </div>
    );
  }

  // If first-time publisher enters, ONLY show all things like a guide
  if (!hasCompletedGuide) {
    return (
      <CreatorOnboardingGuide
        authName={authName}
        onFinish={handleFinishGuide}
      />
    );
  }

  const availRev = stats?.availableBalance ?? 0.00;

  interface NavTabItem {
    id: string;
    label: string;
    icon: any;
    count?: number | string;
    highlight?: boolean;
  }

  // Streamlined sidebar navigation items
  const navContentItems: NavTabItem[] = [
    { id: 'upload', label: 'Publish Ground Report', icon: Upload, highlight: true },
    { id: 'analytics', label: 'Analytics & Earnings', icon: BarChart3 },
    { id: 'files', label: 'Content Library', icon: FileText, count: contents.length },
    { id: 'playlists', label: 'Playlists & Series', icon: Layers, count: playlists.length }
  ];

  const navAccountItems: NavTabItem[] = [
    { id: 'branding', label: 'Channel & Profile', icon: UserCircle2 },
    { id: 'billing', label: 'Disbursals & Payouts', icon: CreditCard },
    { id: 'agreement', label: 'Creator Accord', icon: ShieldCheck }
  ];

  return (
    <div className="h-screen w-screen bg-[#F4EFE6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex overflow-hidden antialiased font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex ${sidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-[#FAF8F5] dark:bg-[#111827] border-r border-stone-200/90 dark:border-slate-800/80 flex-col justify-between shrink-0 transition-all duration-300 z-30 shadow-xs`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Collapse Header */}
          <div className="p-4 flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800/80 min-h-[64px]">
            <div className="flex items-center overflow-hidden">
              <NagrikLogo size={sidebarCollapsed ? 'sm' : 'md'} variant={sidebarCollapsed ? 'icon' : 'horizontal'} hideSubtitle />
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer text-xs shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Collapse sidebar"
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Creator Profile Card */}
          <div className="p-3 border-b border-stone-200/60 dark:border-slate-800/80">
            <div className="p-2.5 bg-white dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-2xs">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {authName ? authName.charAt(0).toUpperCase() : 'C'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <span>{authName || 'Citizen Reporter'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{authEmail}</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-5 flex-1">
            {/* PUBLISHING Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Publishing
                </div>
              )}
              {navContentItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTabNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25 shadow-xs'
                        : item.highlight
                        ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-500/5 hover:border-brand-500/15 border border-transparent font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : item.highlight ? 'text-brand-500' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold' : 'bg-stone-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {!sidebarCollapsed && item.highlight && (
                      <span className="text-[9px] font-extrabold bg-brand-500 text-white px-1.5 py-0.5 rounded font-mono tracking-wider">
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* PREFERENCES Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Preferences
                </div>
              )}
              {navAccountItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTabNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom Footer */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/30">
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin/moderation')}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition flex items-center gap-3 cursor-pointer shadow-xs"
                title="Admin Moderation Queue"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                {!sidebarCollapsed && <span>Admin Moderation</span>}
              </button>
            )}

            <button
              onClick={onBackToHome}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-slate-800 transition flex items-center gap-3 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-slate-700 shadow-xs"
              title="Live News Feed"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              {!sidebarCollapsed && <span>Public Feed</span>}
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-3 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER (For Phone & Tablet Screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#FAF8F5] dark:bg-[#111827] h-full flex flex-col justify-between p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <NagrikLogo size="sm" variant="horizontal" hideSubtitle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Profile Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-black text-sm flex items-center justify-center">
                  {authName ? authName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{authName || 'Citizen Reporter'}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{authEmail}</div>
                </div>
              </div>

              {/* Mobile Navigation List */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Publishing
                  </div>
                  {navContentItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTabNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTabNav(item.id as any)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Preferences
                  </div>
                  {navAccountItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTabNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTabNav(item.id as any)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 space-y-2">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin/moderation');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 flex items-center gap-3"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Admin Moderation Queue</span>
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-stone-100 dark:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <span className="text-[10px] font-mono uppercase">{theme}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-3 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 h-screen flex flex-col overflow-y-auto bg-[#F4EFE6] dark:bg-[#0B0F17] transition-colors duration-200">
        {/* Top Studio Header */}
        <header className="bg-[#FAF8F5]/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-stone-200/90 dark:border-slate-800/80 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Open Navigation"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Publisher Studio</span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeTabNav === 'upload'
                  ? 'Publish Ground Report'
                  : activeTabNav === 'analytics'
                  ? 'Analytics & Earnings'
                  : activeTabNav === 'files'
                  ? 'Content Library'
                  : activeTabNav === 'playlists'
                  ? 'Playlists & Series'
                  : activeTabNav === 'branding'
                  ? 'Channel & Profile'
                  : activeTabNav === 'billing'
                  ? 'Disbursals & Payouts'
                  : 'Creator Accord'}
              </span>
            </div>

            {/* Hyperlocal Node Status */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>5km Ward Engine Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance Pill */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 border border-stone-200/90 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline">Balance:</span>
              <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono">${availRev.toFixed(2)}</span>
              {availRev >= 10.0 && (
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded hidden lg:inline">
                  CLAIMABLE
                </span>
              )}
            </div>

            {/* DARK & LIGHT MODE TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
                  <span className="hidden md:inline text-[11px] font-mono font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
                  <span className="hidden md:inline text-[11px] font-mono font-medium">Dark</span>
                </>
              )}
            </button>

            {/* Studio Guide Trigger */}
            <button
              onClick={() => setHasCompletedGuide(false)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs"
              title="Review Studio Guide"
              aria-label="Studio Guide"
            >
              <Compass className="w-4 h-4 text-brand-500" />
              <span className="hidden lg:inline text-[11px] font-mono font-medium">Guide</span>
            </button>

            {/* Quick Upload Action if not already on upload tab */}
            {activeTabNav !== 'upload' && (
              <button
                onClick={() => setActiveTabNav('upload')}
                className="px-3 sm:px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs shadow-brand-500/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Report</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto">
          {activeTabNav === 'analytics' && (
            <CreatorAnalyticsTab
              stats={stats}
              contents={contents}
            />
          )}

          {activeTabNav === 'upload' && (
            <CreatorUploadTab
              token={token}
              apiBase={API_BASE}
              fetchDashboard={fetchDashboard}
              fetchContents={fetchContents}
              setActiveTabNav={setActiveTabNav}
            />
          )}

          {activeTabNav === 'files' && (
            <CreatorFilesTab
              contents={contents}
              token={token}
              apiBase={API_BASE}
              fetchContents={fetchContents}
              fetchDashboard={fetchDashboard}
            />
          )}

          {activeTabNav === 'playlists' && (
            <CreatorPlaylistsTab
              playlists={playlists}
              setPlaylists={setPlaylists}
            />
          )}

          {activeTabNav === 'branding' && (
            <CreatorBrandingTab
              authEmail={authEmail}
              token={token}
              apiBase={API_BASE}
            />
          )}

          {activeTabNav === 'billing' && (
            <CreatorBillingTab
              stats={stats}
              payoutRequests={payoutRequests}
              token={token}
              apiBase={API_BASE}
              fetchDashboard={fetchDashboard}
              fetchPayouts={fetchPayouts}
            />
          )}

          {activeTabNav === 'agreement' && (
            <CreatorAgreementTab />
          )}
        </main>

        {/* Dedicated Creator Footer */}
        <footer className="bg-[#FAF8F5] dark:bg-[#111827] border-t border-slate-200/80 dark:border-slate-800/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium shadow-xs transition-colors duration-200">
          <div>© {new Date().getFullYear()} Nagrik Studio • Verified Hyperlocal Citizen Journalism Network</div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Monetization Rate: $1.00 / 1K Verified Reads</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
