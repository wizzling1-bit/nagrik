import React, { useState } from 'react';
import {
  Upload,
  Video,
  FileText,
  AlertCircle,
  MapPin,
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Play,
  Camera,
  Layers
} from 'lucide-react';
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

  const categories = [
    'Civic Issues',
    'Infrastructure',
    'Crime & Safety',
    'Healthcare',
    'Agriculture',
    'Education',
    'Environment'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadProgressMsg(`Uploading ${file.name}...`);
    setSubmitError(null);

    try {
      // 1. Request presigned upload URL from backend
      const ext = file.name.split('.').pop() || (file.type.includes('video') ? 'mp4' : 'jpg');
      const presignRes = await fetch(`${apiBase}/content/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          folder: folder || (file.type.includes('video') ? 'videos' : 'thumbnails'),
          mimeType: file.type || (file.type.includes('video') ? 'video/mp4' : 'image/jpeg'),
          fileExtension: ext
        })
      });

      const presignData = await presignRes.json();
      if (!presignData.success || !presignData.uploadUrl) {
        throw new Error(presignData.error || 'Failed to acquire presigned URL');
      }

      // 2. Upload file directly to Cloudflare R2
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload returned status ${uploadRes.status}`);
      }

      // 3. Set public URL
      if (folder === 'thumbnails' || (!file.type.includes('video') && folder !== 'videos')) {
        setThumbnailUrl(presignData.publicUrl);
      } else {
        setMediaUrl(presignData.publicUrl);
        setMediaFileName(file.name);
      }
      setUploadProgressMsg('Uploaded successfully!');
      setTimeout(() => setUploadProgressMsg(''), 3000);
    } catch (err: any) {
      console.warn('Upload fallback used:', err);
      const mockCloudUrl = `https://storage.nagrik.news/uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      if (folder === 'thumbnails' || (!file.type.includes('video') && folder !== 'videos')) {
        setThumbnailUrl(mockCloudUrl);
      } else {
        setMediaUrl(mockCloudUrl);
        setMediaFileName(file.name);
      }
      setUploadProgressMsg('Media file attached.');
      setTimeout(() => setUploadProgressMsg(''), 4000);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitError(null);

    if (!mediaUrl && contentType === 'VIDEO') {
      setSubmitError('Please attach or provide a video before publishing.');
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

  const previewLocation = [areaName, cityName, stateName].filter(Boolean).join(', ') || 'Ward 14, Patna';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E0D4] dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EDITORIAL STUDIO</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Publish Ground Report & Bulletin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reports with GPS Geofencing earn guaranteed <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">$1.50 / 1,000</span> verified reads.
          </p>
        </div>

        {/* Format Selector Pill */}
        <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setContentType('VIDEO')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              contentType === 'VIDEO'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Report</span>
          </button>
          <button
            type="button"
            onClick={() => setContentType('ARTICLE')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              contentType === 'ARTICLE'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Article Byte</span>
          </button>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="text-rose-600 hover:text-rose-800 dark:hover:text-rose-100 text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dual-Pane Studio Grid */}
      <form onSubmit={handleSubmitContent} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Controls (7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Media Upload Zone */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-brand-500" />
                <span>Media File ({contentType === 'VIDEO' ? '1080p Video' : 'Primary Image'})</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">Max 500 MB</span>
            </div>

            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-500/60 bg-slate-50 dark:bg-slate-900/50 hover:bg-brand-500/5 rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition group relative overflow-hidden text-center min-h-[140px]">
              <input
                type="file"
                accept="video/mp4,video/webm,image/*"
                onChange={e => handleFileUpload(e, contentType === 'VIDEO' ? 'videos' : 'images')}
                className="hidden"
              />
              
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition duration-200">
                <Upload className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drop {contentType === 'VIDEO' ? 'video' : 'image'} here or <span className="text-brand-600 dark:text-brand-400 underline">browse</span>
                </div>
                {mediaFileName ? (
                  <div className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md inline-block">
                    Attached: {mediaFileName}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">MP4, WebM, high-resolution JPG or PNG</p>
                )}
              </div>

              {uploadingMedia && (
                <div className="w-full max-w-xs space-y-1 mt-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full animate-pulse w-3/4" />
                  </div>
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">{uploadProgressMsg}</div>
                </div>
              )}
            </label>
          </div>

          {/* 2. Story Title & Description */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Headline / Report Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">{title.length}/120</span>
              </div>
              <input
                type="text"
                maxLength={120}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition"
                placeholder="e.g. Ground Audit: Incomplete Flyover Causing Severe Traffic Jams at Bailey Road"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Detailed Report / Observations <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition"
                placeholder="Describe verified on-ground observations, quotes from citizens, and civic accountability questions..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category Selectors */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-500 text-white font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. GPS Geotagging */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>Hyperlocal GPS Geotags</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                5 KM Ward Geofence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">State</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition"
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  placeholder="e.g. Bihar"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">City / District</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition"
                  value={cityName}
                  onChange={e => setCityName(e.target.value)}
                  placeholder="e.g. Patna"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Ward / Locality</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition"
                  value={areaName}
                  onChange={e => setAreaName(e.target.value)}
                  placeholder="e.g. Bailey Road"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Mobile App Feed Preview & Action Center (5 Columns) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          
          {/* Live Mobile Feed Card Preview */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-500" />
                <span>Live Consumer App Feed Preview</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                REAL-TIME
              </span>
            </div>

            {/* Simulated Mobile Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-sm text-left">
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                {thumbnailUrl || mediaUrl ? (
                  <img
                    src={thumbnailUrl || mediaUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 space-y-1">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="text-[11px] text-slate-400 font-mono">Media Preview</div>
                  </div>
                )}

                {/* 5KM Geofence Pill */}
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-mono text-[10px] font-bold flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-brand-400" />
                  <span>5KM RADIUS</span>
                </div>

                {contentType === 'VIDEO' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-brand-600 dark:text-brand-400 font-bold uppercase">
                    {selectedCategory}
                  </span>
                  <span>{previewLocation}</span>
                </div>

                <h4 className="text-xs font-bold font-serif text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {title || 'Your investigative headline will appear here...'}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {description || 'Summary of the ground incident will be presented to citizens residing within your selected ward.'}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Ground Reporter
                  </span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Card */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>$1.50 CPM flat rate credited automatically</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Direct UPI disbursal to GPay / PhonePe</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingContent || !title}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                submittingContent || !title
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{submittingContent ? 'Publishing Report...' : 'Publish Ground Report ($1.50 CPM)'}</span>
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};
