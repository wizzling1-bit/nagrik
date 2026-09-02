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
      <div className="lg:col-span-5 bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
          <h3 className="font-black text-stone-900 text-sm">Create Local Ad Campaign</h3>
          <div className="flex bg-white p-1 rounded-xl border border-[#E3E0D4] text-[10px] font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setAdUploadMode('upload')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                adUploadMode === 'upload' ? 'bg-[#E36138] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setAdUploadMode('url')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                adUploadMode === 'url' ? 'bg-[#E36138] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Web URL
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateAd} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Campaign Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Festive Sale"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Ad Type</label>
            <select
              value={adType}
              onChange={(e: any) => setAdType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#E36138] shadow-2xs cursor-pointer"
            >
              <option value="BANNER">Banner Image (PNG / JPG / WebP)</option>
              <option value="VIDEO">In-Stream Video (MP4 / WebM)</option>
              <option value="SPONSORED">Sponsored Story Card</option>
            </select>
          </div>

          {adUploadMode === 'upload' ? (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Upload Banner / Media File from Device
              </label>
              <label className="border-2 border-dashed border-[#DBD7C9] hover:border-[#E36138] bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
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
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-stone-800">
                    {adFileName ? adFileName : 'Click to select image or video file'}
                  </div>
                  <div className="text-[10px] text-stone-500">Supports JPG, PNG, WebP, MP4 up to 50MB</div>
                </div>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Creative Media URL</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={adMediaUrl}
                onChange={(e) => setAdMediaUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
              />
            </div>
          )}

          {/* Live Media Preview Box */}
          {adMediaUrl && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Live Preview</div>
              <div className="h-32 w-full rounded-xl overflow-hidden bg-stone-900 border border-[#E3E0D4] relative group">
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
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#E36138] to-[#EA580C] hover:from-[#D24E25] hover:to-[#C2410C] text-white text-xs font-black py-3 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Publish Local Ad Campaign
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-4 shadow-xs">
        <h3 className="font-black text-stone-900 text-sm">Active Campaigns</h3>
        {ads.length === 0 ? (
          <div className="text-xs text-stone-500">No custom ad campaigns deployed yet.</div>
        ) : (
          <div className="space-y-3">
            {paginatedAds.map((a) => (
              <div
                key={a.id || a._id}
                className="p-3 bg-white border border-[#E3E0D4] rounded-2xl flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-bold text-stone-900">{a.name}</div>
                  <div className="text-[10px] text-stone-500 uppercase">{a.type} • Status: {a.status}</div>
                </div>
                <span className="text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
