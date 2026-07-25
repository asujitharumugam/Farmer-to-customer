import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-bold ${
          isSuccess
            ? 'bg-emerald-900/90 text-white border-emerald-500/40'
            : 'bg-rose-900/90 text-white border-rose-500/40'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        )}

        <span>{toast.message}</span>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
