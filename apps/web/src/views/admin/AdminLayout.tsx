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
  Megaphone,
  Sun,
  Moon,
  Clock,
  Radio,
  Activity,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Plus
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminModerationTab } from './AdminModerationTab';
import { AdminCreatorsTab } from './AdminCreatorsTab';
import { AdminPayoutsTab } from './AdminPayoutsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminCmsTab } from './AdminCmsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminAuditTab } from './AdminAuditTab';
import { AdminMetrics, AdminTab } from './types';
import { supabase, getAdminDashboardStats, adminModerateContent, adminProcessPayout } from '@/lib/supabase';
interface AdminLayoutProps {
  onBackToHome?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToHome }) => {
  const { token, user, isLoading, logout: handleSignOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    handleSignOut();
    navigate('/signin');
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sidebar expanded / slider state (persisted in localStorage)
  const SIDEBAR_EXPANDED_KEY = 'nagrik_admin_sidebar_expanded';
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(SIDEBAR_EXPANDED_KEY) !== 'false';
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
  const rawSubRoute = pathParts[1] || 'dashboard';

  // Map legacy / duplicate route aliases directly to canonical tabs
  const canonicalTabMap: Record<string, AdminTab> = {
    dashboard: 'dashboard',
    analytics: 'dashboard',
    moderation: 'moderation',
    reports: 'moderation',
    verification: 'moderation',
    creators: 'creators',
    publishers: 'creators',
    users: 'creators',
    payouts: 'payouts',
    proof: 'payouts',
    demo: 'payouts',
    categories: 'categories',
    geo: 'categories',
    cms: 'cms',
    audit: 'audit',
    settings: 'settings',
    features: 'settings'
  };

  const activeTab: AdminTab = canonicalTabMap[rawSubRoute] || 'dashboard';

  const setActiveTab = (tab: AdminTab) => {
    const canonical = canonicalTabMap[tab] || tab;
    navigate(`/admin/${canonical}`);
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
    try {
      const { data: setRow } = await supabase.from('system_settings').select('*').limit(1).maybeSingle();
      if (setRow) {
        setSettings({
          earningRatePer1000Views: setRow.earning_rate_per_1000_views ?? 1.0,
          minPayoutAmount: setRow.min_payout_amount ?? 10,
          maxCountedViewsPerVideo: setRow.max_counted_views_per_video ?? 3,
          adFeedFrequency: setRow.ad_feed_frequency ?? 4
        });
      }
    } catch (err) {
      console.warn('Notice fetching settings via Supabase:', err);
    }
  };

  // Fetch CMS Legal Pages
  const fetchCmsPages = async () => {
    try {
      const { data: pages } = await supabase.from('cms_pages').select('*');
      if (pages) {
        setCmsPages(pages);
      }
    } catch (err) {
      console.warn('Notice fetching CMS pages via Supabase:', err);
    }
  };

  // Fetch Dashboard Metrics
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // Primary: Server-side aggregated RPC with sub-millisecond execution
      const stats = await getAdminDashboardStats();
      if (stats) {
        setMetrics(stats);
        return;
      }
    } catch (rpcErr) {
      console.warn('Notice: get_admin_dashboard_stats RPC failed, attempting count fallbacks:', rpcErr);
      try {
        const [contentsCount, usersCount, creatorsCount, pendingCount] = await Promise.all([
          supabase.from('contents').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('creators').select('id', { count: 'exact', head: true }),
          supabase.from('contents').select('id', { count: 'exact', head: true }).eq('moderation_status', 'PENDING_REVIEW'),
        ]);

        setMetrics({
          totalUsers: usersCount.count || 0,
          totalCreators: creatorsCount.count || 0,
          activeCreators: creatorsCount.count || 0,
          totalReports: contentsCount.count || 0,
          publishedContent: (contentsCount.count || 0) - (pendingCount.count || 0),
          pendingModeration: pendingCount.count || 0,
          flaggedModeration: 0,
          totalViews: 0,
          totalEligibleViews: 0,
          totalPaidOut: 0,
          pendingPayouts: 0,
          pendingPayoutsCount: 0
        });
      } catch (fallbackErr) {
        console.error('Error fetching admin dashboard fallback metrics:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Moderation Queue
  const fetchModerationQueue = async () => {
    try {
      let query = supabase
        .from('contents')
        .select('*, creator:creators(*, user:users(*)), category:categories(*)')
        .order('created_at', { ascending: false });

      if (modStatusFilter) {
        query = query.eq('moderation_status', modStatusFilter);
      }
      const { data } = await query.limit(50);
      if (data) {
        setModItems(data.map((c: any) => ({
          ...c,
          _id: c.id,
          status: c.moderation_status,
          mediaUrl: c.media_url,
          thumbnailUrl: c.thumbnail_url,
          moderationStatus: c.moderation_status,
          publicationStatus: c.publication_status,
          eligibleViews: c.eligible_views,
          totalEarnings: c.total_earnings,
          createdAt: c.created_at,
          publishedAt: c.published_at,
          category: c.category?.name || c.category_id || 'General',
          creatorName: c.creator?.user?.name || c.creator?.user?.email || 'Citizen Reporter',
          creator: c.creator,
          city: c.location_city || c.location?.city || '',
          state: c.location_state || c.location?.state || '',
          area: c.location_area || c.location?.area || ''
        })));
      }
    } catch (err) {
      console.error('Error fetching moderation queue via Supabase:', err);
    }
  };

  // Fetch Creators List
  const fetchCreators = async () => {
    try {
      const { data } = await supabase
        .from('creators')
        .select('*, user:users(*)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) {
        setCreatorsList(data.map((c: any) => ({
          ...c,
          _id: c.id,
          name: c.user?.name || 'Citizen Reporter',
          email: c.user?.email || '',
          phone: c.user?.phone || '',
          channelName: c.user?.name || 'Citizen Reporter',
          avatarUrl: c.user?.profile_image || c.avatar_url,
          verificationStatus: c.verification_status,
          totalEligibleViews: c.total_eligible_views || 0,
          availableBalance: c.available_balance || 0,
          lifetimeEarnings: c.lifetime_earnings || 0,
          totalPaid: c.total_paid || 0,
          createdAt: c.created_at
        })));
      }
    } catch (err) {
      console.error('Error fetching creators via Supabase:', err);
    }
  };

  // Fetch Payouts
  const fetchPayouts = async () => {
    try {
      const { data } = await supabase
        .from('payout_requests')
        .select('*, creator:creators(*, user:users(*)), payout_method:payout_methods(*)')
        .order('requested_at', { ascending: false })
        .limit(100);

      if (data) {
        setPayouts(data.map((p: any) => ({
          ...p,
          _id: p.id,
          creatorId: p.creator_id,
          creatorName: p.creator?.user?.name || p.creator?.user?.email || 'Citizen Reporter',
          creatorEmail: p.creator?.user?.email || '',
          requestedAt: p.requested_at,
          processedAt: p.processed_at,
          transactionReference: p.transaction_reference,
          payoutMethod: p.payout_method?.type || p.payout_method || 'UPI',
          payoutMethodDetails: p.payout_method
        })));
      }
    } catch (err) {
      console.error('Error fetching payouts via Supabase:', err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (data) {
        setCategories(data.map((c: any) => ({
          ...c,
          _id: c.id,
          displayOrder: c.display_order
        })));
      }
    } catch (err) {
      console.error('Error fetching categories via Supabase:', err);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setAuditLogs(data.map((l: any) => ({
          ...l,
          _id: l.id,
          actor: l.actor_email || 'Admin',
          actorEmail: l.actor_email,
          actorRole: l.actor_role,
          createdAt: l.created_at || l.timestamp,
          time: l.created_at || l.timestamp
        })));
      }
    } catch (err) {
      console.error('Error fetching audit logs via Supabase:', err);
    }
  };

  const fetchAllData = () => {
    fetchDashboard();
    fetchModerationQueue();
    fetchCreators();
    fetchPayouts();
    fetchCategories();
    fetchCmsPages();
    fetchAuditLogs();
    fetchSettings();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'moderation') {
      fetchModerationQueue();
    }
    if (activeTab === 'creators') {
      fetchCreators();
    }
    if (activeTab === 'cms') {
      fetchCmsPages();
    }
    if (activeTab === 'settings') {
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
      // Primary: Server-side auditable RPC with role verification and audit log insertion
      try {
        await adminModerateContent(
          contentId,
          status === 'FLAGGED' ? 'REJECTED' : status,
          reason,
          user?.id
        );
      } catch (rpcErr) {
        console.warn('adminModerateContent RPC failed, executing direct fallback:', rpcErr);
        const { error } = await supabase
          .from('contents')
          .update({
            moderation_status: status === 'APPROVED' ? 'APPROVED' : (status === 'REJECTED' ? 'REJECTED' : 'FLAGGED'),
            publication_status: status === 'APPROVED' ? 'PUBLISHED' : 'DRAFT',
            rejection_reason: reason || null,
            reviewed_at: new Date().toISOString(),
            published_at: status === 'APPROVED' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentId);
        if (error) throw error;
      }

      showToast(
        status === 'APPROVED'
          ? 'Report approved & published to citizen feed!'
          : status === 'REJECTED'
          ? 'Report rejected.'
          : 'Report flagged for review.'
      );
      await fetchModerationQueue();
      await fetchDashboard();
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
      // Primary: Server-side auditable RPC with role verification and audit log insertion
      try {
        await adminProcessPayout(
          requestId,
          status,
          txRef,
          adminNote,
          user?.id
        );
      } catch (rpcErr) {
        console.warn('adminProcessPayout RPC failed, executing direct fallback:', rpcErr);
        const { error } = await supabase
          .from('payout_requests')
          .update({
            status: status,
            transaction_reference: txRef || null,
            admin_note: adminNote || null,
            processed_at: new Date().toISOString()
          })
          .eq('id', requestId);
        if (error) throw error;
      }

      showToast(status === 'PAID' ? `Payout approved with UTR: ${txRef || 'CONFIRMED'}` : 'Payout rejected.');
      await fetchPayouts();
      await fetchDashboard();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing payout', 'error');
    }
  };

  // Admin User details
  const adminName = user?.name || (user?.email ? user.email.split('@')[0] : 'Admin');
  const adminEmail = user?.email || 'admin@nagrik.news';
  const adminRole = user?.role || 'System Administrator';

  const totalPendingModeration = metrics?.pendingModeration ?? modItems.filter(i => (i.moderationStatus || i.moderation_status) === 'PENDING_REVIEW').length;
  const totalPendingPayouts = metrics?.pendingPayoutsCount ?? payouts.filter(p => p.status === 'PENDING').length;
  const totalPendingAlerts = totalPendingModeration + totalPendingPayouts;

  // Real formatted date string matching "Mon, 28 Jul 2025"
  const formattedToday = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Clean, Non-Duplicate 2-Group Navigation for Sovereign Newsroom Ops
  const editorialNavItems = [
    {
      tab: 'dashboard' as AdminTab,
      label: 'Dashboard',
      desc: 'Operations & Live Pulse',
      icon: LayoutDashboard,
      badge: null,
      alias: ['dashboard', 'analytics']
    },
    {
      tab: 'moderation' as AdminTab,
      label: 'Content Moderation',
      desc: 'Review & Published Queue',
      icon: ShieldAlert,
      badge: totalPendingModeration > 0 ? (
        <span className="bg-[#DE5227] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
          {totalPendingModeration}
        </span>
      ) : null,
      alias: ['moderation', 'reports', 'verification']
    },
    {
      tab: 'creators' as AdminTab,
      label: 'Publishers & Creators',
      desc: 'Citizen Journalist Bureau',
      icon: Users,
      badge: (
        <span className="text-[10px] text-slate-400 font-mono">
          {metrics?.totalCreators || creatorsList.length || 0}
        </span>
      ),
      alias: ['creators', 'publishers', 'users']
    },
    {
      tab: 'payouts' as AdminTab,
      label: 'Treasury & Payouts',
      desc: 'Disbursals & Proof Ledger',
      icon: CreditCard,
      badge: totalPendingPayouts > 0 ? (
        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
          {totalPendingPayouts}
        </span>
      ) : null,
      alias: ['payouts', 'proof', 'demo']
    }

  ];

  const systemNavItems = [
    {
      tab: 'categories' as AdminTab,
      label: 'Categories & Beats',
      desc: 'Civic Beat Taxonomy',
      icon: Tag,
      badge: null,
      alias: ['categories', 'geo']
    },
    {
      tab: 'cms' as AdminTab,
      label: 'CMS & Legal Pages',
      desc: 'Ethical Charters & Terms',
      icon: BookOpen,
      badge: (
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold font-mono">
          Live
        </span>
      ),
      alias: ['cms']
    },
    {
      tab: 'audit' as AdminTab,
      label: 'Audit Trail',
      desc: 'Immutable Bureau Log',
      icon: History,
      badge: null,
      alias: ['audit']
    },
    {
      tab: 'settings' as AdminTab,
      label: 'Platform Settings',
      desc: 'Rates, Limits & Controls',
      icon: Settings,
      badge: null,
      alias: ['settings', 'features']
    }
  ];

  const allNavItems = [...editorialNavItems, ...systemNavItems];

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

  useEffect(() => {
    // Only redirect AFTER authentication check has finished loading
    if (!isLoading && (!token || user?.role !== 'ADMIN')) {
      navigate('/signin?redirect=/admin');
    }
  }, [token, user, isLoading, navigate]);

  // While verifying session during initial load or page reload
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-white p-6 font-sans">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Verifying Administrator Session...</p>
        <span className="text-xs font-mono text-slate-500 mt-1">Sovereign Control Security Verification</span>
      </div>
    );
  }

  // If Not Authenticated as Admin after loading is complete, redirect to unified sign in
  if (!token || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-white p-6 font-sans">
        <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold font-serif">Opening Sign In Gateway...</p>
        <span className="text-xs font-mono text-slate-500 mt-1">Administrator Credentials Required</span>
      </div>
    );
  }

  const renderNavGroup = (items: typeof editorialNavItems, isMobile = false) => (
    <div className={`space-y-1 ${!isSidebarExpanded && !isMobile ? 'flex flex-col items-center' : ''}`}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.alias.includes(activeTab);

        if (!isSidebarExpanded && !isMobile) {
          return (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
              }}
              className={`relative p-3 rounded-2xl transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#F5EFE6] dark:hover:bg-slate-800/80'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.8]" />
              {/* Notification dot if badge exists */}
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DE5227] animate-pulse" />
              )}
              {/* Hover Tooltip in collapsed mode */}
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              if (isMobile) setMobileMenuOpen(false);
            }}
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
              {item.badge}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderSidebarContent = (isMobile = false) => {
    const showExpanded = isSidebarExpanded || isMobile;

    return (
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4 overflow-y-auto flex-1 pr-0.5">
          {/* Top Brand Strip */}
          {showExpanded ? (
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD1BF]/60 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
                title="Nagrik Operations"
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
                    नागरिक <span className="text-[#DE5227]">Operations</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Superintendent Bureau
                  </div>
                </div>
              </button>

              {isMobile ? (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-[#F8F5EE] dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Turn section names OFF (Collapse sidebar)"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-orange-500/25 hover:scale-105 transition-transform cursor-pointer"
                title="Nagrik Operations"
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
          {!isMobile && (
            showExpanded ? (
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
            )
          )}

          {/* Section 1: EDITORIAL & OPERATIONS */}
          <div className="space-y-1.5">
            {showExpanded && (
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 font-mono">
                EDITORIAL & OPERATIONS
              </div>
            )}
            {renderNavGroup(editorialNavItems, isMobile)}
          </div>

          {/* Section 2: PLATFORM & GOVERNANCE */}
          <div className="space-y-1.5 pt-2">
            {showExpanded && (
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 font-mono">
                PLATFORM & GOVERNANCE
              </div>
            )}
            {renderNavGroup(systemNavItems, isMobile)}
          </div>
        </div>

        {/* Bottom Admin User Profile & Sign Out (Moved from Header Right Corner) */}
        {showExpanded ? (
          <div className="pt-3 border-t border-[#DCD1BF]/60 dark:border-slate-800 mt-2 shrink-0">
            <div className="p-2.5 rounded-2xl bg-[#F8F5EE] dark:bg-slate-900/80 border border-[#DCD1BF] dark:border-slate-800 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#DE5227] to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                  {adminName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left leading-tight min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {adminName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Superintendent
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer shrink-0 border border-transparent hover:border-[#DCD1BF] dark:hover:border-slate-700 shadow-xs"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-[#DCD1BF]/60 dark:border-slate-800 mt-2 flex flex-col items-center gap-2 shrink-0">
            <div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DE5227] to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-orange-500/20 cursor-default"
              title={`${adminName} (Superintendent)`}
            >
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleAdminLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-[#F8F5EE] dark:hover:bg-slate-800 transition cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#EAE2D5] dark:bg-[#070A11] text-slate-900 dark:text-slate-100 flex p-3 sm:p-5 lg:p-6 gap-4 sm:gap-6 antialiased font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white relative overflow-x-clip">
      {/* Ambient Editorial Depth Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DE5227]/[0.08] dark:bg-[#DE5227]/[0.10] rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-500/[0.06] dark:bg-amber-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[32rem] h-96 bg-[#DE5227]/[0.05] dark:bg-[#DE5227]/[0.06] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#C6B9A3_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#1E293B_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-45 dark:opacity-20" />
      </div>

      {/* 1. DEDICATED SLIDING NAVIGATION SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between py-5 bg-white/95 dark:bg-[#101522]/95 backdrop-blur-md rounded-3xl border border-[#DCD1BF] dark:border-slate-800 shadow-[0_8px_30px_-4px_rgba(30,24,16,0.12)] shrink-0 sticky top-6 h-[calc(100vh-3rem)] z-30 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'w-72 lg:w-80 px-4 items-stretch' : 'w-16 lg:w-18 px-2 items-center'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-76 max-w-[85vw] h-full bg-white dark:bg-[#101522] border-r border-[#DCD1BF] dark:border-slate-800 flex flex-col justify-between p-4 z-10 shadow-2xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6 relative z-10 pb-20">
        {/* Topbar Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-2xl bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Nagrik Saffron/Vermilion Starburst Emblem */}
            <div className="w-11 h-11 rounded-2xl bg-[#DE5227] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Good morning, {adminName.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate hidden sm:block">
                Superintendent Operations & Sovereign Editorial Bureau
              </p>
            </div>
          </div>

          {/* Right Area: Search Pill, Status, IST Clock, Theme, Notifications, Refresh, User */}
          <div className="flex items-center gap-2 sm:gap-2.5 self-end md:self-auto flex-wrap sm:flex-nowrap justify-end flex-1 min-w-0">
            {/* Global Search Input with ⌘ K & Command Palette */}
            <div className="relative w-48 sm:w-64 lg:w-72">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tools, stories (⌘K)..."
                value={globalSearch}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                className="w-full pl-4 pr-10 py-2 rounded-full bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)] focus:outline-none focus:border-[#DE5227] transition"
              />
              <button
                type="button"
                onClick={() => setSearchDropdownOpen(true)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* Floating Command Search Results Dropdown */}
              {searchDropdownOpen && globalSearch.trim().length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSearchDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 text-xs">
                    {/* Navigation Views */}
                    {searchResults.nav.length > 0 && (
                      <div className="p-2 border-b border-[#DCD1BF]/60 dark:border-slate-800">
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
                                setSearchDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-[#F8F5EE] dark:hover:bg-slate-800/60 transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DE5227] transition" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#DE5227] transition">
                                  {item.label}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Jump ↵
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reports Matches */}
                    {searchResults.reports.length > 0 && (
                      <div className="p-2 border-b border-[#DCD1BF]/60 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2.5 py-1 font-mono">
                          Reports & Stories
                        </div>
                        {searchResults.reports.map((report: any, idx: number) => (
                          <button
                            key={report.id || report._id || idx}
                            onClick={() => {
                              setActiveTab('moderation');
                              setSearchDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-[#F8F5EE] dark:hover:bg-slate-800/60 transition cursor-pointer group"
                          >
                            <div className="min-w-0 pr-3">
                              <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#DE5227] transition">
                                {report.title || 'Civic infrastructure report'}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {report.location?.city || report.city || 'Report location'}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#F8F5EE] dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
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
                                setActiveTab('creators');
                                setSearchDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-[#F8F5EE] dark:hover:bg-slate-800/60 transition cursor-pointer group"
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

            {/* Operational Node Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.9% Uptime</span>
            </div>

            {/* Live IST Clock Badge */}
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono font-bold shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)]">
                <Clock className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>{currentTime} IST</span>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#101522] hover:bg-[#F8F5EE] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer border border-[#DCD1BF] dark:border-slate-800 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)]"
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
                className="relative p-2.5 rounded-2xl bg-white dark:bg-[#101522] hover:bg-[#F8F5EE] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer border border-[#DCD1BF] dark:border-slate-800 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)]"
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
                <div className="absolute right-0 mt-2 w-76 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-30 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-[#DCD1BF]/60 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                      Actionable Alerts
                    </span>
                    <span className="text-[10px] bg-[#F8F5EE] dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold font-mono">
                      {totalPendingAlerts} Pending
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('moderation');
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F5EE] dark:hover:bg-slate-800/50 flex items-center justify-between transition cursor-pointer border border-transparent hover:border-[#DCD1BF] dark:hover:border-slate-700"
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
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F5EE] dark:hover:bg-slate-800/50 flex items-center justify-between transition cursor-pointer border border-transparent hover:border-[#DCD1BF] dark:hover:border-slate-700"
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

            {/* Quick Link to Creator Studio / Publish Report */}
            <button
              onClick={() => navigate('/creator/upload')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
              title="Open Creator Studio / Publish Ground Report"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Publish Report</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#101522] hover:bg-[#F8F5EE] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer border border-[#DCD1BF] dark:border-slate-800 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.08)]"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin text-[#DE5227]' : ''}`}
              />
            </button>
          </div>
        </header>

        {/* 3. Main Body View */}
        <main className="space-y-6 flex-1 w-full">
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
              adminName={adminName}
            />
          )}

          {activeTab === 'moderation' && (
            <AdminModerationTab
              modItems={modItems}
              modStatusFilter={modStatusFilter}
              setModStatusFilter={setModStatusFilter}
              fetchModerationQueue={fetchModerationQueue}
              handleModerate={handleModerate}
            />
          )}

          {activeTab === 'creators' && (
            <AdminCreatorsTab creatorsList={creatorsList} />
          )}

          {activeTab === 'payouts' && (
            <AdminPayoutsTab
              payouts={payouts}
              fetchPayouts={fetchPayouts}
              handleProcessPayout={handleProcessPayout}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              token={token}
              apiBase="/api"
              fetchCategories={fetchCategories}
            />
          )}

          {activeTab === 'cms' && (
            <AdminCmsTab
              cmsPages={cmsPages}
              token={token}
              apiBase="/api"
              fetchCmsPages={fetchCmsPages}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditTab auditLogs={auditLogs} />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              setSettings={setSettings}
              token={token}
              apiBase="/api"
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-[#101522]/80 backdrop-blur-md border border-[#DCD1BF] dark:border-slate-800 rounded-3xl px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 shadow-[0_2px_8px_-2px_rgba(30,24,16,0.06)]">
          <div className="flex items-center gap-2">
            <NagrikLogo size="sm" variant="icon" />
            <span className="font-serif font-bold text-slate-800 dark:text-slate-200">
              © {new Date().getFullYear()} Nagrik Hyperlocal Civic Journalism Platform
            </span>
          </div>
          <div className="font-mono text-[11px] text-[#DE5227] font-semibold">
            Enterprise Operations Console • Sovereign Node
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
