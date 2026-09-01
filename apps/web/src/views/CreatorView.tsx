import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Wallet,
  LogOut,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Eye,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { NagrikLogo } from '../components/NagrikLogo';
import { useAuth } from '../context/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface CreatorViewProps {
  onBackToHome?: () => void;
}

export const CreatorView: React.FC<CreatorViewProps> = ({ onBackToHome }) => {
  const { token, login, logout: handleSignOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'create' | 'analytics' | 'wallet'>('dashboard');

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
  const [contentType] = useState<'VIDEO' | 'ARTICLE'>('VIDEO');
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
  const [requestAmount] = useState(10);
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

      const resHistory = await fetch(`${API_BASE}/creator/payout-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataHistory = await resHistory.json();
      if (dataHistory.success) setPayoutRequests(dataHistory.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/content/categories`);
      const data = await res.json();
      if (data.success && data.categories?.length > 0) {
        setCategories(data.categories);
        setSelectedCategory(data.categories[0].id || data.categories[0].slug);
      } else {
        const fallback = [
          { id: 'local', slug: 'local', name: 'Local News' },
          { id: 'politics', slug: 'politics', name: 'Politics' },
          { id: 'crime', slug: 'crime', name: 'Crime' },
          { id: 'sports', slug: 'sports', name: 'Sports' }
        ];
        setCategories(fallback);
        setSelectedCategory(fallback[0].id);
      }
    } catch {
      const fallback = [
        { id: 'local', slug: 'local', name: 'Local News' },
        { id: 'politics', slug: 'politics', name: 'Politics' },
        { id: 'crime', slug: 'crime', name: 'Crime' },
        { id: 'sports', slug: 'sports', name: 'Sports' }
      ];
      setCategories(fallback);
      setSelectedCategory(fallback[0].id);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContent();
      fetchAnalytics();
      fetchPayouts();
    }
  }, [token, activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: 'videos' | 'images' | 'thumbnails') => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingMedia(true);
    setUploadProgressMsg(`Uploading ${file.name} to Cloudflare R2...`);

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const mimeType = file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg');

      const presignRes = await fetch(`${API_BASE}/content/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ folder, mimeType, fileExtension: ext })
      });
      const presignData = await presignRes.json();

      if (!presignData.success) {
        throw new Error(presignData.error || 'Failed to get R2 presigned URL');
      }

      await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: file
      });

      if (folder === 'videos' || folder === 'images') {
        setMediaUrl(presignData.mediaUrl);
      } else {
        setThumbnailUrl(presignData.mediaUrl);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingMedia(false);
      setUploadProgressMsg('');
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

  const availableBal = stats?.availableBalance || 0;
  const isEligibleForPayout = availableBal >= 10.0;
  const payoutProgress = Math.min(100, (availableBal / 10.0) * 100);

  // AUTH SCREEN
  if (!token) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <div className="bg-white border border-orange-100 shadow-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E36138] via-[#F58220] to-[#388E3C]" />

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#E36138] mb-4 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Feed</span>
            </button>
          )}

          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="cursor-pointer hover:opacity-90 transition inline-block"
              title="Go to Home Page"
            >
              <NagrikLogo size="lg" variant="full" />
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {isRegister ? 'Join as a Verified Creator' : 'Creator Studio Sign In'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Publish Hyperlocal News & Monetize Short Video Reports
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#E36138]/20 focus:border-[#E36138] outline-none transition"
                  placeholder="e.g. Rahul Kumar"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#E36138]/20 focus:border-[#E36138] outline-none transition"
                placeholder="creator@naagrik.news"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#E36138]/20 focus:border-[#E36138] outline-none transition"
                placeholder="••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-sm font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
            >
              {authLoading ? 'Verifying...' : isRegister ? 'Register Creator Profile' : 'Access Creator Studio'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
              className="text-xs font-semibold text-[#E36138] hover:text-[#B83E1A] transition"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an author profile? Register Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CREATOR DESK
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Creator Top Sub-Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E36138] to-[#D24E25] text-white flex items-center justify-center font-bold text-sm">
            {authEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{authEmail}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Citizen Journalist
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full">
            <Wallet className="w-4 h-4 text-[#E36138]" />
            <span className="text-xs font-semibold text-slate-600">Balance:</span>
            <span className="text-sm font-black text-[#E36138]">${availableBal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Creator Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'content', label: 'My Submissions', icon: FileText },
          { id: 'create', label: '+ Publish Story', icon: PlusCircle },
          { id: 'analytics', label: 'Monetization Analytics', icon: BarChart3 },
          { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#E36138] to-[#D24E25] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Published Reports</span>
                <FileText className="w-5 h-5 text-[#E36138]" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats?.publishedContent || 0}</div>
              <div className="mt-2 text-xs text-slate-500">
                Pending Approval: <strong>{stats?.pendingContent || 0}</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Monetized Views</span>
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats?.totalEligibleViews || 0}</div>
              <div className="mt-2 text-xs text-emerald-600 font-medium">
                Verified views (Max 3/user ceiling)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
                <DollarSign className="w-5 h-5 text-[#E36138]" />
              </div>
              <div className="text-3xl font-black text-slate-900">${availableBal.toFixed(2)}</div>
              <div className="mt-2">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#E36138] h-full rounded-full"
                    style={{ width: `${payoutProgress}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                  <span>Threshold: $10.00</span>
                  <span className={isEligibleForPayout ? 'text-emerald-600 font-bold' : ''}>
                    {isEligibleForPayout ? 'Eligible for Payout' : `${payoutProgress.toFixed(0)}%`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Lifetime Earnings</span>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">${(stats?.lifetimeEarnings || 0).toFixed(2)}</div>
              <div className="mt-2 text-xs text-slate-500">
                Total Paid Out: <strong>${(stats?.totalPaid || 0).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-slate-900 to-[#74260E] text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Submit a Breaking Video Report</h3>
              <p className="text-xs text-slate-300">
                Direct Cloudflare R2 upload with instant editorial moderation scanning.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition"
            >
              + Publish Story Now
            </button>
          </div>
        </div>
      )}

      {/* MY CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['ALL', 'APPROVED', 'PENDING_REVIEW', 'REJECTED'].map(f => (
              <button
                key={f}
                onClick={() => setContentFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  contentFilter === f
                    ? 'bg-[#E36138] text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filteredContents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              No submissions found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredContents.map(item => (
                <div key={item.id || item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="relative h-40 bg-slate-900">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/80 text-white px-2 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.moderationStatus === 'APPROVED' ? 'bg-emerald-500 text-white' :
                      item.moderationStatus === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {item.moderationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-600">
                      <span>Views: {item.views || 0}</span>
                      <span className="text-emerald-700">Monetized: {item.eligibleViews || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE CONTENT */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
          <h3 className="text-lg font-bold text-slate-900">Publish Local News / Short Video</h3>
          <form onSubmit={handleCreateContent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                placeholder="Headline"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Story Details</label>
              <textarea
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                placeholder="Full report..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  value={cityName}
                  onChange={e => setCityName(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  value={areaName}
                  onChange={e => setAreaName(e.target.value)}
                  placeholder="Locality"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-xl text-center space-y-2">
                <Upload className="w-5 h-5 text-[#E36138] mx-auto" />
                <div className="text-xs font-bold text-slate-800">Media (.mp4 / image)</div>
                <input
                  type="file"
                  onChange={e => handleFileUpload(e, contentType === 'VIDEO' ? 'videos' : 'images')}
                  className="w-full text-xs"
                />
                {mediaUrl && <div className="text-[10px] text-emerald-700">✓ Ready</div>}
              </div>

              <div className="p-4 bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-xl text-center space-y-2">
                <Upload className="w-5 h-5 text-[#E36138] mx-auto" />
                <div className="text-xs font-bold text-slate-800">Thumbnail Image</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, 'thumbnails')}
                  className="w-full text-xs"
                />
                {thumbnailUrl && <div className="text-[10px] text-emerald-700">✓ Ready</div>}
              </div>
            </div>

            {uploadingMedia && (
              <div className="text-xs text-[#E36138] font-bold text-center animate-pulse">
                {uploadProgressMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingContent || uploadingMedia}
              className="w-full bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-bold py-3 rounded-xl shadow-md transition"
            >
              {submittingContent ? 'Submitting...' : 'Submit Story for Verification'}
            </button>
          </form>
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase">Total Views</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{analytics?.totalViews || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 text-center">
              <div className="text-xs font-bold text-emerald-600 uppercase">Eligible Monetized Views</div>
              <div className="text-3xl font-black text-emerald-800 mt-1">{analytics?.totalEligibleViews || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-amber-200 text-center">
              <div className="text-xs font-bold text-amber-600 uppercase">Exceeded Ceiling</div>
              <div className="text-3xl font-black text-amber-800 mt-1">{analytics?.nonEligibleViews || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* WALLET & PAYOUTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Available Earnings</div>
              <div className="text-4xl font-black text-slate-900">${availableBal.toFixed(2)}</div>
              <div className="text-xs text-slate-500 mt-1">Minimum Payout: <strong>$10.00</strong></div>
            </div>
            <button
              onClick={handleRequestPayout}
              disabled={!isEligibleForPayout || payoutLoading}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition ${
                isEligibleForPayout ? 'bg-[#E36138] text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {payoutLoading ? 'Processing...' : isEligibleForPayout ? 'Request Payout ($10+)' : 'Min $10.00 Required'}
            </button>
          </div>

          {/* Payment Method Config */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Add Payment Method</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPayoutType('UPI')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${payoutType === 'UPI' ? 'bg-[#E36138] text-white' : 'bg-slate-100'}`}
              >
                UPI ID
              </button>
              <button
                type="button"
                onClick={() => setPayoutType('BANK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${payoutType === 'BANK' ? 'bg-[#E36138] text-white' : 'bg-slate-100'}`}
              >
                Bank Transfer
              </button>
            </div>

            <form onSubmit={handleAddPayoutMethod} className="space-y-3 max-w-md">
              {payoutType === 'UPI' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">UPI VPA</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Account Holder"
                    value={accHolder}
                    onChange={e => setAccHolder(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    placeholder="Account Number"
                    value={accNumber}
                    onChange={e => setAccNumber(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    placeholder="IFSC Code"
                    value={ifsc}
                    onChange={e => setIfsc(e.target.value)}
                    required
                  />
                </div>
              )}
              <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Save Method
              </button>
            </form>

            {/* Saved Payout Methods List */}
            {payoutMethods.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-700">Saved Payment Methods:</div>
                <div className="space-y-1.5">
                  {payoutMethods.map((m: any, idx: number) => (
                    <div key={m.id || idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{m.type}</span>: {m.type === 'UPI' ? m.details?.upiId : `${m.details?.bankName} (***${m.details?.accountNumber?.slice(-4) || ''})`}
                      </div>
                      {m.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Default</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payout History List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Payout Requests History</h4>
            {payoutRequests.length === 0 ? (
              <div className="text-xs text-slate-400">No payout requests recorded yet.</div>
            ) : (
              <div className="space-y-2">
                {payoutRequests.map((r: any, idx: number) => (
                  <div key={r.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">${r.amount?.toFixed(2) || '0.00'}</div>
                      <div className="text-[10px] text-slate-500">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      r.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
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
    </div>
  );
};
