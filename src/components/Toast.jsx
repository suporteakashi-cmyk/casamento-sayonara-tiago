import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm w-full">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
        isSuccess
          ? 'bg-white border-[#556B2F] text-stone-800'
          : isError
          ? 'bg-white border-rose-300 text-stone-800'
          : 'bg-white border-stone-300 text-stone-800'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#556B2F] shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-[#556B2F] shrink-0 mt-0.5" />}

        <div className="flex-1 text-xs sm:text-sm">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
