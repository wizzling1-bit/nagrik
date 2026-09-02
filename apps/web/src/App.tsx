import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import {
  Home,
  Menu,
  X,
  FileEdit
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

  const currentPath = location.pathname;

  // Automatically scroll to top on route or tab/search change
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
    <div className="min-h-screen bg-[#FFFDFB] text-slate-900 flex flex-col selection:bg-orange-100 selection:text-orange-900 antialiased font-sans">
      {/* FLOATING GLASS NAVBAR (Sleek 1-Line Layout in Brand Orange) */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-orange-100/90 rounded-full px-5 py-2.5 shadow-md shadow-orange-950/5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo (Single Line) */}
          <Link
            to="/"
            className="flex items-center gap-2 text-left shrink-0 cursor-pointer hover:opacity-95 transition"
          >
            <NagrikLogo size="sm" variant="horizontal" hideSubtitle={true} theme="light" />
          </Link>

          {/* Navigation Links (Strict Single-Line No-Wrap) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600 whitespace-nowrap">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                currentPath === '/'
                  ? 'text-[#E36138] font-bold bg-orange-50/60'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <a
              href="/#features"
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Features
            </a>

            <a
              href="/#why-nagrik"
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Why Nagrik?
            </a>

            <a
              href="/#rates"
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Publisher Rates
            </a>

            <a
              href="/#payout-methods"
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Payout Methods
            </a>

            <a
              href="/#faq"
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-50 transition"
            >
              FAQ
            </a>

            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                currentPath === '/contact'
                  ? 'text-[#E36138] font-bold bg-orange-50/60'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Action CTA (Direct Creator Studio — No Login/Signup needed) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link
              to="/creator"
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#E36138] hover:bg-[#D24E25] shadow-xs hover:shadow-md transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-slate-100 text-slate-700 lg:hidden cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-slate-900" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 bg-white/98 backdrop-blur-xl border border-orange-100 rounded-3xl space-y-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-w-md mx-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-left bg-orange-50 text-[#E36138]"
            >
              <Home className="w-4 h-4" />
              <span>Home Feed</span>
            </Link>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Features & Tools</span>
            </a>
            <a
              href="/#why-nagrik"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Why Nagrik?</span>
            </a>
            <a
              href="/#rates"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Publisher Rates ($1.50 CPM)</span>
            </a>
            <a
              href="/#payout-methods"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Payout Methods (UPI & Bank)</span>
            </a>
            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Frequently Asked Questions</span>
            </a>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Contact Us</span>
            </Link>
            <a
              href="/#app-download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>Download App</span>
            </a>
            <div className="pt-2">
              <Link
                to="/creator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl text-xs font-bold bg-[#E36138] text-white block shadow-xs"
              >
                Open Creator Studio
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. DYNAMIC CONTENT CONTAINER */}
      <main className="flex-1">
        <Routes>
          {/* Public Home Route */}
          <Route
            path="/"
            element={<HomeView onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)} />}
          />

          {/* Public Contact Us Route */}
          <Route
            path="/contact"
            element={<ContactView />}
          />

          {/* Public Legal & Terms Routes */}
          <Route
            path="/terms"
            element={<TermsView />}
          />
          <Route
            path="/privacy"
            element={<TermsView />}
          />
          <Route
            path="/dmca"
            element={<TermsView />}
          />

          {/* Role Protected: Creator Route */}
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

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. FOOTER (DiskWala Clean Light Theme in Brand Orange) */}
      <footer className="bg-white text-slate-600 text-xs py-14 border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <Link
                to="/"
                className="cursor-pointer text-left hover:opacity-90 transition block"
                title="Go to Home Page"
              >
                <NagrikLogo size="md" variant="horizontal" theme="light" />
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload, share, and monetize your ground journalism content with unlimited cloud storage. Built for citizen reporters and local news consumers.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3.5">
                PLATFORM
              </h4>
              <ul className="space-y-2.5 font-medium text-slate-600">
                <li>
                  <Link
                    to="/creator"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                    className="hover:text-[#E36138] transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="/#features" className="hover:text-[#E36138] transition">
                    Download App
                  </a>
                </li>
                <li>
                  <a href="/#rates" className="hover:text-[#E36138] transition">
                    Publisher Rates
                  </a>
                </li>
                <li>
                  <a href="/#payout-methods" className="hover:text-[#E36138] transition">
                    Payout Records
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3.5">
                RESOURCES
              </h4>
              <ul className="space-y-2.5 font-medium text-slate-600">
                <li>
                  <a href="/#features" className="hover:text-[#E36138] transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/#why-nagrik" className="hover:text-[#E36138] transition">
                    Why Nagrik?
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="hover:text-[#E36138] transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                    className="hover:text-[#E36138] transition"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3.5">
                GET THE APP
              </h4>
              <div className="space-y-2">
                <a href="#" className="block hover:opacity-90 transition">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-10 w-auto"
                  />
                </a>
                <a href="#" className="block hover:opacity-90 transition">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© {new Date().getFullYear()} Nagrik. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link
                to="/terms?tab=privacy"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className="hover:text-slate-900 transition"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/terms?tab=terms"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className="hover:text-slate-900 transition"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                to="/terms?tab=creator"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className="hover:text-slate-900 transition"
              >
                Creator Agreement
              </Link>
              <span>•</span>
              <Link
                to="/terms?tab=dmca"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className="hover:text-slate-900 transition"
              >
                DMCA
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
