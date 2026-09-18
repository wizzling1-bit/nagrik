'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  Radio,
  MapPin,
  TrendingUp,
  CreditCard,
  Layers,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from '../../utils/navCompat';

interface CreatorAuthProps {
  apiBase?: string;
  initialMode?: 'signin' | 'signup';
  redirectUrl?: string;
  onBackToHome?: () => void;
}

export const CreatorAuth: React.FC<CreatorAuthProps> = ({
  apiBase: propsApiBase,
  initialMode = 'signin',
  redirectUrl = '/creator',
  onBackToHome
}) => {
  const apiBase = propsApiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  const { login } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Authentication Mode: Sign In (false) or Sign Up (true)
  const [isRegister, setIsRegister] = useState(initialMode === 'signup');

  // Synchronize with initialMode changes
  useEffect(() => {
    setIsRegister(initialMode === 'signup');
  }, [initialMode]);

  // Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Interaction & Async States
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [demoFilled, setDemoFilled] = useState(false);
  const [demoRole, setDemoRole] = useState<'creator' | 'admin' | null>(null);

  // Validation Rules
  const isEmailValid = authEmail.length > 3 && authEmail.includes('@') && authEmail.includes('.');
  const isNameValid = authName.trim().length >= 2;
  const hasMinLen = authPassword.length >= 8;
  const hasNumber = /\d/.test(authPassword);
  const hasUpperLower = /[a-z]/.test(authPassword) && /[A-Z]/.test(authPassword);
  const strengthScore = (hasMinLen ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUpperLower ? 1 : 0);

  // Reset errors when switching mode & update browser URL if on dedicated page
  const handleModeSwitch = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setAuthError('');
    setAuthSuccess(false);

    if (typeof window !== 'undefined') {
      const targetPath = registerMode ? '/signup' : '/signin';
      if (window.location.pathname === '/signin' || window.location.pathname === '/signup') {
        window.history.replaceState(null, '', targetPath);
      }
    }
  };

  // Quick 1-Click Demo Credentials
  const handleFillDemo = (type: 'creator' | 'admin' = 'creator') => {
    if (type === 'admin') {
      setAuthEmail('admin@nagrik.news');
      setAuthPassword('AdminPass123!');
      setDemoRole('admin');
    } else {
      setAuthEmail('creator1@nagrik.news');
      setAuthPassword('CreatorPass123!');
      setDemoRole('creator');
    }
    setDemoFilled(true);
    setAuthError('');
    setTimeout(() => {
      setDemoFilled(false);
      setDemoRole(null);
    }, 2200);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (isRegister && !agreeTerms) {
      setAuthError(language === 'hi' ? 'कृपया जारी रखने के लिए नियमों और शर्तों को स्वीकार करें।' : 'Please accept the Contributor Guidelines & Terms to proceed.');
      setAuthLoading(false);
      return;
    }

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
        throw new Error(data.error || (language === 'hi' ? 'प्रमाणीकरण विफल रहा। कृपया अपनी साख जांचें।' : 'Authentication failed. Please check your email and password.'));
      }

      setAuthSuccess(true);

      // Brief cinematic success pause before routing
      setTimeout(() => {
        login(data.token, data.user);
        if (data.user?.role === 'ADMIN') {
          navigate(redirectUrl && redirectUrl.startsWith('/admin') ? redirectUrl : '/admin');
        } else {
          navigate(redirectUrl && !redirectUrl.startsWith('/admin') ? redirectUrl : '/creator');
        }
      }, 700);

    } catch (err: any) {
      setAuthError(err.message || 'Unable to connect to Nagrik authentication service.');
      setAuthSuccess(false);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#070A12] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans relative overflow-hidden transition-colors duration-300 selection:bg-[#DE5227] selection:text-white">
      
      {/* ── AMBIENT ATMOSPHERIC BACKGROUND (SLOW, CINEMATIC, GPU-FRIENDLY) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Soft Warm Radial Illumination */}
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] bg-gradient-to-tr from-[#DE5227]/12 via-[#F5EAE0]/25 to-transparent rounded-full blur-3xl dark:from-[#DE5227]/15 dark:via-slate-900/10 transition-opacity duration-1000" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-tl from-[#DE5227]/10 via-[#EADBCC]/20 to-transparent rounded-full blur-3xl dark:from-slate-900/40 dark:via-orange-950/15" />
        
        {/* Subtle Topographical Elevation Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.03] text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.75" />
              <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* ── MAIN AUTHENTICATION CONTAINER (SPLIT-SCREEN HERO) ── */}
      <div className="w-full max-w-5xl bg-[#FAF8F5] dark:bg-[#101726] rounded-3xl sm:rounded-[2.5rem] shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-stone-200/90 dark:border-slate-800/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px] relative z-10 transition-all duration-300">
        
        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN: INTERACTIVE AUTHENTICATION FORM (7 Cols Desktop)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          
          {/* ── Top Bar: Home Link, Theme Toggle, Language & Continuous Mode Switcher ── */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="group flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
                  title="Back to Public Home Feed"
                >
                  <div className="w-8 h-8 rounded-full border border-stone-200 dark:border-slate-700 group-hover:border-stone-400 dark:group-hover:border-slate-500 group-hover:bg-stone-100 dark:group-hover:bg-slate-800 flex items-center justify-center transition shadow-2xs">
                    <ArrowLeft className="w-3.5 h-3.5 transition group-hover:-translate-x-0.5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <span className="hidden sm:inline font-serif font-semibold">
                    {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
                  </span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full border border-stone-200 dark:border-slate-700 hover:border-[#DE5227]/50 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center justify-center transition shadow-2xs text-slate-700 dark:text-slate-300 cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-200" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-600 animate-in spin-in-180 duration-200" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-2.5 py-1 rounded-full border border-stone-200 dark:border-slate-700 hover:border-[#DE5227]/50 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1 transition shadow-2xs text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Change language / भाषा बदलें"
              >
                <Globe className="w-3 h-3 text-slate-500" />
                <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
              </button>
            </div>

            {/* Continuous Segmented Sliding Mode Switcher */}
            <div className="bg-stone-200/70 dark:bg-slate-900/80 p-1 rounded-full flex items-center text-xs font-bold border border-stone-300/80 dark:border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => handleModeSwitch(false)}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-serif ${
                  !isRegister
                    ? 'bg-[#FAF8F5] dark:bg-[#162032] text-slate-950 dark:text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'लॉग इन' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch(true)}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-serif ${
                  isRegister
                    ? 'bg-[#DE5227] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'साइन अप' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* ── Form Header & Editorial Headline ── */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE5227]/10 text-[#DE5227] dark:text-orange-400 text-[10px] font-mono font-bold tracking-wider uppercase border border-[#DE5227]/20">
              <ShieldCheck className="w-3 h-3" />
              <span>{isRegister ? 'JOIN NAGRIK CIVIC NETWORK' : 'NAGRIK UNIFIED GATEWAY'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 dark:text-white tracking-tight leading-tight">
              {isRegister
                ? (language === 'hi' ? 'प्रकाशक खाता बनाएं' : 'Create Publisher Account')
                : (language === 'hi' ? 'नागरिक में आपका स्वागत है' : 'Welcome to Nagrik')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-md">
              {isRegister
                ? (language === 'hi'
                    ? 'नागरिक के हाइपरलोकल नेटवर्क से जुड़ें एवं $1.00 सीपीएम (~₹86) दर से सत्यापित व्यूज पर सीधे यूपीआई में कमाई करें।'
                    : 'Join our verified hyperlocal journalism network. Monetize reads at flat $1.00 CPM (~₹86) with direct UPI disbursals.')
                : (language === 'hi'
                    ? 'अपने क्रिएटर स्टूडियो या एडमिन कमांड सेंटर में प्रवेश करने के लिए अपनी साख दर्ज करें।'
                    : 'Enter your credentials to access your Publisher Studio, Admin Command Center, or Citizen Account.')}
            </p>
          </div>

          {/* ── Error Banner ── */}
          {authError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150 text-left shadow-2xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-medium">{authError}</span>
            </div>
          )}

          {/* ── Success Banner ── */}
          {authSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150 text-left shadow-2xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <span className="font-bold">
                {language === 'hi' ? 'प्रमाणीकरण सफल! रीडायरेक्ट किया जा रहा है...' : 'Access granted! Authenticating session...'}
              </span>
            </div>
          )}

          {/* ── Interactive Auth Form ── */}
          <form onSubmit={handleAuth} className="space-y-4 text-left">
            
            {/* Full Name Field (Sign Up Only) */}
            {isRegister && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'} <span className="text-[#DE5227]">*</span>
                </label>
                <div className="relative bg-white dark:bg-[#0B0F17] border border-stone-200/90 dark:border-slate-800 rounded-2xl px-3.5 py-3 flex items-center focus-within:border-[#DE5227] focus-within:ring-2 focus-within:ring-[#DE5227]/20 transition shadow-2xs">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    required={isRegister}
                  />
                  {isNameValid && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 animate-in zoom-in-50" />
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                {language === 'hi' ? 'ईमेल पता' : 'Email Address'} <span className="text-[#DE5227]">*</span>
              </label>
              <div className="relative bg-white dark:bg-[#0B0F17] border border-stone-200/90 dark:border-slate-800 rounded-2xl px-3.5 py-3 flex items-center focus-within:border-[#DE5227] focus-within:ring-2 focus-within:ring-[#DE5227]/20 transition shadow-2xs">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="email"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  placeholder="reporter@nagrik.news"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                />
                {isEmailValid && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 animate-in zoom-in-50" />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'} <span className="text-[#DE5227]">*</span>
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setAuthError(language === 'hi' ? 'डेमो खातों का डिफ़ॉल्ट पासवर्ड CreatorPass123! या AdminPass123! है।' : 'Default password for demo accounts is CreatorPass123! or AdminPass123!')}
                    className="text-[11px] text-slate-500 hover:text-[#DE5227] font-bold transition cursor-pointer font-mono"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </button>
                )}
              </div>

              <div className="relative bg-white dark:bg-[#0B0F17] border border-stone-200/90 dark:border-slate-800 rounded-2xl px-3.5 py-3 flex items-center focus-within:border-[#DE5227] focus-within:ring-2 focus-within:ring-[#DE5227]/20 transition shadow-2xs">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  placeholder={isRegister ? 'Min 8 characters (mixed case + number)' : '••••••••••••'}
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Progressive Password Strength Meter (Sign Up Only) */}
            {isRegister ? (
              <div className="pt-1 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400 font-mono uppercase">Password Strength</span>
                    <span className={`font-mono font-bold ${
                      strengthScore === 3 ? "text-emerald-600 dark:text-emerald-400" :
                      strengthScore === 2 ? "text-amber-600 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"
                    }`}>
                      {strengthScore === 3 ? "Strong ✓" : strengthScore === 2 ? "Moderate" : "Weak (Requires numbers & uppercase)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-all duration-300 ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-rose-500' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-stone-200 dark:bg-slate-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-stone-200 dark:bg-slate-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${strengthScore === 3 ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-slate-800'}`} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition ${
                    hasMinLen ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-stone-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasMinLen ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} 8+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition ${
                    hasNumber ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-stone-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Number
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition ${
                    hasUpperLower ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-stone-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {hasUpperLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />} Mixed Case
                  </span>
                </div>

                {/* Terms and Privacy Checkbox */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#DE5227] focus:ring-[#DE5227] cursor-pointer"
                  />
                  <span className="leading-snug">
                    {language === 'hi' ? (
                      <>मैं <Link href="/terms?tab=terms" className="text-[#DE5227] font-bold hover:underline">नागरिक दिशानिर्देशों</Link> और 100% सामग्री स्वामित्व नियमों से सहमत हूँ।</>
                    ) : (
                      <>I acknowledge the <Link href="/terms?tab=terms" className="text-[#DE5227] font-bold hover:underline">Contributor Guidelines</Link> and 100% Content IP Ownership Agreement.</>
                    )}
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {/* Remember Me & Instant Disbursal Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-[#DE5227] focus:ring-[#DE5227] cursor-pointer"
                    />
                    <span className="text-xs font-medium">
                      {language === 'hi' ? '30 दिनों तक याद रखें' : 'Remember this workstation'}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Instant UPI Disbursals</span>
                  </div>
                </div>

                {/* 1-Click Quick Demo Credential Pills */}
                <div className="p-3 bg-[#F2ECE1]/60 dark:bg-slate-900/60 rounded-2xl border border-stone-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                    Demo Credentials:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('creator')}
                      className={`text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                        demoFilled && demoRole === 'creator'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-[#DE5227] hover:text-[#DE5227]'
                      }`}
                      title="Auto-fill Creator Account"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Creator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillDemo('admin')}
                      className={`text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                        demoFilled && demoRole === 'admin'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-[#DE5227] hover:text-[#DE5227]'
                      }`}
                      title="Auto-fill Admin Account"
                    >
                      <KeyRound className="w-3 h-3 text-slate-400" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading || authSuccess}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DE5227] hover:bg-[#C84318] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying workstation access...'}</span>
                  </span>
                ) : authSuccess ? (
                  <span className="flex items-center gap-2 text-white">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{language === 'hi' ? 'सत्यापित! प्रवेश कर रहे हैं...' : 'Authenticated! Entering Studio...'}</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isRegister
                        ? (language === 'hi' ? 'साइन अप पूरा करें' : 'Create Publisher Account')
                        : (language === 'hi' ? 'स्टूडियो में प्रवेश करें' : 'Enter Creator Studio')}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Micro Footer Policy Links */}
          <div className="pt-4 border-t border-stone-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <Link href="/terms?tab=terms" className="hover:text-slate-900 dark:hover:text-white transition">Terms</Link>
              <span>•</span>
              <Link href="/terms?tab=privacy" className="hover:text-slate-900 dark:hover:text-white transition">Privacy</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition">Support</Link>
            </div>
            <div className="text-[11px] font-mono">
              Nagrik © {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT COLUMN: CINEMATIC BRAND SHOWCASE (5 Cols Desktop - Dark Navy)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 relative bg-[#090E1A] dark:bg-[#070B14] p-8 sm:p-10 flex flex-col justify-between overflow-hidden hidden lg:flex text-white border-l border-slate-800">
          
          {/* Subtle Warm Amber Atmospheric Illumination */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DE5227]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-950/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Nagrik Creator Studio Identity & Telemetry Chip */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <NagrikLogo size="md" variant="icon" />
              <div className="text-left">
                <span className="font-serif font-black text-lg text-white block leading-none">Creator Studio</span>
                <span className="text-[10px] font-mono text-slate-400">Hyperlocal Newsroom</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-white text-[10px] font-mono font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE • 5KM WIRE</span>
            </div>
          </div>

          {/* Middle Story Canvas: Verified Dispatch & Contributor Ledger */}
          <div className="relative z-10 space-y-4 my-auto text-left">
            
            {/* Editorial Statement */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#DE5227] uppercase">
                Hyperlocal Contributor Economy
              </div>
              <h3 className="text-xl font-bold font-serif text-white leading-snug">
                Create. Report. Reach your community.
              </h3>
            </div>

            {/* Live Financial & Audience Ledger Card */}
            <div className="bg-[#121927]/95 backdrop-blur-xl text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'सत्यापित व्यूज' : 'Verified Real Reads'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  100% Monetized
                </span>
              </div>

              <div className="text-3xl font-black font-serif tracking-tight text-white flex items-baseline gap-2">
                <span>₹8,600.00</span>
                <span className="text-xs font-mono font-normal text-slate-400">($100.00 USD)</span>
              </div>

              <div className="p-3 bg-[#0B0F17] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Contributor Flat CPM</span>
                  <span className="text-brand-400 font-mono font-bold">$1.00 CPM (~₹86 / 1k)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Disbursal Method</span>
                  <span className="text-emerald-400 font-mono font-semibold">Direct UPI / Bank IMPS</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Active Geofence</span>
                  <span className="text-slate-200 font-mono">Patna Ward 12 (5km radius)</span>
                </div>
              </div>
            </div>

            {/* Proof Benefit Capsule */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-xs leading-relaxed space-y-1.5">
              <div className="font-bold text-sm text-white font-serif flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DE5227]" />
                <span>{language === 'hi' ? '100% सामग्री स्वामित्व' : 'Zero Escrow & 100% Contributor IP'}</span>
              </div>
              <p className="text-slate-400 font-normal">
                {language === 'hi'
                  ? 'आपकी रिपोर्ट और वीडियो का कॉपीराइट हमेशा आपका रहता है। ₹850 ($10) होते ही तत्काल निकासी।'
                  : 'You retain full copyright over your reports and video bytes. Zero platform deductions and automated daily payouts.'}
              </p>
            </div>
          </div>

          {/* Bottom Cryptographic Security Seal */}
          <div className="relative z-10 text-[11px] font-mono text-slate-400 text-center flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>256-Bit SSL Cryptographic Geofence Gateway</span>
          </div>

        </div>

      </div>
    </div>
  );
};
