import React, { useState } from 'react';
import {
  FileText,
  Search,
  Video,
  Eye,
  Share2,
  Edit3,
  Trash2,
  X,
  Play,
  MapPin,
  Check,
  Calendar,
  Layers,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  Copy,
  Plus
} from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/context/CurrencyContext';

interface CreatorFilesTabProps {
  contents: any[];
  token: string | null;
  apiBase: string;
  fetchContents: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
}

export const CreatorFilesTab: React.FC<CreatorFilesTabProps> = ({
  contents,
  token,
  apiBase,
  fetchContents,
  fetchDashboard
}) => {
  const { rate, usdToInr } = useCurrency();
  const [filesSearch, setFilesSearch] = useState('');
  const [filesStatusFilter, setFilesStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED' | 'VIDEO' | 'ARTICLE'>('ALL');
  const [selectedPreviewStory, setSelectedPreviewStory] = useState<any | null>(null);
  const [selectedEditStory, setSelectedEditStory] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [actionToastMsg, setActionToastMsg] = useState('');
  const [deletingStory, setDeletingStory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredContents = contents.filter(c => {
    const matchQuery = !filesSearch ||
      c.title?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.location?.city?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.location?.area?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.city?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.state?.toLowerCase().includes(filesSearch.toLowerCase());

    let matchStatus = true;
    if (filesStatusFilter === 'APPROVED') matchStatus = c.moderationStatus === 'APPROVED' || c.publicationStatus === 'PUBLISHED';
    else if (filesStatusFilter === 'PENDING_REVIEW') matchStatus = c.moderationStatus === 'PENDING_REVIEW' || c.moderationStatus === 'DRAFT';
    else if (filesStatusFilter === 'REJECTED') matchStatus = c.moderationStatus === 'REJECTED';
    else if (filesStatusFilter === 'VIDEO') matchStatus = c.type === 'VIDEO';
    else if (filesStatusFilter === 'ARTICLE') matchStatus = c.type === 'ARTICLE';

    return matchQuery && matchStatus;
  });

  const paginatedContents = filteredContents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatCategoryLabel = (cat: any, fallbackCat?: any): string => {
    const c = cat || fallbackCat;
    if (!c) return 'Civic';
    if (typeof c === 'object') return c.name || c.slug || 'Civic';
    return String(c);
  };

  const handleCopyStoryLink = (story: any) => {
    const storyId = story.id || story._id;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nagrik.news';
    const url = `${origin}/news/${storyId}`;
    navigator.clipboard.writeText(url);
    setActionToastMsg('Story share link copied to clipboard!');
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const handleShareWhatsApp = (story: any) => {
    const storyId = story.id || story._id;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nagrik.news';
    const url = `${origin}/news/${storyId}`;
    const text = encodeURIComponent(`Check out this verified ground report on Nagrik:\n"${story.title}"\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleOpenEditStory = (story: any) => {
    setSelectedEditStory(story);
    setEditTitle(story.title || '');
    let catVal = 'civic-issues';
    if (typeof story.category === 'object' && story.category !== null) {
      catVal = story.category.slug || story.category.id || 'civic-issues';
    } else if (typeof story.categoryId === 'object' && story.categoryId !== null) {
      catVal = story.categoryId.slug || story.categoryId.id || 'civic-issues';
    } else if (typeof story.category === 'string' && story.category) {
      catVal = story.category;
    } else if (typeof story.categoryId === 'string' && story.categoryId) {
      catVal = story.categoryId;
    }
    setEditCategory(catVal);
    setEditDescription(story.description || '');
  };

  const handleSaveEditStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditStory) return;

    try {
      const id = selectedEditStory.id || selectedEditStory._id;
      const { error } = await supabase
        .from('contents')
        .update({
          title: editTitle,
          category_id: editCategory,
          description: editDescription
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
      }

      setSelectedEditStory(null);
      await fetchContents();
      setActionToastMsg('Story updated successfully!');
      setTimeout(() => setActionToastMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setSelectedEditStory(null);
    }
  };

  const handleConfirmDeleteStory = async () => {
    if (!deletingStory) return;
    const id = deletingStory.id || deletingStory._id;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
      }

      setDeletingStory(null);
      await fetchContents();
      await fetchDashboard();
      setActionToastMsg('Story deleted successfully.');
      setTimeout(() => setActionToastMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics for Content Library Overview
  const totalReportsCount = contents.length;
  const approvedCount = contents.filter(c => c.moderationStatus === 'APPROVED' || c.publicationStatus === 'PUBLISHED').length;
  const pendingCount = contents.filter(c => c.moderationStatus === 'PENDING_REVIEW' || c.moderationStatus === 'DRAFT').length;
  const totalVerifiedReads = contents.reduce((acc, c) => acc + (c.eligibleViews ?? c.eligible_views ?? c.views ?? 0), 0);
  const totalYieldINR = usdToInr((totalVerifiedReads / 1000) * 1.0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#DE5227] dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-[#DE5227]/20">
              CONTENT REPOSITORY
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Content Library & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor editorial verification statuses, inspect view performance, and generate public share links.
          </p>
        </div>
      </div>

      {/* 4-Card Repository Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl space-y-1 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(30,24,16,0.12)] transition-all">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Total Stories</p>
          <div className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
            {totalReportsCount}
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">Recorded</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl space-y-1 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(30,24,16,0.12)] transition-all">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Approved & Live</p>
          <div className="text-xl sm:text-2xl font-black font-serif text-emerald-700 dark:text-emerald-400">
            {approvedCount}
          </div>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Verified Public</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl space-y-1 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(30,24,16,0.12)] transition-all">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">In Editorial Review</p>
          <div className="text-xl sm:text-2xl font-black font-serif text-amber-700 dark:text-amber-400">
            {pendingCount}
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">Fact-Check Pending</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl space-y-1 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(30,24,16,0.12)] transition-all">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Total Accrued Yield</p>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#DE5227]">
            ₹{totalYieldINR.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">{totalVerifiedReads.toLocaleString()} reads</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#DE5227]/30 shadow-sm transition"
            placeholder="Search stories by headline, ward, or city..."
            value={filesSearch}
            onChange={e => {
              setFilesSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-1 bg-[#EDE5D8] dark:bg-slate-800 p-1.5 rounded-2xl border border-[#DCD1BF] dark:border-slate-700 text-xs shadow-2xs overflow-x-auto max-w-full">
          {[
            { id: 'ALL', label: 'All Reports' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'PENDING_REVIEW', label: 'In Review' },
            { id: 'REJECTED', label: 'Needs Revision' },
            { id: 'VIDEO', label: 'Videos' },
            { id: 'ARTICLE', label: 'Articles' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => {
                setFilesStatusFilter(st.id as any);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs whitespace-nowrap ${
                filesStatusFilter === st.id
                  ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#E2D8C7] dark:hover:bg-slate-700/60'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Reports Table / Card Container */}
      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
        {filteredContents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-600 dark:text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F5EE] dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FileText className="w-6 h-6" />
            </div>
            <div className="font-bold font-serif text-slate-900 dark:text-white text-base">No ground reports found</div>
            <p className="max-w-sm mx-auto text-xs">
              {filesSearch
                ? `No stories matched "${filesSearch}". Try clearing your search query.`
                : 'You have not submitted reports matching this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F5EE] dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-b border-[#E4DBD0] dark:border-slate-800 font-bold">
                <tr>
                  <th className="p-4 font-bold">Story Headline & Media</th>
                  <th className="p-4 font-bold">Geofence Beat</th>
                  <th className="p-4 font-bold">Verified Reads</th>
                  <th className="p-4 font-bold">Accrued Yield (₹)</th>
                  <th className="p-4 font-bold">Verification Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] dark:divide-slate-800/80 font-medium text-slate-800 dark:text-slate-300">
                {paginatedContents.map(item => {
                  const views = item.eligibleViews ?? item.eligible_views ?? item.views ?? 0;
                  const accruedINR = usdToInr((views / 1000) * 1.0);
                  return (
                    <tr key={item.id || item._id} className="hover:bg-[#F8F5EE]/80 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setSelectedPreviewStory(item)}
                            className="w-12 h-12 rounded-2xl bg-slate-900 overflow-hidden shrink-0 border border-[#DCD1BF] dark:border-slate-700 flex items-center justify-center cursor-pointer relative group shadow-2xs"
                          >
                            {item.thumbnailUrl ? (
                              <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                              <Video className="w-5 h-5 text-slate-400" />
                            )}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div
                              onClick={() => setSelectedPreviewStory(item)}
                              className="font-bold font-serif text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm hover:text-[#DE5227] cursor-pointer"
                            >
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                              <span className="text-[#DE5227] font-bold uppercase">{formatCategoryLabel(item.category, item.categoryId)}</span>
                              <span>•</span>
                              <span>{item.type === 'VIDEO' ? 'Video Byte' : 'Article'}</span>
                              <span>•</span>
                              <span>{new Date(item.createdAt || item.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#DE5227] shrink-0" />
                          <span>{item.location?.area || item.area || 'Ward Beat'}, {item.location?.city || item.city || 'Patna'}</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {views.toLocaleString()}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        ₹{accruedINR.toFixed(2)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap shrink-0 ${
                          item.moderationStatus === 'APPROVED' || item.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                            : item.moderationStatus === 'REJECTED'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item.moderationStatus === 'APPROVED' || item.publicationStatus === 'PUBLISHED' ? 'bg-emerald-500' :
                            item.moderationStatus === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                          }`} />
                          <span>{item.moderationStatus === 'APPROVED' || item.publicationStatus === 'PUBLISHED' ? 'Approved & Live' : item.moderationStatus === 'REJECTED' ? 'Needs Revision' : 'In Review'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPreviewStory(item)}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-[#F2ECE1] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#DE5227] transition cursor-pointer border border-stone-200 dark:border-slate-700"
                            title="Preview Story"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleCopyStoryLink(item)}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-[#F2ECE1] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#DE5227] transition cursor-pointer border border-stone-200 dark:border-slate-700"
                            title="Copy Public Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleShareWhatsApp(item)}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer border border-stone-200 dark:border-slate-700"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditStory(item)}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-[#F2ECE1] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#DE5227] transition cursor-pointer border border-stone-200 dark:border-slate-700"
                            title="Edit Report"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingStory(item)}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:border-rose-300 transition cursor-pointer border border-stone-200 dark:border-slate-700"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredContents.length > pageSize && (
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#111827] border-t border-stone-200/90 dark:border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredContents.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Toast */}
      {actionToastMsg && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-950 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 border border-slate-800">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionToastMsg}</span>
        </div>
      )}

      {/* Story Preview Modal */}
      {selectedPreviewStory && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="p-4 bg-[#F2ECE1] dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Eye className="w-4 h-4 text-[#DE5227]" />
                <span className="font-serif">Story Preview & Evidence</span>
              </div>
              <button
                onClick={() => setSelectedPreviewStory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Media Preview */}
              {selectedPreviewStory.type === 'VIDEO' ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    src={selectedPreviewStory.mediaUrl}
                    controls
                    poster={selectedPreviewStory.thumbnailUrl}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : selectedPreviewStory.mediaUrl ? (
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-72 flex items-center justify-center">
                  <img
                    src={selectedPreviewStory.mediaUrl}
                    alt={selectedPreviewStory.title}
                    className="w-full h-full object-cover max-h-72"
                  />
                </div>
              ) : null}

              {/* Title & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#DE5227] dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-[#DE5227]/20 font-mono">
                    {formatCategoryLabel(selectedPreviewStory.category, selectedPreviewStory.categoryId)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(selectedPreviewStory.createdAt || selectedPreviewStory.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-serif font-black text-slate-900 dark:text-white leading-snug">
                  {selectedPreviewStory.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {selectedPreviewStory.description}
                </p>
              </div>

              {/* Geofence & Yield Strip */}
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#DE5227]" />
                  <span>{selectedPreviewStory.location?.area || 'Local Beat'}, {selectedPreviewStory.location?.city || 'Patna'}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {(selectedPreviewStory.eligibleViews ?? selectedPreviewStory.eligible_views ?? 0).toLocaleString()} Verified Reads
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F2ECE1] dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleCopyStoryLink(selectedPreviewStory)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#E8E0D2] dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Share Link</span>
              </button>

              <button
                onClick={() => setSelectedPreviewStory(null)}
                className="px-5 py-2 bg-[#DE5227] hover:bg-[#C84318] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Edit Modal */}
      {selectedEditStory && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="p-4 bg-[#F2ECE1] dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Edit3 className="w-4 h-4 text-[#DE5227]" />
                <span className="font-serif">Edit Ground Report</span>
              </div>
              <button
                onClick={() => setSelectedEditStory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStory} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Story Headline</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Ground Report Narrative</label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={5}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DE5227]/25 font-medium leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEditStory(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStory && (
        <ConfirmModal
          isOpen={!!deletingStory}
          title="Delete Ground Report"
          message={`Are you sure you want to permanently delete "${deletingStory.title}"? This action cannot be undone and accrued reads will be removed.`}
          confirmText="Delete Report"
          cancelText="Keep Report"
          onConfirm={handleConfirmDeleteStory}
          onClose={() => setDeletingStory(null)}
          variant="danger"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
