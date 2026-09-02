import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Share2, Check } from 'lucide-react';
import { NagrikLogo } from '../../components/NagrikLogo';

interface CreatorBrandingTabProps {
  authEmail: string;
}

export const CreatorBrandingTab: React.FC<CreatorBrandingTabProps> = ({ authEmail }) => {
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState(authEmail || '');
  const [brandBio, setBrandBio] = useState('');
  const [brandTwitter, setBrandTwitter] = useState('');
  const [brandYoutube, setBrandYoutube] = useState('');
  const [brandTelegram, setBrandTelegram] = useState('');
  const [brandInstagram, setBrandInstagram] = useState('');
  const [brandSavedToast, setBrandSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyPublicLink = () => {
    const url = `https://nagrik.news/creator/${authEmail.split('@')[0] || 'reporter'}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSaveBrandDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSavedToast(true);
    setTimeout(() => setBrandSavedToast(false), 3000);
  };

  return (
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
                  setBrandSavedToast(true);
                  setTimeout(() => setBrandSavedToast(false), 3000);
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
                placeholder="e.g. Ground Truth News"
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
              placeholder="Covering municipal infrastructure, civic grievances, and ground realities in Bihar."
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Creator Profile Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                className="w-full px-4 py-3 bg-[#EFECE6] border border-[#DBD7C9] rounded-2xl text-xs font-mono text-[#9A3412] focus:outline-none"
                value={`https://nagrik.news/creator/${authEmail.split('@')[0] || 'reporter'}`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              type="text"
              className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
              placeholder="Twitter / X (e.g. @reporter_ground)"
              value={brandTwitter}
              onChange={e => setBrandTwitter(e.target.value)}
            />
            <input
              type="text"
              className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
              placeholder="YouTube Channel (@channel)"
              value={brandYoutube}
              onChange={e => setBrandYoutube(e.target.value)}
            />
            <input
              type="text"
              className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
              placeholder="Telegram Channel / Group"
              value={brandTelegram}
              onChange={e => setBrandTelegram(e.target.value)}
            />
            <input
              type="text"
              className="px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
              placeholder="Instagram Handle (@handle)"
              value={brandInstagram}
              onChange={e => setBrandInstagram(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E36138] hover:bg-[#D24E25] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-2xs"
            >
              Save Brand Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
