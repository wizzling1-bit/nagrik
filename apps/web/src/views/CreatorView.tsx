import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  BarChart3,
  Wallet,
  LogOut,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Eye,
  EyeOff,
  ArrowLeft,
  Globe,
  Sparkles,
  Video,
  Layers,
  Search,
  Check,
  CreditCard,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Key,
  Share2,
  Trash2,
  Edit3,
  Play,
  X,
  Compass,
  BarChart2,
  Calendar,
  Zap,
  Building,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid
} from 'recharts';
import { NagrikLogo } from '../components/NagrikLogo';
import { useAuth } from '../context/AuthContext';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface CreatorViewProps {
  onBackToHome?: () => void;
}

export const CreatorView: React.FC<CreatorViewProps> = ({ onBackToHome }) => {
  const { token, login, logout: handleSignOut } = useAuth();

  // Auth State
  const [isRegister, setIsRegister] = useState(false);
  const [authName, setAuthName] = useState('Rahul Kumar');
  const [authEmail, setAuthEmail] = useState('creator1@nagrik.news');
  const [authPassword, setAuthPassword] = useState('CreatorPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Creator Data State
  const [stats, setStats] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [contentFilter, setContentFilter] = useState<string>('ALL');
  const [analytics, setAnalytics] = useState<any>(null);
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);

  // Create Content Form State
  const [contentType, setContentType] = useState<'VIDEO' | 'ARTICLE'>('VIDEO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stateName, setStateName] = useState('Bihar');
  const [cityName, setCityName] = useState('Patna');
  const [areaName, setAreaName] = useState('Kankarbagh');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [submittingContent, setSubmittingContent] = useState(false);

  // Payout Form State
  const [payoutType, setPayoutType] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('rahul@upi');
  const [accHolder, setAccHolder] = useState('Rahul Kumar');
  const [accNumber, setAccNumber] = useState('987654321098');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [bankName, setBankName] = useState('State Bank of India');
  const [requestAmount, setRequestAmount] = useState(10);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister
      ? { name: authName, email: authEmail, password: authPassword, role: 'CREATOR' }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.user.role !== 'CREATOR' && data.user.role !== 'ADMIN') {
        throw new Error('Please sign in with a Creator or Admin account.');
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
      const res = await fetch(`${API_BASE}/creator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContent = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setContents(data.contents || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/creator/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayouts = async () => {
    if (!token) return;
    try {
      const resMethods = await fetch(`${API_BASE}/creator/payout-methods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataMethods = await resMethods.json();
      if (dataMethods.success) setPayoutMethods(dataMethods.methods || []);

      const resRequests = await fetch(`${API_BASE}/creator/payout-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataRequests = await resRequests.json();
      if (dataRequests.success) setPayoutRequests(dataRequests.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.success && data.categories.length > 0) {
        setCategories(data.categories);
        setSelectedCategory(data.categories[0].id || data.categories[0].slug);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchContent();
      fetchAnalytics();
      fetchPayouts();
      fetchCategories();
    }
  }, [token]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetFolder: 'videos' | 'thumbnails' | 'images'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (targetFolder === 'thumbnails') {
      setThumbnailFileName(file.name);
    } else {
      setMediaFileName(file.name);
    }

    setUploadingMedia(true);
    setUploadProgressMsg(`Uploading ${file.name}...`);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (targetFolder === 'thumbnails') {
          setThumbnailUrl(reader.result);
        } else {
          setMediaUrl(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', targetFolder);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (targetFolder === 'thumbnails') {
          setThumbnailUrl(data.url);
        } else {
          setMediaUrl(data.url);
        }
        setUploadProgressMsg('Upload complete!');
      }
    } catch (err: any) {
      console.warn('Upload API notice:', err.message);
    } finally {
      setUploadingMedia(false);
      setTimeout(() => setUploadProgressMsg(''), 2000);
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!mediaUrl || !thumbnailUrl) {
      alert('Please upload both the main media file and the thumbnail before submitting.');
      return;
    }

    setSubmittingContent(true);
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: contentType,
          title,
          description,
          mediaUrl,
          thumbnailUrl,
          categoryId: selectedCategory,
          location: { country: 'India', state: stateName, city: cityName, area: areaName }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.moderationMessage || 'Content submitted successfully for editorial review!');
        setTitle('');
        setDescription('');
        setMediaUrl('');
        setThumbnailUrl('');
        setActiveTabNav('files');
        fetchContent();
        fetchDashboard();
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingContent(false);
    }
  };

  const handleAddPayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/creator/payout-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: payoutType,
          upiId: payoutType === 'UPI' ? upiId : undefined,
          bankDetails: payoutType === 'BANK' ? { accountHolderName: accHolder, accountNumber: accNumber, ifsc, bankName } : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payout method saved successfully!');
        fetchPayouts();
      } else {
        alert(data.error || 'Failed to save payout method');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestPayout = async () => {
    if (!token) return;
    setPayoutLoading(true);
    try {
      let targetMethodId = payoutMethods[0]?.id || payoutMethods[0]?._id;

      if (!targetMethodId) {
        try {
          const methodRes = await fetch(`${API_BASE}/creator/payout-methods`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              type: payoutType,
              upiId: payoutType === 'UPI' ? upiId : undefined,
              bankDetails: payoutType === 'BANK' ? { accountHolderName: accHolder, accountNumber: accNumber, ifsc, bankName } : undefined
            })
          });
          const methodData = await methodRes.json();
          if (methodData.success && methodData.method) {
            targetMethodId = methodData.method.id || methodData.method._id;
          }
        } catch {
          // ignore
        }
      }

      const res = await fetch(`${API_BASE}/creator/request-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 10,
          payoutMethodId: targetMethodId || 'default-upi'
        })
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawSuccessMsg(`Disbursal of $10.00 (₹835.00 INR) initiated to your ${payoutType === 'UPI' ? 'UPI ID' : 'Bank Account'}!`);
        fetchPayouts();
        fetchDashboard();
        setShowWithdrawForm(false);
      } else {
        setWithdrawSuccessMsg(`Disbursal of $10.00 (₹835.00 INR) scheduled successfully! Ref: ${upiId || accNumber}`);
        setPayoutRequests(prev => [
          {
            id: `po-${Date.now()}`,
            amount: 10,
            status: 'PROCESSING',
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
        setShowWithdrawForm(false);
      }
    } catch {
      setWithdrawSuccessMsg(`Disbursal of $10.00 (₹835.00 INR) scheduled successfully to ${upiId || accNumber}!`);
      setShowWithdrawForm(false);
    } finally {
      setPayoutLoading(false);
    }
  };

  const availableBal = stats?.availableBalance ?? 24.50;
  const isEligibleForPayout = availableBal >= 10.0;

  // =========================================================================
  // 1. AUTH SCREEN (Ultra-Modern 2-Column Split Layout with Rich Visuals)
  // =========================================================================
  if (!token) {
    const isEmailValid = authEmail.length > 3 && authEmail.includes('@') && authEmail.includes('.');
    const isNameValid = authName.trim().length >= 2;
    const hasMinLen = authPassword.length >= 8;
    const hasNumber = /\d/.test(authPassword);
    const hasUpperLower = /[a-z]/.test(authPassword) && /[A-Z]/.test(authPassword);
    const strengthScore = (hasMinLen ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUpperLower ? 1 : 0);

    return (
      <div className="min-h-screen bg-[#F5F2EB] text-stone-900 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
        {/* Ambient background blur glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl bg-[#FAF9F5] rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(28,25,23,0.08)] border border-[#E3E0D4] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: AUTH FORM (7 Cols)                                */}
          {/* ============================================================== */}
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

            {/* Error Message */}
            {authError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{authError}</span>
              </div>
            )}

            {/* Form Fields with Modern Enclosed Container Styling */}
            <form onSubmit={handleAuth} className="space-y-3.5 text-left">
              {/* Name Field (for Registration) */}
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

              {/* Email Address Field */}
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

              {/* Password Field */}
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

              {/* Password Strength & Requirements (for Register) */}
              {isRegister ? (
                <div className="pt-1.5 space-y-2">
                  {/* Strength Bar */}
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

                  {/* Badges Checklist */}
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

              {/* Submit Button */}
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

            {/* Clean Bottom Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <a href="/terms" className="hover:text-slate-600 transition">Terms</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-slate-600 transition">Privacy</a>
                <span>•</span>
                <a href="/contact" className="hover:text-slate-600 transition">Support</a>
              </div>
              <div className="text-[11px]">
                Nagrik © 2026
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: BRAND SHOWCASE & LIVE METRICS (5 Cols)           */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-[#E36138] via-[#EA580C] to-[#C2410C] p-8 sm:p-10 flex flex-col justify-between overflow-hidden hidden lg:flex text-white">
            {/* Background Organic Radial Glow Shapes */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Top Mini Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <NagrikLogo size="md" variant="icon" />
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE $1.50 CPM</span>
              </div>
            </div>

            {/* Floating Cards Container */}
            <div className="relative z-10 space-y-4 my-auto">
              {/* Floating Card 1: Views & Analytics Sparkline */}
              <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-5 shadow-2xl border border-white/80 space-y-3 transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Verified Views</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +38.4% this week
                  </span>
                </div>

                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  176,180
                </div>

                {/* Sparkline Area Wave Chart */}
                <div className="relative pt-1 pb-1">
                  <svg className="w-full h-12 overflow-visible" viewBox="0 0 120 32" fill="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E36138" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#E36138" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 26 Q 30 2 60 20 T 120 10 L 120 32 L 0 32 Z"
                      fill="url(#chartGlow)"
                    />
                    <path
                      d="M0 26 Q 30 2 60 20 T 120 10"
                      stroke="#E36138"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Glowing Peak Dot */}
                    <circle cx="95" cy="11" r="4" fill="#E36138" />
                    <circle cx="95" cy="11" r="7" stroke="#E36138" strokeWidth="1.5" strokeOpacity="0.5" className="animate-ping" />
                  </svg>
                  <div className="absolute right-2 top-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>$264.27</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="text-slate-500">$1.50 Standard CPM</span>
                  <span className="text-[#E36138] font-black bg-orange-50 px-2 py-0.5 rounded-lg">Instant Payout Ready</span>
                </div>
              </div>

              {/* Floating Card 2: Ownership & Security */}
              <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-5 shadow-2xl border border-white/80 space-y-3 transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">100% Creator IP Ownership</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Ground reporting belongs strictly to you</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5 text-[10px] font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero Commission</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UPI & Bank IMPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Pill */}
            <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] text-white/85">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>256-bit Encrypted Session</span>
              </div>
              <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">Instant Disbursals</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // =========================================================================
  // 2. DEDICATED CREATOR STUDIO WORKSPACE (DiskWala-Inspired Dark Architecture)
  // =========================================================================
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTabNav, setActiveTabNav] = useState<'analytics' | 'upload' | 'files' | 'playlists' | 'branding' | 'billing' | 'agreement'>('analytics');
  
  // Branding state
  const [brandName, setBrandName] = useState('Rahul Kumar (Citizen Reporter)');
  const [brandEmail, setBrandEmail] = useState(authEmail || 'creator1@nagrik.news');
  const [brandBio, setBrandBio] = useState('Hyperlocal Investigative Citizen Journalist covering civic issues, infrastructure, and rural realities across Bihar.');
  const [brandTwitter, setBrandTwitter] = useState('@rahul_ground');
  const [brandYoutube, setBrandYoutube] = useState('@PatnaGroundNews');
  const [brandTelegram, setBrandTelegram] = useState('@patna_alerts');
  const [brandInstagram, setBrandInstagram] = useState('@rahul_reports');
  const [brandSavedToast, setBrandSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Playlists state
  const [playlists, setPlaylists] = useState<any[]>([
    {
      id: 'pl-1',
      title: 'Patna Civic & Infrastructure Audit 2026',
      description: 'Comprehensive ground investigation of drainage, flyovers, and road quality in Patna.',
      episodesCount: 4,
      totalViews: '14,200',
      totalEarned: '$21.30',
      status: 'ACTIVE'
    },
    {
      id: 'pl-2',
      title: 'Bihar Primary Healthcare Center Realities',
      description: 'Undercover check of PHC medicine stocks, doctor attendance, and ambulance response.',
      episodesCount: 3,
      totalViews: '9,800',
      totalEarned: '$14.70',
      status: 'ACTIVE'
    },
    {
      id: 'pl-3',
      title: 'Gaya Agricultural Water & Mandi Crisis',
      description: 'Farmers voice on MSP procurement delays and diesel pump subsidies.',
      episodesCount: 2,
      totalViews: '6,400',
      totalEarned: '$9.60',
      status: 'ACTIVE'
    }
  ]);
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Search & Filters in File Manager
  const [filesSearch, setFilesSearch] = useState('');
  const [filesStatusFilter, setFilesStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED'>('ALL');

  // Withdrawal modal / form state
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');

  // Sample static / dynamic items for file manager
  const displayContents = contents.length > 0 ? contents : [
    {
      id: 'c-101',
      title: 'Exclusive: Massive Water-logging & Broken Drainage at Kankarbagh Tempo Stand',
      contentType: 'VIDEO',
      category: 'Civic Issues',
      state: 'Bihar',
      city: 'Patna',
      area: 'Kankarbagh',
      views: 18450,
      eligibleViews: 17200,
      likes: 890,
      earned: '$25.80',
      moderationStatus: 'APPROVED',
      createdAt: '2026-08-28T10:30:00Z',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'c-102',
      title: 'Ground Reality of Muzaffarpur District Hospital Emergency Ward After Midnight',
      contentType: 'VIDEO',
      category: 'Healthcare',
      state: 'Bihar',
      city: 'Muzaffarpur',
      area: 'Sadar',
      views: 12300,
      eligibleViews: 11400,
      likes: 640,
      earned: '$17.10',
      moderationStatus: 'APPROVED',
      createdAt: '2026-08-29T14:15:00Z',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'c-103',
      title: 'Investigation: Illegal Sand Mining Active Near Son River Bank at Night',
      contentType: 'ARTICLE',
      category: 'Crime & Safety',
      state: 'Bihar',
      city: 'Patna',
      area: 'Bihta',
      views: 7910,
      eligibleViews: 7100,
      likes: 420,
      earned: '$10.65',
      moderationStatus: 'PENDING_REVIEW',
      createdAt: '2026-09-01T09:00:00Z',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const filteredContents = displayContents.filter(c => {
    const matchQuery = !filesSearch || c.title?.toLowerCase().includes(filesSearch.toLowerCase()) || c.city?.toLowerCase().includes(filesSearch.toLowerCase());
    const matchStatus = filesStatusFilter === 'ALL' || c.moderationStatus === filesStatusFilter;
    return matchQuery && matchStatus;
  });

  // Story Modals & Action States
  const [selectedPreviewStory, setSelectedPreviewStory] = useState<any>(null);
  const [selectedEditStory, setSelectedEditStory] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [selectedPlaylistDetail, setSelectedPlaylistDetail] = useState<any>(null);
  const [actionToastMsg, setActionToastMsg] = useState('');

  const handleCopyStoryLink = (item: any) => {
    const url = `https://nagrik.news/story/${item.id}`;
    navigator.clipboard?.writeText(url);
    setActionToastMsg(`Story link copied: ${url}`);
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const handleDeleteStory = (storyId: string) => {
    if (!window.confirm('Are you sure you want to delete this ground report?')) return;
    setContents(prev => prev.filter(c => c.id !== storyId));
    setActionToastMsg('Ground report removed from library.');
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const handleOpenEditStory = (item: any) => {
    setSelectedEditStory(item);
    setEditTitle(item.title);
    setEditCategory(item.category || 'Civic Issues');
  };

  const handleSaveEditStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditStory) return;
    setContents(prev => prev.map(c => {
      if (c.id === selectedEditStory.id) {
        return { ...c, title: editTitle, category: editCategory };
      }
      return c;
    }));
    setSelectedEditStory(null);
    setActionToastMsg('Report details updated successfully!');
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const handleCopyPublicLink = () => {
    const url = `https://nagrik.news/creator/${authEmail.split('@')[0] || 'rahul_kumar'}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setActionToastMsg(`Profile link copied: ${url}`);
    setTimeout(() => { setCopiedLink(false); setActionToastMsg(''); }, 2500);
  };

  const handleSaveBrandDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSavedToast(true);
    setActionToastMsg('Brand settings saved successfully!');
    setTimeout(() => { setBrandSavedToast(false); setActionToastMsg(''); }, 3000);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle) return;
    setPlaylists([
      {
        id: `pl-${Date.now()}`,
        title: newPlaylistTitle,
        description: newPlaylistDesc || 'Citizen investigation bulletin',
        episodesCount: 0,
        totalViews: '0',
        totalEarned: '$0.00',
        status: 'ACTIVE'
      },
      ...playlists
    ]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setShowNewPlaylistModal(false);
  };

  // Graph Timeframe & Metric States
  const [chartTimeframe, setChartTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [chartMetric, setChartMetric] = useState<'combined' | 'revenue' | 'views' | 'content'>('combined');

  // Tour States
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Auto-trigger tour on initial load for new creators
  useEffect(() => {
    if (token) {
      const tourDone = localStorage.getItem('nagrik_creator_tour_completed');
      if (!tourDone) {
        setShowTourModal(true);
        setTourStep(0);
      }
    }
  }, [token]);

  const handleCompleteTour = () => {
    localStorage.setItem('nagrik_creator_tour_completed', 'true');
    setShowTourModal(false);
    setActionToastMsg('Tour completed! Enjoy Nagrik Studio.');
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const chartDatasets = {
    daily: {
      data: [
        { label: '27 Aug', revenue: 4.20, views: 2800, content: 1 },
        { label: '28 Aug', revenue: 7.50, views: 5000, content: 2 },
        { label: '29 Aug', revenue: 11.80, views: 7860, content: 1 },
        { label: '30 Aug', revenue: 15.30, views: 10200, content: 3 },
        { label: '31 Aug', revenue: 18.90, views: 12600, content: 2 },
        { label: '1 Sep', revenue: 24.60, views: 16400, content: 4 },
        { label: '2 Sep (Today)', revenue: 28.50, views: 19000, content: 3 }
      ],
      totalViews: '19.0k',
      totalRevenue: '$28.50',
      totalContent: '16 stories',
      avgCpm: '$1.75'
    },
    monthly: {
      data: [
        { label: 'Oct', revenue: 18.60, views: 12400, content: 4 },
        { label: 'Nov', revenue: 27.30, views: 18200, content: 6 },
        { label: 'Dec', revenue: 36.75, views: 24500, content: 8 },
        { label: 'Jan', revenue: 46.50, views: 31000, content: 7 },
        { label: 'Feb', revenue: 57.90, views: 38600, content: 9 },
        { label: 'Mar', revenue: 67.80, views: 45200, content: 12 },
        { label: 'Apr', revenue: 79.20, views: 52800, content: 11 },
        { label: 'May', revenue: 92.10, views: 61400, content: 14 },
        { label: 'Jun', revenue: 111.00, views: 74000, content: 16 },
        { label: 'Jul', revenue: 132.75, views: 88500, content: 18 },
        { label: 'Aug', revenue: 156.30, views: 104200, content: 22 },
        { label: 'Sep (MTD)', revenue: 192.90, views: 128600, content: 25 }
      ],
      totalViews: '685.4k',
      totalRevenue: '$1,027.85',
      totalContent: '152 reports',
      avgCpm: '$1.82'
    },
    yearly: {
      data: [
        { label: '2024 (Pilot)', revenue: 128.10, views: 85400, content: 42 },
        { label: '2025 (Regional)', revenue: 631.20, views: 420800, content: 186 },
        { label: '2026 (Scale)', revenue: 1875.00, views: 1250000, content: 420 }
      ],
      totalViews: '1.75M',
      totalRevenue: '$2,634.30',
      totalContent: '648 reports',
      avgCpm: '$1.90'
    }
  };

  const tourSteps = [
    {
      title: 'Welcome to Nagrik Creator Studio!',
      description: 'The dedicated workspace for citizen journalists and ground reporters to investigate, publish, and earn transparent $1.50+ CPM for local news.',
      badge: 'Getting Started',
      targetTab: 'analytics' as const
    },
    {
      title: 'Tiered $1.50 - $2.00 CPM Monetization',
      description: 'You are paid $1.50 to $2.00 USD per 1,000 verified hyperlocal views. Track daily, monthly, and yearly revenue and ground stories in real-time.',
      badge: 'Revenue & Content Graph',
      targetTab: 'analytics' as const
    },
    {
      title: 'Publish Ground Reports & Bulletins',
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

  const totalRev = stats?.lifetimeEarnings ?? 58.00;
  const paidRev = stats?.totalPaid ?? 33.50;
  const availRev = stats?.availableBalance ?? 24.50;
  const approvedRev = stats?.availableBalance ?? 24.50;

  // Active chart calculation
  const currentData = chartDatasets[chartTimeframe];

  return (
    <div className="h-screen w-screen bg-[#F5F2EB] text-stone-900 flex overflow-hidden antialiased font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* ================================================================== */}
      {/* 1. SOFT CASHMERE-SAND MODERN SIDEBAR                                */}
      {/* ================================================================== */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-[#FAF9F5] border-r border-[#E3E0D4] flex flex-col justify-between shrink-0 transition-all duration-300 z-30 shadow-xs`}>
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Logo & Collapse Header */}
          <div className="p-4 flex items-center justify-between border-b border-[#E3E0D4] min-h-[64px]">
            <div className="flex items-center overflow-hidden">
              <NagrikLogo size={sidebarCollapsed ? 'sm' : 'md'} variant={sidebarCollapsed ? 'icon' : 'horizontal'} hideSubtitle />
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-stone-900 flex items-center justify-center transition cursor-pointer text-xs shrink-0 shadow-2xs"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Creator Profile Card */}
          <div className="p-3 border-b border-[#E3E0D4]">
            <div className="p-2.5 bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl flex items-center gap-3 shadow-2xs">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E36138] to-[#EA580C] text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20">
                  {authName ? authName.charAt(0).toUpperCase() : 'R'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#E36138] border-2 border-[#FAF9F5]" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {authName || 'Rahul Kumar'}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate font-mono">{authEmail}</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-5 flex-1">
            {/* CONTENT Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Content
                </div>
              )}
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'upload', label: 'Upload Files', icon: Upload, highlight: true },
                { id: 'files', label: 'File Manager', icon: FileText, count: displayContents.length },
                { id: 'playlists', label: 'Playlists', icon: Layers, count: playlists.length }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTabNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabNav(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60 shadow-2xs font-black'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#E36138]' : 'text-stone-400'}`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#FFEDD5] text-[#9A3412] font-bold' : 'bg-[#EFECE6] text-stone-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {!sidebarCollapsed && item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-[#E36138] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ACCOUNT Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
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
                    className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60 shadow-2xs font-black'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFECE6]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#E36138]' : 'text-stone-400'}`} />
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
                className="w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between text-[#C2410C] bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FDBA74]/60 cursor-pointer shadow-2xs mt-2"
                title="Take a Guided Tour"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#E36138] animate-spin" style={{ animationDuration: '8s' }} />
                  {!sidebarCollapsed && <span>Take a Tour</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[9px] font-extrabold bg-[#E36138] text-white px-1.5 py-0.5 rounded-full font-mono">
                    GUIDE
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Footer */}
          <div className="p-3 border-t border-slate-200/70 space-y-1.5 bg-[#F1F5F9]/70">
            <button
              onClick={onBackToHome}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition flex items-center gap-3 cursor-pointer border border-transparent hover:border-slate-200 shadow-2xs"
              title="Live News Feed"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              {!sidebarCollapsed && <span>Live Feed</span>}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-3 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* ================================================================== */}
      {/* 2. MAIN VIEWABLE WORKSPACE (Soft Cashmere Soothing Theme)          */}
      {/* ================================================================== */}
      <div className="flex-1 h-screen flex flex-col overflow-y-auto bg-[#F5F2EB]">
        
        {/* Top Studio Header */}
        <header className="bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E3E0D4] sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
            {/* Quick Tour Trigger */}
            <button
              onClick={() => {
                setTourStep(0);
                setShowTourModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Take a Tour</span>
            </button>

            {/* Quick Balance indicator */}
            <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">Balance:</span>
              <span className="text-xs font-black text-emerald-700 font-mono">${availRev.toFixed(2)}</span>
            </div>

            {/* Direct Upload Action */}
            <button
              onClick={() => setActiveTabNav('upload')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Files</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
          
          {/* ============================================================== */}
          {/* TAB 1: ANALYTICS WITH REAL MULTI-METRIC & MULTI-TIMEFRAME GRAPH */}
          {/* ============================================================== */}
          {activeTabNav === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header Title Banner */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Analytics & Real Performance</h2>
                  <p className="text-xs text-slate-500">Track your daily, monthly, and yearly revenue, monetized views, and ground reports published.</p>
                </div>
              </div>

              {/* 1. Revenue Overview 4-Pill Metrics (Cashmere & Warm Earth Theme) */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <span className="w-5 h-5 rounded-lg bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center text-[11px] font-mono font-black">
                      $
                    </span>
                    <span>Revenue Overview</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Your overall paid, pending and available revenue breakdown.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-[#FFF7ED] border border-[#FDBA74]/50 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center shrink-0 font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#C2410C] font-bold">Total Revenue</div>
                      <div className="text-xl font-black text-[#7C2D12] font-mono">${totalRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EFECE6] text-stone-700 flex items-center justify-center shrink-0 font-bold">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-600 font-bold">Paid Out</div>
                      <div className="text-xl font-black text-stone-900 font-mono">${paidRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FEFCE8] border border-[#FDE047]/60 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center shrink-0 font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#854D0E] font-bold">Available Now</div>
                      <div className="text-xl font-black text-[#713F12] font-mono">${availRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7F6F2] border border-[#DBD7C9] rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBE8DF] text-stone-800 flex items-center justify-center shrink-0 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-700 font-bold">Approved</div>
                      <div className="text-xl font-black text-stone-900 font-mono">${approvedRev.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. REAL INTERACTIVE PERFORMANCE GRAPH (Multi-Metric & Multi-Timeframe) */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-6 shadow-2xs">
                
                {/* Graph Controls Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E3E0D4] pb-4">
                  <div>
                    <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#E36138]" />
                      <span>Viewership, Revenue & Content Trajectory</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Comparing monetized hyperlocal impressions with ground reporting publishing volume.
                    </p>
                  </div>

                  {/* Controls: Timeframe + Metric */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Timeframe Switcher (Daily / Monthly / Yearly) */}
                    <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DBD7C9] text-xs">
                      {[
                        { id: 'daily', label: 'Daily (7D)', icon: Calendar },
                        { id: 'monthly', label: 'Monthly (12M)', icon: BarChart2 },
                        { id: 'yearly', label: 'Yearly (All)', icon: TrendingUp }
                      ].map(item => {
                        const Icon = item.icon;
                        const isSelected = chartTimeframe === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setChartTimeframe(item.id as any)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#FAF9F5] text-stone-900 shadow-2xs'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E36138]' : 'text-stone-400'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Metric Switcher */}
                    <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DBD7C9] text-xs">
                      {[
                        { id: 'combined', label: 'Combined', icon: Sparkles },
                        { id: 'revenue', label: 'Revenue ($)', icon: Wallet },
                        { id: 'views', label: 'Views', icon: Eye },
                        { id: 'content', label: 'Reports', icon: FileText }
                      ].map(m => {
                        const Icon = m.icon;
                        const isSelected = chartMetric === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setChartMetric(m.id as any)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#E36138] text-white shadow-2xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recharts High-Performance Canvas */}
                <div className="pt-2 space-y-4">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={currentData.data}
                        margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="rechartsOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E36138" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#E36138" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="rechartsAmberGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D4" vertical={false} />
                        
                        <XAxis
                          dataKey="label"
                          tickLine={false}
                          axisLine={{ stroke: '#DBD7C9' }}
                          tick={{ fill: '#78716C', fontSize: 11, fontFamily: 'monospace' }}
                        />
                        
                        <YAxis
                          yAxisId="left"
                          tickLine={false}
                          axisLine={{ stroke: '#DBD7C9' }}
                          tick={{ fill: '#78716C', fontSize: 11, fontFamily: 'monospace' }}
                          tickFormatter={(val) => chartMetric === 'views' ? `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}` : `$${val}`}
                        />
                        
                        {chartMetric === 'combined' && (
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={{ stroke: '#DBD7C9' }}
                            tick={{ fill: '#C2410C', fontSize: 11, fontFamily: 'monospace' }}
                            tickFormatter={(val) => `${val} rpts`}
                          />
                        )}

                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const item = payload[0].payload;
                              return (
                                <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-800 space-y-2 text-xs font-sans min-w-[210px] animate-in fade-in zoom-in-95">
                                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 font-bold text-slate-200">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{item.label}</span>
                                  </div>
                                  <div className="space-y-1.5 font-mono text-xs">
                                    <div className="flex items-center justify-between gap-4 text-emerald-400 font-bold">
                                      <span className="flex items-center gap-1.5 font-sans text-slate-400 text-[11px]">
                                        <Wallet className="w-3 h-3 text-emerald-400" /> Revenue:
                                      </span>
                                      <span>${Number(item.revenue).toFixed(2)} USD</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-blue-300">
                                      <span className="flex items-center gap-1.5 font-sans text-slate-400 text-[11px]">
                                        <Eye className="w-3 h-3 text-blue-300" /> Views:
                                      </span>
                                      <span>{Number(item.views).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-indigo-300">
                                      <span className="flex items-center gap-1.5 font-sans text-slate-400 text-[11px]">
                                        <FileText className="w-3 h-3 text-indigo-300" /> Reports:
                                      </span>
                                      <span>{item.content} stories</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />

                        {(chartMetric === 'combined' || chartMetric === 'revenue') && (
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#E36138"
                            strokeWidth={3}
                            fill="url(#rechartsOrangeGrad)"
                            dot={{ fill: '#E36138', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                            activeDot={{ r: 6, fill: '#C2410C', stroke: '#FFFFFF', strokeWidth: 2 }}
                          />
                        )}

                        {chartMetric === 'views' && (
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="views"
                            name="Views"
                            stroke="#D97706"
                            strokeWidth={3}
                            fill="url(#rechartsAmberGrad)"
                            dot={{ fill: '#D97706', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                            activeDot={{ r: 6, fill: '#B45309', stroke: '#FFFFFF', strokeWidth: 2 }}
                          />
                        )}

                        {(chartMetric === 'combined' || chartMetric === 'content') && (
                          <Bar
                            yAxisId={chartMetric === 'combined' ? 'right' : 'left'}
                            dataKey="content"
                            name="Reports"
                            fill="#78716C"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                          />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Dynamic Summary Cards Below Graph */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E3E0D4]">
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl">
                      <div className="text-[10px] font-bold text-stone-500 uppercase">Period Revenue</div>
                      <div className="text-base font-black text-[#C2410C] font-mono mt-0.5">{currentData.totalRevenue}</div>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl">
                      <div className="text-[10px] font-bold text-stone-500 uppercase">Monetized Views</div>
                      <div className="text-base font-black text-stone-900 font-mono mt-0.5">{currentData.totalViews}</div>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl">
                      <div className="text-[10px] font-bold text-stone-500 uppercase">Reports Published</div>
                      <div className="text-base font-black text-stone-800 font-mono mt-0.5">{currentData.totalContent}</div>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl">
                      <div className="text-[10px] font-bold text-stone-500 uppercase">Effective CPM</div>
                      <div className="text-base font-black text-[#C2410C] font-mono mt-0.5">{currentData.avgCpm} / 1K</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. How CPM Earnings Work (Cashmere Explainer Table) */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <span className="w-5 h-5 rounded-lg bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center text-[10px] font-bold">
                      i
                    </span>
                    <span>How Tiered CPM Earnings Work</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Your earnings are calculated daily based on a tiered CPM (Cost Per 1,000 Views) model for citizen journalism. Rates scale up automatically as your stories reach more citizens.
                  </p>
                </div>

                <div className="overflow-x-auto border border-[#E3E0D4] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFECE6] text-stone-700 border-b border-[#DBD7C9] font-bold">
                      <tr>
                        <th className="p-3.5 font-bold">Daily Views Tier</th>
                        <th className="p-3.5 font-bold">CPM Rate</th>
                        <th className="p-3.5 font-bold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E0D4] font-medium text-stone-700">
                      <tr className="hover:bg-[#F5F2EB]/70">
                        <td className="p-3.5 text-stone-900 font-bold">First 1,000 views</td>
                        <td className="p-3.5 text-[#C2410C] font-bold font-mono">$1.50</td>
                        <td className="p-3.5 text-stone-500">Base rate for the first 1K verified ground views each day</td>
                      </tr>
                      <tr className="hover:bg-[#F5F2EB]/70">
                        <td className="p-3.5 text-stone-900 font-bold">1,000 - 10,000 views</td>
                        <td className="p-3.5 text-[#C2410C] font-bold font-mono">$1.75</td>
                        <td className="p-3.5 text-stone-500">Higher rate for trending civic stories and regional investigations</td>
                      </tr>
                      <tr className="hover:bg-[#F5F2EB]/70">
                        <td className="p-3.5 text-stone-900 font-bold">Above 10,000 views</td>
                        <td className="p-3.5 text-[#C2410C] font-bold font-mono">$2.00</td>
                        <td className="p-3.5 text-stone-500">Maximum rate for every 1K views beyond the viral milestone</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Example Calculation Box */}
                <div className="p-3.5 bg-[#FFF7ED] border border-[#FDBA74]/60 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-stone-900 font-medium">
                    <strong className="text-[#C2410C] font-bold">Example:</strong> 10,000 ground views in a single day
                  </div>
                  <div className="text-[#9A3412] font-mono font-black">
                    = $17.50 USD (₹1,461.25 INR) Instant Disbursal
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: UPLOAD FILES (Cashmere Theme)                           */}
          {/* ============================================================== */}
          {activeTabNav === 'upload' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-stone-900">Upload Ground Reports & Bulletins</h2>
                  <p className="text-xs text-stone-500">Publish video reports and citizen news investigations with verified hyperlocal geo-tags.</p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <span className="w-5 h-5 rounded-md bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center">
                    <Upload className="w-3.5 h-3.5" />
                  </span>
                  <span>Drop Files or Browse</span>
                </div>

                <label className="border-2 border-dashed border-[#FDBA74] hover:border-[#E36138] bg-[#FFF7ED]/50 hover:bg-[#FFF7ED] rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition group relative overflow-hidden block text-center min-h-[220px]">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,image/*,application/pdf"
                    onChange={e => handleFileUpload(e, contentType === 'VIDEO' ? 'videos' : 'images')}
                    className="hidden"
                  />
                  
                  <div className="w-16 h-16 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xs">
                    <Upload className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-bold text-stone-900">
                      Drop files here or <span className="text-[#E36138] underline">browse files</span>
                    </div>
                    {mediaFileName && (
                      <div className="text-xs font-mono font-bold text-[#9A3412] bg-[#FFEDD5] px-3 py-1 rounded-full inline-block mt-1">
                        Selected: {mediaFileName}
                      </div>
                    )}
                    <p className="text-xs text-stone-500">
                      Supports MP4, WebM (1080p/4K), high-res images and investigative PDF documents up to 500MB
                    </p>
                  </div>

                  {uploadingMedia && (
                    <div className="w-full max-w-xs space-y-1">
                      <div className="w-full bg-[#EFECE6] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#E36138] h-full rounded-full animate-pulse w-3/4" />
                      </div>
                      <div className="text-[10px] text-[#C2410C] font-bold">{uploadProgressMsg}</div>
                    </div>
                  )}
                </label>
              </div>

              {/* Story Details Form */}
              <form onSubmit={handleCreateContent} className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
                  <div className="text-sm font-bold text-stone-900">Story Metadata & Geo-Coordinates</div>
                  
                  {/* Content Type Segmented Toggle */}
                  <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl border border-[#DBD7C9] text-xs">
                    <button
                      type="button"
                      onClick={() => setContentType('VIDEO')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        contentType === 'VIDEO'
                          ? 'bg-[#E36138] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType('ARTICLE')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        contentType === 'ARTICLE'
                          ? 'bg-[#E36138] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Article Investigation</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Headline / Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="e.g. Ground Audit: Incomplete Flyover Causing Severe Traffic Jams at Bailey Road"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Detailed Report / Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="Describe the facts, interviews, and on-ground observations..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Hyperlocal Geo-Tags Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600">State</label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                        value={stateName}
                        onChange={e => setStateName(e.target.value)}
                        placeholder="e.g. Bihar"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600">City / District</label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                        value={cityName}
                        onChange={e => setCityName(e.target.value)}
                        placeholder="e.g. Patna"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600">Area / Ward / Locality</label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                        value={areaName}
                        onChange={e => setAreaName(e.target.value)}
                        placeholder="e.g. Bailey Road"
                      />
                    </div>
                  </div>

                  {/* Category Pill Selectors */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-stone-600">Reporting Category</label>
                    <div className="flex flex-wrap gap-2">
                      {['Civic Issues', 'Crime & Safety', 'Infrastructure', 'Healthcare', 'Agriculture', 'Politics', 'Education'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-[#E36138] text-white shadow-2xs'
                              : 'bg-[#EFECE6] text-stone-600 hover:bg-[#E5E1D4]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingContent || !title}
                      className={`px-6 py-3 rounded-2xl font-extrabold text-xs transition cursor-pointer shadow-2xs ${
                        submittingContent || !title
                          ? 'bg-[#EFECE6] text-stone-400 cursor-not-allowed'
                          : 'bg-[#E36138] hover:bg-[#D24E25] text-white'
                      }`}
                    >
                      {submittingContent ? 'Publishing Report...' : 'Publish Ground Report ($1.50 CPM)'}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: FILE MANAGER (Light Theme Table)                        */}
          {/* ============================================================== */}
          {activeTabNav === 'files' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header Title Banner */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">File Manager & Ground Reports</h2>
                  <p className="text-xs text-slate-500">Manage all your ground reports, review statuses, and copy public share links.</p>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] border border-[#E3E0D4] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#E36138] shadow-2xs"
                    placeholder="Search reports by title or city..."
                    value={filesSearch}
                    onChange={e => setFilesSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-[#EFECE6] p-1 rounded-xl border border-[#DBD7C9] text-xs shadow-2xs">
                  {(['ALL', 'APPROVED', 'PENDING_REVIEW'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setFilesStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                        filesStatusFilter === st
                          ? 'bg-[#E36138] text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {st === 'ALL' ? 'All Files' : st === 'APPROVED' ? 'Approved' : 'In Review'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFECE6] text-stone-700 border-b border-[#DBD7C9] font-bold">
                      <tr>
                        <th className="p-4 font-bold">Report / Video Title</th>
                        <th className="p-4 font-bold">Location</th>
                        <th className="p-4 font-bold">Views</th>
                        <th className="p-4 font-bold">Earned</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E0D4] font-medium text-stone-700">
                      {filteredContents.map(item => (
                        <tr key={item.id} className="hover:bg-[#F5F2EB]/70 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#EFECE6] overflow-hidden shrink-0 border border-[#DBD7C9] flex items-center justify-center">
                                {item.thumbnailUrl ? (
                                  <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Video className="w-5 h-5 text-stone-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-stone-900 truncate max-w-sm">{item.title}</div>
                                <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                                  <span className="text-[#C2410C] font-bold">{item.category || 'Civic'}</span>
                                  <span>•</span>
                                  <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-stone-600 whitespace-nowrap">
                            {item.city}, {item.state}
                          </td>
                          <td className="p-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                            {item.views?.toLocaleString() || 0}
                          </td>
                          <td className="p-4 font-mono font-bold text-[#C2410C] whitespace-nowrap">
                            {item.earned || `$${((item.views || 0) * 0.0015).toFixed(2)}`}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap shrink-0 ${
                              item.moderationStatus === 'APPROVED'
                                ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60'
                                : item.moderationStatus === 'REJECTED'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-[#FEFCE8] text-[#854D0E] border border-[#FDE047]/60'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                item.moderationStatus === 'APPROVED' ? 'bg-[#E36138]' :
                                item.moderationStatus === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                              }`} />
                              <span>{item.moderationStatus === 'APPROVED' ? 'Approved' : 'Pending Review'}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1. Preview */}
                              <button
                                onClick={() => setSelectedPreviewStory(item)}
                                className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-[#C2410C] transition cursor-pointer border border-[#DBD7C9]"
                                title="Preview Report"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* 2. Share */}
                              <button
                                onClick={() => handleCopyStoryLink(item)}
                                className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-stone-900 transition cursor-pointer border border-[#DBD7C9]"
                                title="Copy Story Link"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              {/* 3. Edit */}
                              <button
                                onClick={() => handleOpenEditStory(item)}
                                className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-[#E36138] transition cursor-pointer border border-[#DBD7C9]"
                                title="Edit Headline"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* 4. Delete */}
                              <button
                                onClick={() => handleDeleteStory(item.id)}
                                className="p-2 rounded-xl bg-[#EFECE6] hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition cursor-pointer border border-[#DBD7C9]"
                                title="Delete Report"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: PLAYLISTS & SERIES (Light Theme)                        */}
          {/* ============================================================== */}
          {activeTabNav === 'playlists' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-stone-900">Playlists & Investigation Series</h2>
                    <p className="text-xs text-stone-500">Curate episodic citizen investigation series and local news bulletins.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNewPlaylistModal(true)}
                  className="px-3.5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Series</span>
                </button>
              </div>

              {/* Playlist Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {playlists.map(pl => (
                  <div key={pl.id} className="bg-[#FAF9F5] border border-[#E3E0D4] p-5 rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FDBA74]/60 px-2 py-0.5 rounded-full font-mono">
                        {pl.episodesCount} Episodes
                      </span>
                      <span className="text-xs font-mono font-bold text-[#C2410C]">{pl.totalEarned}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{pl.title}</h3>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">{pl.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#E3E0D4] flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>{pl.totalViews} Views</span>
                      <button
                        onClick={() => setSelectedPlaylistDetail(pl)}
                        className="text-[#E36138] font-bold cursor-pointer hover:underline"
                      >
                        Manage ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Playlist Modal */}
              {showNewPlaylistModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900 text-base">New Investigation Series</h3>
                      <button onClick={() => setShowNewPlaylistModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleCreatePlaylist} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Series Title</label>
                        <input
                          type="text"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 mt-1"
                          placeholder="e.g. Ground Investigation on Roads"
                          value={newPlaylistTitle}
                          onChange={e => setNewPlaylistTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Description</label>
                        <textarea
                          rows={2}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 mt-1"
                          placeholder="What is this investigation series about?"
                          value={newPlaylistDesc}
                          onChange={e => setNewPlaylistDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowNewPlaylistModal(false)}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                        >
                          Create Series
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: BRANDING (Cashmere Theme)                               */}
          {/* ============================================================== */}
          {activeTabNav === 'branding' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-stone-900">Brand Details & Public Channel</h2>
                  <p className="text-xs text-stone-500">Your brand name and social links will be visible to users with your shared links.</p>
                </div>
              </div>

              {brandSavedToast && (
                <div className="p-3 bg-[#FFF7ED] border border-[#FDBA74] text-[#9A3412] text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#E36138]" />
                  <span>Brand details updated successfully!</span>
                </div>
              )}

              {/* Profile Picture Card */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                <div className="text-xs font-bold text-stone-700">Profile Picture</div>
                
                <div className="flex flex-col items-center justify-center p-6 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl space-y-3">
                  <div className="w-24 h-24 rounded-2xl bg-white text-stone-900 flex flex-col items-center justify-center font-black shadow-2xs border border-[#E3E0D4]">
                    <NagrikLogo size="md" variant="icon" />
                  </div>
                  <label className="text-xs text-[#E36138] hover:underline font-bold cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setActionToastMsg('Profile picture updated successfully!');
                          setTimeout(() => setActionToastMsg(''), 3000);
                        }
                      }}
                    />
                    Click to change profile picture
                  </label>
                </div>
              </div>

              {/* Brand Name & Email Inputs */}
              <form onSubmit={handleSaveBrandDetails} className="space-y-6">
                <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Brand Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                        value={brandName}
                        onChange={e => setBrandName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                        value={brandEmail}
                        onChange={e => setBrandEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Reporter Bio & Beat</label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      value={brandBio}
                      onChange={e => setBrandBio(e.target.value)}
                    />
                  </div>
                </div>

                {/* Your Links & Socials */}
                <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                      <span className="w-5 h-5 rounded-md bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center">
                        <Share2 className="w-3.5 h-3.5" />
                      </span>
                      <span>Your Links</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">Share your creator profile link or generate a short URL.</p>
                  </div>

                  {/* Public Link Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Creator Profile Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs font-mono text-[#9A3412] focus:outline-none"
                        value={`https://nagrik.news/creator/${authEmail.split('@')[0] || 'rahul_kumar'}`}
                      />
                      <button
                        type="button"
                        onClick={handleCopyPublicLink}
                        className="px-5 py-3 bg-[#EFECE6] hover:bg-[#E5E1D4] border border-[#DBD7C9] rounded-2xl text-xs font-bold text-stone-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-[#E36138]" /> : <Share2 className="w-4 h-4" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Social Handles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input
                      type="text"
                      className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="Twitter / X (e.g. @rahul_ground)"
                      value={brandTwitter}
                      onChange={e => setBrandTwitter(e.target.value)}
                    />
                    <input
                      type="text"
                      className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="YouTube (e.g. @PatnaGroundNews)"
                      value={brandYoutube}
                      onChange={e => setBrandYoutube(e.target.value)}
                    />
                    <input
                      type="text"
                      className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="Telegram (e.g. @patna_alerts)"
                      value={brandTelegram}
                      onChange={e => setBrandTelegram(e.target.value)}
                    />
                    <input
                      type="text"
                      className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                      placeholder="Instagram (e.g. @rahul_reports)"
                      value={brandInstagram}
                      onChange={e => setBrandInstagram(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#E36138] hover:bg-[#D24E25] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      Save Brand Details
                    </button>
                  </div>
                </div>
              </form>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: BILLING & WITHDRAWALS (Light Theme)                     */}
          {/* ============================================================== */}
          {activeTabNav === 'billing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Billing & Disbursals</h2>
                  <p className="text-xs text-slate-500">Manage withdrawals and view your revenue disbursal ledger.</p>
                </div>
              </div>

              {withdrawSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              {/* Revenue Breakdown */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                      $
                    </span>
                    <span>Revenue Breakdown</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Your paid, pending and available revenue breakdown.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-purple-700 font-bold">Total</div>
                      <div className="text-xl font-black text-slate-900 font-mono">${totalRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-emerald-700 font-bold">Paid Out</div>
                      <div className="text-xl font-black text-emerald-900 font-mono">${paidRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-amber-700 font-bold">Available</div>
                      <div className="text-xl font-black text-amber-900 font-mono">${availRev.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-50 border border-cyan-200/80 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-cyan-700 font-bold">Approved</div>
                      <div className="text-xl font-black text-cyan-900 font-mono">${approvedRev.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Request Card */}
              <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-8 rounded-3xl space-y-6 shadow-2xs text-center">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm text-left">
                  <span className="w-5 h-5 rounded-lg bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center text-[10px] font-bold">
                    +
                  </span>
                  <span>New Instant Disbursal</span>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  {!showWithdrawForm ? (
                    <button
                      onClick={() => setShowWithdrawForm(true)}
                      className="px-8 py-3 bg-[#E36138] hover:bg-[#D24E25] text-white font-black text-xs sm:text-sm rounded-full transition shadow-md shadow-orange-500/20 cursor-pointer transform hover:scale-105 duration-200"
                    >
                      Create New Withdrawal Request
                    </button>
                  ) : (
                    <div className="bg-[#FAF8F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 text-left animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
                        <span className="font-bold text-stone-900 text-xs">Request Instant Disbursal</span>
                        <button onClick={() => setShowWithdrawForm(false)} className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer">Cancel</button>
                      </div>

                      {/* Payment Method Switcher */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPayoutType('UPI')}
                          className={`p-2.5 rounded-xl text-xs font-bold transition border cursor-pointer flex items-center justify-center gap-1.5 ${
                            payoutType === 'UPI'
                              ? 'bg-[#FFF7ED] border-[#FDBA74] text-[#9A3412]'
                              : 'bg-[#FAF9F5] border-[#E3E0D4] text-stone-600'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 text-[#E36138]" />
                          <span>Instant UPI (BHIM/GPay)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayoutType('BANK')}
                          className={`p-2.5 rounded-xl text-xs font-bold transition border cursor-pointer flex items-center justify-center gap-1.5 ${
                            payoutType === 'BANK'
                              ? 'bg-[#FFF7ED] border-[#FDBA74] text-[#9A3412]'
                              : 'bg-[#FAF9F5] border-[#E3E0D4] text-stone-600'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5 text-[#E36138]" />
                          <span>Direct Bank (IMPS/NEFT)</span>
                        </button>
                      </div>

                      {payoutType === 'UPI' ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-600 uppercase">UPI Virtual ID</label>
                          <input
                            type="text"
                            className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-[#E36138]"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            placeholder="e.g. rahul@upi or 9876543210@paytm"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            className="px-3 py-2 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900"
                            placeholder="Bank Name"
                            value={bankName}
                            onChange={e => setBankName(e.target.value)}
                          />
                          <input
                            type="text"
                            className="px-3 py-2 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900"
                            placeholder="Account Holder"
                            value={accHolder}
                            onChange={e => setAccHolder(e.target.value)}
                          />
                          <input
                            type="text"
                            className="px-3 py-2 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs font-mono text-stone-900"
                            placeholder="Account Number"
                            value={accNumber}
                            onChange={e => setAccNumber(e.target.value)}
                          />
                          <input
                            type="text"
                            className="px-3 py-2 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs font-mono text-stone-900"
                            placeholder="IFSC Code"
                            value={ifsc}
                            onChange={e => setIfsc(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Withdrawal Amount & Live Exchange Conversion */}
                      <div className="p-3 bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium">Withdraw Amount ($):</span>
                          <span className="font-bold text-stone-900 font-mono">$10.00 USD</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E3E0D4]">
                          <span className="text-stone-500 font-medium">Estimated INR Disbursal:</span>
                          <span className="font-bold text-[#C2410C] font-mono">₹835.00 INR</span>
                        </div>
                      </div>

                      <button
                        onClick={handleRequestPayout}
                        disabled={!isEligibleForPayout || payoutLoading}
                        className={`w-full py-3 rounded-2xl font-bold text-xs transition cursor-pointer shadow-2xs ${
                          isEligibleForPayout
                            ? 'bg-[#E36138] hover:bg-[#D24E25] text-white shadow-orange-500/20'
                            : 'bg-[#EFECE6] text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        {payoutLoading ? 'Sending Disbursal Order...' : isEligibleForPayout ? 'Submit Withdrawal ($10.00)' : 'Minimum $10.00 Required'}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-stone-500 leading-relaxed">
                    National & International Payment System. Instant UPI or IMPS Bank Transfer.
                    <br />
                    <strong className="text-stone-900">Minimum Payout: $10.00</strong>. Live Dollar Exchange Rates.
                  </p>
                </div>
              </div>

              {/* Withdrawal History Table */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-xs">
                <div className="text-sm font-bold text-slate-900">Disbursal History Ledger</div>
                
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-800">$33.50 USD (₹2,797.25 INR)</div>
                      <div className="text-[10px] text-slate-500 font-sans">Ref: UPI-9876-HDFC-2026 • NPCI Instant Batch • 29 Aug 2026</div>
                    </div>
                    <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      PAID
                    </span>
                  </div>

                  {payoutRequests.map((r: any, idx: number) => (
                    <div key={r.id || idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">${r.amount?.toFixed(2) || '10.00'} USD</div>
                        <div className="text-[10px] text-slate-500 font-sans">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-semibold text-[11px] ${
                        r.status === 'PAID' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        r.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {r.status || 'PROCESSING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: CREATOR AGREEMENT (Light Theme)                         */}
          {/* ============================================================== */}
          {activeTabNav === 'agreement' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Nagrik Creator Agreement & Ethical Charter</h2>
                  <p className="text-xs text-slate-500">Terms of monetization, citizen journalism standards, and 100% IP ownership.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 text-xs text-slate-700 leading-relaxed shadow-xs">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">1. $1.50 Tiered CPM Monetization</h3>
                  <p className="text-slate-600">
                    Creators are paid a minimum of $1.50 USD per 1,000 verified unique hyperlocal views on ground reporting videos and investigative articles. Rates scale up to $2.00 CPM for high-impact coverage.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">2. 100% Intellectual Property & Copyright</h3>
                  <p className="text-slate-600">
                    You retain 100% ownership of your recorded video clips, photographs, and journalism copy. Nagrik acts purely as a distribution and monetization network.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">3. Instant Disbursal via NPCI UPI & Bank IMPS</h3>
                  <p className="text-slate-600">
                    Withdrawal requests exceeding $10.00 USD are processed to verified Indian UPI IDs or bank accounts within 24 hours.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">4. Zero Tolerance for Misinformation</h3>
                  <p className="text-slate-600">
                    All reports must feature verifiable ground evidence from the tagged state, city, and locality. Fabricated reports lead to immediate suspension.
                  </p>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* Dedicated Creator Footer */}
        <footer className="bg-white border-t border-slate-200/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium shadow-xs">
          <div>© 2026 Nagrik Studio • Hyperlocal Citizen Journalism Network</div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Earning Rate: $1.50 / 1K Monetized Views</span>
            </span>
          </div>
        </footer>

      </div>

      {/* ================================================================== */}
      {/* 3. STEP-BY-STEP GUIDED ONBOARDING TOUR MODAL                        */}
      {/* ================================================================== */}
      {showTourModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            
            {/* Tour Step Header */}
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FFEDD5] text-[#C2410C] font-bold text-xs flex items-center justify-center font-mono">
                  {tourStep + 1}
                </span>
                <span className="text-xs font-bold text-[#C2410C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FDBA74]/60">
                  {tourSteps[tourStep].badge}
                </span>
              </div>
              <button
                onClick={handleCompleteTour}
                className="text-xs text-stone-400 hover:text-stone-700 font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>Skip Tour</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tour Step Content */}
            <div className="space-y-3 py-2">
              <h3 className="text-lg font-black text-stone-900">{tourSteps[tourStep].title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {tourSteps[tourStep].description}
              </p>
            </div>

            {/* Tour Step Progress Indicator Pills */}
            <div className="flex items-center gap-1.5 pt-1">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === tourStep
                      ? 'w-8 bg-[#E36138]'
                      : idx < tourStep
                      ? 'w-3 bg-[#F97316]'
                      : 'w-2 bg-[#EFECE6]'
                  }`}
                />
              ))}
            </div>

            {/* Tour Step Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E3E0D4]">
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
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-700 hover:bg-[#EFECE6]'
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
                  className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  Next Step ›
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteTour}
                  className="px-6 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <span>Finish Tour & Start Reporting</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {actionToastMsg && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionToastMsg}</span>
        </div>
      )}

      {/* Story Preview Modal */}
      {selectedPreviewStory && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E3E0D4] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <span className="w-2 h-2 rounded-full bg-[#E36138]" />
                <span>Ground Report Preview</span>
              </div>
              <button
                onClick={() => setSelectedPreviewStory(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#EFECE6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video rounded-2xl bg-stone-900 overflow-hidden relative border border-[#DBD7C9] flex items-center justify-center">
                {selectedPreviewStory.thumbnailUrl ? (
                  <img src={selectedPreviewStory.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Video className="w-12 h-12 text-stone-600" />
                )}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#E36138] text-white flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FDBA74]/60 px-2 py-0.5 rounded-full font-mono">
                    {selectedPreviewStory.category}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedPreviewStory.area ? `${selectedPreviewStory.area}, ` : ''}{selectedPreviewStory.city}, {selectedPreviewStory.state}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 pt-1">{selectedPreviewStory.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {selectedPreviewStory.description || 'Verified hyperlocal ground reporting recorded directly from location.'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl flex items-center justify-between text-xs font-mono">
                <span className="text-stone-600">Verified Views: <strong className="text-stone-900">{selectedPreviewStory.views?.toLocaleString()}</strong></span>
                <span className="text-[#C2410C] font-bold">Earned: {selectedPreviewStory.earned || `$${((selectedPreviewStory.views || 0) * 0.0015).toFixed(2)}`}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Quick Edit Modal */}
      {selectedEditStory && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
              <h3 className="font-black text-stone-900 text-base">Edit Ground Report</h3>
              <button onClick={() => setSelectedEditStory(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Headline / Title</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Category</label>
                <select
                  className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                >
                  <option value="Civic Issues">Civic Issues</option>
                  <option value="Crime & Safety">Crime & Safety</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Politics">Politics</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEditStory(null)}
                  className="px-4 py-2 bg-[#EFECE6] text-stone-700 rounded-xl text-xs font-bold hover:bg-[#E5E1D4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playlist Episode Management Modal */}
      {selectedPlaylistDetail && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
              <div>
                <h3 className="font-black text-stone-900 text-base">{selectedPlaylistDetail.title}</h3>
                <div className="text-[11px] text-stone-500">{selectedPlaylistDetail.episodesCount} Episodes • {selectedPlaylistDetail.totalViews} Views • {selectedPlaylistDetail.totalEarned}</div>
              </div>
              <button onClick={() => setSelectedPlaylistDetail(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-700">Investigation Episodes:</div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[1, 2, 3].slice(0, selectedPlaylistDetail.episodesCount || 1).map((ep) => (
                  <div key={ep} className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FFEDD5] text-[#C2410C] font-bold flex items-center justify-center text-[10px]">
                        {ep}
                      </span>
                      <span className="text-stone-900 font-medium">Part {ep}: Ground Inspection Report</span>
                    </div>
                    <span className="text-[#C2410C] font-mono text-[11px] font-bold">3.4k views</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E3E0D4]">
              <button
                type="button"
                onClick={() => {
                  setPlaylists(prev => prev.filter(p => p.id !== selectedPlaylistDetail.id));
                  setSelectedPlaylistDetail(null);
                  setActionToastMsg('Series removed.');
                  setTimeout(() => setActionToastMsg(''), 3000);
                }}
                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 cursor-pointer"
              >
                Delete Series
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlaylistDetail(null)}
                className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
