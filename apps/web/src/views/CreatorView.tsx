import React, { useState, useEffect } from 'react';
import {
  
  PlusCircle,
  BarChart3,
  Wallet,
  LogOut,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,LayoutDashboard,
  FileText,
  TrendingUp,
  Eye,
  DollarSign,
  ArrowLeft,
  Globe,
  ChevronRight,
  Sparkles,
  UserCheck,
  Video,
  Layers,
  Search,
  Check,
  X,
  CreditCard,
  History,
  ShieldCheck,
  Menu
} from 'lucide-react';
import { NagrikLogo } from '../components/NagrikLogo';
import { useAuth } from '../context/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface CreatorViewProps {
  onBackToHome?: () => void;
}

export const CreatorView: React.FC<CreatorViewProps> = ({ onBackToHome }) => {
  const { token, user, login, logout: handleSignOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'create' | 'analytics' | 'wallet'>('dashboard');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Auth State
  const [isRegister, setIsRegister] = useState(false);
  const [authName, setAuthName] = useState('Rahul Kumar');
  const [authEmail, setAuthEmail] = useState('creator1@naagrik.news');
  const [authPassword, setAuthPassword] = useState('CreatorPass123!');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Creator Data State
  const [stats, setStats] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [contentFilter, setContentFilter] = useState<string>('ALL');
  const [analytics, setAnalytics] = useState<any>(null);
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);

  // Create Content Form State
  const [contentType, setContentType] = useState<'VIDEO' | 'ARTICLE'>('VIDEO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stateName, setStateName] = useState('Bihar');
  const [cityName, setCityName] = useState('Patna');
  const [areaName, setAreaName] = useState('Kankarbagh');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [submittingContent, setSubmittingContent] = useState(false);

  // Payout Form State
  const [payoutType, setPayoutType] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('rahul@upi');
  const [accHolder, setAccHolder] = useState('Rahul Kumar');
  const [accNumber, setAccNumber] = useState('987654321098');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [bankName, setBankName] = useState('State Bank of India');
  const [requestAmount, setRequestAmount] = useState(10);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister
      ? { name: authName, email: authEmail, password: authPassword, role: 'CREATOR' }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.user.role !== 'CREATOR' && data.user.role !== 'ADMIN') {
        throw new Error('Please sign in with a Creator or Admin account.');
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
    try {
      const res = await fetch(`${API_BASE}/creator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContent = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setContents(data.contents || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const resMethods = await fetch(`${API_BASE}/creator/payout-methods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataMethods = await resMethods.json();
      if (dataMethods.success) setPayoutMethods(dataMethods.methods || []);

      const resRequests = await fetch(`${API_BASE}/creator/payout-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataRequests = await resRequests.json();
      if (dataRequests.success) setPayoutRequests(dataRequests.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.success && data.categories.length > 0) {
        setCategories(data.categories);
        setSelectedCategory(data.categories[0].id || data.categories[0].slug);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContent();
      fetchAnalytics();
      fetchPayouts();
      fetchCategories();
    }
  }, [token]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetFolder: 'videos' | 'thumbnails' | 'images'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingMedia(true);
    setUploadProgressMsg(`Uploading ${file.name}...`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', targetFolder);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (targetFolder === 'thumbnails') {
          setThumbnailUrl(data.url);
        } else {
          setMediaUrl(data.url);
        }
        setUploadProgressMsg('Upload complete!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploadingMedia(false);
      setTimeout(() => setUploadProgressMsg(''), 2000);
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!mediaUrl || !thumbnailUrl) {
      alert('Please upload both the main media file and the thumbnail before submitting.');
      return;
    }

    setSubmittingContent(true);
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: contentType,
          title,
          description,
          mediaUrl,
          thumbnailUrl,
          categoryId: selectedCategory,
          location: { country: 'India', state: stateName, city: cityName, area: areaName }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.moderationMessage || 'Content submitted successfully for editorial review!');
        setTitle('');
        setDescription('');
        setMediaUrl('');
        setThumbnailUrl('');
        setActiveTab('content');
        fetchContent();
        fetchDashboard();
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingContent(false);
    }
  };

  const handleAddPayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/creator/payout-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: payoutType,
          upiId: payoutType === 'UPI' ? upiId : undefined,
          bankDetails: payoutType === 'BANK' ? { accountHolderName: accHolder, accountNumber: accNumber, ifsc, bankName } : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payout method saved successfully!');
        fetchPayouts();
      } else {
        alert(data.error || 'Failed to save payout method');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestPayout = async () => {
    if (!token || payoutMethods.length === 0) {
      alert('Please add a valid UPI or Bank payout method first.');
      return;
    }
    setPayoutLoading(true);
    try {
      const res = await fetch(`${API_BASE}/creator/request-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: requestAmount,
          payoutMethodId: payoutMethods[0].id || payoutMethods[0]._id
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Payout request submitted successfully!');
        fetchPayouts();
        fetchDashboard();
      } else {
        alert(data.error || 'Failed to submit payout request');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPayoutLoading(false);
    }
  };

  const filteredContents = contents.filter(item => {
    if (contentFilter === 'ALL') return true;
    return item.moderationStatus === contentFilter;
  });

  const availableBal = stats?.availableBalance ?? 24.50;
  const isEligibleForPayout = availableBal >= 10.0;
  const payoutProgress = Math.min(100, (availableBal / 10.0) * 100);

  // =========================================================================
  // 1. AUTH SCREEN (Dedicated Dark Enterprise Theme)
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#E36138] selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E36138] via-amber-500 to-emerald-500" />

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Feed</span>
            </button>
          )}

          <div className="text-center space-y-2">
            <div className="inline-flex justify-center mb-1">
              <NagrikLogo size="lg" variant="icon" theme="dark" />
            </div>
            <h2 className="text-xl font-black text-white">
              {isRegister ? 'Join as a Citizen Reporter' : 'Creator Studio Sign In'}
            </h2>
            <p className="text-xs text-slate-400">
              Publish Hyperlocal Video Reports & Monetize Viewership
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#E36138]"
                  placeholder="e.g. Rahul Kumar"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#E36138]"
                placeholder="creator@naagrik.news"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#E36138]"
                placeholder="••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-xs font-black py-3 rounded-xl shadow-lg shadow-orange-950 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? 'Verifying...' : isRegister ? 'Register Creator Account' : 'Enter Creator Studio'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
              className="text-xs font-bold text-[#FB923C] hover:underline cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an author profile? Register Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DEDICATED CREATOR STUDIO WORKSPACE (Full-Screen Layout)
  // =========================================================================
  return (
    <div className="h-screen w-screen bg-[#090D16] text-slate-100 flex overflow-hidden antialiased selection:bg-[#E36138] selection:text-white">
      {/* ------------------------------------------------------------------ */}
      {/* 2.1 DEDICATED CREATOR SIDEBAR                                       */}
      {/* ------------------------------------------------------------------ */}
      <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 z-30">
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Creator Brand Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <NagrikLogo size="sm" variant="icon" />
              <div>
                <div className="font-black text-sm text-white tracking-wide flex items-center gap-1.5">
                  <span>NAAGRIK</span>
                  <span className="bg-amber-600 text-[9px] font-black text-white px-1.5 py-0.2 rounded tracking-wider uppercase">
                    CREATOR
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Citizen Reporter Studio</div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KYC Verified Reporter</span>
            </div>
          </div>

          {/* Quick Balance Preview Pill */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-emerald-400 font-mono">${availableBal.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 font-mono">Min $10.00</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#E36138] to-emerald-400 h-full rounded-full"
                style={{ width: `${payoutProgress}%` }}
              />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Overview & Earnings', icon: LayoutDashboard },
              { id: 'content', label: 'My Submissions', icon: FileText, count: contents.length || stats?.publishedContent },
              { id: 'create', label: '+ Publish Video Report', icon: PlusCircle, highlight: true },
              { id: 'analytics', label: 'Monetization Analytics', icon: BarChart3 },
              { id: 'wallet', label: 'Wallet & UPI Payouts', icon: Wallet }
            ].map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    isActive
                      ? 'bg-[#E36138] text-white shadow-lg shadow-orange-950'
                      : t.highlight
                      ? 'bg-gradient-to-r from-orange-950/60 to-slate-900 text-[#FB923C] border border-orange-900/50 hover:border-[#E36138]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </div>
                  {t.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-slate-300">
                      {t.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="p-4 border-t border-slate-900 space-y-2 bg-slate-950 shrink-0">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E36138] text-white font-black text-xs flex items-center justify-center shrink-0">
              {authEmail.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-white truncate">Rahul Kumar</div>
              <div className="text-[10px] text-slate-400 truncate font-mono">{authEmail}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
              title="Public Web Portal"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Feed</span>
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

      {/* ------------------------------------------------------------------ */}
      {/* 2.2 MAIN CONTENT CONTAINER                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 h-screen flex flex-col overflow-y-auto">
        {/* Dedicated Creator Top Header */}
        <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <NagrikLogo size="sm" variant="icon" />
            </div>
            <div>
              <h1 className="text-base font-black text-white capitalize tracking-tight flex items-center gap-2">
                <span>
                  {activeTab === 'dashboard'
                    ? 'Reporter Studio Overview'
                    : activeTab === 'content'
                    ? 'My Submissions & Approvals'
                    : activeTab === 'create'
                    ? 'Publish Local News Video'
                    : activeTab === 'analytics'
                    ? 'Monetization & View Analytics'
                    : 'Wallet & Payout Disbursals'}
                </span>
              </h1>
              <div className="text-[10px] text-slate-400 font-medium">Naagrik Citizen Journalism Network</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-slate-400">Balance:</span>
              <span className="text-xs font-mono font-black text-emerald-400">${availableBal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish Story</span>
            </button>
          </div>
        </header>

        {/* Dynamic Creator Views */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW & ANALYTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Range Selector & Realtime Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-3xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-white">Live Reporter Network & Monetization Pulse</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    Real-time
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
                  {[
                    { id: '24h', label: '24h' },
                    { id: '7d', label: '7 Days' },
                    { id: '30d', label: '30 Days' },
                    { id: 'all', label: 'All Time' }
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => setTimeframe(tf.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs ${
                        timeframe === tf.id
                          ? 'bg-[#E36138] text-white shadow-sm font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6 Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monetized Views</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">38,666</div>
                  <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+24.8% this week</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Impressions</div>
                  <div className="text-2xl font-black text-white font-mono">42,800</div>
                  <div className="text-[10px] text-slate-400 font-mono">90.3% Conversion</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">${availableBal.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">● Ready to Withdraw</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Earnings</div>
                  <div className="text-2xl font-black text-white font-mono">$58.00</div>
                  <div className="text-[10px] text-slate-400">Total Across Stories</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Paid Out</div>
                  <div className="text-2xl font-black text-[#FB923C] font-mono">$33.50</div>
                  <div className="text-[10px] text-slate-400 font-mono">UPI Ref: Verified</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creator RPM</div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">$1.50</div>
                  <div className="text-[10px] text-indigo-300 font-bold">Per 1,000 Views</div>
                </div>
              </div>

              {/* MULTI-GRAPH ROW 1: Area Trajectory & Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Graph 1: 7-Day Viewership & Daily Earnings Trajectory */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-black text-white text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#E36138]" />
                        <span>Daily Viewership Growth & Daily Revenue Stream</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Comparing gross reader impressions with earned creator revenue ($1.50/1k)</p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <span className="flex items-center gap-1 text-[#FB923C]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                        <span>Views</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span>Earnings ($)</span>
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-56 w-full pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                      <defs>
                        <linearGradient id="creator_views_grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FB923C" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#FB923C" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="creator_earn_grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="600" y2="40" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="0" y1="180" x2="600" y2="180" stroke="#334155" />

                      {/* Views Area & Path */}
                      <path
                        d="M 0 160 Q 100 140 200 110 T 400 70 T 600 30 L 600 180 L 0 180 Z"
                        fill="url(#creator_views_grad)"
                      />
                      <path
                        d="M 0 160 Q 100 140 200 110 T 400 70 T 600 30"
                        fill="none"
                        stroke="#FB923C"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Earnings Area & Path */}
                      <path
                        d="M 0 170 Q 100 155 200 130 T 400 95 T 600 50 L 600 180 L 0 180 Z"
                        fill="url(#creator_earn_grad)"
                      />
                      <path
                        d="M 0 170 Q 100 155 200 130 T 400 95 T 600 50"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Data Point Circles */}
                      <circle cx="0" cy="160" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="100" cy="140" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="200" cy="110" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="300" cy="85" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="400" cy="70" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="500" cy="45" r="4" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="600" cy="30" r="5" fill="#FB923C" stroke="#FFFFFF" strokeWidth="2" />

                      <circle cx="600" cy="50" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>

                    {/* X-Axis Days */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2">
                      <span>26 Aug (2.1k / $3.15)</span>
                      <span>27 Aug (3.4k / $5.10)</span>
                      <span>28 Aug (4.8k / $7.20)</span>
                      <span>29 Aug (6.2k / $9.30)</span>
                      <span>30 Aug (8.5k / $12.75)</span>
                      <span>31 Aug (9.8k / $14.70)</span>
                      <span className="text-emerald-400 font-bold">Today (12.4k / $18.60)</span>
                    </div>
                  </div>
                </div>

                {/* Graph 2: Category Engagement Breakdown */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#FB923C]" />
                      <span>Story Category Revenue Split</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Distribution of earnings across beats</p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-200">Local Infrastructure (पटना)</span>
                        <span className="text-[#FB923C] font-bold">52% ($30.16)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#E36138] h-full rounded-full" style={{ width: '52%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-200">Culture & Festivals (गंगा आरती)</span>
                        <span className="text-emerald-400 font-bold">28% ($16.24)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-200">Crime & Civic Alerts</span>
                        <span className="text-indigo-400 font-bold">12% ($6.96)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '12%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-200">Public Welfare & Schemes</span>
                        <span className="text-amber-400 font-bold">8% ($4.64)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Highest Earning Beat:</span>
                    <strong className="text-emerald-400">Local Infrastructure</strong>
                  </div>
                </div>
              </div>

              {/* MULTI-GRAPH ROW 2: Hourly Traffic Rush Histogram & Payout Meter */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Graph 3: Hourly Traffic Peaks */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div>
                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Hourly Reader Traffic & Peak Virality Spikes</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">When your hyperlocal stories get the highest real-time views</p>
                  </div>

                  <div className="grid grid-cols-8 gap-2 h-36 items-end pt-4 font-mono text-[10px]">
                    {[
                      { time: '6 AM', val: 25, label: '2.5k' },
                      { time: '8 AM', val: 92, label: '9.2k', peak: true },
                      { time: '10 AM', val: 65, label: '6.5k' },
                      { time: '12 PM', val: 45, label: '4.5k' },
                      { time: '3 PM', val: 38, label: '3.8k' },
                      { time: '6 PM', val: 78, label: '7.8k' },
                      { time: '8 PM', val: 98, label: '11.4k', peak: true },
                      { time: '10 PM', val: 40, label: '4.0k' }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className={`text-[9px] ${bar.peak ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                          {bar.label}
                        </span>
                        <div
                          className={`w-full rounded-xl transition-all duration-300 ${
                            bar.peak
                              ? 'bg-gradient-to-t from-[#E36138] to-emerald-400 shadow-md shadow-orange-950'
                              : 'bg-slate-800 group-hover:bg-slate-700'
                          }`}
                          style={{ height: `${bar.val}%` }}
                        />
                        <span className="text-[9px] text-slate-400 truncate">{bar.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>🔥 Prime Publishing Window:</span>
                    <strong className="text-white">08:00 AM – 10:00 AM & 07:30 PM – 09:30 PM</strong>
                  </div>
                </div>

                {/* Graph 4: Payout Readiness & Account Health */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Wallet Balance & Disbursal Status</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Direct NEFT/UPI bank settlement ready</p>
                  </div>

                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">Available to Withdraw:</span>
                      <span className="text-3xl font-black text-emerald-400 font-mono">${availableBal.toFixed(2)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Withdrawal Goal ($10.00 Min)</span>
                        <span className="text-emerald-400 font-bold">100% (Eligible)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-[#E36138] via-amber-400 to-emerald-400 h-full rounded-full w-full" />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-900">
                      <span className="text-slate-400 font-mono">Registered UPI:</span>
                      <span className="font-bold text-white font-mono">rahulkumar@okhdfcbank</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('wallet')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Open Wallet & Request Instant Payout →
                  </button>
                </div>
              </div>

              {/* Call to action Banner */}
              <div className="p-6 bg-gradient-to-r from-[#74260E] to-slate-900 border border-orange-900/60 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#FB923C]" />
                    <span>Submit a Breaking Video Report</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Upload live ground coverage. Instant editorial moderation with $1.50 CPM earnings per 1,000 views.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition cursor-pointer shrink-0"
                >
                  + Publish Story Now
                </button>
              </div>

              {/* Top Performing Reports Table */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Your Top Performing Hyperlocal Reports</h3>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="text-xs font-bold text-[#FB923C] hover:underline cursor-pointer"
                  >
                    View All Submissions →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: '1',
                      title: 'पटना कंकड़बाग में नए फ्लाइओवर का निर्माण कार्य शुरू, ट्रैफिक डायवर्जन जारी',
                      category: 'Local News',
                      views: 18450,
                      earned: '$27.67',
                      status: 'APPROVED',
                      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
                    },
                    {
                      id: '2',
                      title: 'गंगा रिवरफ्रंट पर उमड़ी भारी भीड़, शाम की भव्य आरती का सीधा दृश्य',
                      category: 'Culture',
                      views: 20216,
                      earned: '$30.32',
                      status: 'APPROVED',
                      thumbnail: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80'
                    }
                  ].map((story) => (
                    <div
                      key={story.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex gap-4 items-center"
                    >
                      <img
                        src={story.thumbnail}
                        alt=""
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                          {story.status}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{story.title}</h4>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                          <span>{story.views.toLocaleString()} views</span>
                          <span className="text-emerald-400 font-bold">{story.earned} Earned</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY SUBMISSIONS */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {['ALL', 'APPROVED', 'PENDING_REVIEW', 'REJECTED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setContentFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      contentFilter === f
                        ? 'bg-[#E36138] text-white shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {filteredContents.length === 0 ? (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center text-slate-400 text-xs">
                  No submissions found matching the selected filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredContents.map(item => (
                    <div
                      key={item.id || item._id}
                      className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative h-40 bg-black">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/80 text-white px-2 py-0.5 rounded uppercase">
                          {item.type}
                        </span>
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.moderationStatus === 'APPROVED' ? 'bg-emerald-600 text-white' :
                          item.moderationStatus === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {item.moderationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-white text-xs line-clamp-2">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-300">
                          <span>Views: {item.views || 0}</span>
                          <span className="text-emerald-400 font-bold">Monetized: {item.eligibleViews || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATE CONTENT */}
          {activeTab === 'create' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-black text-white">Publish Local News / Short Video Report</h3>
              <form onSubmit={handleCreateContent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Headline</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#E36138]"
                    placeholder="Enter short, factual headline..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Story Details</label>
                  <textarea
                    rows={4}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#E36138]"
                    placeholder="Provide detailed ground report context..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#E36138]"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.id || c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">State</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      value={stateName}
                      onChange={e => setStateName(e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      value={cityName}
                      onChange={e => setCityName(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Locality</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      value={areaName}
                      onChange={e => setAreaName(e.target.value)}
                      placeholder="Locality"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-[#E36138] rounded-xl text-center space-y-2 transition">
                    <Upload className="w-5 h-5 text-[#E36138] mx-auto" />
                    <div className="text-xs font-bold text-slate-300">Media (.mp4 / image)</div>
                    <input
                      type="file"
                      onChange={e => handleFileUpload(e, contentType === 'VIDEO' ? 'videos' : 'images')}
                      className="w-full text-xs text-slate-400 cursor-pointer"
                    />
                    {mediaUrl && <div className="text-[10px] text-emerald-400 font-bold">✓ Media Uploaded</div>}
                  </div>

                  <div className="p-4 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-[#E36138] rounded-xl text-center space-y-2 transition">
                    <Upload className="w-5 h-5 text-[#E36138] mx-auto" />
                    <div className="text-xs font-bold text-slate-300">Thumbnail Image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'thumbnails')}
                      className="w-full text-xs text-slate-400 cursor-pointer"
                    />
                    {thumbnailUrl && <div className="text-[10px] text-emerald-400 font-bold">✓ Thumbnail Ready</div>}
                  </div>
                </div>

                {uploadingMedia && (
                  <div className="text-xs text-[#FB923C] font-bold text-center animate-pulse">
                    {uploadProgressMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingContent || uploadingMedia}
                  className="w-full bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-xs font-black py-3 rounded-xl shadow-lg transition cursor-pointer"
                >
                  {submittingContent ? 'Submitting...' : 'Submit Story for Verification'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">Gross Impressions</div>
                  <div className="text-3xl font-black text-white font-mono">{analytics?.totalViews ?? '42,800'}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-1">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Eligible Monetized Views</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">{analytics?.totalEligibleViews ?? '38,666'}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-1">
                  <div className="text-xs font-bold text-amber-400 uppercase">Exceeded Frequency Ceiling</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">{analytics?.nonEligibleViews ?? '4,134'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WALLET & PAYOUTS */}
          {activeTab === 'wallet' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Available Creator Earnings</div>
                  <div className="text-4xl font-black text-emerald-400 font-mono mt-1">${availableBal.toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mt-1">Minimum Payout Limit: <strong className="text-white">$10.00</strong></div>
                </div>
                <button
                  onClick={handleRequestPayout}
                  disabled={!isEligibleForPayout || payoutLoading}
                  className={`px-6 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    isEligibleForPayout
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {payoutLoading ? 'Processing...' : isEligibleForPayout ? 'Request Payout Disbursal ($10+)' : 'Min $10.00 Required'}
                </button>
              </div>

              {/* Payment Method Config */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h4 className="font-black text-white text-sm">Add / Configure Payout Method</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutType('UPI')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      payoutType === 'UPI' ? 'bg-[#E36138] text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    UPI ID (Virtual Payment Address)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutType('BANK')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      payoutType === 'BANK' ? 'bg-[#E36138] text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    Bank Direct Transfer (NEFT/IMPS)
                  </button>
                </div>

                <form onSubmit={handleAddPayoutMethod} className="space-y-3 max-w-md">
                  {payoutType === 'UPI' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">UPI VPA</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#E36138]"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        placeholder="Bank Name"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        placeholder="Account Holder"
                        value={accHolder}
                        onChange={e => setAccHolder(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                        placeholder="Account Number"
                        value={accNumber}
                        onChange={e => setAccNumber(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                        placeholder="IFSC Code"
                        value={ifsc}
                        onChange={e => setIfsc(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <button type="submit" className="bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                    Save Payout Method
                  </button>
                </form>

                {/* Saved Payout Methods List */}
                {payoutMethods.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300">Saved Payment Methods:</div>
                    <div className="space-y-1.5">
                      {payoutMethods.map((m: any, idx: number) => (
                        <div key={m.id || idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                          <div className="text-slate-200">
                            <span className="font-bold text-[#FB923C]">{m.type}</span>: {m.type === 'UPI' ? m.details?.upiId : `${m.details?.bankName} (***${m.details?.accountNumber?.slice(-4) || ''})`}
                          </div>
                          {m.isDefault && <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded font-bold">Default</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payout History List */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h4 className="font-black text-white text-sm">Payout Requests History</h4>
                {payoutRequests.length === 0 ? (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-emerald-400">$33.50</div>
                        <div className="text-[10px] text-slate-500">Ref: UPI-9876-HDFC-2026 • Disbursed</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                        PAID
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payoutRequests.map((r: any, idx: number) => (
                      <div key={r.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="font-bold text-white">${r.amount?.toFixed(2) || '0.00'}</div>
                          <div className="text-[10px] text-slate-500">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          r.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {r.status || 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Dedicated Creator Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <div>© 2026 Naagrik Creator Studio • Hyperlocal Citizen Journalism Network</div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Earning Rate: $1.50 / 1K Monetized Views</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
