import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from '@/utils/navCompat';
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Bell,
  Mail,
  Settings,
  UserCog,
  Globe,
  Tag,
  BookOpen,
  Sliders,
  History,
  Search,
  RefreshCw,
  LogOut,
  Menu,
  X,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminModerationTab } from './AdminModerationTab';
import { AdminCreatorsTab } from './AdminCreatorsTab';
import { AdminPayoutsTab } from './AdminPayoutsTab';
import { AdminAdsTab } from './AdminAdsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminCmsTab } from './AdminCmsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminAuditTab } from './AdminAuditTab';
import { AdminMetrics, AdminTab } from './types';
import { Sun, Moon, Clock, Radio, Activity, Shield } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface AdminLayoutProps {
  onBackToHome?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToHome }) => {
  const { token, user, logout: handleSignOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    handleSignOut();
    navigate('/signin');
  };

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Extract active tab from URL path (e.g. /admin/moderation -> 'moderation')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = (pathParts[1] || 'dashboard') as AdminTab;

  // Active Tab normalizer
  const activeTab: AdminTab = subRoute;

  const setActiveTab = (tab: AdminTab) => {
    navigate(`/admin/${tab}`);
  };

  // Data States
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('30d');

  // Mod Queue State
  const [modStatusFilter, setModStatusFilter] = useState<'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED'>('PENDING_REVIEW');
  const [modItems, setModItems] = useState<any[]>([]);

  // Creators / Publishers list
  const [creatorsList, setCreatorsList] = useState<any[]>([]);

  // Payouts State
  const [payouts, setPayouts] = useState<any[]>([]);

  // Ads State
  const [ads, setAds] = useState<any[]>([]);

  // Settings State
  const [settings, setSettings] = useState<any>({
    earningRatePer1000Views: 1.5,
    minPayoutAmount: 10,
    maxCountedViewsPerVideo: 100000,
    adFeedFrequency: 4
  });

  // Categories
  const [categories, setCategories] = useState<any[]>([]);

  // CMS Legal Pages State
  const [cmsPages, setCmsPages] = useState<any[]>([]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Mobile drawer, notifications popover, and command palette search
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: ⌘ K / Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Settings
  const fetchSettings = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Fetch CMS Legal Pages
  const fetchCmsPages = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/cms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCmsPages(data.pages || []);
      }
    } catch (err) {
      console.error('Error fetching CMS pages:', err);
    }
  };

  // Fetch Dashboard Metrics
  const fetchDashboard = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics || data.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Moderation Queue
  const fetchModerationQueue = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/moderation?status=${modStatusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setModItems(data.items || data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Creators List
  const fetchCreators = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/creators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCreatorsList(data.creators || data.data || []);
      }
    } catch (err) {
      console.error('Error fetching creators:', err);
    }
  };

  // Fetch Payouts
  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/payouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(data.requests || data.payouts || data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Ads
  const fetchAds = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAds(data.ads || data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs || data.auditLogs || data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllData = () => {
    fetchDashboard();
    fetchModerationQueue();
    fetchCreators();
    fetchPayouts();
    fetchAds();
    fetchCategories();
    fetchCmsPages();
    fetchAuditLogs();
    fetchSettings();
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  useEffect(() => {
    if (token && (activeTab === 'moderation' || activeTab === 'reports' || activeTab === 'verification')) {
      fetchModerationQueue();
    }
    if (token && (activeTab === 'creators' || activeTab === 'publishers' || activeTab === 'users')) {
      fetchCreators();
    }
    if (token && activeTab === 'cms') {
      fetchCmsPages();
    }
    if (token && (activeTab === 'settings' || activeTab === 'features')) {
      fetchSettings();
    }
  }, [modStatusFilter, activeTab]);

  // Action Toast state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Actions
  const handleModerate = async (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/moderation/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason, rejectionReason: reason })
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          status === 'APPROVED'
            ? 'Report approved & published to citizen feed!'
            : status === 'REJECTED'
            ? 'Report rejected.'
            : 'Report flagged for review.'
        );
        fetchModerationQueue();
        fetchDashboard();
      } else {
        showToast(data.error || 'Failed to update report status', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing moderation action', 'error');
    }
  };

  const handleProcessPayout = async (
    requestId: string,
    status: 'PAID' | 'REJECTED',
    txRef?: string,
    adminNote?: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/admin/payouts/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, txRef, transactionReference: txRef, adminNote })
      });
      const data = await res.json();
      if (data.success) {
        showToast(status === 'PAID' ? `Payout approved with UTR: ${txRef}` : 'Payout rejected.');
        fetchPayouts();
        fetchDashboard();
      } else {
        showToast(data.error || 'Failed to process payout', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing payout', 'error');
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      navigate('/signin?redirect=/admin');
    }
  }, [token, user, navigate]);

  // If Not Authenticated as Admin, redirect to unified sign in
  if (!token || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-white p-6">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Opening Sign In Gateway...</p>
        <span className="text-xs font-mono text-slate-500">Administrator Credentials Required</span>
      </div>
    );
  }

  // Admin User details
  const adminName = user?.name || (user?.email ? user.email.split('@')[0] : 'Admin');
  const adminEmail = user?.email || 'admin@naagrik.news';
  const adminRole = user?.role || 'System Administrator';

  const totalPendingModeration = metrics?.pendingModeration || modItems.filter(i => i.status === 'PENDING_REVIEW').length || 0;
  const totalPendingPayouts = metrics?.pendingPayouts || payouts.filter(p => p.status === 'PENDING').length || 0;
  const totalPendingAlerts = totalPendingModeration + totalPendingPayouts;

  // Real formatted date string matching "Mon, 28 Jul 2025"
  const formattedToday = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // 3-Group Navigation Items for Sovereign Newsroom Ops
  const editorialNavItems = [
    {
      tab: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      alias: ['dashboard']
    },
    {
      tab: 'moderation' as AdminTab,
      label: 'Content Moderation',
      icon: ShieldAlert,
      badge: totalPendingModeration > 0 ? (
        <span className="bg-[#DE5227] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
          {totalPendingModeration}
        </span>
      ) : null,
      alias: ['moderation']
    },
    {
      tab: 'reports' as AdminTab,
      label: 'Published Reports',
      icon: FileText,
      badge: (
        <span className="text-[10px] text-slate-400 font-mono">
          {metrics?.publishedContent || modItems.length || 0}
        </span>
      ),
      alias: ['reports']
    },
    {
      tab: 'communities' as AdminTab,
      label: 'Civic Communities',
      icon: MessageSquare,
      badge: null,
      alias: ['communities']
    },
    {
      tab: 'analytics' as AdminTab,
      label: 'Live Telemetry',
      icon: TrendingUp,
      badge: null,
      alias: ['analytics']
    }
  ];

  const creatorNavItems = [
    {
      tab: 'publishers' as AdminTab,
      label: 'Publishers & Stringers',
      icon: Users,
      badge: (
        <span className="text-[10px] text-slate-400 font-mono">
          {metrics?.totalCreators || creatorsList.length || 0}
        </span>
      ),
      alias: ['publishers', 'creators']
    },
    {
      tab: 'payouts' as AdminTab,
      label: 'Treasury & Payouts',
      icon: CreditCard,
      badge: totalPendingPayouts > 0 ? (
        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
          {totalPendingPayouts}
        </span>
      ) : null,
      alias: ['payouts']
    },
    {
      tab: 'verification' as AdminTab,
      label: 'Identity Verification',
      icon: CheckCircle2,
      badge: null,
      alias: ['verification']
    }
  ];

  const systemNavItems = [
    {
      tab: 'geo' as AdminTab,
      label: 'Geo Management',
      icon: Globe,
      badge: null,
      alias: ['geo']
    },
    {
      tab: 'categories' as AdminTab,
      label: 'Categories & Tags',
      icon: Tag,
      badge: null,
      alias: ['categories']
    },
    {
      tab: 'cms' as AdminTab,
      label: 'Legal & CMS Pages',
      icon: BookOpen,
      badge: (
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold font-mono">
          Live
        </span>
      ),
      alias: ['cms']
    },
    {
      tab: 'features' as AdminTab,
      label: 'Feature Controls',
      icon: Sliders,
      badge: null,
      alias: ['features']
    },
    {
      tab: 'audit' as AdminTab,
      label: 'Audit Trail',
      icon: History,
      badge: null,
      alias: ['audit']
    },
    {
      tab: 'settings' as AdminTab,
      label: 'System Settings',
      icon: Settings,
      badge: null,
      alias: ['settings']
    }
  ];

  const allNavItems = [...editorialNavItems, ...creatorNavItems, ...systemNavItems];

  // Global Command Search Results Filtering
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return { nav: [], reports: [], creators: [] };

    const navMatches = allNavItems.filter(
      (item) => item.label.toLowerCase().includes(q) || item.tab.toLowerCase().includes(q)
    );

    const reportMatches = modItems.filter(
      (item) =>
        (item.title && String(item.title).toLowerCase().includes(q)) ||
        (item.city && String(item.city).toLowerCase().includes(q)) ||
        (item.status && String(item.status).toLowerCase().includes(q))
    ).slice(0, 4);

    const creatorMatches = creatorsList.filter(
      (c) =>
        (c.name && String(c.name).toLowerCase().includes(q)) ||
        (c.email && String(c.email).toLowerCase().includes(q)) ||
        (c.user?.name && String(c.user.name).toLowerCase().includes(q)) ||
        (c.user?.email && String(c.user.email).toLowerCase().includes(q))
    ).slice(0, 4);

    return { nav: navMatches, reports: reportMatches, creators: creatorMatches };
  }, [globalSearch, modItems, creatorsList]);

  const renderNavGroup = (items: typeof editorialNavItems, isMobile = false) => (
    <div className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.alias.includes(activeTab);

        return (
          <button
            key={item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer relative group ${
              isActive
                ? 'bg-[#FDF2EC] text-[#DE5227] dark:bg-[#DE5227]/20 dark:text-orange-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-[#1A2234]'
            }`}
          >
            {/* Active Left Orange Bar Accent */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#DE5227] rounded-r-full shadow-xs" />
            )}

            <div className="flex items-center gap-2.5 pl-1.5">
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? 'text-[#DE5227] dark:text-orange-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />
              <span>{item.label}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {item.badge}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <NagrikLogo size="sm" variant="icon" />
            <div>
              <div className="font-black text-sm text-slate-950 dark:text-white tracking-wide flex items-center gap-1.5">
                <span>Nagrik Operations</span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">
                PEOPLE. STORIES. CHANGE.
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section 1: COMMAND & EDITORIAL */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
            COMMAND & EDITORIAL
          </div>
          {renderNavGroup(editorialNavItems, isMobile)}
        </div>

        {/* Section 2: CREATORS & TREASURY */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
            CREATORS & TREASURY
          </div>
          {renderNavGroup(creatorNavItems, isMobile)}
        </div>

        {/* Section 3: GOVERNANCE & SYSTEM */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
            GOVERNANCE & SYSTEM
          </div>
          {renderNavGroup(systemNavItems, isMobile)}
        </div>
      </div>

      {/* Sidebar Footer with Editorial Watermark, Theme Toggle and Profile */}
      <div className="p-4 border-t border-stone-200/60 dark:border-slate-800 space-y-3 bg-[#FAF8F5]/80 dark:bg-[#111827]">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node: Patna-Varanasi</span>
          </div>

          {/* Quick Sidebar Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/40 dark:border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DE5227] to-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {adminName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {adminRole}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Visit Public Newsroom"
            >
              <Globe className="w-4 h-4 text-[#DE5227]" />
            </button>
            <button
              onClick={handleAdminLogout}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#F4EFE6] dark:bg-[#0B0F17] text-slate-900 dark:text-white flex overflow-hidden antialiased font-sans transition-colors duration-200 bg-grid-pattern">
      {/* 1. DEDICATED DESKTOP SIDEBAR */}
      <aside className="w-64 h-screen bg-[#FAF8F5] dark:bg-[#111827] border-r border-stone-200/90 dark:border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 z-30 shadow-xs">
        {renderSidebarContent(false)}
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-68 max-w-[85vw] h-full bg-[#FAF8F5] dark:bg-[#111827] border-r border-stone-200/90 dark:border-slate-800 flex flex-col justify-between z-10 shadow-2xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Topbar Header */}
        <header className="bg-[#FAF8F5]/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer border border-stone-200 dark:border-slate-800"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Input with ⌘ K & Command Palette */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search reporters, stories, locations, or tools (⌘K)..."
                value={globalSearch}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                className="w-full pl-9 pr-14 py-2 bg-[#FAF8F5] dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] shadow-2xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-[10px] text-slate-400 font-mono pointer-events-none">
                <span>⌘</span>
                <span>K</span>
              </div>

              {/* Floating Command Search Results Dropdown */}
              {searchDropdownOpen && globalSearch.trim().length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSearchDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 text-xs">
                    {/* Navigation Views */}
                    {searchResults.nav.length > 0 && (
                      <div className="p-2 border-b border-stone-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2.5 py-1 font-mono">
                          Navigation & Tools
                        </div>
                        {searchResults.nav.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.tab}
                              onClick={() => {
                                setActiveTab(item.tab);
                                setGlobalSearch('');
                                setSearchDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DE5227] transition" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#DE5227] transition">
                                  {item.label}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Jump to view ↵
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reports Matches */}
                    {searchResults.reports.length > 0 && (
                      <div className="p-2 border-b border-stone-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2.5 py-1 font-mono">
                          Reports & Stories
                        </div>
                        {searchResults.reports.map((report: any, idx: number) => (
                          <button
                            key={report.id || report._id || idx}
                            onClick={() => {
                              setActiveTab('moderation');
                              setGlobalSearch('');
                              setSearchDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                          >
                            <div className="min-w-0 pr-3">
                              <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#DE5227] transition">
                                {report.title || 'Civic infrastructure report'}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {report.location?.city || report.city || 'Report location'}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                              {report.status || 'PENDING'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Creators Matches */}
                    {searchResults.creators.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2.5 py-1 font-mono">
                          Publishers & Reporters
                        </div>
                        {searchResults.creators.map((c: any, idx: number) => {
                          const cName = c.name || c.user?.name || 'Citizen Reporter';
                          const cEmail = c.email || c.user?.email || '';
                          return (
                            <button
                              key={c.id || c._id || idx}
                              onClick={() => {
                                setActiveTab('publishers');
                                setGlobalSearch('');
                                setSearchDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                            >
                              <div className="min-w-0 pr-3">
                                <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#DE5227] transition">
                                  {cName}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                                  {cEmail}
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                View Profile
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Empty State */}
                    {searchResults.nav.length === 0 &&
                      searchResults.reports.length === 0 &&
                      searchResults.creators.length === 0 && (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No matching views, reports, or publishers found for &ldquo;{globalSearch}&rdquo;
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Area: Operational Pill, Clock, Date, Theme, Notifications, Refresh, User */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Operational Node Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.9% Uptime</span>
            </div>

            {/* Live IST Clock Badge */}
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono font-bold shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>{currentTime} IST</span>
              </div>
            )}

            {/* Live Date Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedToday}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F17] hover:bg-stone-100 dark:hover:bg-[#1A2234] text-slate-700 dark:text-slate-300 transition cursor-pointer border border-stone-200 dark:border-slate-800 shadow-2xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F17] hover:bg-stone-100 dark:hover:bg-[#1A2234] text-slate-700 dark:text-slate-300 transition cursor-pointer border border-stone-200 dark:border-slate-800 shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalPendingAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DE5227] text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                    {totalPendingAlerts > 9 ? '9+' : totalPendingAlerts}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-76 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-30 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                      Actionable Alerts
                    </span>
                    <span className="text-[10px] bg-stone-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold font-mono">
                      {totalPendingAlerts} Pending
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('moderation');
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-slate-800/50 flex items-center justify-between transition cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Moderation Review Queue
                        </span>
                      </div>
                      <span className="font-bold text-rose-500 font-mono">
                        {totalPendingModeration}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('payouts');
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-slate-800/50 flex items-center justify-between transition cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Treasury Payout Requests
                        </span>
                      </div>
                      <span className="font-bold text-amber-500 font-mono">
                        {totalPendingPayouts}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F17] hover:bg-stone-100 dark:hover:bg-[#1A2234] text-slate-700 dark:text-slate-300 transition cursor-pointer border border-stone-200 dark:border-slate-800 shadow-2xs"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin text-[#DE5227]' : ''}`}
              />
            </button>

            {/* Admin User Chip */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DE5227] to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {adminName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {adminName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Body View */}
        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              metrics={metrics}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              modItems={modItems}
              creatorsList={creatorsList}
              payouts={payouts}
              auditLogs={auditLogs}
              setActiveTab={setActiveTab}
              handleModerate={handleModerate}
            />
          )}

          {(activeTab === 'moderation' || activeTab === 'reports' || activeTab === 'verification') && (
            <AdminModerationTab
              modItems={modItems}
              modStatusFilter={modStatusFilter}
              setModStatusFilter={setModStatusFilter}
              fetchModerationQueue={fetchModerationQueue}
              handleModerate={handleModerate}
            />
          )}

          {(activeTab === 'publishers' || activeTab === 'creators' || activeTab === 'users') && (
            <AdminCreatorsTab creatorsList={creatorsList} />
          )}

          {activeTab === 'payouts' && (
            <AdminPayoutsTab
              payouts={payouts}
              fetchPayouts={fetchPayouts}
              handleProcessPayout={handleProcessPayout}
            />
          )}

          {(activeTab === 'communities' || activeTab === 'messages') && (
            <div className="bg-white dark:bg-[#111827] border border-stone-200/80 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#DE5227]/10 text-[#DE5227] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Civic Community Channels
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Hyperlocal community group discussions and citizen grievance threads across verified wards.
              </p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AdminDashboardTab
              metrics={metrics}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              modItems={modItems}
              creatorsList={creatorsList}
              payouts={payouts}
              auditLogs={auditLogs}
              setActiveTab={setActiveTab}
              handleModerate={handleModerate}
            />
          )}

          {(activeTab === 'geo' || activeTab === 'categories') && (
            <AdminCategoriesTab
              categories={categories}
              token={token}
              apiBase={API_BASE}
              fetchCategories={fetchCategories}
            />
          )}

          {activeTab === 'cms' && (
            <AdminCmsTab
              cmsPages={cmsPages}
              token={token}
              apiBase={API_BASE}
              fetchCmsPages={fetchCmsPages}
            />
          )}

          {(activeTab === 'settings' || activeTab === 'features') && (
            <AdminSettingsTab
              settings={settings}
              setSettings={setSettings}
              token={token}
              apiBase={API_BASE}
            />
          )}

          {activeTab === 'audit' && <AdminAuditTab auditLogs={auditLogs} />}
        </main>

        {/* Footer */}
        <footer className="bg-[#FAF9F6] dark:bg-[#111827] border-t border-stone-200/80 dark:border-slate-800 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <NagrikLogo size="sm" variant="icon" />
            <span>© {new Date().getFullYear()} Nagrik Hyperlocal Civic Journalism Platform</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Enterprise Operations Build v2.4
          </div>
        </footer>
      </div>

      {/* Floating Action Toast */}
      {toastMsg && (
        <div
          className={`fixed bottom-8 right-6 z-50 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 border ${
            toastMsg.type === 'error'
              ? 'bg-rose-900/90 border-rose-700 text-white'
              : 'bg-slate-900 dark:bg-slate-800 border-slate-700 text-white'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toastMsg.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
            }`}
          />
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
};
