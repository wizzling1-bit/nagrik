import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminAdsTabProps {
  ads: any[];
  token: string | null;
  apiBase: string;
  fetchAds: () => Promise<void>;
}

export const AdminAdsTab: React.FC<AdminAdsTabProps> = ({
  ads,
  token,
  apiBase,
  fetchAds
}) => {
  const [adName, setAdName] = useState('');
  const [adType, setAdType] = useState<'BANNER' | 'VIDEO' | 'SPONSORED'>('BANNER');
  const [adMediaUrl, setAdMediaUrl] = useState('');
  const [adUploadMode, setAdUploadMode] = useState<'upload' | 'url'>('upload');
  const [adFileName, setAdFileName] = useState('');
  const [adFrequency] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const paginatedAds = ads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName || !adMediaUrl) return;
    try {
      const res = await fetch(`${apiBase}/admin/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: adName,
          type: adType,
          mediaUrl: adMediaUrl,
          frequency: adFrequency
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdName('');
        setAdMediaUrl('');
        setAdFileName('');
        fetchAds();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
      <div className="lg:col-span-5 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
          <h3 className="font-black text-slate-900 dark:text-white text-sm">Create Local Ad Campaign</h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setAdUploadMode('upload')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                adUploadMode === 'upload' ? 'bg-brand-500 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setAdUploadMode('url')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                adUploadMode === 'url' ? 'bg-brand-500 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Web URL
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateAd} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Campaign Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Festive Sale"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ad Type</label>
            <select
              value={adType}
              onChange={(e: any) => setAdType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 shadow-2xs cursor-pointer"
            >
              <option value="BANNER">Banner Image (PNG / JPG / WebP)</option>
              <option value="VIDEO">In-Stream Video (MP4 / WebM)</option>
              <option value="SPONSORED">Sponsored Story Card</option>
            </select>
          </div>

          {adUploadMode === 'upload' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Upload Banner / Media File from Device
              </label>
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-500 bg-slate-50/50 dark:bg-[#0B0F17] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAdFileName(file.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setAdMediaUrl(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {adFileName ? adFileName : 'Click to select image or video file'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Supports JPG, PNG, WebP, MP4 up to 50MB</div>
                </div>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Creative Media URL</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={adMediaUrl}
                onChange={(e) => setAdMediaUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
          )}

          {/* Live Media Preview Box */}
          {adMediaUrl && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Preview</div>
              <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 relative group">
                {adType === 'VIDEO' || adMediaUrl.startsWith('data:video') ? (
                  <video src={adMediaUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={adMediaUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAdMediaUrl('');
                    setAdFileName('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-black py-3 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Publish Local Ad Campaign
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
        <h3 className="font-black text-slate-900 dark:text-white text-sm">Active Campaigns</h3>
        {ads.length === 0 ? (
          <div className="text-xs text-slate-500 dark:text-slate-400 p-6 bg-slate-50 dark:bg-[#0B0F17] rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            No custom ad campaigns deployed yet.
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedAds.map((a) => (
              <div
                key={a.id || a._id}
                className="p-3.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{a.type} • Status: {a.status}</div>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
            ))}

            <Pagination
              currentPage={currentPage}
              totalItems={ads.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
