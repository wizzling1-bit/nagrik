'use client';

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
  DollarSign,
  ShieldCheck,
  Award
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface CreatorAuthProps {
  apiBase: string;
  onBackToHome?: () => void;
}

export const CreatorAuth: React.FC<CreatorAuthProps> = ({ apiBase, onBackToHome }) => {
  const { login } = useAuth();
  const { language } = useLanguage();
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
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans relative overflow-hidden transition-colors duration-200">
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* LEFT COLUMN: AUTH FORM (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                className="group flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                title="Back to Home Feed"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-600 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 flex items-center justify-center transition shadow-xs">
                  <ArrowLeft className="w-4 h-4 transition group-hover:-translate-x-0.5" />
                </div>
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'मुख्य पृष्ठ' : 'Back to Home'}
                </span>
              </button>
            ) : (
              <div />
            )}

            {/* Segmented Mode Switcher */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setAuthError(''); }}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                  !isRegister
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'लॉग इन' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setAuthError(''); }}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                  isRegister
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'नया खाता' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
              {isRegister
                ? (language === 'hi' ? 'प्रकाशक खाता बनाएं' : 'Create Publisher Account')
                : (language === 'hi' ? 'स्टूडियो में आपका स्वागत है' : 'Welcome Back')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRegister
                ? (language === 'hi'
                    ? 'नागरिक के हाइपरलोकल नेटवर्क से जुड़ें एवं $1.50 सीपीएम दर से अपने पहले व्यू से सीधे यूपीआई में कमाई करें।'
                    : 'Join our hyperlocal citizen journalism network & monetize views at $1.50 CPM with instant UPI payouts.')
                : (language === 'hi'
                    ? 'अपने क्रिएटर वर्कस्टेशन में प्रवेश करें, रीयल-टाइम एनालिटिक्स देखें और भुगतान प्राप्त करें।'
                    : 'Enter your credentials to access your Creator Studio, track real-time analytics & request payouts.')}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-medium">{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3.5 text-left">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition shadow-xs">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
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
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition shadow-xs">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="email"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
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
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setAuthError('Password recovery is enabled. Please contact support@nagrik.news or use Demo Account.')}
                    className="text-[11px] text-slate-500 hover:text-brand-500 font-bold transition cursor-pointer"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </button>
                )}
              </div>

              <div className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition shadow-xs">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  placeholder={isRegister ? 'Min 8 chars, 1 number, 1 uppercase' : '••••••••'}
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer transition"
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
                    <span className="text-slate-500 dark:text-slate-400">Password Strength</span>
                    <span className={
                      strengthScore === 3 ? "text-emerald-600 dark:text-emerald-400" :
                      strengthScore === 2 ? "text-amber-600 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"
                    }>
                      {strengthScore === 3 ? "Strong" : strengthScore === 2 ? "Moderate" : "Weak"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-colors ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-rose-500' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200 dark:bg-slate-800'}`} />
                    <div className={`rounded-full transition-colors ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200 dark:bg-slate-800'}`} />
                    <div className={`rounded-full transition-colors ${strengthScore === 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasMinLen ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasMinLen ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} 8+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasNumber ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Number / symbol
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
                    hasUpperLower ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasUpperLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Uppercase & lowercase
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'hi' ? 'तत्काल यूपीआई निकासी सक्रिय' : 'Instant UPI disbursal ready'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('creator1@nagrik.news');
                    setAuthPassword('CreatorPass123!');
                  }}
                  className="text-xs text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 font-bold transition cursor-pointer flex items-center gap-1"
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying...'}</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isRegister
                        ? (language === 'hi' ? 'साइन अप पूरा करें' : 'Complete Sign Up')
                        : (language === 'hi' ? 'स्टूडियो में प्रवेश करें' : 'Enter Creator Studio')}
                    </span>
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <a href="/terms?tab=terms" className="hover:text-slate-600 dark:hover:text-slate-200 transition">Terms</a>
              <span>•</span>
              <a href="/terms?tab=privacy" className="hover:text-slate-600 dark:hover:text-slate-200 transition">Privacy</a>
              <span>•</span>
              <a href="/contact" className="hover:text-slate-600 dark:hover:text-slate-200 transition">Support</a>
            </div>
            <div className="text-[11px]">
              Nagrik © {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND SHOWCASE (5 Cols) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-brand-500 via-brand-600 to-amber-700 p-8 sm:p-10 flex flex-col justify-between overflow-hidden hidden lg:flex text-white">
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

          <div className="relative z-10 space-y-4 my-auto text-left">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-900 dark:text-white rounded-3xl p-5 shadow-2xl border border-white/80 dark:border-slate-800 space-y-3 transform hover:-translate-y-1 transition duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'सत्यापित व्यूज' : 'Total Verified Views'}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  Hyperlocal Live
                </span>
              </div>

              <div className="text-3xl font-black font-serif tracking-tight">
                100% Monetized
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Publisher Rate</span>
                  <span className="text-brand-600 dark:text-brand-400 font-mono">$1.50 CPM</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Disbursal Window</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Instant UPI</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs leading-relaxed">
              <div className="font-black text-sm mb-1 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? 'हर वास्तविक व्यू पर कमाई' : 'Earn on Every Real View'}</span>
              </div>
              {language === 'hi'
                ? 'अपने वार्ड और शहर की घटनाओं, विकास कार्यों और जनमुद्दों को कवर करें और सीधा बैंक भुगतान पाएं।'
                : 'Cover ground events, municipal matters, civic developments, and get compensated directly into your bank account.'}
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/80 text-center">
            {language === 'hi'
              ? 'स्वतंत्र नागरिक पत्रकारिता — बिहार एवं हाइपरलोकल समुदाय के लिए'
              : 'Independent Citizen Journalism for Hyperlocal Communities'}
          </div>
        </div>
      </div>
    </div>
  );
};
