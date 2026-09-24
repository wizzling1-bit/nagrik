import React, { useState } from 'react';
import { Tag, Trash2, Edit3, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import { supabase } from '@/lib/supabase';

interface AdminCategoriesTabProps {
  categories: any[];
  token: string | null;
  apiBase: string;
  fetchCategories: () => Promise<void>;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  token,
  apiBase,
  fetchCategories
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirm Modal State
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const parseJsonResponse = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: `Server error (${res.status}). Please check backend API.` };
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSubmitting(true);
    try {
      const slug = (newCatSlug || newCatName).toLowerCase().trim().replace(/\s+/g, '-');
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCatName.trim(),
          slug,
          display_order: categories.length + 1,
          status: 'ACTIVE'
        });

      if (error) {
        console.error('Supabase insert category error:', error);
        showToast(error.message || 'Failed to add category', 'error');
      } else {
        setNewCatName('');
        setNewCatSlug('');
        await fetchCategories();
        showToast('Category created successfully!');
      }
    } catch (err: any) {
      showToast(err.message || 'Error creating category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setEditName(cat.name || '');
    setEditSlug(cat.slug || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;
    setSavingEdit(true);
    try {
      const id = editingCategory.id || editingCategory._id;
      const slug = (editSlug || editName).toLowerCase().trim().replace(/\s+/g, '-');
      const { error } = await supabase
        .from('categories')
        .update({
          name: editName.trim(),
          slug
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase update category error:', error);
        showToast(error.message || 'Failed to update category', 'error');
      } else {
        setEditingCategory(null);
        await fetchCategories();
        showToast('Category updated successfully!');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating category', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const id = deletingCategory.id || deletingCategory._id;
    const name = deletingCategory.name;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete category error:', error);
        showToast(error.message || 'Failed to delete category', 'error');
      } else {
        setDeletingCategory(null);
        await fetchCategories();
        showToast(`Category "${name}" deleted.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {toastMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
          toastMsg.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Add Category Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-sm">Add New News Category</h3>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name (Hindi/Eng)</label>
              <input
                type="text"
                required
                placeholder="e.g. पर्यावरण (Environment)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Slug (Optional)</label>
              <input
                type="text"
                placeholder="e.g. environment"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newCatName.trim()}
              className={`w-full text-white text-xs font-black py-3 rounded-xl transition cursor-pointer shadow-sm ${
                submitting || !newCatName.trim()
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {submitting ? 'Adding Category...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Right: Active Categories List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
          <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
            <h3 className="font-black text-slate-900 dark:text-white text-sm">Active Categories ({categories.length})</h3>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2 bg-slate-50 dark:bg-[#0B0F17] rounded-2xl border border-slate-200 dark:border-slate-800">
              <Tag className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No categories created yet</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Add your first regional category using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {paginatedCategories.map((cat, idx) => (
                  <div
                    key={cat.id || cat._id || cat.slug || idx}
                    className="p-3 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs shadow-2xs hover:border-brand-500/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center font-mono">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">/{cat.slug || cat.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={categories.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Edit News Category</h3>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || !editName.trim()}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SweetAlert Style Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCategory)}
        title="Delete News Category"
        message={`Are you sure you want to permanently remove the category "${deletingCategory?.name}"? Ground stories with this category will remain intact.`}
        confirmText="Yes, Delete Category"
        cancelText="Keep Category"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingCategory(null)}
      />
    </div>
  );
};
