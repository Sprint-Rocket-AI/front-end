import { useEffect, useState } from 'react';
import { toast, type ToastMessage } from '../services/toastService';
import { CheckCircleIcon, ExclamationCircleIcon } from '../../assets/Icons';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        if (t.type === 'custom' && t.render) {
          return (
            <div key={t.id} className="pointer-events-auto w-full animate-fade-in-up">
              {t.render(t.id)}
            </div>
          );
        }

        const bgClass =
          t.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800 dark:text-green-200'
            : t.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200'
            : 'bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-200';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${bgClass} transition-all duration-300 animate-fade-in-up`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />}
              {t.type === 'error' && <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
              <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => toast.remove(t.id)}
              className="text-xs font-semibold hover:opacity-75 transition-opacity"
            >
              ❌
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default ToastContainer;
