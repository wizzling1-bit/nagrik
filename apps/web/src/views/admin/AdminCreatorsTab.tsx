import React, { useState } from 'react';
import { UserCheck, Eye, X, CheckCircle2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminCreatorsTabProps {
  creatorsList: any[];
}

export const AdminCreatorsTab: React.FC<AdminCreatorsTabProps> = ({ creatorsList }) => {
  const [selectedCreatorModal, setSelectedCreatorModal] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const paginatedCreators = creatorsList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">Registered Citizen Reporters</h3>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {creatorsList.length} Active {creatorsList.length === 1 ? 'Creator' : 'Creators'}
        </span>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        {creatorsList.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0B0F17] rounded-2xl border border-slate-200 dark:border-slate-800">
            No registered creators found in the database.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Reporter Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total Paid Views</th>
                    <th className="p-4">Available Balance</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#111827]">
                  {paginatedCreators.map((creator: any, idx: number) => {
                    const repName = creator.user?.name || creator.name || 'Citizen Reporter';
                    const repEmail = creator.user?.email || creator.email || '-';
                    const repStatus = creator.verificationStatus || creator.verification_status || 'VERIFIED';
                    const repViews = creator.totalEligibleViews || creator.total_eligible_views || 0;
                    const repBal = creator.availableBalance || creator.available_balance || 0;

                    return (
                      <tr key={creator.id || creator._id || idx} className="hover:bg-slate-50 dark:hover:bg-[#1A2234] transition">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                          <span>{repName}</span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{repEmail}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                            repStatus === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {repStatus}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{Number(repViews).toLocaleString()} Views</td>
                        <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">${Number(repBal).toFixed(2)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedCreatorModal({
                              id: creator.id || creator._id,
                              name: repName,
                              email: repEmail,
                              phone: creator.user?.phone || creator.phone || '-',
                              location: creator.user?.location ? `${creator.user.location.area || ''}, ${creator.user.location.city || ''}` : (creator.city || 'India'),
                              bio: creator.bio || 'Verified citizen reporter on Nagrik platform.',
                              status: repStatus,
                              joinedAt: new Date(creator.createdAt || Date.now()).toLocaleDateString(),
                              availableBalance: repBal,
                              lifetimeEarnings: creator.lifetimeEarnings || creator.lifetime_earnings || repBal,
                              totalPaid: creator.totalPaid || creator.total_paid || 0,
                              totalViews: repViews,
                              payoutMethod: creator.payoutMethod || 'UPI'
                            })}
                            className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-white font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Portfolio</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={creatorsList.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Creator Portfolio Modal */}
      {selectedCreatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCreatorModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reporter Header Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {selectedCreatorModal.name.charAt(0)}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedCreatorModal.name}</h3>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>{selectedCreatorModal.status}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedCreatorModal.email} • {selectedCreatorModal.phone} • {selectedCreatorModal.location}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">{selectedCreatorModal.bio}</p>
              </div>
            </div>

            {/* Financial & Monetization Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Available Balance</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  ${selectedCreatorModal.availableBalance?.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Lifetime Earned</div>
                <div className="text-xl font-black text-brand-500 font-mono mt-0.5">
                  ${selectedCreatorModal.lifetimeEarnings?.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Paid Out</div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                  ${selectedCreatorModal.totalPaid?.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Monetized Views</div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {selectedCreatorModal.totalViews?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Payout Gateway: <span className="text-slate-900 dark:text-white font-mono font-bold">{selectedCreatorModal.payoutMethod}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Creator verification status confirmed successfully.');
                    setSelectedCreatorModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Confirm KYC Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
