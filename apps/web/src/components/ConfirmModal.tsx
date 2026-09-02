import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: AlertTriangle,
      bg: 'bg-rose-100 text-rose-600 border-rose-200',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-100 text-amber-600 border-amber-200',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-100 text-blue-600 border-blue-200',
      btn: 'bg-[#E36138] hover:bg-[#D24E25] text-white shadow-orange-500/20'
    },
    success: {
      icon: CheckCircle2,
      bg: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
    }
  }[variant];

  const Icon = iconConfig.icon;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E3E0D4] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconConfig.bg} shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-black text-stone-900 text-base">{title}</h3>
          <p className="text-xs text-stone-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3E0D4]">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 bg-[#EFECE6] text-stone-700 rounded-xl text-xs font-bold hover:bg-[#E5E1D4] cursor-pointer transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5 ${iconConfig.btn}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
