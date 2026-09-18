import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Filter,
  DollarSign
} from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminPayoutsTabProps {
  payouts: any[];
  fetchPayouts: () => Promise<void>;
  handleProcessPayout: (
    requestId: string,
    status: 'PAID' | 'REJECTED',
    txRef?: string,
    adminNote?: string
  ) => Promise<void>;
}

export const AdminPayoutsTab: React.FC<AdminPayoutsTabProps> = ({
  payouts,
  fetchPayouts,
  handleProcessPayout
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Clearance Modal State
  const [selectedPayoutForApproval, setSelectedPayoutForApproval] = useState<any | null>(null);
  const [approvalTxRef, setApprovalTxRef] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Rejection Modal State
  const [selectedPayoutForRejection, setSelectedPayoutForRejection] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Invalid payout method details');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayouts();
    setIsRefreshing(false);
  };

  // Helper for Indian Currency
  const formatINR = (amount: number) => {
    return `₹${(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalVolume = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingList = payouts.filter((p) => p.status === 'PENDING');
    const pendingVolume = pendingList.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidList = payouts.filter((p) => p.status === 'PAID');
    const paidVolume = paidList.reduce((sum, p) => sum + (p.amount || 0), 0);
    const rejectedCount = payouts.filter((p) => p.status === 'REJECTED').length;

    return {
      totalVolume,
      pendingCount: pendingList.length,
      pendingVolume,
      paidCount: paidList.length,
      paidVolume,
      rejectedCount
    };
  }, [payouts]);

  // Filter & Search Logic
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      // Status filter
      if (statusFilter !== 'ALL' && p.status !== statusFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();

      const creatorName =
        typeof p.creatorId === 'object' && p.creatorId !== null
          ? (p.creatorId.name || p.creatorId.email || p.creatorId.id || '').toLowerCase()
          : String(p.creatorId || '').toLowerCase();

      const payoutId = String(p.id || p._id || '').toLowerCase();
      const txRef = String(p.transactionReference || p.txRef || '').toLowerCase();
      const methodInfo =
        typeof p.payoutMethod === 'object' && p.payoutMethod !== null
          ? JSON.stringify(p.payoutMethod).toLowerCase()
          : String(p.payoutMethod || '').toLowerCase();

      return (
        creatorName.includes(query) ||
        payoutId.includes(query) ||
        txRef.includes(query) ||
        methodInfo.includes(query)
      );
    });
  }, [payouts, statusFilter, searchQuery]);

  const paginatedPayouts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPayouts.slice(startIndex, startIndex + pageSize);
  }, [filteredPayouts, currentPage, pageSize]);

  // Execute Approval
  const handleConfirmApproval = async () => {
    if (!selectedPayoutForApproval || !approvalTxRef.trim()) return;
    setIsSubmittingApproval(true);
    try {
      await handleProcessPayout(
        selectedPayoutForApproval.id || selectedPayoutForApproval._id,
        'PAID',
        approvalTxRef.trim(),
        approvalNote.trim() || undefined
      );
      setSelectedPayoutForApproval(null);
      setApprovalTxRef('');
      setApprovalNote('');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  // Execute Rejection
  const handleConfirmRejection = async () => {
    if (!selectedPayoutForRejection) return;
    const finalReason =
      rejectionReason === 'Other' ? customRejectionReason.trim() : rejectionReason;
    setIsSubmittingRejection(true);
    try {
      await handleProcessPayout(
        selectedPayoutForRejection.id || selectedPayoutForRejection._id,
        'REJECTED',
        undefined,
        finalReason || 'Request rejected by platform operations.'
      );
      setSelectedPayoutForRejection(null);
      setRejectionReason('Invalid payout method details');
      setCustomRejectionReason('');
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pending Approvals */}
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Pending Action</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {formatINR(metrics.pendingVolume)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {metrics.pendingCount}
            </span>
            <span>requests awaiting clearance</span>
          </div>
        </div>

        {/* KPI 2: Total Settled Payouts */}
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs hover:border-emerald-500/40 transition">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Settled Payouts</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(metrics.paidVolume)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {metrics.paidCount}
            </span>
            <span>disbursed to verified reporters</span>
          </div>
        </div>

        {/* KPI 3: Total Payout Volume */}
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs hover:border-orange-500/40 transition">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Lifetime Volume</span>
            <div className="p-1.5 rounded-lg bg-[#DE5227]/10 text-[#DE5227] border border-[#DE5227]/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatINR(metrics.totalVolume)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{payouts.length} total withdrawal records</span>
          </div>
        </div>

        {/* KPI 4: Security & Compliance Rule */}
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Compliance Rules</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white pt-1">
            ₹500.00 Min Threshold
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>UTR mandatory for bank clearances</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0B0F17] p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(
            [
              { key: 'ALL', label: 'All Requests', count: payouts.length },
              { key: 'PENDING', label: 'Pending', count: metrics.pendingCount },
              { key: 'PAID', label: 'Paid', count: metrics.paidCount },
              { key: 'REJECTED', label: 'Rejected', count: metrics.rejectedCount }
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setStatusFilter(item.key);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                statusFilter === item.key
                  ? 'bg-[#DE5227] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  statusFilter === item.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator, UPI, UTR..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#DE5227] shadow-2xs"
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0B0F17] dark:hover:bg-[#1A2234] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#DE5227]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Payout Requests List */}
      {filteredPayouts.length === 0 ? (
        <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            {statusFilter === 'PENDING'
              ? 'Zero Pending Clearances'
              : 'No Payout Requests Found'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No requests match "${searchQuery}". Try clearing your search query.`
              : statusFilter === 'PENDING'
              ? 'All creator earnings withdrawal requests are fully processed and up to date.'
              : 'There are no payout records under this filter criteria.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#DE5227] hover:underline font-bold"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedPayouts.map((p) => {
            const payoutId = p.id || p._id || '';
            const isPending = p.status === 'PENDING';
            const isPaid = p.status === 'PAID';
            const isRejected = p.status === 'REJECTED';

            const creatorName =
              typeof p.creatorId === 'object' && p.creatorId !== null
                ? p.creatorId.name || p.creatorId.email || 'Verified Journalist'
                : 'Journalist #' + String(p.creatorId || '').slice(-6);

            const creatorEmail =
              typeof p.creatorId === 'object' && p.creatorId !== null
                ? p.creatorId.email || ''
                : '';

            const methodDetails = p.payoutMethodDetails || p.payoutMethod || null;
            const upiId =
              typeof methodDetails === 'object' && methodDetails !== null
                ? methodDetails.upiId || methodDetails.upi || null
                : null;
            const bankDetails =
              typeof methodDetails === 'object' && methodDetails !== null
                ? methodDetails.accountNumber
                  ? `A/C: ${methodDetails.accountNumber} (${methodDetails.ifsc || 'IFSC'})`
                  : null
                : null;

            const txRef = p.transactionReference || p.txRef || null;

            return (
              <div
                key={payoutId}
                className="p-5 bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xs hover:border-[#DE5227]/30 transition group"
              >
                {/* Left Column: Amount and Creator */}
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isPaid
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : isRejected
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                        {formatINR(p.amount)}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : isRejected
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isPaid && <CheckCircle2 className="w-3 h-3" />}
                        {isRejected && <XCircle className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        <span>{p.status || 'PENDING'}</span>
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span>{creatorName}</span>
                      {creatorEmail && (
                        <span className="text-slate-400 font-normal font-mono text-[11px]">
                          ({creatorEmail})
                        </span>
                      )}
                    </div>

                    {/* Method & Destination info */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                      {upiId && (
                        <span className="bg-slate-100 dark:bg-[#0B0F17] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 font-mono font-medium text-slate-700 dark:text-slate-300">
                          UPI: {upiId}
                        </span>
                      )}
                      {bankDetails && (
                        <span className="bg-slate-100 dark:bg-[#0B0F17] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 font-mono font-medium text-slate-700 dark:text-slate-300">
                          Bank: {bankDetails}
                        </span>
                      )}
                      <span className="font-mono text-slate-400 text-[10px]">
                        Req: {new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* UTR / TxRef if paid */}
                    {txRef && (
                      <div className="pt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Bank UTR / TxRef:
                        </span>
                        <code className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">
                          {txRef}
                        </code>
                        <button
                          onClick={() => copyToClipboard(txRef, payoutId)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                          title="Copy UTR"
                        >
                          {copiedId === payoutId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Admin Note if present */}
                    {p.adminNote && (
                      <div className="text-[11px] text-slate-500 italic pt-0.5">
                        Note: {p.adminNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center w-full lg:w-auto justify-end">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedPayoutForApproval(p);
                          setApprovalTxRef('');
                          setApprovalNote('');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Clear Payout</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPayoutForRejection(p);
                          setRejectionReason('Invalid payout method details');
                          setCustomRejectionReason('');
                        }}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : isPaid ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Settled</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Declined</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalItems={filteredPayouts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 4. APPROVAL / CLEARANCE MODAL */}
      {selectedPayoutForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => !isSubmittingApproval && setSelectedPayoutForApproval(null)}
          />
          <div className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Clear Creator Payout
                  </h3>
                  <div className="text-[10px] text-slate-500">Record banking disbursement</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayoutForApproval(null)}
                disabled={isSubmittingApproval}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Payout Summary Info Box */}
            <div className="p-4 bg-stone-100/60 dark:bg-[#0B0F17] rounded-2xl border border-stone-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Disbursement Amount:</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatINR(selectedPayoutForApproval.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Journalist / Creator:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {typeof selectedPayoutForApproval.creatorId === 'object' &&
                  selectedPayoutForApproval.creatorId !== null
                    ? selectedPayoutForApproval.creatorId.name || selectedPayoutForApproval.creatorId.email
                    : String(selectedPayoutForApproval.creatorId || '')}
                </span>
              </div>
            </div>

            {/* UTR Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Bank UTR / Transaction Reference ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/429812981 or NEFT/SBIN..."
                  value={approvalTxRef}
                  onChange={(e) => setApprovalTxRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  autoFocus
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Mandatory for audit trail and compliance verification.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Admin Internal Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Settled via HDFC NetBanking"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPayoutForApproval(null)}
                disabled={isSubmittingApproval}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={!approvalTxRef.trim() || isSubmittingApproval}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmittingApproval ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Paid</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. REJECTION MODAL */}
      {selectedPayoutForRejection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => !isSubmittingRejection && setSelectedPayoutForRejection(null)}
          />
          <div className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Decline Payout Request
                  </h3>
                  <div className="text-[10px] text-slate-500">Return funds to creator balance</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayoutForRejection(null)}
                disabled={isSubmittingRejection}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Reason for Decline <span className="text-rose-500">*</span>
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 shadow-2xs"
                >
                  <option value="Invalid payout method details">Invalid UPI ID or Bank account info</option>
                  <option value="KYC verification pending">Identity / KYC verification required</option>
                  <option value="Suspected bot / non-human traffic violation">Suspected artificial or bot traffic</option>
                  <option value="Account review in progress">Account under operational review</option>
                  <option value="Other">Custom Reason...</option>
                </select>
              </div>

              {rejectionReason === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Specify Custom Reason
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter reason communicated to the creator..."
                    value={customRejectionReason}
                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-rose-500 shadow-2xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPayoutForRejection(null)}
                disabled={isSubmittingRejection}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                disabled={isSubmittingRejection}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmittingRejection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Declining...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Decline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
