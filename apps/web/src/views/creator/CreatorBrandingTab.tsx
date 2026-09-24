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
import { supabase, uploadFileToR2 } from '@/lib/supabase';

interface CreatorBrandingTabProps {
  authEmail: string;
  token?: string | null;
  apiBase?: string;
}

export const CreatorBrandingTab: React.FC<CreatorBrandingTabProps> = ({
  authEmail,
  token,
  apiBase = '/api'
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

  // Fetch current profile from Supabase
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id || (typeof window !== 'undefined' ? localStorage.getItem('creator_id') : null);
        if (!userId) return;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        const { data: creatorData } = await supabase
          .from('creators')
          .select('*')
          .or(`id.eq.${userId},user_id.eq.${userId}`)
          .maybeSingle();

        if (userData || creatorData) {
          if (userData?.name) setBrandName(userData.name);
          if (userData?.email || authData.user?.email) setBrandEmail(userData?.email || authData.user?.email || '');
          if (userData?.profile_image) setProfileImage(userData.profile_image);
          if (creatorData?.bio) setBrandBio(creatorData?.bio);
        }
      } catch (err) {
        console.warn('Failed to load user profile via Supabase:', err);
      }
    };
    fetchMe();
  }, []);

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
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg('Avatar image size must be under 10 MB.');
      return;
    }

    setUploadingAvatar(true);
    setStatusMsg('Uploading avatar to Cloudflare R2...');

    try {
      const uploadRes = await uploadFileToR2(file, 'profiles');
      const finalUrl = uploadRes.publicUrl || uploadRes.mediaUrl;
      setProfileImage(finalUrl);

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (userId) {
        await supabase.from('users').update({ profile_image: finalUrl }).eq('id', userId);
      }

      setStatusMsg('Avatar updated and synced successfully!');
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      setStatusMsg(`Upload failed: ${err.message || 'Unable to upload avatar image'}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveBrandDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (userId) {
        await supabase.from('users').update({
          name: brandName,
          profile_image: profileImage
        }).eq('id', userId);

        await supabase.from('creators').update({
          bio: brandBio
        }).eq('user_id', userId);
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
            <span className="text-xs font-mono font-bold text-[#DE5227] dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-[#DE5227]/20">
              REPORTER IDENTITY
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Cloudflare R2 Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Channel & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your verified stringer byline, press card portrait, and public attribution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyPublicLink}
          className="px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#DE5227] text-xs font-bold rounded-2xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
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
        <div className="p-3 bg-orange-500/10 border border-[#DE5227]/20 text-[#DE5227] dark:text-orange-400 text-xs rounded-2xl flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-[#DE5227]" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Profile Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Avatar Card */}
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <h3 className="text-sm font-black font-serif text-slate-900 dark:text-white">
              Reporter Avatar & Press Portrait
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              This portrait appears alongside your byline and on civic ground report verification cards.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-[#DE5227] to-amber-400 p-1 shrink-0 shadow-md">
                <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center font-mono font-black text-2xl text-slate-800 dark:text-white">
                  {profileImage ? (
                    <img src={profileImage} alt="Reporter Avatar" className="w-full h-full object-cover" />
                  ) : (
                    brandName ? brandName.charAt(0).toUpperCase() : 'C'
                  )}
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Recommended: Square JPG or PNG, at least 400x400px.
                </div>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EDE5D8] hover:bg-[#E3D9C9] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold cursor-pointer transition border border-[#DCD1BF] dark:border-slate-700 shadow-2xs">
                  {uploadingAvatar ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploadingAvatar ? 'Uploading to R2...' : 'Upload New Portrait'}</span>
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
          <form onSubmit={handleSaveBrandDetails} className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <h3 className="text-sm font-black font-serif text-slate-900 dark:text-white">
              Public Reporter Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Reporter Name</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25"
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
                  className="w-full px-3.5 py-2.5 bg-[#F2ECE1] dark:bg-slate-800/60 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  value={brandEmail}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 dark:text-white">Ground Beat Coverage</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25"
                value={beatLocation}
                onChange={e => setBeatLocation(e.target.value)}
                placeholder="e.g. Patna & Surrounding Municipal Wards"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 dark:text-white">Reporter Bio</label>
              <textarea
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 resize-none leading-relaxed font-medium"
                value={brandBio}
                onChange={e => setBrandBio(e.target.value)}
                placeholder="Covering civic governance, roads, infrastructure, and ward news across Patna and Bihar."
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200/60 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#DE5227] hover:bg-[#C84318] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-orange-500/20 flex items-center gap-1.5 disabled:opacity-60"
              >
                {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Mobile Author Card Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Live Byline Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
                MOBILE FEED
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              How your author byline is displayed to readers on ground report articles:
            </p>

            {/* Author Byline Card */}
            <div className="p-4 bg-[#F8F5EE] dark:bg-slate-900 rounded-2xl border border-[#DCD1BF] dark:border-slate-800 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DE5227] text-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs font-mono font-black text-base">
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
                <span className="text-[#DE5227] dark:text-orange-400 font-bold">$1.00 CPM Stringer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
