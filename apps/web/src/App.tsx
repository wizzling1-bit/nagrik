import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import {
  Home,
  FileEdit,
  Radio,
  Menu,
  X,
  Smartphone,
  Sparkles,
  UserCheck,
  LogOut
} from 'lucide-react';
import { NagrikLogo } from './components/NagrikLogo';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { HomeView } from './views/HomeView';
import { CreatorView } from './views/CreatorView';
import { AdminView } from './views/AdminView';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#FED7AA] selection:text-[#74260E]">
      {/* 1. TOP BREAKING NEWS TICKER */}
      <div className="bg-slate-950 text-white text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
            <span className="bg-[#E36138] text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
              <Radio className="w-3 h-3" />
              <span>ताज़ा खबर</span>
            </span>
            <span className="text-slate-300 text-xs truncate font-medium">
              पटना, मुजफ्फरपुर और गया में नागरिक रिपोर्टर नेटवर्क का विस्तार • स्थानीय खबरों पर सीधे पैसे कमाएं
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] font-bold text-slate-300">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  <UserCheck className="w-3 h-3" />
                  <span>{user.email} ({role})</span>
                </span>
                <button
                  onClick={logout}
                  className="hover:text-red-400 text-slate-400 transition flex items-center gap-0.5 cursor-pointer"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-3 h-3" />
                  <span>साइन आउट</span>
                </button>
              </div>
            ) : (
              <span className="flex items-center gap-1 text-[#FED7AA]">
                <Sparkles className="w-3 h-3 text-[#FB923C]" />
                <span>सत्य, निष्पक्ष व स्वतंत्र स्थानीय पत्रकारिता</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-left shrink-0 cursor-pointer hover:opacity-95 transition"
          >
            <NagrikLogo size="md" variant="horizontal" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentPath === '/'
                  ? 'bg-slate-100 text-[#E36138]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>मुख्य पृष्ठ (Home)</span>
            </Link>

            <Link
              to="/creator"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentPath === '/creator'
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'bg-orange-50 text-[#E36138] hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>नागरिक रिपोर्टर बनें (कमाई करें)</span>
            </Link>

            <a
              href="/#app-download"
              onClick={(e) => {
                if (currentPath !== '/') {
                  e.preventDefault();
                  navigate('/#app-download');
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#E36138]" />
              <span>ऐप डाउनलोड करें</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 p-3 bg-white space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-left ${
                currentPath === '/' ? 'bg-[#E36138] text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>मुख्य पृष्ठ (Home Feed)</span>
            </Link>
            <Link
              to="/creator"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-left ${
                currentPath === '/creator' ? 'bg-[#E36138] text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>नागरिक रिपोर्टर बनें (Creator Studio)</span>
            </Link>
            <a
              href="/#app-download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-left bg-slate-50 text-slate-700"
            >
              <Smartphone className="w-4 h-4 text-[#E36138]" />
              <span>मोबाइल ऐप डाउनलोड करें</span>
            </a>
          </div>
        )}
      </header>

      {/* 3. DYNAMIC PROTECTED ROUTE CONTAINER */}
      <main className="flex-1">
        <Routes>
          {/* Public Home Route */}
          <Route
            path="/"
            element={<HomeView onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)} />}
          />

          {/* Role Protected: Creator Route (CREATOR & ADMIN roles allowed) */}
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

      {/* 4. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Link
                to="/"
                className="cursor-pointer text-left hover:opacity-90 transition block"
                title="Go to Home Page"
              >
                <NagrikLogo size="md" variant="horizontal" theme="dark" />
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                भारत का अग्रणी हाइपरलोकल डिजिटल समाचार और नागरिक पत्रकारिता मंच। अपने क्षेत्र की समस्याओं और सच्ची खबरों को सीधे दुनिया तक पहुंचाएं।
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">
                मुख्य अनुभाग (Sections)
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    ताज़ा ख़बरें (Public Feed)
                  </Link>
                </li>
                <li>
                  <Link to="/creator" className="hover:text-white transition">
                    रिपोर्टर स्टूडियो व कमाई (Creator Studio)
                  </Link>
                </li>
                <li>
                  <a href="/#app-download" className="hover:text-white transition">
                    मोबाइल ऐप (Android & iOS)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">
                नागरिक रिपोर्टर प्रोत्साहन (Creator Rewards)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                अपने वार्ड व शहर की सत्यापित वीडियो खबरें अपलोड करें और हर 1,000 व्यूज़ पर $1.50 तक की कमाई प्राप्त करें। $10.00 होते ही सीधा बैंक या UPI में भुगतान।
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© 2026 Naagrik News. सर्वाधिकार सुरक्षित।</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>सत्यमेव जयते • जन-जन की आवाज़</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
