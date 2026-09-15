import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminPayoutsTabProps {
  payouts: any[];
  fetchPayouts: () => Promise<void>;
  handleProcessPayout: (requestId: string, status: 'PAID' | 'REJECTED', txRef?: string) => Promise<void>;
}

export const AdminPayoutsTab: React.FC<AdminPayoutsTabProps> = ({
  payouts,
  fetchPayouts,
  handleProcessPayout
}) => {
  const [payoutTxRef, setPayoutTxRef] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const paginatedPayouts = payouts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">Pending Withdrawal Requests ($10.00 Minimum)</h3>
        <button onClick={fetchPayouts} className="text-xs text-brand-500 hover:text-brand-600 font-bold cursor-pointer">
          Refresh
        </button>
      </div>

      {payouts.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Pending Payouts</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">All creator withdrawal requests have been processed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedPayouts.map((p) => (
            <div
              key={p.id || p._id}
              className="p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
            >
              <div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">${p.amount?.toFixed(2)}</div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">Creator ID: {p.creatorId}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Date: {new Date(p.createdAt || Date.now()).toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="UPI / Bank Tx Ref..."
                  value={payoutTxRef}
                  onChange={(e) => setPayoutTxRef(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
                />
                <button
                  onClick={() => {
                    handleProcessPayout(p.id || p._id, 'PAID', payoutTxRef);
                    setPayoutTxRef('');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Mark Paid
                </button>
                <button
                  onClick={() => handleProcessPayout(p.id || p._id, 'REJECTED')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalItems={payouts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
