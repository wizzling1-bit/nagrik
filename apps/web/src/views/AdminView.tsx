import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NagrikLogo } from '../components/NagrikLogo';
import { useAuth } from '../context/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface AdminViewProps {
  onBackToHome?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToHome }) => {
  const { token, login, logout: handleSignOut } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'moderation' | 'creators' | 'payouts' | 'ads' | 'settings' | 'categories' | 'audit'
  >('dashboard');

  // Auth State
  const [authEmail, setAuthEmail] = useState('admin@naagrik.news');
  const [authPassword, setAuthPassword] = useState('AdminPass123!');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [modStatusFilter, setModStatusFilter] = useState<'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED'>('PENDING_REVIEW');
  const [modItems, setModItems] = useState<any[]>([]);
  const [creatorsList, setCreatorsList] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    minPayoutAmount: 10.00,
    earningRatePer1000Views: 1.50,
    maxCountedViewsPerVideo: 3,
    adFeedFrequency: 4
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedStoryModal, setSelectedStoryModal] = useState<any | null>(null);

  // Forms
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [adName, setAdName] = useState('Patna Mega Sale');
  const [adType, setAdType] = useState<'BANNER' | 'VIDEO' | 'SPONSORED'>('BANNER');
  const [adMediaUrl, setAdMediaUrl] = useState('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80');
  const [adFrequency, setAdFrequency] = useState(4);
  const [rejectionReason, setRejectionReason] = useState('');
  const [payoutTxRef, setPayoutTxRef] = useState('UPI-REF-2026-9876');

  // Auth Handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.user.role !== 'ADMIN') {
        throw new Error('Access denied: Admin role required.');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setMetrics(data.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModerationQueue = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/moderation/queue?status=${modStatusFilter}&limit=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setModItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/payouts/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPayouts(data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAds = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAds(data.ads || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/content/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAuditLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllData = () => {
    fetchDashboard();
    fetchModerationQueue();
    fetchPayouts();
    fetchAds();
    fetchCategories();
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
  }, [modStatusFilter, activeTab]);

  // Moderation Actions
  const handleModerate = async (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED') => {
    try {
      const res = await fetch(`${API_BASE}/admin/moderation/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId,
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason || 'Content violates editorial standards' : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedStoryModal(null);
        setRejectionReason('');
        fetchModerationQueue();
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Payout Process
  const handleProcessPayout = async (requestId: string, status: 'PAID' | 'REJECTED') => {
    try {
      const res = await fetch(`${API_BASE}/admin/payouts/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId,
          status,
          transactionRef: status === 'PAID' ? payoutTxRef : undefined,
          remarks: status === 'REJECTED' ? 'Verification mismatch' : 'Processed successfully'
        })
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

  // Create Ad
  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: adName,
          type: adType,
          mediaUrl: adMediaUrl,
          frequency: adFrequency
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdName('');
        fetchAds();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
          displayOrder: categories.length + 1
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName('');
        setNewCatSlug('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        alert('System Settings updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If Not Authenticated as Admin
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-white selection:bg-[#E36138]">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <NagrikLogo size="md" variant="horizontal" theme="dark" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-black uppercase tracking-wider mt-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Operations Gateway</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">Admin Command Center</h2>
            <p className="text-xs text-slate-400">
              Enter authorized administrator credentials to manage platform, moderation, and payouts.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E36138]"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E36138]"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-xs font-black py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              {authLoading ? 'Verifying...' : 'Access Admin Command Center'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col antialiased selection:bg-[#E36138] selection:text-white">
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================== */}
        {/* 1. DEDICATED ENTERPRISE ADMIN SIDEBAR                      */}
        {/* ========================================================== */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="p-5 space-y-6">
            {/* Admin Brand Badge */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <NagrikLogo size="sm" variant="icon" />
                <div>
                  <div className="font-black text-sm text-white tracking-wide flex items-center gap-1.5">
                    <span>NAAGRIK</span>
                    <span className="bg-[#E36138] text-[9px] font-black text-white px-1.5 py-0.2 rounded tracking-wider uppercase">
                      ADMIN
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Enterprise Control Hub</div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Supabase Connected</span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Moderation Queue</span>
                </div>
                {metrics?.pendingModeration > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {metrics.pendingModeration}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('creators')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'creators'
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Verified Creators</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{metrics?.totalCreators || 1}</span>
              </button>

              <button
                onClick={() => setActiveTab('payouts')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'payouts'
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Payout Approvals</span>
                </div>
                {metrics?.pendingPayouts > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {metrics.pendingPayouts}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4" />
                  <span>Category Manager</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
                    ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
          <div className="p-4 border-t border-slate-900 space-y-2 bg-slate-950/80">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-[#E36138] text-white font-black text-xs flex items-center justify-center">
                AD
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">Chief Admin</div>
                <div className="text-[10px] text-slate-400 truncate">admin@naagrik.news</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onBackToHome}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
                title="Public Web Portal"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </button>

              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================== */}
        {/* 2. MAIN ADMIN CONTENT CONTAINER                           */}
        {/* ========================================================== */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Dedicated Admin Header */}
          <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <NagrikLogo size="sm" variant="icon" />
              </div>
              <div>
                <h1 className="text-base font-black text-white capitalize tracking-tight flex items-center gap-2">
                  <span>{activeTab === 'dashboard' ? 'Operational Overview & Traffic' : activeTab.replace('-', ' ')}</span>
                </h1>
                <div className="text-[10px] text-slate-400 font-medium">Naagrik Enterprise Operations Management</div>
              </div>
            </div>

            {/* Topbar Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#E36138]"
                />
              </div>

              <button
                onClick={fetchAllData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer border border-slate-800"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E36138]' : ''}`} />
              </button>

              <button
                onClick={onBackToHome}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Live Feed</span>
              </button>
            </div>
          </header>

          {/* Main Body View */}
          <main className="p-6 space-y-6 flex-1">
            {/* TAB 1: DASHBOARD OVERVIEW & ANALYTICS GRAPHS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Top 4 KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Moderation</div>
                        <div className="text-3xl font-black text-amber-400 mt-1">{metrics?.pendingModeration || 0}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-[10px] text-slate-400 font-medium">
                      <span>Stories waiting editorial verification</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</div>
                        <div className="text-3xl font-black text-emerald-400 mt-1">{metrics?.pendingPayouts || 0}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-[10px] text-slate-400 font-medium">
                      <span>UPI & Bank withdrawal requests</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Creators</div>
                        <div className="text-3xl font-black text-indigo-400 mt-1">{metrics?.totalCreators || 1}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-[10px] text-slate-400 font-medium">
                      <span>Registered Citizen Journalists</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Video Views</div>
                        <div className="text-3xl font-black text-[#FB923C] mt-1">{metrics?.totalViews || 14890}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FB923C] flex items-center justify-center">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-[10px] text-slate-400 font-medium">
                      <span>Verified Hyperlocal Impressions</span>
                    </div>
                  </div>
                </div>

                {/* VISUAL ANALYTICS & INTERACTIVE GRAPHS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Graph 1: 7-Day Views & Monetization Trend (SVG Area Chart) */}
                  <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-black text-white text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#E36138]" />
                          <span>Video Traffic & Monetized Impressions (Last 7 Days)</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Comparing Total Views vs Ceiling-Eligible Paid Views</p>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-orange-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E36138]" />
                          <span>Total Views</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span>Eligible Monetized</span>
                        </span>
                      </div>
                    </div>

                    {/* SVG Interactive Visual Chart */}
                    <div className="h-56 w-full pt-4 relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180">
                        <defs>
                          <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E36138" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#E36138" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="700" y2="30" stroke="#1e293b" strokeDasharray="4" />
                        <line x1="0" y1="80" x2="700" y2="80" stroke="#1e293b" strokeDasharray="4" />
                        <line x1="0" y1="130" x2="700" y2="130" stroke="#1e293b" strokeDasharray="4" />
                        <line x1="0" y1="170" x2="700" y2="170" stroke="#334155" />

                        {/* Area 1 (Total Views) */}
                        <path
                          d="M 20 150 Q 120 70, 220 110 T 420 50 T 580 80 T 680 30 L 680 170 L 20 170 Z"
                          fill="url(#totalGrad)"
                        />
                        <path
                          d="M 20 150 Q 120 70, 220 110 T 420 50 T 580 80 T 680 30"
                          fill="none"
                          stroke="#E36138"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* Area 2 (Eligible Monetized Views) */}
                        <path
                          d="M 20 160 Q 120 100, 220 130 T 420 80 T 580 110 T 680 60 L 680 170 L 20 170 Z"
                          fill="url(#paidGrad)"
                        />
                        <path
                          d="M 20 160 Q 120 100, 220 130 T 420 80 T 580 110 T 680 60"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Data point dots */}
                        <circle cx="20" cy="150" r="4" fill="#E36138" />
                        <circle cx="220" cy="110" r="4" fill="#E36138" />
                        <circle cx="420" cy="50" r="4" fill="#E36138" />
                        <circle cx="580" cy="80" r="4" fill="#E36138" />
                        <circle cx="680" cy="30" r="5" fill="#FB923C" className="animate-pulse" />

                        <circle cx="20" cy="160" r="3.5" fill="#10B981" />
                        <circle cx="220" cy="130" r="3.5" fill="#10B981" />
                        <circle cx="420" cy="80" r="3.5" fill="#10B981" />
                        <circle cx="580" cy="110" r="3.5" fill="#10B981" />
                        <circle cx="680" cy="60" r="4" fill="#34D399" />
                      </svg>

                      {/* X-Axis Day Labels */}
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2">
                        <span>25 Aug</span>
                        <span>26 Aug</span>
                        <span>27 Aug</span>
                        <span>28 Aug</span>
                        <span>29 Aug</span>
                        <span>30 Aug</span>
                        <span className="text-[#FB923C] font-bold">Today (Live)</span>
                      </div>
                    </div>
                  </div>

                  {/* Graph 2: City-wise Hyperlocal Traffic Distribution */}
                  <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        <span>Hyperlocal Coverage by City</span>
                      </h3>

                      <div className="space-y-3.5 pt-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-200">Patna (पटना)</span>
                            <span className="text-orange-400">48%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#E36138] h-full rounded-full w-[48%]" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-200">Gaya (गया)</span>
                            <span className="text-emerald-400">24%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full w-[24%]" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-200">Muzaffarpur (मुजफ्फरपुर)</span>
                            <span className="text-indigo-400">16%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full w-[16%]" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-200">Bhagalpur & Darbhanga</span>
                            <span className="text-amber-400">12%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full w-[12%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-400">Active Reporter Nodes</div>
                      <div className="font-mono font-bold text-emerald-400">100% Operational</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTENT MODERATION QUEUE */}
            {activeTab === 'moderation' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Filter Status:</span>
                    {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setModStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          modStatusFilter === st
                            ? 'bg-[#E36138] text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={fetchModerationQueue}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                  >
                    Reload Queue
                  </button>
                </div>

                {modItems.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-white text-base">No stories in this queue</h3>
                    <p className="text-xs text-slate-400">All submitted reports for this status have been handled.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modItems.map((story) => (
                      <div
                        key={story.id || story._id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-slate-950">
                          <img
                            src={story.thumbnailUrl || story.mediaUrl}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold uppercase">
                            {story.type}
                          </span>
                        </div>

                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] text-[#FB923C] font-semibold">
                              {story.location?.area}, {story.location?.city}
                            </div>
                            <h4 className="font-black text-white text-sm line-clamp-2 mt-1">{story.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1">{story.description}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-800 space-y-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleModerate(story.id || story._id, 'APPROVED')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleModerate(story.id || story._id, 'REJECTED')}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                            <button
                              onClick={() => setSelectedStoryModal(story)}
                              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-1.5 rounded-xl transition"
                            >
                              Preview Full Video & Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CREATORS MANAGEMENT */}
            {activeTab === 'creators' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <h3 className="text-sm font-black text-white">Registered Citizen Reporters</h3>
                  <span className="text-xs text-emerald-400 font-bold">1 Active Creator</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Reporter Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Total Paid Views</th>
                        <th className="p-4">Available Balance</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>Rahul Kumar</span>
                        </td>
                        <td className="p-4 text-slate-300 font-mono">creator1@naagrik.news</td>
                        <td className="p-4">
                          <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 text-[10px] font-bold">
                            VERIFIED
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">38,666 Views</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">$24.50</td>
                        <td className="p-4">
                          <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold text-[11px]">
                            View Portfolio
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: PAYOUT APPROVALS */}
            {activeTab === 'payouts' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <h3 className="text-sm font-black text-white">Pending Withdrawal Requests ($10.00 Minimum)</h3>
                  <button onClick={fetchPayouts} className="text-xs text-[#E36138] font-bold">
                    Refresh
                  </button>
                </div>

                {payouts.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-white text-sm">No Pending Payouts</h4>
                    <p className="text-xs text-slate-400">All creator withdrawal requests have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payouts.map((p) => (
                      <div
                        key={p.id || p._id}
                        className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div>
                          <div className="text-lg font-black text-emerald-400 font-mono">${p.amount?.toFixed(2)}</div>
                          <div className="text-xs text-slate-300 font-bold mt-1">Creator ID: {p.creatorId}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Date: {new Date(p.createdAt || Date.now()).toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="UPI / Bank Tx Ref..."
                            value={payoutTxRef}
                            onChange={(e) => setPayoutTxRef(e.target.value)}
                            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          />
                          <button
                            onClick={() => handleProcessPayout(p.id || p._id, 'PAID')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => handleProcessPayout(p.id || p._id, 'REJECTED')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ADS & CAMPAIGNS */}
            {activeTab === 'ads' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-black text-white text-sm">Create Local Ad Campaign</h3>
                  <form onSubmit={handleCreateAd} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Campaign Title</label>
                      <input
                        type="text"
                        required
                        value={adName}
                        onChange={(e) => setAdName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Ad Type</label>
                      <select
                        value={adType}
                        onChange={(e: any) => setAdType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      >
                        <option value="BANNER">Banner Ad</option>
                        <option value="VIDEO">Video Sponsored</option>
                        <option value="SPONSORED">Sponsored Post</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Media Banner URL</label>
                      <input
                        type="text"
                        required
                        value={adMediaUrl}
                        onChange={(e) => setAdMediaUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black py-2.5 rounded-xl transition"
                    >
                      Publish Local Ad
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-black text-white text-sm">Active Campaigns</h3>
                  {ads.length === 0 ? (
                    <div className="text-xs text-slate-400">No custom ad campaigns deployed yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {ads.map((a) => (
                        <div
                          key={a.id || a._id}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{a.name}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{a.type} • Status: {a.status}</div>
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: CATEGORIES MANAGER */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-black text-white text-sm">Add New News Category</h3>
                  <form onSubmit={handleAddCategory} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Category Name (Hindi/Eng)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. पर्यावरण (Environment)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Slug</label>
                      <input
                        type="text"
                        placeholder="e.g. environment"
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black py-2.5 rounded-xl transition"
                    >
                      Add Category
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-black text-white text-sm">Active Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat, idx) => (
                      <div
                        key={cat.id || cat.slug || idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white">{cat.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">/{cat.slug || cat.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SYSTEM & CPM SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 animate-in fade-in duration-200">
                <h3 className="font-black text-white text-base">Platform Monetization & CPM Rules</h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Creator Earning Rate (USD per 1,000 Views)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.earningRatePer1000Views}
                      onChange={(e) => setSettings({ ...settings, earningRatePer1000Views: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Minimum Withdrawal Threshold (USD)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={settings.minPayoutAmount}
                      onChange={(e) => setSettings({ ...settings, minPayoutAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Max Counted Views Per Device Per Day (Ceiling Rule)
                    </label>
                    <input
                      type="number"
                      value={settings.maxCountedViewsPerVideo}
                      onChange={(e) => setSettings({ ...settings, maxCountedViewsPerVideo: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black py-3 rounded-xl transition"
                  >
                    Save Platform Rules
                  </button>
                </form>
              </div>
            )}

            {/* TAB 8: AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
                <h3 className="font-black text-white text-sm">Security & Action Audit Logs</h3>
                {auditLogs.length === 0 ? (
                  <div className="text-xs text-slate-400">No critical audit events recorded recently.</div>
                ) : (
                  <div className="space-y-2 font-mono text-xs">
                    {auditLogs.map((log, idx) => (
                      <div key={log.id || idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                        <div>
                          <span className="text-[#FB923C] font-bold">[{log.action}]</span> {log.target_type} ({log.target_id || ''})
                        </div>
                        <span className="text-slate-500 text-[10px]">{new Date(log.created_at || Date.now()).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Dedicated Admin Footer */}
          <footer className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
            <div>Naagrik Admin Suite v2.4 • Supabase PostgreSQL Active</div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero System Errors</span>
              </span>
              <a href={`${API_BASE.replace('/api/v1', '')}/docs`} target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
                API Docs
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* STORY DETAIL MODAL */}
      {selectedStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedStoryModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 sm:h-72 bg-black flex items-center justify-center">
              {selectedStoryModal.type === 'VIDEO' ? (
                <video src={selectedStoryModal.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={selectedStoryModal.thumbnailUrl || selectedStoryModal.mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-base font-black text-white">{selectedStoryModal.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedStoryModal.description}</p>
              <div className="text-xs text-[#FB923C] font-bold">
                Location: {selectedStoryModal.location?.area}, {selectedStoryModal.location?.city}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleModerate(selectedStoryModal.id || selectedStoryModal._id, 'APPROVED')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Approve Story & Publish to Feed
                </button>
                <button
                  onClick={() => handleModerate(selectedStoryModal.id || selectedStoryModal._id, 'REJECTED')}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Reject Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
