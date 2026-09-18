import React, { useState } from 'react';
import { Layers, Plus, X, Play, Video, Eye, FolderPlus } from 'lucide-react';
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
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              SERIES & COLLECTIONS
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              {playlists.length} Active Series
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Playlists & Investigation Series
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Curate episodic citizen investigation stories into structured multi-part series.
          </p>
        </div>

        <button
          onClick={() => setShowNewPlaylistModal(true)}
          className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Series</span>
        </button>
      </div>

      {/* Playlist Grid or Empty State */}
      {playlists.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Investigation Series Created Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Group your related ground reports and episodic video investigations into a playlist series.
          </p>
          <button
            onClick={() => setShowNewPlaylistModal(true)}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create First Series</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPlaylists.map(pl => (
              <div key={pl.id} className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-2xs hover:border-brand-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full font-mono">
                    {pl.episodesCount || 0} Episodes
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{pl.totalEarned || '$0.00'}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{pl.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{pl.description || 'No description provided.'}</p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>{pl.totalViews || '0'} Total Views</span>
                  <button
                    onClick={() => setSelectedPlaylistDetail(pl)}
                    className="text-brand-600 dark:text-brand-400 font-bold cursor-pointer hover:underline"
                  >
                    Manage Series ›
                  </button>
                </div>
              </div>
            ))}
          </div>

          {playlists.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalItems={playlists.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* New Series Modal */}
      {showNewPlaylistModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif">Create Investigation Series</h3>
              <button onClick={() => setShowNewPlaylistModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Series Title</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Ward 14 Drainage & Hospital Road Delays"
                  value={newPlaylistTitle}
                  onChange={e => setNewPlaylistTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Editorial Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
                  placeholder="Summarize the core investigative focus of this series..."
                  value={newPlaylistDesc}
                  onChange={e => setNewPlaylistDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Create Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Series Detail Modal */}
      {selectedPlaylistDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif">{selectedPlaylistDetail.title}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {selectedPlaylistDetail.episodesCount || 0} Episodes • {selectedPlaylistDetail.totalViews || 0} Views
                </div>
              </div>
              <button onClick={() => setSelectedPlaylistDetail(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] dark:bg-slate-900 rounded-2xl border border-stone-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedPlaylistDetail.description || 'No description provided.'}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setPlaylists(prev => prev.filter(p => p.id !== selectedPlaylistDetail.id));
                  setSelectedPlaylistDetail(null);
                }}
                className="px-3 py-2 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                Delete Series
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlaylistDetail(null)}
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold cursor-pointer"
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
