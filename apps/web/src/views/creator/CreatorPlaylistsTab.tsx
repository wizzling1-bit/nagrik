import React, { useState } from 'react';
import { Layers, PlusCircle, X } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface CreatorPlaylistsTabProps {
  playlists: any[];
  setPlaylists: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CreatorPlaylistsTab: React.FC<CreatorPlaylistsTabProps> = ({
  playlists,
  setPlaylists
}) => {
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [selectedPlaylistDetail, setSelectedPlaylistDetail] = useState<any | null>(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const paginatedPlaylists = playlists.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      title: newPlaylistTitle,
      description: newPlaylistDesc,
      episodesCount: 0,
      totalViews: '0',
      totalEarned: '$0.00'
    };

    setPlaylists([newPl, ...playlists]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setShowNewPlaylistModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]/50 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900">Playlists & Investigation Series</h2>
            <p className="text-xs text-stone-500">Curate episodic citizen investigation series and local news bulletins.</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewPlaylistModal(true)}
          className="px-3.5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Series</span>
        </button>
      </div>

      {/* Playlist Cards Grid or Empty State */}
      {playlists.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">No Investigation Series Created Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Group your related ground reports and episodic video investigations into a playlist series.
          </p>
          <button
            onClick={() => setShowNewPlaylistModal(true)}
            className="px-4 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create First Series</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {paginatedPlaylists.map(pl => (
              <div key={pl.id} className="bg-[#FAF9F5] border border-[#E3E0D4] p-5 rounded-3xl space-y-3 shadow-2xs hover:border-[#FDBA74] transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED] border border-[#FDBA74]/60 px-2 py-0.5 rounded-full font-mono">
                    {pl.episodesCount} Episodes
                  </span>
                  <span className="text-xs font-mono font-bold text-[#C2410C]">{pl.totalEarned}</span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{pl.title}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">{pl.description}</p>
                </div>

                <div className="pt-2 border-t border-[#E3E0D4] flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>{pl.totalViews} Views</span>
                  <button
                    onClick={() => setSelectedPlaylistDetail(pl)}
                    className="text-[#E36138] font-bold cursor-pointer hover:underline"
                  >
                    Manage ›
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={playlists.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* New Playlist Modal */}
      {showNewPlaylistModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">New Investigation Series</h3>
              <button onClick={() => setShowNewPlaylistModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Series Title</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 mt-1"
                  placeholder="e.g. Ground Investigation on Roads"
                  value={newPlaylistTitle}
                  onChange={e => setNewPlaylistTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 mt-1"
                  placeholder="What is this investigation series about?"
                  value={newPlaylistDesc}
                  onChange={e => setNewPlaylistDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Create Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playlist Episode Management Modal */}
      {selectedPlaylistDetail && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-3">
              <div>
                <h3 className="font-black text-stone-900 text-base">{selectedPlaylistDetail.title}</h3>
                <div className="text-[11px] text-stone-500">{selectedPlaylistDetail.episodesCount} Episodes • {selectedPlaylistDetail.totalViews} Views • {selectedPlaylistDetail.totalEarned}</div>
              </div>
              <button onClick={() => setSelectedPlaylistDetail(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-700">Investigation Episodes:</div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[1, 2, 3].slice(0, selectedPlaylistDetail.episodesCount || 1).map((ep) => (
                  <div key={ep} className="p-3 bg-[#FAF8F5] border border-[#E3E0D4] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FFEDD5] text-[#C2410C] font-bold flex items-center justify-center text-[10px]">
                        {ep}
                      </span>
                      <span className="text-stone-900 font-medium">Part {ep}: Ground Inspection Report</span>
                    </div>
                    <span className="text-[#C2410C] font-mono text-[11px] font-bold">3.4k views</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E3E0D4]">
              <button
                type="button"
                onClick={() => {
                  setPlaylists(prev => prev.filter(p => p.id !== selectedPlaylistDetail.id));
                  setSelectedPlaylistDetail(null);
                }}
                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 cursor-pointer"
              >
                Delete Series
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlaylistDetail(null)}
                className="px-5 py-2 bg-[#E36138] hover:bg-[#D24E25] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
