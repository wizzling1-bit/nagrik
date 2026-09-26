'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  RotateCcw,
  ExternalLink,
  Search,
  Edit2,
  AlertTriangle,
  Copy,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Building,
  CreditCard,
  Calendar,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface DemoPayoutItem {
  id: string;
  city: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer';
  date: string;
  txRef: string;
}

const DEFAULT_DEMO_RECORDS: DemoPayoutItem[] = [
  { id: 'demo-1', city: 'Mumbai', amount: 4250.00, method: 'UPI', date: '2026-09-18', txRef: 'NGK-TXN-9A3F21' },
  { id: 'demo-2', city: 'Delhi', amount: 2180.50, method: 'Bank Transfer', date: '2026-09-15', txRef: 'NGK-TXN-7B2E44' },
  { id: 'demo-3', city: 'Bengaluru', amount: 6890.00, method: 'UPI', date: '2026-09-12', txRef: 'NGK-TXN-5C8D09' },
  { id: 'demo-4', city: 'Jaipur', amount: 1540.75, method: 'UPI', date: '2026-09-10', txRef: 'NGK-TXN-3D6F18' },
  { id: 'demo-5', city: 'Hyderabad', amount: 3420.00, method: 'Bank Transfer', date: '2026-09-08', txRef: 'NGK-TXN-1E4A72' },
  { id: 'demo-6', city: 'Chennai', amount: 5100.25, method: 'UPI', date: '2026-09-05', txRef: 'NGK-TXN-8F2B33' },
  { id: 'demo-7', city: 'Pune', amount: 2860.00, method: 'Bank Transfer', date: '2026-09-03', txRef: 'NGK-TXN-6G1C55' },
  { id: 'demo-8', city: 'Kolkata', amount: 1975.50, method: 'UPI', date: '2026-09-01', txRef: 'NGK-TXN-4H9D67' },
  { id: 'demo-9', city: 'Lucknow', amount: 3710.00, method: 'UPI', date: '2026-08-28', txRef: 'NGK-TXN-2I7E89' },
  { id: 'demo-10', city: 'Ahmedabad', amount: 4580.75, method: 'Bank Transfer', date: '2026-08-25', txRef: 'NGK-TXN-0J5F01' },
  { id: 'demo-11', city: 'Kochi', amount: 1290.00, method: 'UPI', date: '2026-08-22', txRef: 'NGK-TXN-9K3G23' },
  { id: 'demo-12', city: 'Chandigarh', amount: 2645.50, method: 'Bank Transfer', date: '2026-08-19', txRef: 'NGK-TXN-7L1H45' },
];

