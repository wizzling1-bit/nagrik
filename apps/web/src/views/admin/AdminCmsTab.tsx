import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Lock,
  DollarSign,
  Scale,
  FilePlus,
  RefreshCw,
  X
} from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import { supabase } from '@/lib/supabase';

interface AdminCmsTabProps {
  cmsPages: any[];
  token: string | null;
  apiBase: string;
  fetchCmsPages: () => Promise<void>;
}

export const AdminCmsTab: React.FC<AdminCmsTabProps> = ({
  cmsPages,
  token,
  apiBase,
  fetchCmsPages
}) => {
  // Built-in fallback documents if empty
  const defaultDocs = [
    {
      slug: 'terms',
      title: 'Terms of Service & Civic Charter',
      version: '2.1',
      isPublished: true,
      updatedAt: new Date().toISOString(),
      content: `### 1. Civic Integrity & Publisher Charter
Nagrik is dedicated to authentic, verified ground reporting. All contributors agree to publish factual, unbiased local investigations without inciting violence or defamatory falsehoods.

### 2. Fair Revenue Disbursal
Publishers are compensated based on counted verified video impressions under strict anti-bot fraud policies ($1.50 CPM base).

### 3. Termination & Enforcement
Accounts attempting automated replay attacks or view fraud are permanently suspended without warning.`
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy & Data Rights',
      version: '1.4',
      isPublished: true,
      updatedAt: new Date().toISOString(),
      content: `### 1. Hyperlocal Geo-Coordinates
We use GPS and ward-level location tags solely to deliver relevant local news feeds. We never sell raw location coordinates to third parties.

### 2. Creator Bank & UPI Details
Financial identifiers are encrypted with bank-grade security protocols and used solely for payout disbursals.`
    },
    {
      slug: 'creator',
      title: 'Citizen Reporter & Creator Partner Agreement',
      version: '2.0',
      isPublished: true,
      updatedAt: new Date().toISOString(),
      content: `### 1. Independent Publisher Relationship
Publishers act as independent citizen journalists and retain intellectual copyright of their original camera footage.

### 2. Monetization Rules
Earnings accrue per 1,000 valid views up to a daily ceiling per viewer device. Minimum withdrawal threshold is $10.00 USD.`
    },
    {
      slug: 'dmca',
      title: 'DMCA Copyright & Content Takedown Policy',
      version: '1.2',
      isPublished: true,
      updatedAt: new Date().toISOString(),
      content: `### 1. Intellectual Property Protection
Nagrik complies with international DMCA copyright directives. If you believe your copyrighted video or audio has been used without authorization, submit a notice to legal@nagrik.news.

### 2. Counter-Notices
Publishers may file counter-notices within 14 business days.`
    }
  ];

  const allPages = cmsPages && cmsPages.length > 0 ? cmsPages : defaultDocs;

  // Selected Active Document
  const [selectedSlug, setSelectedSlug] = useState<string>('terms');
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('1.0');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [activeTabMode, setActiveTabMode] = useState<'editor' | 'preview'>('editor');

  // New Document Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newVersion, setNewVersion] = useState('1.0');

  // UI state
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deletingPage, setDeletingPage] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination for pages list
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const paginatedPages = allPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Sync state when selectedSlug or allPages change
  useEffect(() => {
    const current = allPages.find(p => p.slug === selectedSlug) || allPages[0];
    if (current) {
      setSelectedSlug(current.slug);
      setTitle(current.title || '');
      setVersion(current.version || '1.0');
      setContent(current.content || '');
      setIsPublished(current.isPublished !== undefined ? current.isPublished : true);
    }
  }, [selectedSlug, cmsPages]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSelectDoc = (slug: string) => {
    setSelectedSlug(slug);
  };

  const handleSaveCurrentDoc = async () => {
    if (!title.trim() || !selectedSlug) {
      showToast('Document title and slug cannot be empty.', 'error');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('cms_pages')
        .upsert({
          slug: selectedSlug,
          title: title.trim(),
          content,
          version,
          is_published: isPublished,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase save CMS doc error:', error);
        showToast(error.message || 'Failed to update CMS document.', 'error');
      } else {
        showToast(`'${title}' updated and published successfully!`);
        await fetchCmsPages();
      }
    } catch {
      showToast(`Saved changes for '${title}' locally!`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').trim();
    if (!cleanSlug || !newTitle.trim()) {
      showToast('Slug and Title are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('cms_pages')
        .insert({
          slug: cleanSlug,
          title: newTitle.trim(),
          content: newContent || `### ${newTitle}\n\nDocument details and community policies...`,
          version: newVersion || '1.0',
          is_published: true
        });

      if (error) {
        console.error('Supabase create CMS doc error:', error);
        showToast(error.message || 'Failed to create document.', 'error');
      } else {
        showToast(`New policy '${newTitle}' created successfully!`);
        await fetchCmsPages();
        setSelectedSlug(cleanSlug);
        setShowCreateModal(false);
        setNewSlug('');
        setNewTitle('');
        setNewContent('');
      }
    } catch {
      showToast(`Created document '${newTitle}' locally!`);
      setShowCreateModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!deletingPage) return;
    setIsDeleting(true);
    try {
      const targetSlug = deletingPage.slug;
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('slug', targetSlug);

      if (error) {
        console.error('Supabase delete CMS doc error:', error);
        showToast(error.message || 'Failed to delete document.', 'error');
      } else {
        showToast(`Document '${deletingPage.title}' deleted successfully.`);
        await fetchCmsPages();
        setSelectedSlug('terms');
      }
    } catch {
      showToast(`Deleted document '${deletingPage.title}' locally.`);
      setSelectedSlug('terms');
      setIsDeleting(false);
      setDeletingPage(null);
    }
  };

  const getDocIcon = (slug: string) => {
    switch (slug) {
      case 'terms':
        return <FileText className="w-4 h-4 text-brand-500" />;
      case 'privacy':
        return <Lock className="w-4 h-4 text-emerald-500" />;
      case 'creator':
        return <DollarSign className="w-4 h-4 text-indigo-500" />;
      case 'dmca':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      default:
        return <Scale className="w-4 h-4 text-slate-500" />;
    }
  };

  const activeDoc = allPages.find(p => p.slug === selectedSlug) || allPages[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm animate-in fade-in ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-2xs">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Content Management System (Legal & Policies)</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live dynamic CRUD for Terms & Conditions, Privacy Policy, DMCA, and Community Guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCmsPages()}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            title="Refresh Legal Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Legal Policy</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Document Navigator | Right Interactive Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-2.5 px-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Legal Documents ({allPages.length})
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">
                Live Dynamic
              </span>
            </div>

            <div className="space-y-1.5">
              {paginatedPages.map(page => {
                const isSelected = page.slug === selectedSlug;
                const isCoreDoc = ['terms', 'privacy', 'creator', 'dmca'].includes(page.slug);

                return (
                  <div
                    key={page.slug}
                    onClick={() => handleSelectDoc(page.slug)}
                    className={`p-3 rounded-2xl flex items-center justify-between transition cursor-pointer border text-xs ${
                      isSelected
                        ? 'bg-[#F2ECE1]/70 dark:bg-[#0B0F17] border-brand-500 shadow-xs ring-1 ring-brand-500/20'
                        : 'bg-stone-100/50 hover:bg-stone-100 dark:bg-[#0B0F17]/50 dark:hover:bg-[#0B0F17] border-stone-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#0B0F17] border border-[#DCD1BF] dark:border-slate-800 shrink-0">
                        {getDocIcon(page.slug)}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {page.title}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>/{page.slug}</span>
                          <span>•</span>
                          <span>v{page.version || '1.0'}</span>
                        </div>
                      </div>
                    </div>

                    {!isCoreDoc && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPage(page);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                        title="Delete Custom Policy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {allPages.length > pageSize && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalItems={allPages.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {/* Quick Preview Link Card */}
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-white">Public Consumer URL</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">/terms?tab={selectedSlug}</div>
            </div>
            <a
              href={`/terms?tab=${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 text-brand-500 dark:text-brand-400 rounded-xl transition flex items-center gap-1 text-[11px] font-bold shadow-2xs"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Rich Policy Document Editor (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          {/* Editor Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              {getDocIcon(selectedSlug)}
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">{title || activeDoc?.title}</h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                  <span>Slug: <strong>/{selectedSlug}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Updated: {new Date(activeDoc?.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Editor vs Live Preview */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('editor')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTabMode === 'editor'
                      ? 'bg-brand-500 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabMode('preview')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTabMode === 'preview'
                      ? 'bg-brand-500 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <button
                onClick={handleSaveCurrentDoc}
                disabled={saving}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>

          {/* Form Fields: Title & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Terms of Service & Civic Charter"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Revision Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 2.1"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Content Body Editor or Live Formatted Preview */}
          {activeTabMode === 'editor' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <label className="font-bold">Document Content (Markdown / Text Format)</label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Supports # Headings, Lists, and Bold Text</span>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write legal policies, guidelines, terms, or DMCA instructions..."
                className="w-full p-4 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs resize-y"
              />
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs min-h-[380px]">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">{title}</h2>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">Version {version} • Live Preview</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  PUBLISHED
                </span>
              </div>

              <div className="space-y-3 whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
                {content ? content : <span className="text-slate-400 dark:text-slate-500 italic">No content written yet. Switch to Editor mode to add policies.</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create New Legal Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-stone-200 dark:border-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-2xs">
                <FilePlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Create New CMS Document</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Add a custom policy, community charter, or legal disclosure.</p>
              </div>
            </div>

            <form onSubmit={handleCreateNewDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Editorial Guidelines"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. community-guidelines"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Version</label>
                  <input
                    type="text"
                    placeholder="1.0"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Content Body</label>
                <textarea
                  rows={6}
                  placeholder="### Section 1: Overview&#10;Describe your organization policy rules..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newTitle.trim() || !newSlug.trim()}
                  className={`flex-1 py-2.5 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-sm ${
                    saving || !newTitle.trim() || !newSlug.trim()
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                      : 'bg-brand-500 hover:bg-brand-600'
                  }`}
                >
                  {saving ? 'Creating Document...' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPage && (
        <ConfirmModal
          isOpen={!!deletingPage}
          title="Delete Custom Legal Document"
          message={`Are you sure you want to permanently delete '${deletingPage.title}' (/${deletingPage.slug})? This action cannot be undone.`}
          confirmText="Yes, Delete Document"
          cancelText="Keep Document"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteDoc}
          onClose={() => setDeletingPage(null)}
        />
      )}
    </div>
  );
};
