import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  History,
  LayoutDashboard,
  Megaphone,
  ShieldAlert,
  Sliders,
  Tag
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation' | 'payouts' | 'ads' | 'settings' | 'categories' | 'audit'>('dashboard');

  // Auth State
  const [authEmail, setAuthEmail] = useState('admin@naagrik.news');
  const [authPassword, setAuthPassword] = useState('AdminPass123!');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [modStatusFilter, setModStatusFilter] = useState<'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED'>('PENDING_REVIEW');
  const [modItems, setModItems] = useState<any[]>([]);
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

  // Ads Form
  const [adName, setAdName] = useState('Patna Mega Sale');
  const [adType, setAdType] = useState<'BANNER' | 'VIDEO' | 'SPONSORED'>('BANNER');
  const [adMediaUrl, setAdMediaUrl] = useState('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80');
  const [adFrequency, setAdFrequency] = useState(4);

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
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setMetrics(data.metrics);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModerationQueue = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/moderation/queue?status=${modStatusFilter}&limit=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setModItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewAction = async (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED') => {
    if (!token) return;
    const reason = status === 'REJECTED' ? prompt('Enter rejection reason:') || 'Violates community guidelines' : undefined;

    try {
      const res = await fetch(`${API_BASE}/admin/moderation/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ contentId, status, rejectionReason: reason })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || `Content status updated to ${status}`);
        fetchModerationQueue();
        fetchDashboard();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/payouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPayouts(data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessPayout = async (requestId: string, status: 'PAID' | 'REJECTED') => {
    if (!token) return;
    const utr = status === 'PAID' ? prompt('Enter Bank UTR Reference:') || 'UTR_BANK_2026' : undefined;

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
          transactionReference: utr,
          adminNote: 'Processed via instant IMPS'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || `Payout marked as ${status}`);
        fetchPayouts();
        fetchDashboard();
      } else {
        alert(data.error || 'Failed to process');
      }
    } catch (err: any) {
      alert(err.message);
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

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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
          frequency: adFrequency,
          status: 'ACTIVE'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Ad created!');
        fetchAds();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchSettings = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.settings) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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
      if (data.success) alert('Monetization settings saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  useEffect(() => {
    if (token) {
      fetchDashboard();
      if (activeTab === 'moderation') fetchModerationQueue();
      if (activeTab === 'payouts') fetchPayouts();
      if (activeTab === 'ads') fetchAds();
      if (activeTab === 'settings') fetchSettings();
      if (activeTab === 'categories') fetchCategories();
      if (activeTab === 'audit') fetchAuditLogs();
    }
  }, [token, activeTab, modStatusFilter]);

  // AUTH SCREEN
  if (!token) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
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
            <h2 className="text-lg font-bold text-slate-900">Admin Governance Console</h2>
            <p className="text-xs text-slate-500 mt-1">Editorial moderation and treasury payouts clearance</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Admin Email</label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-xl shadow-md transition"
            >
              {authLoading ? 'Verifying...' : 'Sign In as Admin'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-400">
            Preset: <strong>admin@naagrik.news</strong> / <strong>AdminPass123!</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Admin Top Sub-Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E36138] text-white flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div>
            <div className="text-sm font-bold">Chief Admin Desk</div>
            <div className="text-[11px] text-emerald-400">Full Operational Rights</div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard },
          { id: 'moderation', label: 'Moderation Queue', icon: ShieldAlert },
          { id: 'payouts', label: 'Payout Requests', icon: CreditCard },
          { id: 'ads', label: 'Ads & Campaigns', icon: Megaphone },
          { id: 'settings', label: 'System Settings', icon: Sliders },
          { id: 'categories', label: 'Categories', icon: Tag },
          { id: 'audit', label: 'Audit Trail', icon: History }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition ${
                activeTab === t.id
                  ? 'bg-[#E36138] text-white shadow-md'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Pending Moderation</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{metrics?.pendingModeration || 0}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Pending Payouts</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{metrics?.pendingPayoutsCount || 0}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Active Creators</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{metrics?.activeCreators || 0}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Video Views</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{metrics?.totalViews || 0}</div>
          </div>
        </div>
      )}

      {/* MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {(['PENDING_REVIEW', 'FLAGGED', 'APPROVED', 'REJECTED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setModStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${modStatusFilter === f ? 'bg-[#E36138] text-white' : 'bg-white border border-slate-200'}`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {modItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm">
              No items in {modStatusFilter.replace('_', ' ')} queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modItems.map(item => (
                <div key={item.id || item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleReviewAction(item.id || item._id, 'APPROVED')}
                      className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction(item.id || item._id, 'REJECTED')}
                      className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-xl"
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

      {/* PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 border-b border-slate-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">No payout requests.</td></tr>
              ) : (
                payouts.map(p => (
                  <tr key={p.id || p._id} className="hover:bg-slate-50">
                    <td className="p-3">{new Date(p.requestedAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold font-mono text-slate-900">${p.amount.toFixed(2)}</td>
                    <td className="p-3 font-mono">{p.payoutMethodId?.upiId ? `UPI: ${p.payoutMethodId.upiId}` : 'Bank'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === 'PENDING' && (
                        <button
                          onClick={() => handleProcessPayout(p.id || p._id, 'PAID')}
                          className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADS */}
      {activeTab === 'ads' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleCreateAd} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm">Create Ad Campaign</h4>
            <input
              type="text"
              placeholder="Campaign Name"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              value={adName}
              onChange={e => setAdName(e.target.value)}
              required
            />
            <select
              value={adType}
              onChange={e => setAdType(e.target.value as 'BANNER' | 'VIDEO' | 'SPONSORED')}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="BANNER">Banner</option>
              <option value="VIDEO">Video</option>
              <option value="SPONSORED">Sponsored</option>
            </select>
            <input
              type="text"
              placeholder="Media URL"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              value={adMediaUrl}
              onChange={e => setAdMediaUrl(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Frequency (Every N videos)"
              min={1}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              value={adFrequency}
              onChange={e => setAdFrequency(Number(e.target.value))}
            />
            <button type="submit" className="w-full bg-[#E36138] text-white text-xs font-bold py-2 rounded-xl">
              Publish Ad
            </button>
          </form>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-sm">Active Ads ({ads.length})</h4>
            <div className="grid grid-cols-2 gap-3">
              {ads.map(a => (
                <div key={a.id || a._id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs">{a.name}</div>
                  <img src={a.mediaUrl} alt={a.name} className="w-full h-24 object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 max-w-lg space-y-4">
          <h4 className="font-bold text-sm">Monetization Economics</h4>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Payout ($)</label>
            <input
              type="number"
              className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
              value={settings.minPayoutAmount}
              onChange={e => setSettings({ ...settings, minPayoutAmount: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rate per 1000 views ($)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
              value={settings.earningRatePer1000Views}
              onChange={e => setSettings({ ...settings, earningRatePer1000Views: parseFloat(e.target.value) })}
            />
          </div>
          <button type="submit" className="bg-[#E36138] text-white text-xs font-bold px-4 py-2 rounded-xl">
            Save Settings
          </button>
        </form>
      )}

      {/* CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h4 className="font-bold text-sm">Categories</h4>
          <div className="grid grid-cols-3 gap-2">
            {categories.map(c => (
              <div key={c.id || c.slug} className="p-3 bg-slate-50 rounded-xl font-bold text-xs text-slate-800">
                {c.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h4 className="font-bold text-sm mb-3">Audit Logs</h4>
          <div className="space-y-2 text-xs font-mono">
            {auditLogs.map((l, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded-lg flex justify-between">
                <span>{l.action} on {l.entity}</span>
                <span className="text-slate-400">{new Date(l.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
