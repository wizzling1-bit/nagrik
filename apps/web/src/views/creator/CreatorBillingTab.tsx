import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  FileText,
  Wallet,
  Zap,
  Building,
  AlertCircle,
  Clock,
  ArrowDownRight,
  Plus,
  X,
  RefreshCw,
  ShieldCheck,
  Check,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { CreatorStats } from './types';
import { Pagination } from '../../components/Pagination';

interface CreatorBillingTabProps {
  stats: CreatorStats | null;
  payoutRequests: any[];
  token: string | null;
  apiBase: string;
  fetchDashboard: () => Promise<void>;
  fetchPayouts: () => Promise<void>;
}

export const CreatorBillingTab: React.FC<CreatorBillingTabProps> = ({
  stats,
  payoutRequests,
  token,
  apiBase,
  fetchDashboard,
  fetchPayouts
}) => {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [payoutType, setPayoutType] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accHolder, setAccHolder] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('10.00');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [methodLoading, setMethodLoading] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');
  const [savedMethods, setSavedMethods] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const paginatedRequests = payoutRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRev = stats?.lifetimeEarnings ?? 0.00;
  const paidRev = stats?.totalPaid ?? (stats?.availableBalance ? Math.max(0, (stats.lifetimeEarnings || 0) - stats.availableBalance) : 0.00);
  const availRev = stats?.availableBalance ?? 0.00;
  const isEligibleForPayout = availRev >= 10.0;
  const progressPercent = Math.min(100, Math.round((availRev / 10.0) * 100));

  // Load saved payout methods
  const fetchPayoutMethods = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/creator/payout-methods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.methods)) {
          setSavedMethods(data.methods);
          const def = data.methods.find((m: any) => m.isDefault || m.is_default) || data.methods[0];
          if (def) {
            setPayoutType(def.type || 'UPI');
            if (def.upiId) setUpiId(def.upiId);
            if (def.bankDetails) {
              setBankName(def.bankDetails.bankName || '');
              setAccHolder(def.bankDetails.accHolder || '');
              setAccNumber(def.bankDetails.accNumber || '');
              setIfsc(def.bankDetails.ifsc || '');
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load payout methods:', err);
    }
  };

  useEffect(() => {
    fetchPayoutMethods();
  }, [token]);

  const handleSavePayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setMethodLoading(true);
    setWithdrawErrorMsg('');

    try {
      const bodyPayload = payoutType === 'UPI'
        ? { type: 'UPI', upiId }
        : {
            type: 'BANK',
            bankDetails: {
              bankName,
              accountHolderName: accHolder,
              accountNumber: accNumber,
              ifsc
            }
          };

      const res = await fetch(`${apiBase}/creator/payout-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save payout method');
      }

      setWithdrawSuccessMsg('Payment destination updated and saved!');
      setShowMethodModal(false);
      fetchPayoutMethods();
      setTimeout(() => setWithdrawSuccessMsg(''), 4000);
    } catch (err: any) {
      setWithdrawErrorMsg(err.message);
    } finally {
      setMethodLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setWithdrawErrorMsg('');
    setWithdrawSuccessMsg('');

    const parsedAmount = parseFloat(withdrawAmount);
    if (isNaN(parsedAmount) || parsedAmount < 10.00) {
      setWithdrawErrorMsg('Minimum disbursal request threshold is $10.00 USD.');
      return;
    }
    if (parsedAmount > availRev) {
      setWithdrawErrorMsg(`Requested amount ($${parsedAmount.toFixed(2)}) exceeds available balance ($${availRev.toFixed(2)}).`);
      return;
    }

    setPayoutLoading(true);
    try {
      const res = await fetch(`${apiBase}/creator/request-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parsedAmount,
          payoutMethod: payoutType,
          upiId: upiId || undefined,
          bankDetails: payoutType === 'BANK' ? { bankName, accHolder, accNumber, ifsc } : undefined,
          details: payoutType === 'UPI' ? { upiId } : { bankName, accHolder, accNumber, ifsc }
        })
      });

      const data = await res.json().catch(() => ({ success: false, error: 'Network response error' }));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to request disbursal. Verify payout details.');
      }

      setWithdrawSuccessMsg(`Disbursal of $${parsedAmount.toFixed(2)} USD scheduled! NPCI UPI settlement initiates within 24 hours.`);
      fetchDashboard();
      fetchPayouts();
      setShowWithdrawForm(false);
      setTimeout(() => setWithdrawSuccessMsg(''), 6000);
    } catch (err: any) {
      setWithdrawErrorMsg(err.message);
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              NPCI UPI & BANK DISBURSALS
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Zero Platform Commission
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Disbursals & Payouts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Request withdrawals once your verified reporting earnings reach the $10.00 USD minimum threshold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMethodModal(true)}
            className="px-3.5 py-2 bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Payment Channels</span>
          </button>

          <button
            onClick={() => setShowWithdrawForm(true)}
            disabled={!isEligibleForPayout}
            className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs ${
              isEligibleForPayout
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-emerald-600/20'
                : 'bg-stone-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Request Disbursal</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {withdrawSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{withdrawSuccessMsg}</span>
        </div>
      )}

      {withdrawErrorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="font-semibold">{withdrawErrorMsg}</span>
        </div>
      )}

      {/* Payout Threshold Progress Card */}
      <div className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-500" />
              <span>$10.00 Minimum Disbursal Threshold</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified ground reads automatically accumulate toward your next instant withdrawal.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-right">
            {isEligibleForPayout ? (
              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                ✓ Payout Unlocked (${availRev.toFixed(2)})
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">
                ${availRev.toFixed(2)} / $10.00 ({progressPercent}%)
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-stone-200/80 dark:border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEligibleForPayout
                ? 'bg-emerald-500'
                : 'bg-brand-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>$0.00</span>
          <span>$5.00</span>
          <span className="font-bold text-slate-900 dark:text-white">$10.00 Payout Goal</span>
        </div>
      </div>

      {/* Financial Position 3-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Available Balance</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${availRev.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ≈ ₹{(availRev * 86.5).toFixed(2)} INR
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Total Disbursed</span>
            <Wallet className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            ${paidRev.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {payoutRequests.filter(r => r.status === 'PAID').length} Completed Transfers
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Default Destination</span>
            <Building className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
            {upiId || (accNumber ? `Bank •••${accNumber.slice(-4)}` : 'UPI (Not set)')}
          </div>
          <button
            type="button"
            onClick={() => setShowMethodModal(true)}
            className="text-[11px] font-mono text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Update Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Disbursals Ledger Table */}
      <div className="bg-white dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-stone-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Disbursal History & UTR Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete audit trail of all withdrawals processed via NPCI UPI / IMPS.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {payoutRequests.length} Transactions
          </span>
        </div>

        {payoutRequests.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-900 dark:text-white">No disbursal requests yet</div>
            <p>Once your balance reaches $10.00, your withdrawals will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-b border-stone-200/80 dark:border-slate-800 font-bold">
                <tr>
                  <th className="p-4 font-bold">Request Ref / UTR</th>
                  <th className="p-4 font-bold">Timestamp</th>
                  <th className="p-4 font-bold">Amount (USD)</th>
                  <th className="p-4 font-bold">Estimated INR</th>
                  <th className="p-4 font-bold">Payout Method</th>
                  <th className="p-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                {paginatedRequests.map(r => (
                  <tr key={r.id || r._id} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono text-slate-900 dark:text-white font-bold">
                      {r.transactionReference || r.transaction_reference || (r.id ? r.id.substring(0, 8) : 'PENDING')}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(r.requestedAt || r.requested_at || r.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      ${Number(r.amount || 10).toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                      ₹{(Number(r.amount || 10) * 86.5).toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400 uppercase text-[11px]">
                      {r.payoutMethod || 'UPI'}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        r.status === 'PAID'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : r.status === 'REJECTED'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : r.status === 'PROCESSING'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.status === 'PAID' ? 'bg-emerald-500' : r.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                        }`} />
                        <span>{r.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payoutRequests.length > pageSize && (
              <div className="p-4 bg-white dark:bg-[#111827] border-t border-stone-200/90 dark:border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalItems={payoutRequests.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif">Request Revenue Disbursal</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Available balance: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${availRev.toFixed(2)} USD</strong>
                </p>
              </div>
              <button onClick={() => setShowWithdrawForm(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Withdrawal Amount (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.50"
                    min="10.00"
                    max={availRev}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Minimum $10.00</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(availRev.toFixed(2))}
                    className="text-brand-500 hover:underline cursor-pointer font-bold"
                  >
                    Withdraw All (${availRev.toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Payout Channel Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Disbursal Destination</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutType('UPI')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                      payoutType === 'UPI'
                        ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400'
                        : 'bg-[#FAF8F5] dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutType('BANK')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                      payoutType === 'BANK'
                        ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400'
                        : 'bg-[#FAF8F5] dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Bank IMPS</span>
                  </button>
                </div>
              </div>

              {payoutType === 'UPI' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="reporter@okaxis / 9876543210@paytm"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Bank Name (e.g. State Bank of India)"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    value={accHolder}
                    onChange={e => setAccHolder(e.target.value)}
                    placeholder="Account Holder Name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={accNumber}
                      onChange={e => setAccNumber(e.target.value)}
                      placeholder="Account Number"
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      value={ifsc}
                      onChange={e => setIfsc(e.target.value)}
                      placeholder="IFSC Code"
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-stone-50 dark:bg-slate-900/50 rounded-xl border border-stone-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
                <span>Estimated Payout:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{(parseFloat(withdrawAmount || '0') * 86.5).toFixed(2)} INR
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {payoutLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Confirm Disbursal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE PAYMENT METHODS MODAL */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-stone-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif">Payment Destination Settings</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure your default account for instant automated disbursals.</p>
              </div>
              <button onClick={() => setShowMethodModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayoutMethod} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutType('UPI')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                    payoutType === 'UPI'
                      ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400'
                      : 'bg-[#FAF8F5] dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>UPI ID (VPA)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutType('BANK')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                    payoutType === 'BANK'
                      ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400'
                      : 'bg-[#FAF8F5] dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank Account</span>
                </button>
              </div>

              {payoutType === 'UPI' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">UPI VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="reporter@okhdfcbank"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Bank Name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    value={accHolder}
                    onChange={e => setAccHolder(e.target.value)}
                    placeholder="Account Holder Full Name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={accNumber}
                      onChange={e => setAccNumber(e.target.value)}
                      placeholder="Account Number"
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      value={ifsc}
                      onChange={e => setIfsc(e.target.value)}
                      placeholder="IFSC"
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMethodModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={methodLoading}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {methodLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Payment Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
