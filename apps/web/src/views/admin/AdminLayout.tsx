import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  CreditCard,
  Megaphone,
  Sliders,
  History,
  Tag,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Search,
  Globe,
  LogOut
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { AdminAuth } from './AdminAuth';
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

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface AdminLayoutProps {
  onBackToHome?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToHome }) => {
  const { token, logout: handleSignOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active tab from URL path (e.g. /admin/moderation -> 'moderation')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] || 'dashboard';

  const validTabs = ['dashboard', 'moderation', 'creators', 'payouts', 'ads', 'settings', 'categories', 'cms', 'audit'] as const;

  const activeTab: AdminTab = validTabs.includes(subRoute as AdminTab)
    ? (subRoute as AdminTab)
    : 'dashboard';

  const setActiveTab = (tab: AdminTab) => {
    navigate(`/admin/${tab}`);
  };

  // Data States
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Mod Queue State
  const [modStatusFilter, setModStatusFilter] = useState<'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED'>('PENDING_REVIEW');
  const [modItems, setModItems] = useState<any[]>([]);

  // Creators list
  const [creatorsList, setCreatorsList] = useState<any[]>([]);

  // Payouts State
  const [payouts, setPayouts] = useState<any[]>([]);

  // Ads State
  const [ads, setAds] = useState<any[]>([]);

  // Settings State
  const [settings, setSettings] = useState<any>({
    earningRatePer1000Views: 1.5,
    minPayoutAmount: 10,
    maxCountedViewsPerVideo: 100000
  });

  // Categories
  const [categories, setCategories] = useState<any[]>([]);

  // CMS Legal Pages State
  const [cmsPages, setCmsPages] = useState<any[]>([]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

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
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'moderation') {
      fetchModerationQueue();
    }
    if (token && activeTab === 'creators') {
      fetchCreators();
    }
    if (token && activeTab === 'cms') {
      fetchCmsPages();
    }
  }, [modStatusFilter, activeTab]);

  // Actions
  const handleModerate = async (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/moderation/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchModerationQueue();
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessPayout = async (requestId: string, status: 'PAID' | 'REJECTED', txRef?: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/payouts/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, txRef })
      });
      const data = await res.json();
      if (data.success) {
        fetchPayouts();
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If Not Authenticated as Admin
  if (!token) {
    return <AdminAuth apiBase={API_BASE} onBackToHome={onBackToHome} />;
  }

  return (
    <div className="h-screen w-screen bg-[#F5F2EB] text-stone-900 flex overflow-hidden antialiased selection:bg-orange-100 selection:text-orange-900 font-sans">
      {/* 1. DEDICATED ADMIN SIDEBAR */}
      <aside className="w-64 h-screen bg-[#FAF9F5] border-r border-[#E3E0D4] flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 z-30 shadow-xs">
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Admin Brand Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <NagrikLogo size="sm" variant="icon" theme="light" />
              <div>
                <div className="font-black text-sm text-stone-900 tracking-wide flex items-center gap-1.5">
                  <span>NAGRIK</span>
                  <span className="bg-[#E36138] text-[9px] font-black text-white px-1.5 py-0.2 rounded tracking-wider uppercase">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 font-medium">Enterprise Control Hub</div>
              </div>
            </div>

            
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Analytics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Moderation Queue</span>
              </div>
              {(metrics?.pendingModeration || 0) > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {metrics?.pendingModeration}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('creators')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'creators'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Verified Creators</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">{metrics?.totalCreators || creatorsList.length || 0}</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'payouts'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Payout Approvals</span>
              </div>
              {(metrics?.pendingPayouts || 0) > 0 && (
                <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {metrics?.pendingPayouts}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-4 h-4" />
                <span>Ads & Campaigns</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Category Manager</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Legal & CMS Pages</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-md font-bold font-mono">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>CPM & System Rules</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                <span>Audit Trail</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Account info */}
        <div className="p-4 border-t border-[#E3E0D4] space-y-2 bg-[#FAF9F5]">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E0D4] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#E36138] text-white font-black text-xs flex items-center justify-center">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-stone-900 truncate">Chief Admin</div>
              <div className="text-[10px] text-stone-500 truncate">admin@nagrik.news</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onBackToHome}
              className="flex-1 px-3 py-1.5 rounded-lg bg-white hover:bg-[#EFECE6] border border-[#E3E0D4] text-[11px] font-bold text-stone-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
              title="Public Web Portal"
            >
              <Globe className="w-3.5 h-3.5 text-[#E36138]" />
              <span>Live Site</span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition cursor-pointer shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#F5F2EB]">
        {/* Dedicated Admin Header */}
        <header className="bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E3E0D4] sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <NagrikLogo size="sm" variant="icon" theme="light" />
            </div>
            <div>
              <h1 className="text-base font-black text-stone-900 capitalize tracking-tight flex items-center gap-2">
                <span>{activeTab === 'dashboard' ? 'Operational Overview & Traffic' : activeTab.replace('-', ' ')}</span>
              </h1>
              <div className="text-[10px] text-stone-500 font-medium">Nagrik Enterprise Operations Management</div>
            </div>
          </div>

          {/* Topbar Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
              />
            </div>

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-white hover:bg-[#EFECE6] text-stone-700 transition cursor-pointer border border-[#E3E0D4] shadow-2xs"
              title="Refresh Metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E36138]' : ''}`} />
            </button>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E36138] to-[#EA580C] hover:from-[#D24E25] hover:to-[#C2410C] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visit Live Feed</span>
            </button>
          </div>
        </header>

        {/* Main Body View */}
        <main className="p-6 space-y-6 flex-1">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              metrics={metrics}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              modItems={modItems}
              creatorsList={creatorsList}
              setActiveTab={setActiveTab}
              handleModerate={handleModerate}
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
            <AdminCreatorsTab
              creatorsList={creatorsList}
            />
          )}

          {activeTab === 'payouts' && (
            <AdminPayoutsTab
              payouts={payouts}
              fetchPayouts={fetchPayouts}
              handleProcessPayout={handleProcessPayout}
            />
          )}

          {activeTab === 'ads' && (
            <AdminAdsTab
              ads={ads}
              token={token}
              apiBase={API_BASE}
              fetchAds={fetchAds}
            />
          )}

          {activeTab === 'categories' && (
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

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              setSettings={setSettings}
              token={token}
              apiBase={API_BASE}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditTab
              auditLogs={auditLogs}
            />
          )}
        </main>

        {/* Dedicated Admin Footer */}
        <footer className="bg-[#FAF9F5] border-t border-[#E3E0D4] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 font-medium">
          <div>© {new Date().getFullYear()} Nagrik</div>
         
        </footer>
      </div>
    </div>
  );
};
