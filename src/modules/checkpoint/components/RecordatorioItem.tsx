import type { RecordatorioInterface } from '../interfaces/RecordatorioInterface';
import { TrashIcon } from '../../../assets/Icons';

interface RecordatorioItemProps {
  recordatorio: RecordatorioInterface;
  onDelete: (id: string) => void;
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

export const RecordatorioItem = ({ recordatorio, onDelete }: RecordatorioItemProps) => {
  const { label, colorClass } = getTimeLeft(recordatorio.proximoEnvio);

  const handleDelete = () => {
    if (recordatorio.id) {
      onDelete(recordatorio.id);
    }
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

      <div className="flex shrink-0 flex-col items-end gap-2">
        {label && <span className={`text-xs font-bold ${colorClass}`}>{label}</span>}

        <button
          type="button"
          aria-label="Eliminar recordatorio"
          onClick={handleDelete}
          className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <TrashIcon className="w-4 h-4" />
        </button>

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