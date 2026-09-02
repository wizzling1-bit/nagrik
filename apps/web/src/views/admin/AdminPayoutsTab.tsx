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
      <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <h3 className="text-sm font-black text-stone-900">Pending Withdrawal Requests ($10.00 Minimum)</h3>
        <button onClick={fetchPayouts} className="text-xs text-[#E36138] hover:text-[#C2410C] font-bold cursor-pointer">
          Refresh
        </button>
      </div>

      {payouts.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-12 text-center space-y-2 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-stone-900 text-sm">No Pending Payouts</h4>
          <p className="text-xs text-stone-500">All creator withdrawal requests have been processed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedPayouts.map((p) => (
            <div
              key={p.id || p._id}
              className="p-5 bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
            >
              <div>
                <div className="text-lg font-black text-emerald-700 font-mono">${p.amount?.toFixed(2)}</div>
                <div className="text-xs text-stone-700 font-bold mt-1">Creator ID: {p.creatorId}</div>
                <div className="text-[11px] text-stone-400 font-mono">Date: {new Date(p.createdAt || Date.now()).toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="UPI / Bank Tx Ref..."
                  value={payoutTxRef}
                  onChange={(e) => setPayoutTxRef(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#DBD7C9] rounded-xl text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
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