export const AdminDemoPayoutsManager: React.FC = () => {
  const [items, setItems] = useState<DemoPayoutItem[]>([]);
  const [showDemo, setShowDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'ALL' | 'UPI' | 'Bank Transfer'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DemoPayoutItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DemoPayoutItem | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formCity, setFormCity] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMethod, setFormMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [formDate, setFormDate] = useState('');
  const [formTxRef, setFormTxRef] = useState('');
  const [formError, setFormError] = useState('');

  // Toast State
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatINR = (amt: number) =>
    `₹${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Generate random transaction reference
  const generateRandomTxRef = () => {
    const chars = '0123456789ABCDEF';
    let hex = '';
    for (let i = 0; i < 6; i++) {
      hex += chars[Math.floor(Math.random() * chars.length)];
    }
    return `NGK-TXN-${hex}`;
  };

  // Fetch initial data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('demo_payouts, show_demo_payouts')
        .eq('key', 'DEFAULT')
        .maybeSingle();

      if (!error && data) {
        setShowDemo(data.show_demo_payouts ?? true);
        if (Array.isArray(data.demo_payouts)) {
          setItems(data.demo_payouts);
        } else {
          setItems(DEFAULT_DEMO_RECORDS);
        }
      } else {
        // Fallback to defaults
        setItems(DEFAULT_DEMO_RECORDS);
        setShowDemo(true);
      }
    } catch (err) {
      console.error('Error loading demo payouts:', err);
      setItems(DEFAULT_DEMO_RECORDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save changes to Supabase RPC / API
  const persistChanges = async (newItems: DemoPayoutItem[], newShowDemo: boolean) => {
    setSaving(true);
    try {
      // 1. Try Supabase RPC
      const { error: rpcError } = await supabase.rpc('admin_manage_demo_payouts', {
        p_demo_payouts: newItems,
        p_show_demo_payouts: newShowDemo
      });

      if (rpcError) {
        // Fallback to Next.js API route
        const res = await fetch('/api/admin/demo-payouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            demoPayouts: newItems,
            showDemoPayouts: newShowDemo
          })
        });
        if (!res.ok) {
          throw new Error('Failed to persist demo payouts');
        }
      }
      return true;
    } catch (err: any) {
      console.error('Failed to save demo payouts:', err);
      showToast(err.message || 'Error saving changes', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Master Visibility Toggle
  const handleToggleVisibility = async () => {
    const nextVal = !showDemo;
    setShowDemo(nextVal);
    const success = await persistChanges(items, nextVal);
    if (success) {
      showToast(
        nextVal
          ? 'Demo records are now VISIBLE on public payment proof page'
          : 'Demo records are now HIDDEN from public payment proof page'
      );
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCity('');
    setFormAmount('');
    setFormMethod('UPI');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTxRef(generateRandomTxRef());
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: DemoPayoutItem) => {
    setEditingItem(item);
    setFormCity(item.city);
    setFormAmount(item.amount.toString());
    setFormMethod(item.method);
    setFormDate(item.date);
    setFormTxRef(item.txRef);
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCity.trim()) {
      setFormError('Please enter a city or location');
      return;
    }
    const parsedAmount = parseFloat(formAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid positive payout amount (₹)');
      return;
    }
    if (!formTxRef.trim()) {
      setFormError('Please enter a transaction reference');
      return;
    }

    let updated: DemoPayoutItem[];
    if (editingItem) {
      // Edit existing
      updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              city: formCity.trim(),
              amount: parsedAmount,
              method: formMethod,
              date: formDate || new Date().toISOString().split('T')[0],
              txRef: formTxRef.trim().toUpperCase()
            }
          : it
      );
    } else {
      // Add new
      const newItem: DemoPayoutItem = {
        id: `demo-${Date.now()}`,
        city: formCity.trim(),
        amount: parsedAmount,
        method: formMethod,
        date: formDate || new Date().toISOString().split('T')[0],
        txRef: formTxRef.trim().toUpperCase()
      };
      updated = [newItem, ...items];
    }

    setItems(updated);
    setIsEditModalOpen(false);
    const success = await persistChanges(updated, showDemo);
    if (success) {
      showToast(editingItem ? 'Payout record updated' : 'New payout proof record added');
    }
  };

  // Single Item Delete
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    const updated = items.filter((it) => it.id !== itemToDelete.id);
    setItems(updated);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);

    const success = await persistChanges(updated, showDemo);
    if (success) {
      showToast('Demo payout record removed');
    }
  };

  // Clear All Demo Data
  const handleClearAll = async () => {
    const updated: DemoPayoutItem[] = [];
    setItems(updated);
    setIsClearAllModalOpen(false);

    const success = await persistChanges(updated, showDemo);
    if (success) {
      showToast('All demo payout records removed successfully');
    }
  };

  // Reset to Default 12 Records
  const handleResetToDefault = async () => {
    setItems(DEFAULT_DEMO_RECORDS);
    setIsResetModalOpen(false);

    const success = await persistChanges(DEFAULT_DEMO_RECORDS, showDemo);
    if (success) {
      showToast('Restored default 12 illustrative demo records');
    }
  };

  // Calculated Metrics
  const metrics = useMemo(() => {
    const totalVolume = items.reduce((s, it) => s + (it.amount || 0), 0);
    const uniqueCities = new Set(items.map((it) => it.city)).size;
    const upiCount = items.filter((it) => it.method === 'UPI').length;
    const bankCount = items.filter((it) => it.method === 'Bank Transfer').length;

    return { totalVolume, uniqueCities, upiCount, bankCount };
  }, [items]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const matchesMethod = methodFilter === 'ALL' || it.method === methodFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        it.city.toLowerCase().includes(q) ||
        it.txRef.toLowerCase().includes(q) ||
        it.amount.toString().includes(q);

      return matchesMethod && matchesSearch;
    });
  }, [items, methodFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER / BANNER ── */}
      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 text-[#DE5227] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Transparency Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
              Payment Proof & Demo Data Manager
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage illustrative payout proofs shown on the public transparency ledger{' '}
              <code className="text-[11px] font-mono font-semibold bg-stone-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[#DE5227]">
                /payment-proof
              </code>
              . You can add new proof records, edit amounts, toggle public visibility, or clear all demo records.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Direct Public Link */}
            <Link
              href="/payment-proof"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition border border-stone-200 dark:border-slate-700 shadow-xs cursor-pointer group"
              title="Open public payment proof page in new tab"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DE5227] transition-colors" />
            </Link>

            {/* Refresh Data */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer border border-stone-200 dark:border-slate-700 shadow-xs"
              title="Refresh demo records from database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#DE5227]' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── MASTER VISIBILITY SWITCH STRIP ── */}
        <div className="mt-6 pt-5 border-t border-stone-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/80 dark:bg-[#0B0F17]/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                showDemo
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {showDemo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Show Demo Records on Public Page
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    showDemo
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  {showDemo ? 'ENABLED / VISIBLE' : 'DISABLED / HIDDEN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {showDemo
                  ? 'Fallback demo records are displayed whenever live database disbursements are empty.'
                  : 'Demo records are completely hidden. Public page will display an empty state if no live payouts exist.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleVisibility}
            disabled={saving}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              showDemo
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {showDemo ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Demo Records</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Enable Demo Records</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Records */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-2xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">Demo Records</span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-[#DE5227]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {items.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{showDemo ? 'Currently active' : 'Hidden from public'}</span>
          </div>
        </div>

        {/* Card 2: Total Volume */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-2xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">Total Demo Value</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(metrics.totalVolume)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Illustrative creator payouts</span>
          </div>
        </div>

        {/* Card 3: Cities Covered */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-2xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">Geographic Reach</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.uniqueCities}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Unique cities / beats</span>
          </div>
        </div>

        {/* Card 4: Disbursal Methods */}
        <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-5 rounded-2xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">Method Breakdown</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white font-mono pt-1">
            {metrics.upiCount} UPI • {metrics.bankCount} Bank Transfer
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Instant UTR settlement</span>
          </div>
        </div>
      </div>

      {/* ── CONTROLS & ACTION TOOLBAR ── */}
      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-sm">
        {/* Left: Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Method Filter Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#0B0F17] p-1 rounded-2xl border border-stone-200 dark:border-slate-800 shrink-0">
            {(['ALL', 'UPI', 'Bank Transfer'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  methodFilter === method
                    ? 'bg-[#DE5227] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {method === 'ALL' ? 'All Methods' : method}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, TxRef, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Add New Record Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 rounded-2xl bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Record</span>
          </button>

          {/* Reset to Default */}
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-stone-200 dark:border-slate-700 cursor-pointer shadow-2xs"
            title="Restore default 12 illustrative demo records"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {/* Clear All / Remove Demo Data Button */}
          <button
            onClick={() => setIsClearAllModalOpen(true)}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-900/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            title="Remove all demo data from public ledger"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove All Demo Data</span>
          </button>
        </div>
      </div>

      {/* ── RECORDS TABLE ── */}
      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08)]">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-stone-100/90 dark:bg-[#0B0F17] text-xs font-bold font-mono text-slate-500 uppercase tracking-wider border-b border-stone-200 dark:border-slate-800">
          <div className="col-span-1">#</div>
          <div className="col-span-2">City</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Method</div>
          <div className="col-span-2">Disbursal Date</div>
          <div className="col-span-2">Tx Reference</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center text-sm text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-[#DE5227] rounded-full animate-spin mx-auto" />
            <p className="font-serif">Loading demo payout records...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 font-serif">
                {items.length === 0 ? 'No Demo Records Active' : 'No records match search'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length === 0
                  ? 'All demo records have been removed. The public transparency page is operating in strict live-only mode.'
                  : `No records found matching "${searchQuery}". Clear your search query to view all.`}
              </p>
            </div>
            {items.length === 0 && (
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default 12 Records</span>
              </button>
            )}
          </div>
        )}

        {/* Rows */}
        {!loading &&
          filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-stone-100 dark:border-slate-800/40 last:border-0 hover:bg-stone-50/80 dark:hover:bg-[#141A29]/60 transition items-center text-xs"
            >
              {/* Index */}
              <div className="hidden sm:block col-span-1 font-mono text-slate-400 font-semibold">
                {idx + 1}
              </div>

              {/* City */}
              <div className="col-span-1 sm:col-span-2 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.city}</span>
              </div>

              {/* Amount */}
              <div className="col-span-1 sm:col-span-2 font-black font-mono text-emerald-600 dark:text-emerald-400 text-right sm:text-left">
                {formatINR(item.amount)}
              </div>

              {/* Method */}
              <div className="col-span-1 sm:col-span-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    item.method === 'UPI'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                  }`}
                >
                  <CreditCard className="w-3 h-3" />
                  <span>{item.method}</span>
                </span>
              </div>

              {/* Date */}
              <div className="col-span-1 sm:col-span-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{item.date}</span>
              </div>

              {/* TxRef */}
              <div className="col-span-2 sm:col-span-2 font-mono text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span className="bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-stone-200 dark:border-slate-700 truncate max-w-[130px]">
                  {item.txRef}
                </span>
                <button
                  onClick={() => copyToClipboard(item.txRef, item.id)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                  title="Copy reference"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-[#DE5227] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Edit record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Remove record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111A29] border border-stone-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#DE5227] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  {editingItem ? 'Edit Payout Proof Record' : 'Add New Payout Proof Record'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 font-medium">
                  {formError}
                </div>
              )}

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                  City / Location Jurisdiction *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Varanasi, Patna"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227]"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                  Disbursal Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="e.g. 4250.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227]"
                    required
                  />
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Bank Transfer'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormMethod(m)}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                        formMethod === m
                          ? 'bg-[#DE5227] text-white border-[#DE5227] shadow-sm'
                          : 'bg-stone-50 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-stone-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                  Disbursed Date *
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#DE5227]"
                  required
                />
              </div>

              {/* Transaction Ref */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Transaction Reference / TxRef *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormTxRef(generateRandomTxRef())}
                    className="text-[10px] text-[#DE5227] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="NGK-TXN-XXXXXX"
                  value={formTxRef}
                  onChange={(e) => setFormTxRef(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl bg-[#DE5227] hover:bg-[#C84318] text-white font-bold transition shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE SINGLE CONFIRMATION MODAL ── */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111A29] border border-stone-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Remove Demo Record?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove the record for{' '}
                <strong className="text-slate-800 dark:text-slate-200">{itemToDelete.city}</strong>{' '}
                ({formatINR(itemToDelete.amount)})?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={saving}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {saving ? 'Removing...' : 'Yes, Remove Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CLEAR ALL CONFIRMATION MODAL ── */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111A29] border border-stone-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                Remove All Demo Data?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This will delete all <strong className="text-slate-900 dark:text-white">{items.length} demo payout records</strong> from the system. Visitors viewing the public payment proof page will see 0 records until real payouts are cleared or you restore defaults.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-slate-800 text-[11px] text-slate-500 font-mono">
              Note: You can always click &ldquo;Reset Defaults&rdquo; later to restore the initial sample dataset.
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {saving ? 'Clearing...' : 'Yes, Remove All Demo Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESET TO DEFAULT CONFIRMATION MODAL ── */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111A29] border border-stone-200 dark:border-slate-700 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-[#DE5227] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Reset to Default Demo Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will reset your demo dataset back to the standard 12 illustrative verified city disbursements.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={saving}
                className="px-4 py-2 rounded-2xl bg-[#DE5227] hover:bg-[#C84318] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {saving ? 'Resetting...' : 'Restore 12 Records'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING TOAST ── */}
      {toastMsg && (
        <div
          className={`fixed bottom-8 right-6 z-50 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 border ${
            toastMsg.type === 'error'
              ? 'bg-rose-900/95 border-rose-700 text-white'
              : 'bg-slate-900 dark:bg-slate-800 border-slate-700 text-white'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toastMsg.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
            }`}
          />
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
};
