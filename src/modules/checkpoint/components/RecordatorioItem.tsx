import { useState, useRef, useEffect } from 'react';
import type { RecordatorioInterface } from '../interfaces/RecordatorioInterface';

interface RecordatorioItemProps {
  recordatorio: RecordatorioInterface;
  onStateChange: (id: string, accion: 'DESCARTAR' | 'POSPONER') => void;
}

function getTimeLeft(proximoEnvio?: string): { label: string; colorClass: string } {
  if (!proximoEnvio) return { label: '', colorClass: 'text-slate-400' };

  const diff = new Date(proximoEnvio).getTime() - Date.now();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) return { label: 'Vencido', colorClass: 'text-red-500 dark:text-red-400' };
  if (hours < 1) return { label: `En ${minutes}m`, colorClass: 'text-red-500 dark:text-red-400' };
  if (hours < 6) return { label: `En ${hours}h`, colorClass: 'text-yellow-500 dark:text-yellow-400' };
  if (days < 1) return { label: `En ${hours}h`, colorClass: 'text-yellow-500 dark:text-yellow-400' };
  return { label: `En ${days}d`, colorClass: 'text-green-600 dark:text-green-400' };
}

function formatIsoDateTime(isoString?: string): string {
  if (!isoString) return 'Sin expiración';
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export const RecordatorioItem = ({ recordatorio, onStateChange }: RecordatorioItemProps) => {
  const { label, colorClass } = getTimeLeft(recordatorio.proximoEnvio);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (accion: 'DESCARTAR' | 'POSPONER') => {
    if (recordatorio.id) {
      onStateChange(recordatorio.id, accion);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30">

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {recordatorio.titulo}
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            📅 {formatIsoDateTime(recordatorio.fechaExpiracion)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {label && <span className={`text-xs font-bold ${colorClass}`}>{label}</span>}

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            Acciones ▾
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-1 w-28 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-[fadeInUp_0.1s_ease]">
              <button
                type="button"
                className="w-full rounded-lg px-2 py-1.5 text-left text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                onClick={() => handleAction('POSPONER')}
              >
                ⏳ Posponer
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-2 py-1.5 text-left text-[10px] font-bold uppercase text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition"
                onClick={() => handleAction('DESCARTAR')}
              >
                ❌ Descartar
              </button>
            </div>
          )}
        </div>

        {recordatorio.activo ? (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
            Activo
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
            Inactivo
          </span>
        )}
      </div>
    </div>
  );
};