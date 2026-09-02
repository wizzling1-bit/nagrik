import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Check,
  Zap,
  DollarSign
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';

interface CreatorAuthProps {
  apiBase: string;
  onBackToHome?: () => void;
}

export const CreatorAuth: React.FC<CreatorAuthProps> = ({ apiBase, onBackToHome }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const isEmailValid = authEmail.length > 3 && authEmail.includes('@') && authEmail.includes('.');
  const isNameValid = authName.trim().length >= 2;
  const hasMinLen = authPassword.length >= 8;
  const hasNumber = /\d/.test(authPassword);
  const hasUpperLower = /[a-z]/.test(authPassword) && /[A-Z]/.test(authPassword);
  const strengthScore = (hasMinLen ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUpperLower ? 1 : 0);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const bodyPayload = isRegister
        ? { email: authEmail, password: authPassword, name: authName, role: 'CREATOR' }
        : { email: authEmail, password: authPassword };

      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-stone-900 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
      {/* Ambient background blur glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-[#FAF9F5] rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(28,25,23,0.08)] border border-[#E3E0D4] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* LEFT COLUMN: AUTH FORM (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                className="group flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
                title="Back to Home Feed"
              >
                <div className="w-8 h-8 rounded-full border border-[#DBD7C9] group-hover:border-stone-400 group-hover:bg-[#EFECE6] flex items-center justify-center transition shadow-xs">
                  <ArrowLeft className="w-4 h-4 transition group-hover:-translate-x-0.5" />
                </div>
                <span className="hidden sm:inline">Back to Feed</span>
              </button>
            ) : (
              <div />
            )}

            {/* Segmented Mode Switcher */}
            <div className="bg-[#EFECE6] p-1 rounded-full flex items-center text-xs font-bold border border-[#DBD7C9]">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setAuthError(''); }}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                  !isRegister
                    ? 'bg-[#FAF9F5] text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setAuthError(''); }}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                  isRegister
                    ? 'bg-[#E36138] text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {isRegister
                ? 'Join our hyper-local citizen journalism network & monetize views at $1.50 CPM with instant payouts.'
                : 'Enter your credentials to access your Creator Studio, track real-time analytics & request payouts.'}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium">{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3.5 text-left">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Full Name</label>
                <div className="relative bg-[#EFECE6]/90 border border-[#DBD7C9] rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-[#E36138] focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:bg-[#FAF9F5] transition-all shadow-xs">
                  <User className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    placeholder="e.g. Rahul Kumar"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    required
                  />
                  {isNameValid && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 animate-in zoom-in-50" />
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Email Address</label>
              <div className="relative bg-[#EFECE6]/90 border border-[#DBD7C9] rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-[#E36138] focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:bg-[#FAF9F5] transition-all shadow-xs">
                <Mail className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
                <input
                  type="email"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  placeholder="creator@nagrik.news"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                />
                {isEmailValid && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 animate-in zoom-in-50" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setAuthError('Password recovery is enabled. Please contact support@nagrik.news or use Demo Login.')}
                    className="text-[11px] text-stone-500 hover:text-[#E36138] font-bold transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative bg-[#EFECE6]/90 border border-[#DBD7C9] rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-[#E36138] focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:bg-[#FAF9F5] transition-all shadow-xs">
                <Lock className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  placeholder={isRegister ? 'Min 8 chars, 1 number, 1 uppercase' : '••••••••'}
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister ? (
              <div className="pt-1.5 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Password Strength</span>
                    <span className={
                      strengthScore === 3 ? "text-emerald-600" :
                      strengthScore === 2 ? "text-amber-600" : "text-rose-500"
                    }>
                      {strengthScore === 3 ? "Strong" : strengthScore === 2 ? "Moderate" : "Weak"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-colors ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-rose-500' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                    <div className={`rounded-full transition-colors ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                    <div className={`rounded-full transition-colors ${strengthScore === 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasMinLen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {hasMinLen ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} 8+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasNumber ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Number / symbol
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasUpperLower ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {hasUpperLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Uppercase & lowercase
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant UPI disbursal ready</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('creator1@nagrik.news');
                    setAuthPassword('CreatorPass123!');
                  }}
                  className="text-xs text-slate-500 hover:text-[#E36138] font-bold transition cursor-pointer flex items-center gap-1"
                  title="Fill test credentials"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo Account</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E36138] via-[#EA580C] to-[#F97316] hover:from-[#d55229] hover:to-[#ea580c] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <>
                    <span>{isRegister ? 'Complete Sign Up' : 'Enter Creator Studio'}</span>
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <a href="/terms" className="hover:text-slate-600 transition">Terms</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-slate-600 transition">Privacy</a>
              <span>•</span>
              <a href="/contact" className="hover:text-slate-600 transition">Support</a>
            </div>
            <div className="text-[11px]">
              Nagrik © {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND SHOWCASE (5 Cols) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#E36138] via-[#EA580C] to-[#C2410C] p-8 sm:p-10 flex flex-col justify-between overflow-hidden hidden lg:flex text-white">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <NagrikLogo size="md" variant="icon" />
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE $1.50 CPM</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4 my-auto">
            <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-5 shadow-2xl border border-white/80 space-y-3 transform hover:-translate-y-1 transition duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Verified Views</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Hyperlocal Live
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 tracking-tight">
                100% Monetized
              </div>

              <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-[#E3E0D4] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Publisher Rate</span>
                  <span className="text-[#E36138]">$1.50 CPM</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Disbursal Window</span>
                  <span className="text-emerald-700">Instant UPI</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs leading-relaxed">
              <div className="font-black text-sm mb-1 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-300" />
                <span>Earn on Every Real View</span>
              </div>
              Cover ground events, municipal matters, civic developments, and get compensated directly into your bank account.
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/80 text-center">
            Independent Citizen Journalism for Bihar & Hyperlocal Communities
          </div>
        </div>
      </div>
    </div>
  );
};
