import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import {
  Home,
  Menu,
  X,
  FileEdit,
  Smartphone,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Globe,
  Sparkles
} from 'lucide-react';
import { NagrikLogo } from './components/NagrikLogo';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeView } from './views/HomeView';
import { CreatorView } from './views/CreatorView';
import { AdminView } from './views/AdminView';
import { ContactView } from './views/ContactView';
import { TermsView } from './views/TermsView';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentPath = location.pathname;

  // Track scroll for subtle navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically scroll to top on route change (unless hash present)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.search]);

  // Dedicated full-screen layout for Admin Console
  if (currentPath.startsWith('/admin')) {
    return (
      <ProtectedRoute
        allowedRoles={['ADMIN']}
        fallback={<AdminView onBackToHome={() => navigate('/')} />}
      >
        <AdminView onBackToHome={() => navigate('/')} />
      </ProtectedRoute>
    );
  }

  // Dedicated full-screen layout for Creator Studio
  if (currentPath.startsWith('/creator')) {
    return (
      <ProtectedRoute
        allowedRoles={['CREATOR', 'ADMIN']}
        fallback={<CreatorView onBackToHome={() => navigate('/')} />}
      >
        <CreatorView onBackToHome={() => navigate('/')} />
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col selection:bg-[#FED7AA] selection:text-[#74260E] antialiased font-sans">
      
      {/* =================================================================== */}
      {/* 1. TOP EDITORIAL TICKER BAR                                         */}
      {/* =================================================================== */}
      <div className="bg-[#0F172A] text-slate-300 text-[11px] font-medium tracking-wide py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-widest text-[#E15024] text-[10px] bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-500/30 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#E15024] animate-ping" />
              Live Network
            </span>
            <div className="hidden sm:flex items-center gap-2 text-slate-300 text-xs truncate">
              <span className="text-slate-600">•</span>
              <span className="text-white font-medium">100+ Indian Cities Live</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Ground Citizen Journalism & Verified Hyperlocal Reports</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
            <div className="hidden md:inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
              <span className="text-slate-400">Guaranteed CPM:</span>
              <strong className="text-emerald-400 font-bold">$1.50 / 1K</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-slate-400">Disbursal:</span>
              <strong className="text-white font-semibold">Instant UPI & Bank</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. EDITORIAL MASTHEAD NAVIGATION (Glassmorphic Light)               */}
      {/* =================================================================== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav-light py-2.5'
            : 'bg-[#FAFAFC]/90 backdrop-blur-xl border-b border-slate-200/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Editorial Moniker */}
          <Link
            to="/"
            className="flex items-center gap-3 text-left shrink-0 cursor-pointer group"
            title="Nagrik.news Home"
          >
            <NagrikLogo size="md" variant="horizontal" hideSubtitle={true} theme="light" />
            <div className="hidden sm:block pl-3 border-l border-slate-300 text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block leading-tight">
                Citizen Press
              </span>
              <span className="text-[10px] text-[#E15024] font-mono font-bold block">
                $1.50 CPM Network
              </span>
            </div>
          </Link>

          {/* Clean Focused Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                currentPath === '/'
                  ? 'text-[#E15024] font-bold bg-orange-50 border border-orange-200/60 shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </Link>

            <a
              href="/#features"
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              App Capabilities
            </a>

            <a
              href="/#earnings"
              className="px-3.5 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-emerald-50 text-emerald-600 font-bold transition-all duration-200"
            >
              $1.50 CPM Calculator
            </a>

            <a
              href="/#city-radar"
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              City Radar
            </a>

            <a
              href="/#faq"
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              FAQ
            </a>

            <Link
              to="/contact"
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              Bureau Desk
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/#app-download"
              className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 hover:text-slate-900 transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#E15024] mr-1.5" />
              <span>Get Mobile App</span>
            </a>

            <Link
              to="/creator"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E15024] via-[#EA580C] to-[#C83F15] hover:from-[#EA580C] hover:to-[#B0340E] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 lg:hidden cursor-pointer hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-5 space-y-2 shadow-xl animate-in slide-in-from-top-3 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-orange-50 text-[#E15024] border border-orange-200"
            >
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-800 hover:bg-slate-50"
            >
              <span>App Capabilities</span>
            </a>

            <a
              href="/#earnings"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-emerald-700 hover:bg-emerald-50 font-bold"
            >
              <span>$1.50 CPM Calculator</span>
            </a>

            <a
              href="/#city-radar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-800 hover:bg-slate-50"
            >
              <span>City Radar Network</span>
            </a>

            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-stone-800 hover:bg-white hover:border-[#E8E2D5]"
            >
              <span>Frequently Asked Questions</span>
            </a>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-stone-800 hover:bg-white hover:border-[#E8E2D5]"
            >
              <span>Contact Bureau Desk</span>
            </Link>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <Link
                to="/creator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-xl text-xs font-bold bg-[#E15024] text-white block shadow-sm hover:bg-[#C83F15] transition"
              >
                Open Creator Studio Workstation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* 3. DYNAMIC MAIN CONTENT                                             */}
      {/* =================================================================== */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomeView onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)} />}
          />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/terms" element={<TermsView />} />
          <Route path="/privacy" element={<TermsView />} />
          <Route path="/dmca" element={<TermsView />} />
          <Route
            path="/creator"
            element={
              <ProtectedRoute
                allowedRoles={['CREATOR', 'ADMIN']}
                fallback={<CreatorView onBackToHome={() => navigate('/')} />}
              >
                <CreatorView onBackToHome={() => navigate('/')} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* =================================================================== */}
      {/* 4. PREMIUM EDITORIAL NEWSPAPER FOOTER                               */}
      {/* =================================================================== */}
      <footer className="bg-[#0E1015] text-[#E8E2D5] text-xs pt-16 pb-12 border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Brand Statement Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/90">
            <div className="lg:col-span-5 space-y-4">
              <Link to="/" className="inline-block hover:opacity-90 transition">
                <NagrikLogo size="lg" variant="horizontal" theme="dark" hideSubtitle={false} />
              </Link>
              <p className="text-stone-400 text-sm leading-relaxed max-w-md font-serif">
                India's decentralized hyperlocal journalism network. Empowering citizens to report ground reality, preserve freedom of press, and monetize investigative media with transparent $1.50+ CPM revenue sharing.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-stone-400 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[#E15024] font-bold">100+ CITIES</span>
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300">100% IP OWNERSHIP</span>
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-emerald-400">INSTANT UPI</span>
              </div>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">
                  PLATFORM
                </h4>
                <ul className="space-y-3 font-medium text-stone-400">
                  <li>
                    <a href="/#front-page" className="hover:text-white transition">
                      Live Ground Wire
                    </a>
                  </li>
                  <li>
                    <Link to="/creator" className="hover:text-[#E15024] transition font-bold text-stone-300 flex items-center gap-1">
                      <span>Creator Studio</span>
                      <ArrowRight className="w-3 h-3 text-[#E15024]" />
                    </Link>
                  </li>
                  <li>
                    <a href="/#earnings-calculator" className="hover:text-white transition">
                      Publisher Rates ($1.50 CPM)
                    </a>
                  </li>
                  <li>
                    <a href="/#regional-reports" className="hover:text-white transition">
                      City Coverage Radar
                    </a>
                  </li>
                  <li>
                    <a href="/#creator-economy" className="hover:text-white transition">
                      Stringer Economics
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">
                  JOURNALISM & LEGAL
                </h4>
                <ul className="space-y-3 font-medium text-stone-400">
                  <li>
                    <Link to="/terms?tab=terms" className="hover:text-white transition">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-white transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms?tab=creator" className="hover:text-white transition">
                      Creator Charter & IP
                    </Link>
                  </li>
                  <li>
                    <Link to="/dmca" className="hover:text-white transition">
                      DMCA & Copyright
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition">
                      Press & Editorial Bureau
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">
                  MOBILE APPS
                </h4>
                <p className="text-stone-400 text-xs leading-normal">
                  Read hyperlocal news on Android & iOS without paywalls or algorithmic bias.
                </p>
                <div className="space-y-2 pt-1">
                  <a href="#app-showcase" className="block hover:opacity-90 transition">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-9 w-auto"
                    />
                  </a>
                  <a href="#app-showcase" className="block hover:opacity-90 transition">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="h-9 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-[11px] font-sans">
            <div>
              © {new Date().getFullYear()} Nagrik News Media Inc. All rights reserved. Powered by Citizen Stringers across India.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-stone-400">
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Network Operational
              </span>
              <span>•</span>
              <Link to="/terms?tab=privacy" className="hover:text-stone-300 transition">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms?tab=terms" className="hover:text-stone-300 transition">Terms</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-stone-300 transition">Contact Bureau</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
