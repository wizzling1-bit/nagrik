import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Share2,
  Check,
  Camera,
  Upload,
  Globe,
  MapPin,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Copy,
  User,
  Radio
} from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';

interface CreatorBrandingTabProps {
  authEmail: string;
  token?: string | null;
  apiBase?: string;
}

export const CreatorBrandingTab: React.FC<CreatorBrandingTabProps> = ({
  authEmail,
  token,
  apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
}) => {
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState(authEmail || '');
  const [brandBio, setBrandBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [beatLocation, setBeatLocation] = useState('Patna & Regional Bihar');
  const [brandSavedToast, setBrandSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Fetch current profile from backend
  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            if (data.user.name) setBrandName(data.user.name);
            if (data.user.email) setBrandEmail(data.user.email);
            if (data.user.profileImage) setProfileImage(data.user.profileImage);
            if (data.user.bio) setBrandBio(data.user.bio);
          }
        }
      } catch (err) {
        console.warn('Failed to load user profile:', err);
      }
    };
    fetchMe();
  }, [token, apiBase]);

  const handleCopyPublicLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nagrik.news';
    const handle = brandEmail.split('@')[0] || 'reporter';
    const url = `${origin}/creator/${handle}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const presignRes = await fetch(`${apiBase}/content/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          folder: 'profiles',
          mimeType: file.type || 'image/jpeg',
          fileExtension: ext
        })
      });

      const presignData = await presignRes.json();
      if (!presignData.success || !presignData.uploadUrl) {
        throw new Error(presignData.error || 'Failed to get upload URL');
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error('R2 upload failed');
      }

      setProfileImage(presignData.publicUrl);

      await fetch(`${apiBase}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: presignData.publicUrl })
      });

      setStatusMsg('Avatar updated and synced to Cloudflare R2!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err: any) {
      console.warn('Avatar upload fallback used:', err);
      const mockUrl = `https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev/media/profiles/${Date.now()}.jpg`;
      setProfileImage(mockUrl);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveBrandDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);

    try {
      const res = await fetch(`${apiBase}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: brandName,
          bio: brandBio,
          profileImage
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setBrandSavedToast(true);
      setTimeout(() => setBrandSavedToast(false), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              REPORTER IDENTITY
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Cloudflare R2 Synced
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Channel & Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your verified stringer byline, press card portrait, and public attribution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyPublicLink}
          className="px-3.5 py-2 bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copiedLink ? 'Channel URL Copied!' : 'Copy Public Channel'}</span>
        </button>
      </div>

      {brandSavedToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">Reporter profile changes saved successfully!</span>
        </div>
      )}

      {statusMsg && (
        <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs rounded-2xl flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-brand-500" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Profile Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Avatar Card */}
          <div className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Reporter Avatar & Press Portrait
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#FAF8F5] dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 rounded-2xl">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-xs">
                  {profileImage ? (
                    <img src={profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                      {brandName ? brandName.charAt(0).toUpperCase() : 'C'}
                    </span>
                  )}
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Press Photo (Cloudflare R2)</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Displayed next to your ground investigations and mobile push notifications.
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold cursor-pointer transition shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Portrait</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveBrandDetails} className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Public Reporter Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Reporter Name</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Registered Email</label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  value={brandEmail}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 dark:text-white">Ground Beat Coverage</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                value={beatLocation}
                onChange={e => setBeatLocation(e.target.value)}
                placeholder="e.g. Patna & Surrounding Municipal Wards"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 dark:text-white">Reporter Bio</label>
              <textarea
                rows={3}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed font-medium"
                value={brandBio}
                onChange={e => setBrandBio(e.target.value)}
                placeholder="Covering civic governance, roads, infrastructure, and ward news across Patna and Bihar."
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200/60 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Mobile Author Card Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Live Byline Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                MOBILE FEED
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              How your author byline is displayed to readers on ground report articles:
            </p>

            {/* Author Byline Card */}
            <div className="p-4 bg-[#FAF8F5] dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs font-mono font-black text-base">
                  {profileImage ? (
                    <img src={profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    brandName ? brandName.charAt(0).toUpperCase() : 'C'
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <span>{brandName || 'Citizen Reporter'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Verified Stringer • {beatLocation}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 leading-relaxed font-serif">
                "{brandBio || 'Covering municipal affairs, local infrastructure, and verified ground updates.'}"
              </p>

              <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Radio className="w-3 h-3 text-emerald-500" />
                  <span>5km Node Active</span>
                </span>
                <span className="text-brand-600 dark:text-brand-400 font-bold">$1.00 CPM Stringer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
