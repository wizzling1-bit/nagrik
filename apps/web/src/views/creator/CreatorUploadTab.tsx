import React, { useState } from 'react';
import { Upload, Video, FileText, AlertCircle } from 'lucide-react';
import { CreatorTab } from './types';

interface CreatorUploadTabProps {
  token: string | null;
  apiBase: string;
  fetchDashboard: () => Promise<void>;
  fetchContents: () => Promise<void>;
  setActiveTabNav: (tab: CreatorTab) => void;
}

export const CreatorUploadTab: React.FC<CreatorUploadTabProps> = ({
  token,
  apiBase,
  fetchDashboard,
  fetchContents,
  setActiveTabNav
}) => {
  const [contentType, setContentType] = useState<'VIDEO' | 'ARTICLE'>('VIDEO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Civic Issues');
  const [stateName, setStateName] = useState('Bihar');
  const [cityName, setCityName] = useState('Patna');
  const [areaName, setAreaName] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [submittingContent, setSubmittingContent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, _folder: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadProgressMsg(`Uploading ${file.name} (Direct simulation)...`);

    setTimeout(() => {
      const mockCloudUrl = `https://storage.nagrik.news/uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      setMediaUrl(mockCloudUrl);
      setMediaFileName(file.name);
      setUploadingMedia(false);
      setUploadProgressMsg('');
    }, 1200);
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitError(null);

    if (!mediaUrl && contentType === 'VIDEO') {
      setSubmitError('Please upload or provide a video media URL before submitting.');
      return;
    }

    setSubmittingContent(true);
    try {
      const res = await fetch(`${apiBase}/creator/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: contentType,
          title,
          description,
          mediaUrl: mediaUrl || 'https://storage.nagrik.news/sample.mp4',
          thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
          category: selectedCategory,
          location: {
            state: stateName,
            city: cityName,
            area: areaName
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setTitle('');
        setDescription('');
        setMediaUrl('');
        setMediaFileName('');
        setThumbnailUrl('');
        setAreaName('');
        fetchContents();
        fetchDashboard();
        setActiveTabNav('files');
      } else {
        setSubmitError(data.error || 'Failed to submit report.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error creating content.');
    } finally {
      setSubmittingContent(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
      <form onSubmit={handleSubmitContent} className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-5 shadow-2xs">
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
  );
};
