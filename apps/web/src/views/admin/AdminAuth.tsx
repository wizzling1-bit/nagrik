'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Zap,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AdminAuthProps {
  apiBase: string;
  onBackToHome?: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ apiBase, onBackToHome }) => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [demoFilled, setDemoFilled] = useState(false);

  const handleFillDemo = () => {
    setAuthEmail('admin@nagrik.news');
    setAuthPassword('AdminPass123!');
    setDemoFilled(true);
    setAuthError('');
    setTimeout(() => setDemoFilled(false), 2000);
  };

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
        throw new Error('Access denied: Administrator credentials required.');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden transition-colors duration-200">
      
      {/* Subtle Ambient Illumination */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#DE5227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-slate-900/10 dark:bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <NagrikLogo size="md" variant="horizontal" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-[#DE5227]" />
            <span>SOVEREIGN OPERATIONS GATEWAY</span>
          </div>

          <h2 className="text-2xl font-black font-serif text-slate-950 dark:text-white tracking-tight">
            Admin Command Center
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Enter authorized credentials to access editorial moderation, telemetry verification, and treasury disbursals.
          </p>
        </div>

        {authError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-150 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
              Admin Identity
            </label>
            <div className="relative bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-[#DE5227] focus-within:ring-2 focus-within:ring-[#DE5227]/20 transition shadow-xs">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="email"
                required
                placeholder="admin@nagrik.news"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
              Security Passkey
            </label>
            <div className="relative bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center focus-within:border-[#DE5227] focus-within:ring-2 focus-within:ring-[#DE5227]/20 transition shadow-xs">
              <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              LEVEL 4 PRIVILEGE
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className={`text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                demoFilled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 scale-105'
                  : 'bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-[#DE5227] hover:text-[#DE5227]'
              }`}
              title="Fill test credentials"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{demoFilled ? 'Loaded!' : 'Demo Admin'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-[#DE5227] hover:bg-[#C84318] text-white text-xs sm:text-sm font-bold py-3.5 rounded-full shadow-lg shadow-orange-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating Sovereign Channel...</span>
              </span>
            ) : (
              <>
                <span>Access Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-stone-200/80 dark:border-slate-800 text-center">
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition flex items-center gap-1.5 mx-auto cursor-pointer font-serif"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Newsroom</span>
          </button>
        </div>
      </div>
    </div>
  );
};
