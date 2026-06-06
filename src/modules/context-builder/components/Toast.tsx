import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-lg shadow-emerald-500/5 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-slate-900/90 w-[calc(100%-3rem)] sm:w-auto max-w-md animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Guardado Exitoso
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
