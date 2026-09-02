import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminModerationTabProps {
  modItems: any[];
  modStatusFilter: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED';
  setModStatusFilter: (st: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED') => void;
  fetchModerationQueue: () => Promise<void>;
  handleModerate: (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => Promise<void>;
}

export const AdminModerationTab: React.FC<AdminModerationTabProps> = ({
  modItems,
  modStatusFilter,
  setModStatusFilter,
  fetchModerationQueue,
  handleModerate
}) => {
  const [selectedStoryModal, setSelectedStoryModal] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reset to page 1 when filter changes
  const handleFilterChange = (st: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED') => {
    setModStatusFilter(st);
    setCurrentPage(1);
  };

  const paginatedItems = modItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E3E0D4] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase">Filter Status:</span>
          {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                modStatusFilter === st
                  ? 'bg-[#E36138] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DBD7C9]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={fetchModerationQueue}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EFECE6] border border-[#E3E0D4] text-xs font-bold text-stone-700 transition shadow-2xs cursor-pointer"
        >
          Reload Queue
        </button>
      </div>

      {modItems.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-stone-900 text-base">No stories in this queue</h3>
          <p className="text-xs text-stone-500">All submitted reports for this status have been handled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((story) => (
              <div
                key={story.id || story._id}
                className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div className="relative h-44 bg-stone-900">
                  <img
                    src={story.thumbnailUrl || story.mediaUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                    {story.type}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-[#E36138] font-semibold">
                      {story.location?.area}, {story.location?.city}
                    </div>
                    <h4 className="font-black text-stone-900 text-sm line-clamp-2 mt-1">{story.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{story.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E3E0D4] space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModerate(story.id || story._id, 'APPROVED')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-2xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(story.id || story._id, 'REJECTED')}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-2xs"
                      >
                        Reject
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedStoryModal(story)}
                      className="w-full bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] text-stone-700 text-xs font-bold py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      Preview Full Video & Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={modItems.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Story Detail Preview Modal */}
      {selectedStoryModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedStoryModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 sm:h-72 bg-stone-900 flex items-center justify-center">
              {selectedStoryModal.type === 'VIDEO' ? (
                <video src={selectedStoryModal.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={selectedStoryModal.thumbnailUrl || selectedStoryModal.mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-base font-black text-stone-900">{selectedStoryModal.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{selectedStoryModal.description}</p>
              <div className="text-xs text-[#E36138] font-bold">
                Location: {selectedStoryModal.location?.area}, {selectedStoryModal.location?.city}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleModerate(selectedStoryModal.id || selectedStoryModal._id, 'APPROVED');
                    setSelectedStoryModal(null);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                >
                  Approve Story & Publish to Feed
                </button>
                <button
                  onClick={() => {
                    handleModerate(selectedStoryModal.id || selectedStoryModal._id, 'REJECTED');
                    setSelectedStoryModal(null);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                >
                  Reject Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
