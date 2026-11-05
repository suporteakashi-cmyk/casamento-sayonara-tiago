import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 text-center animate-fade-in my-8">
        
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          isDanger ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-[#ECF0E6] text-[#556B2F] border border-[#D7DFCC]'
        }`}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="font-serif-wedding text-2xl font-bold text-[#263116] mb-2">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#556B2F] hover:bg-[#445625]'
            }`}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
