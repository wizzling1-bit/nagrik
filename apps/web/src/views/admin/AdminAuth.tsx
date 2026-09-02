import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';

interface AdminAuthProps {
  apiBase: string;
  onBackToHome?: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ apiBase, onBackToHome }) => {
  const { login } = useAuth();
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${apiBase}/auth/login`, {
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

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col justify-center items-center p-4 text-stone-900 selection:bg-orange-100 selection:text-orange-900 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <NagrikLogo size="md" variant="horizontal" theme="light" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#D24E25] text-xs font-bold uppercase tracking-wider mt-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E36138]" />
            <span>Admin Operations Gateway</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">Admin Command Center</h2>
          <p className="text-xs text-stone-500">
            Enter authorized administrator credentials to manage platform, moderation, and payouts.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@nagrik.news"
              className="w-full px-4 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] transition shadow-2xs"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] transition shadow-2xs"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-[#E36138] to-[#EA580C] hover:from-[#D24E25] hover:to-[#C2410C] text-white text-xs font-black py-3 rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {authLoading ? 'Verifying...' : 'Access Admin Command Center'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#E3E0D4] text-center">
          <button
            onClick={onBackToHome}
            className="text-xs text-stone-500 hover:text-stone-900 transition flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
