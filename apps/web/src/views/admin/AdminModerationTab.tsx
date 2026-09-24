import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  AlertTriangle,
  Play,
  Video,
  Eye,
  ThumbsDown,
  ThumbsUp,
  Flag,
  MapPin,
  Calendar,
  User,
  Search,
  ShieldCheck,
  FileText,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Pagination } from '../../components/Pagination';
import { supabase } from '@/lib/supabase';

interface AdminModerationTabProps {
  modItems: any[];
  modStatusFilter: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED';
  setModStatusFilter: (st: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED') => void;
  fetchModerationQueue: () => Promise<void>;
  handleModerate: (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => Promise<void>;
}

const REJECTION_PRESETS = [
  'Low audio/video recording quality or corrupt media',
  'Inaccurate, unverified, or misleading factual report',
  'Violates community safety & ethical reporting standards',
  'Commercial advertisement, duplicate story, or spam',
  'Location metadata or beat coordinates could not be verified',
  'Contains abusive, explicit, or copyright-infringing content'
];

export const AdminModerationTab: React.FC<AdminModerationTabProps> = ({
  modItems,
  modStatusFilter,
  setModStatusFilter,
  fetchModerationQueue,
  handleModerate
}) => {
  const [selectedStoryModal, setSelectedStoryModal] = useState<any | null>(null);
  const [rejectingStory, setRejectingStory] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);
  const pageSize = 6;

  // Real-time listener for incoming ground reports
  useEffect(() => {
    const channel = supabase
      .channel('admin-moderation-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contents'
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setRealtimeNotification('🔔 New ground report submitted! Auto-refreshing queue...');
            fetchModerationQueue();
            setTimeout(() => setRealtimeNotification(null), 5000);
          } else if (payload.eventType === 'UPDATE') {
            fetchModerationQueue();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchModerationQueue]);

  // Filter items by search query
  const filteredItems = modItems.filter((item: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    const city = item.location?.city?.toLowerCase() || item.city?.toLowerCase() || '';
    const area = item.location?.area?.toLowerCase() || item.area?.toLowerCase() || '';
    const creator = typeof item.creatorId === 'object' ? item.creatorId?.name?.toLowerCase() || '' : '';
    return title.includes(q) || desc.includes(q) || city.includes(q) || area.includes(q) || creator.includes(q);
  });

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (st: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED') => {
    setModStatusFilter(st);
    setCurrentPage(1);
  };

  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onApprove = async (story: any) => {
    const id = story.id || story._id;
    if (!id) return;
    setIsProcessing(id);
    try {
      await handleModerate(id, 'APPROVED');
      if (selectedStoryModal?.id === id || selectedStoryModal?._id === id) {
        setSelectedStoryModal(null);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const onFlag = async (story: any) => {
    const id = story.id || story._id;
    if (!id) return;
    setIsProcessing(id);
    try {
      await handleModerate(id, 'FLAGGED', 'Flagged for editorial board review');
      if (selectedStoryModal?.id === id || selectedStoryModal?._id === id) {
        setSelectedStoryModal(null);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const openRejectModal = (story: any) => {
    setRejectingStory(story);
    setRejectionReason('');
  };

  const confirmReject = async () => {
    if (!rejectingStory) return;
    const id = rejectingStory.id || rejectingStory._id;
    if (!id) return;
    setIsProcessing(id);
    try {
      const reason = rejectionReason.trim() || 'Content does not meet editorial guidelines.';
      await handleModerate(id, 'REJECTED', reason);
      setRejectingStory(null);
      if (selectedStoryModal?.id === id || selectedStoryModal?._id === id) {
        setSelectedStoryModal(null);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const formatCategoryLabel = (cat: any, fallback?: any): string => {
    const c = cat || fallback;
    if (!c) return 'Civic';
    if (typeof c === 'object') return c.name || c.slug || 'Civic';
    return String(c);
  };

  const getCreatorName = (creator: any): string => {
    if (!creator) return 'Citizen Reporter';
    if (typeof creator === 'object') {
      return creator.name || creator.userId?.name || creator.email || 'Citizen Reporter';
    }
    return String(creator);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {realtimeNotification && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
            {realtimeNotification}
          </span>
          <button
            onClick={() => setRealtimeNotification(null)}
            className="text-amber-600 dark:text-amber-400 hover:opacity-75 p-1 rounded-lg transition"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Moderation Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#101522] p-4 sm:p-5 rounded-3xl border border-[#DCD1BF] dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 font-mono">
            Queue:
          </span>
          {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED'] as const).map((st) => {
            const isActive = modStatusFilter === st;
            const labelMap: Record<string, string> = {
              PENDING_REVIEW: 'In Review',
              APPROVED: 'Approved',
              REJECTED: 'Rejected',
              FLAGGED: 'Flagged'
            };
            return (
              <button
                key={st}
                onClick={() => handleFilterChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{labelMap[st]}</span>
                {isActive && (
                  <span className="bg-white/20 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                    {filteredItems.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Refresh Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, beat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={fetchModerationQueue}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Reload Moderation Queue"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No reports in {modStatusFilter.replace('_', ' ').toLowerCase()} queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {modStatusFilter === 'PENDING_REVIEW'
              ? 'All submitted citizen journalism reports have been reviewed by the editorial desk.'
              : `No reports currently match the ${modStatusFilter.replace('_', ' ').toLowerCase()} filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((story) => {
              const storyId = story.id || story._id;
              const isCurrentlyProcessing = isProcessing === storyId;
              const categoryLabel = formatCategoryLabel(story.category, story.categoryId);
              const creatorName = getCreatorName(story.creatorId);
              const isVideo = story.type === 'VIDEO';

              return (
                <div
                  key={storyId}
                  className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)] hover:border-[#DE5227]/60 hover:shadow-[0_10px_24px_-4px_rgba(30,24,16,0.12)] transition group"
                >
                  {/* Media Preview Box */}
                  <div
                    onClick={() => setSelectedStoryModal(story)}
                    className="relative h-48 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer group"
                  >
                    {story.thumbnailUrl ? (
                      <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : isVideo && story.mediaUrl ? (
                      <video
                        src={story.mediaUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center gap-1">
                        <Video className="w-8 h-8" />
                        <span className="text-[10px] font-mono">No Preview</span>
                      </div>
                    )}

                    {/* Gradient Overlay & Play Icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center group-hover:bg-black/40 transition">
                      <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition shadow-lg">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-black/75 text-white text-[10px] font-bold uppercase backdrop-blur-xs font-mono">
                        {isVideo ? 'Video Byte' : 'Article'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-brand-500/90 text-white text-[10px] font-bold uppercase backdrop-blur-xs font-mono">
                        {categoryLabel}
                      </span>
                    </div>

                    {/* Editorial Status Badge Top Right */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-xs ${
                        story.moderationStatus === 'APPROVED'
                          ? 'bg-emerald-500/90 text-white'
                          : story.moderationStatus === 'REJECTED'
                          ? 'bg-rose-500/90 text-white'
                          : story.moderationStatus === 'FLAGGED'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-amber-500/80 text-white animate-pulse'
                      }`}>
                        {story.moderationStatus === 'APPROVED' ? 'Approved' :
                         story.moderationStatus === 'REJECTED' ? 'Rejected' :
                         story.moderationStatus === 'FLAGGED' ? 'Flagged' : 'In Review'}
                      </span>
                    </div>

                    {/* Bottom Beat Strip */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs flex items-center justify-between font-mono">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 drop-shadow-xs truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {story.location?.area ? `${story.location.area}, ` : ''}{story.location?.city || story.city || 'Patna'}
                      </span>
                      <span className="text-[10px] text-slate-300 shrink-0">
                        {new Date(story.createdAt || story.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <User className="w-3 h-3 text-brand-500" />
                        <span className="truncate">{creatorName}</span>
                      </div>
                      
                      <h4
                        onClick={() => setSelectedStoryModal(story)}
                        className="font-black text-slate-900 dark:text-white text-sm line-clamp-2 hover:text-brand-500 cursor-pointer font-serif"
                      >
                        {story.title}
                      </h4>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {story.description || 'No description provided for this ground report.'}
                      </p>

                      {/* Show Rejection Reason if in REJECTED state */}
                      {story.moderationStatus === 'REJECTED' && story.rejectionReason && (
                        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 flex items-start gap-1.5 font-sans">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span><strong>Rejection Reason:</strong> {story.rejectionReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions Panel */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex gap-2">
                        {story.moderationStatus !== 'APPROVED' ? (
                          <button
                            disabled={isCurrentlyProcessing !== null}
                            onClick={() => onApprove(story)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{isCurrentlyProcessing ? 'Processing...' : 'Approve & Publish'}</span>
                          </button>
                        ) : (
                          <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Live in Citizen Feed</span>
                          </div>
                        )}

                        {story.moderationStatus !== 'REJECTED' && (
                          <button
                            disabled={isCurrentlyProcessing !== null}
                            onClick={() => openRejectModal(story)}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        {story.moderationStatus === 'PENDING_REVIEW' && (
                          <button
                            disabled={isCurrentlyProcessing !== null}
                            onClick={() => onFlag(story)}
                            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition cursor-pointer shadow-2xs"
                            title="Flag for Editorial Review"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedStoryModal(story)}
                        className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-1.5 rounded-xl transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspect Full Video & Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredItems.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Full Media Preview Modal */}
      {selectedStoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>Editorial Inspection Desk</span>
              </div>
              <button
                onClick={() => setSelectedStoryModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Media Player Area */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center max-h-96">
                {selectedStoryModal.type === 'VIDEO' && selectedStoryModal.mediaUrl ? (
                  <video
                    src={selectedStoryModal.mediaUrl}
                    controls
                    autoPlay
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <img
                    src={selectedStoryModal.thumbnailUrl || selectedStoryModal.mediaUrl}
                    alt=""
                    className="w-full max-h-96 object-contain"
                  />
                )}
              </div>

              {/* Story Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-bold uppercase">
                    {formatCategoryLabel(selectedStoryModal.category, selectedStoryModal.categoryId)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span>{selectedStoryModal.location?.area ? `${selectedStoryModal.location.area}, ` : ''}{selectedStoryModal.location?.city || selectedStoryModal.city || 'Patna'}</span>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Submitted: {new Date(selectedStoryModal.createdAt || selectedStoryModal.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-xl font-black font-serif text-slate-900 dark:text-white">
                  {selectedStoryModal.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  {selectedStoryModal.description || 'No detailed description provided.'}
                </p>

                {/* Metadata Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Reporter</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                      {getCreatorName(selectedStoryModal.creatorId)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Media Format</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                      {selectedStoryModal.type}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Current Status</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400 block mt-0.5">
                      {selectedStoryModal.moderationStatus}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Publication</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                      {selectedStoryModal.publicationStatus || 'UNPUBLISHED'}
                    </span>
                  </div>
                </div>

                {selectedStoryModal.moderationStatus === 'REJECTED' && selectedStoryModal.rejectionReason && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                    <strong>Rejection Reason:</strong> {selectedStoryModal.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2.5 justify-end">
              <button
                onClick={() => setSelectedStoryModal(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>

              {selectedStoryModal.moderationStatus !== 'REJECTED' && (
                <button
                  onClick={() => openRejectModal(selectedStoryModal)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Reject Report</span>
                </button>
              )}

              {selectedStoryModal.moderationStatus !== 'APPROVED' && (
                <button
                  onClick={() => onApprove(selectedStoryModal)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Approve & Publish to Citizen Feed</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Reject Ground Report</span>
              </div>
              <button
                onClick={() => setRejectingStory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Rejecting <strong className="text-slate-900 dark:text-white font-serif font-bold">"{rejectingStory.title}"</strong>. Please select or specify an editorial reason:
              </p>

              {/* Preset Reason Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {REJECTION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] text-left transition cursor-pointer border ${
                        rejectionReason === preset
                          ? 'bg-rose-500 text-white border-rose-500 font-medium'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Input */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom Rejection Reason / Creator Feedback
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this content was rejected so the reporter can rectify..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingStory(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
