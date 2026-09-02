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
  Check
} from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';

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
  const [filesSearch, setFilesSearch] = useState('');
  const [filesStatusFilter, setFilesStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_REVIEW'>('ALL');
  const [selectedPreviewStory, setSelectedPreviewStory] = useState<any | null>(null);
  const [selectedEditStory, setSelectedEditStory] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [actionToastMsg, setActionToastMsg] = useState('');
  const [deletingStory, setDeletingStory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredContents = contents.filter(c => {
    const matchQuery = !filesSearch ||
      c.title?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.city?.toLowerCase().includes(filesSearch.toLowerCase()) ||
      c.state?.toLowerCase().includes(filesSearch.toLowerCase());
    const matchStatus = filesStatusFilter === 'ALL' || c.moderationStatus === filesStatusFilter;
    return matchQuery && matchStatus;
  });

  const paginatedContents = filteredContents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopyStoryLink = (story: any) => {
    const url = `https://nagrik.news/story/${story.id || story._id}`;
    navigator.clipboard.writeText(url);
    setActionToastMsg('Story share link copied to clipboard!');
    setTimeout(() => setActionToastMsg(''), 3000);
  };

  const handleOpenEditStory = (story: any) => {
    setSelectedEditStory(story);
    setEditTitle(story.title || '');
    setEditCategory(story.category || 'Civic Issues');
  };

  const handleSaveEditStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditStory || !token) return;

    try {
      const res = await fetch(`${apiBase}/creator/content/${selectedEditStory.id || selectedEditStory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory
        })
      });

      const data = await res.json();
      if (data.success) {
        setSelectedEditStory(null);
        fetchContents();
        setActionToastMsg('Story headline updated successfully!');
        setTimeout(() => setActionToastMsg(''), 3000);
      }
    } catch {
      setSelectedEditStory(null);
    }
  };

  const handleConfirmDeleteStory = async () => {
    if (!deletingStory || !token) return;
    const id = deletingStory.id || deletingStory._id;
    setIsDeleting(true);
    try {
      const res = await fetch(`${apiBase}/creator/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeletingStory(null);
        fetchContents();
        fetchDashboard();
        setActionToastMsg('Story deleted successfully.');
        setTimeout(() => setActionToastMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">File Manager & Ground Reports</h2>
          <p className="text-xs text-slate-500">Manage all your ground reports, review statuses, and copy public share links.</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] border border-[#E3E0D4] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#E36138] shadow-2xs"
            placeholder="Search reports by title or city..."
            value={filesSearch}
            onChange={e => setFilesSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#EFECE6] p-1 rounded-xl border border-[#DBD7C9] text-xs shadow-2xs">
          {(['ALL', 'APPROVED', 'PENDING_REVIEW'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilesStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                filesStatusFilter === st
                  ? 'bg-[#E36138] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st === 'ALL' ? 'All Files' : st === 'APPROVED' ? 'Approved' : 'In Review'}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl overflow-hidden shadow-2xs">
        {filteredContents.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white">
            No reports found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFECE6] text-stone-700 border-b border-[#DBD7C9] font-bold">
                <tr>
                  <th className="p-4 font-bold">Report / Video Title</th>
                  <th className="p-4 font-bold">Location</th>
                  <th className="p-4 font-bold">Views</th>
                  <th className="p-4 font-bold">Earned</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E0D4] font-medium text-stone-700 bg-white">
                {paginatedContents.map(item => (
                  <tr key={item.id || item._id} className="hover:bg-[#F5F2EB]/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#EFECE6] overflow-hidden shrink-0 border border-[#DBD7C9] flex items-center justify-center">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Video className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 truncate max-w-sm">{item.title}</div>
                          <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                            <span className="text-[#C2410C] font-bold">{item.category || 'Civic'}</span>
                            <span>•</span>
                            <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 whitespace-nowrap">
                      {item.location?.city || item.city || 'Bihar'}, {item.location?.state || item.state || 'India'}
                    </td>
                    <td className="p-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                      {item.views?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C2410C] whitespace-nowrap">
                      ${((item.views || 0) * 0.0015).toFixed(2)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap shrink-0 ${
                        item.moderationStatus === 'APPROVED'
                          ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/60'
                          : item.moderationStatus === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-[#FEFCE8] text-[#854D0E] border border-[#FDE047]/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          item.moderationStatus === 'APPROVED' ? 'bg-[#E36138]' :
                          item.moderationStatus === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                        }`} />
                        <span>{item.moderationStatus === 'APPROVED' ? 'Approved' : 'Pending Review'}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPreviewStory(item)}
                          className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-[#C2410C] transition cursor-pointer border border-[#DBD7C9]"
                          title="Preview Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCopyStoryLink(item)}
                          className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-stone-900 transition cursor-pointer border border-[#DBD7C9]"
                          title="Copy Story Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditStory(item)}
                          className="p-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E1D4] text-stone-600 hover:text-[#E36138] transition cursor-pointer border border-[#DBD7C9]"
                          title="Edit Headline"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingStory(item)}
                          className="p-2 rounded-xl bg-[#EFECE6] hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition cursor-pointer border border-[#DBD7C9]"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-white border-t border-[#E3E0D4]">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredContents.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Toast Notification */}
      {actionToastMsg && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionToastMsg}</span>
        </div>
      )}

      {/* Story Preview Modal */}
      {selectedPreviewStory && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E3E0D4] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <span className="w-2 h-2 rounded-full bg-[#E36138]" />
                <span>Ground Report Preview</span>
              </div>
              <button
                onClick={() => setSelectedPreviewStory(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#EFECE6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video rounded-2xl bg-stone-900 overflow-hidden relative border border-[#DBD7C9] flex items-center justify-center">
                {selectedPreviewStory.thumbnailUrl ? (
                  <img src={selectedPreviewStory.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Video className="w-12 h-12 text-stone-600" />
                )}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#E36138] text-white flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FDBA74]/60 px-2 py-0.5 rounded-full font-mono">
                    {selectedPreviewStory.category}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedPreviewStory.location?.area ? `${selectedPreviewStory.location.area}, ` : ''}{selectedPreviewStory.location?.city || selectedPreviewStory.city || 'Bihar'}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 pt-1">{selectedPreviewStory.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {selectedPreviewStory.description || 'Verified hyperlocal ground reporting recorded directly from location.'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-2xl flex items-center justify-between text-xs font-mono">
                <span className="text-stone-600">Verified Views: <strong className="text-stone-900">{selectedPreviewStory.views?.toLocaleString() || 0}</strong></span>
                <span className="text-[#C2410C] font-bold">Earned: ${((selectedPreviewStory.views || 0) * 0.0015).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Quick Edit Modal */}
      {selectedEditStory && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
              <h3 className="font-black text-stone-900 text-base">Edit Ground Report</h3>
              <button onClick={() => setSelectedEditStory(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Headline / Title</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Category</label>
                <select
                  className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#DBD7C9] rounded-xl text-xs text-stone-900 focus:bg-[#FAF9F5] focus:outline-none focus:border-[#E36138]"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                >
                  <option value="Civic Issues">Civic Issues</option>
                  <option value="Crime & Safety">Crime & Safety</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Politics">Politics</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEditStory(null)}
                  className="px-4 py-2 bg-[#EFECE6] text-stone-700 rounded-xl text-xs font-bold hover:bg-[#E5E1D4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SweetAlert Style Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingStory)}
        title="Delete Ground Report"
        message={`Are you sure you want to delete the report "${deletingStory?.title}" from Nagrik? This action cannot be undone.`}
        confirmText="Yes, Delete Report"
        cancelText="Keep Report"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteStory}
        onClose={() => setDeletingStory(null)}
      />
    </div>
  );
};
