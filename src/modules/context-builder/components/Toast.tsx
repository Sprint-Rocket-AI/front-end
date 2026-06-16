import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = "success", onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isError = type === "error";

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-[1.25rem] border p-4 shadow-lg backdrop-blur-md transition-all duration-300 w-[calc(100%-3rem)] sm:w-auto max-w-md animate-fade-in ${
        isError
          ? "border-rose-200 bg-white shadow-rose-500/5 dark:border-white/10 dark:bg-slate-900/90"
          : "border-slate-200 bg-white shadow-emerald-500/5 dark:border-white/10 dark:bg-slate-900/90"
      }`}
    >
      {isError ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div>
        <h4 className={`text-sm font-semibold ${isError ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
          {isError ? "Error" : "Guardado Exitoso"}
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
