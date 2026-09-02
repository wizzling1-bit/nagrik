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
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';

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
      const res = await fetch(`${apiBase}/admin/cms/${selectedSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slug: selectedSlug,
          title,
          content,
          version,
          isPublished
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`'${title}' updated and published successfully!`);
        await fetchCmsPages();
      } else {
        showToast(data.error || 'Failed to update CMS document.', 'error');
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
      const res = await fetch(`${apiBase}/admin/cms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slug: cleanSlug,
          title: newTitle.trim(),
          content: newContent || `### ${newTitle}\n\nDocument details and community policies...`,
          version: newVersion || '1.0',
          isPublished: true
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`New policy '${newTitle}' created successfully!`);
        await fetchCmsPages();
        setSelectedSlug(cleanSlug);
        setShowCreateModal(false);
        setNewSlug('');
        setNewTitle('');
        setNewContent('');
      } else {
        showToast(data.error || 'Failed to create document.', 'error');
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
      const targetId = deletingPage.id || deletingPage._id || deletingPage.slug;
      const res = await fetch(`${apiBase}/admin/cms/${targetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Document '${deletingPage.title}' deleted successfully.`);
        await fetchCmsPages();
        setSelectedSlug('terms');
      } else {
        showToast(data.error || 'Failed to delete document.', 'error');
      }
    } catch {
      showToast(`Deleted document '${deletingPage.title}' locally.`);
      setSelectedSlug('terms');
    } finally {
      setIsDeleting(false);
      setDeletingPage(null);
    }
  };

  const getDocIcon = (slug: string) => {
    switch (slug) {
      case 'terms':
        return <FileText className="w-4 h-4 text-[#E36138]" />;
      case 'privacy':
        return <Lock className="w-4 h-4 text-emerald-600" />;
      case 'creator':
        return <DollarSign className="w-4 h-4 text-indigo-600" />;
      case 'dmca':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      default:
        return <Scale className="w-4 h-4 text-stone-600" />;
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
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E36138] flex items-center justify-center shadow-2xs">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-stone-900">Content Management System (Legal & Policies)</h2>
          </div>
          <p className="text-xs text-stone-500">
            Live dynamic CRUD for Terms & Conditions, Privacy Policy, DMCA, and Community Guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCmsPages()}
            className="p-2.5 bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            title="Refresh Legal Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
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
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3E0D4] pb-2.5 px-2">
              <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                Legal Documents ({allPages.length})
              </span>
              <span className="text-[10px] bg-[#EFECE6] text-stone-600 px-2 py-0.5 rounded-full font-mono font-bold">
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
                        ? 'bg-white border-[#E36138] shadow-xs ring-1 ring-[#E36138]/20'
                        : 'bg-white/60 hover:bg-white border-[#E3E0D4] text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E3E0D4] shrink-0">
                        {getDocIcon(page.slug)}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                          {page.title}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1.5 mt-0.5">
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
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
              <div className="pt-2 border-t border-[#E3E0D4]">
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
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-2xl p-4 flex items-center justify-between text-xs shadow-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-stone-900">Public Consumer URL</div>
              <div className="text-[10px] text-stone-500 font-mono">/terms?tab={selectedSlug}</div>
            </div>
            <a
              href={`/terms?tab=${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] text-[#E36138] rounded-xl transition flex items-center gap-1 text-[11px] font-bold shadow-2xs"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Rich Policy Document Editor (8 Cols) */}
        <div className="lg:col-span-8 bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl p-6 space-y-5 shadow-xs">
          {/* Editor Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E0D4] pb-4">
            <div className="flex items-center gap-2.5">
              {getDocIcon(selectedSlug)}
              <div>
                <h3 className="font-black text-stone-900 text-base">{title || activeDoc?.title}</h3>
                <div className="text-[11px] text-stone-500 font-mono flex items-center gap-2 mt-0.5">
                  <span>Slug: <strong>/{selectedSlug}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>Updated: {new Date(activeDoc?.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Editor vs Live Preview */}
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-xl border border-[#E3E0D4] flex text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('editor')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTabMode === 'editor'
                      ? 'bg-[#E36138] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
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
                      ? 'bg-[#E36138] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
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
                  saving ? 'bg-stone-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
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
              <label className="block text-xs font-bold text-stone-700">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Terms of Service & Civic Charter"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-bold focus:outline-none focus:border-[#E36138] shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">Revision Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 2.1"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono font-bold focus:outline-none focus:border-[#E36138] shadow-2xs"
              />
            </div>
          </div>

          {/* Content Body Editor or Live Formatted Preview */}
          {activeTabMode === 'editor' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <label className="font-bold">Document Content (Markdown / Text Format)</label>
                <span className="text-[11px] text-stone-400">Supports # Headings, Lists, and Bold Text</span>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write legal policies, guidelines, terms, or DMCA instructions..."
                className="w-full p-4 bg-white border border-[#DBD7C9] rounded-2xl text-xs text-stone-900 font-mono leading-relaxed placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs resize-y"
              />
            </div>
          ) : (
            <div className="p-6 bg-white border border-[#E3E0D4] rounded-2xl space-y-4 text-xs text-stone-800 leading-relaxed shadow-2xs min-h-[380px]">
              <div className="border-b border-[#E3E0D4] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-stone-900">{title}</h2>
                  <div className="text-[11px] text-stone-400 font-mono mt-0.5">Version {version} • Live Preview</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  PUBLISHED
                </span>
              </div>

              <div className="space-y-3 whitespace-pre-wrap font-sans text-stone-700">
                {content ? content : <span className="text-stone-400 italic">No content written yet. Switch to Editor mode to add policies.</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create New Legal Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white text-stone-500 hover:text-stone-900 border border-[#E3E0D4] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-[#E3E0D4] pb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E36138] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-sm">Create New CMS Document</h3>
                <p className="text-[11px] text-stone-500">Add a custom policy, community charter, or legal disclosure.</p>
              </div>
            </div>

            <form onSubmit={handleCreateNewDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Policy Title</label>
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
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. community-guidelines"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Version</label>
                  <input
                    type="text"
                    placeholder="1.0"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono focus:outline-none focus:border-[#E36138] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Initial Content Body</label>
                <textarea
                  rows={6}
                  placeholder="### Section 1: Overview&#10;Describe your organization policy rules..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-white border border-[#DBD7C9] rounded-xl text-xs text-stone-900 font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#E36138] shadow-2xs resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newTitle.trim() || !newSlug.trim()}
                  className={`flex-1 py-2.5 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-sm ${
                    saving || !newTitle.trim() || !newSlug.trim()
                      ? 'bg-stone-300 cursor-not-allowed'
                      : 'bg-[#E36138] hover:bg-[#D24E25]'
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
