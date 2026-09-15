import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@/utils/navCompat';
import {
  BarChart3,
  Upload,
  FileText,
  Layers,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Compass,
  Globe,
  LogOut,
  X
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { CreatorAuth } from './CreatorAuth';
import { CreatorAnalyticsTab } from './CreatorAnalyticsTab';
import { CreatorUploadTab } from './CreatorUploadTab';
import { CreatorFilesTab } from './CreatorFilesTab';
import { CreatorPlaylistsTab } from './CreatorPlaylistsTab';
import { CreatorBrandingTab } from './CreatorBrandingTab';
import { CreatorBillingTab } from './CreatorBillingTab';
import { CreatorAgreementTab } from './CreatorAgreementTab';
import { CreatorStats, CreatorTab } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface CreatorLayoutProps {
  onBackToHome?: () => void;
}

export const CreatorLayout: React.FC<CreatorLayoutProps> = ({ onBackToHome }) => {
  const { token, user, logout: handleSignOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract active tab from URL path (e.g. /creator/upload -> 'upload')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] || 'analytics';

  const validCreatorTabs = ['analytics', 'upload', 'files', 'playlists', 'branding', 'billing', 'agreement'] as const;

  const activeTabNav: CreatorTab = validCreatorTabs.includes(subRoute as CreatorTab)
    ? (subRoute as CreatorTab)
    : 'analytics';

  const setActiveTabNav = (tab: CreatorTab) => {
    navigate(`/creator/${tab}`);
  };

  // Creator Data State
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  // Tour State
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const authEmail = user?.email || '';
  const authName = user?.name || '';

  const tourSteps = [
    {
      title: 'Welcome to Nagrik Creator Studio!',
      description: 'Your command center for publishing ground reports, tracking verified views, and receiving instant UPI payouts at $1.50 CPM.',
      badge: 'Welcome',
      targetTab: 'analytics' as const
    },
    {
      title: 'Ground News & Video Publishing Studio',
      description: 'Upload video stories or ground articles with pinpoint geo-tagging (State, City/District, and Local Area) to deliver verified civic coverage.',
      badge: 'Publishing Studio',
      targetTab: 'upload' as const
    },
    {
      title: 'File Manager & Public Share Links',
      description: 'Inspect editorial review statuses, copy instant 1-click share links for WhatsApp/Telegram, and manage your entire investigative catalog.',
      badge: 'Content Library',
      targetTab: 'files' as const
    },
    {
      title: 'Instant Disbursals via NPCI UPI & Bank',
      description: 'Payouts above $10.00 USD are automatically converted to INR and credited to your verified UPI ID (GPay/PhonePe) or Bank account within 24 hours.',
      badge: 'Disbursals',
      targetTab: 'billing' as const
    },
    {
      title: 'Your Public Channel & Brand Hub',
      description: 'Customize your reporter bio, avatar, and social handles. Share your creator profile URL to grow your direct hyperlocal audience.',
      badge: 'Creator Brand',
      targetTab: 'branding' as const
    }
  ];

  const fetchDashboard = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setContents(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/payout-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayoutRequests(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContents();
      fetchPayouts();
    }
  }, [token]);

  const handleCompleteTour = () => {
    setShowTourModal(false);
  };

  // If Not Authenticated as Creator
  if (!token) {
    return <CreatorAuth apiBase={API_BASE} onBackToHome={onBackToHome} />;
  }

  const availRev = stats?.availableBalance ?? 0.00;

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex overflow-hidden antialiased font-sans selection:bg-brand-500 selection:text-white">
      {/* 1. SOFT CASHMERE-SAND MODERN SIDEBAR */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 shadow-xs`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Collapse Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 min-h-[64px]">
            <div className="flex items-center overflow-hidden">
              <NagrikLogo size={sidebarCollapsed ? 'sm' : 'md'} variant={sidebarCollapsed ? 'icon' : 'horizontal'} hideSubtitle />
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer text-xs shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Creator Profile Card */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-brand-500/20">
                  {authName ? authName.charAt(0).toUpperCase() : 'C'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {authName || 'Citizen Reporter'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{authEmail}</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-5 flex-1">
            {/* CONTENT Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Content
                </div>
              )}
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'upload', label: 'Upload Files', icon: Upload, highlight: true },
                { id: 'files', label: 'File Manager', icon: FileText, count: contents.length },
                { id: 'playlists', label: 'Playlists', icon: Layers, count: playlists.length }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTabNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {!sidebarCollapsed && item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ACCOUNT Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Account & Help
                </div>
              )}
              {[
                { id: 'branding', label: 'Branding', icon: Sparkles },
                { id: 'billing', label: 'Billing', icon: CreditCard },
                { id: 'agreement', label: 'Creator Agreement', icon: ShieldCheck }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTabNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}

              {/* Take a Tour Action Button */}
              <button
                onClick={() => {
                  setTourStep(0);
                  setShowTourModal(true);
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/20 cursor-pointer shadow-xs mt-2"
                title="Take a Guided Tour"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '8s' }} />
                  {!sidebarCollapsed && <span>Take a Tour</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[9px] font-extrabold bg-brand-500 text-white px-1.5 py-0.5 rounded-full font-mono">
                    GUIDE
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 bg-slate-50 dark:bg-slate-900/50">
            <button
              onClick={onBackToHome}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition flex items-center gap-3 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-xs"
              title="Live News Feed"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              {!sidebarCollapsed && <span>Live Feed</span>}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-3 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 h-screen flex flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0B0F17]">
        {/* Top Studio Header */}
        <header className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
              {activeTabNav === 'analytics'
                ? 'Analytics & Earnings'
                : activeTabNav === 'upload'
                ? 'Upload Files & Ground Reports'
                : activeTabNav === 'files'
                ? 'File Manager'
                : activeTabNav === 'playlists'
                ? 'Playlists & Series'
                : activeTabNav === 'branding'
                ? 'Brand Details'
                : activeTabNav === 'billing'
                ? 'Billing & Disbursals'
                : 'Creator Agreement'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTourStep(0);
                setShowTourModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-brand-500" />
              <span>Take a Tour</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Balance:</span>
              <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono">${availRev.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setActiveTabNav('upload')}
              className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand-500/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Files</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
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
        <footer className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium shadow-xs">
          <div>© {new Date().getFullYear()} Nagrik Studio • Hyperlocal Citizen Journalism Network</div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Earning Rate: $1.50 / 1K Verified Reads</span>
            </span>
          </div>
        </footer>
      </div>

      {/* 3. STEP-BY-STEP GUIDED ONBOARDING TOUR MODAL */}
      {showTourModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center font-mono">
                  {tourStep + 1}
                </span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                  {tourSteps[tourStep].badge}
                </span>
              </div>
              <button
                onClick={handleCompleteTour}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>Skip Tour</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">{tourSteps[tourStep].title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {tourSteps[tourStep].description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === tourStep
                      ? 'w-8 bg-brand-500'
                      : idx < tourStep
                      ? 'w-3 bg-brand-400'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => {
                  const prev = Math.max(0, tourStep - 1);
                  setTourStep(prev);
                  setActiveTabNav(tourSteps[prev].targetTab);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  tourStep === 0
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Previous
              </button>

              {tourStep < tourSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(tourSteps.length - 1, tourStep + 1);
                    setTourStep(next);
                    setActiveTabNav(tourSteps[next].targetTab);
                  }}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Next Step ›
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteTour}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>Finish Tour & Start Reporting</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
