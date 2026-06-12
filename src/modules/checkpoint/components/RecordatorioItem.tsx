import type { RecordatorioInterface } from '../interfaces/RecordatorioInterface';

interface RecordatorioItemProps {
  recordatorio: RecordatorioInterface;
  onStateChange: (id: string, accion: 'DESCARTAR' | 'POSPONER') => void;
}

function getTimeLeft(proximoEnvio?: string): { label: string; colorClass: string } {
  if (!proximoEnvio) return { label: 'Sin fecha', colorClass: 'text-slate-400' };

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

const TIPO_ICONS: Record<string, string> = {
  DIARIO: '☀️',
  SEMANAL: '📅',
  HORA_POR_HORA: '⏰',
  CUSTOM: '⚙️',
  EVENTO: '🔔',
};

export const RecordatorioItem = ({ recordatorio, onStateChange }: RecordatorioItemProps) => {
  const { label, colorClass } = getTimeLeft(recordatorio.proximoEnvio);
  const icon = TIPO_ICONS[recordatorio.tipoRecordatorio] ?? '🔔';

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30">
      <span className="text-xl leading-none">{icon}</span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {recordatorio.titulo}
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {recordatorio.tipoRecordatorio.replace('_', ' ')}
          </span>
          {recordatorio.horaActivacion && (
            <span className="text-slate-400 dark:text-slate-500">
              🕐 {recordatorio.horaActivacion}
            </span>
          )}
          {recordatorio.diasSemana && recordatorio.diasSemana.length > 0 && (
            <span className="text-slate-400 dark:text-slate-500">
              {recordatorio.diasSemana.map((d) => d.slice(0, 2)).join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`text-xs font-bold ${colorClass}`}>{label}</span>
        <select
          className="shrink-0 cursor-pointer rounded-full bg-slate-100 border-none px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 outline-none focus:ring-0 appearance-none text-center dark:bg-slate-800 dark:text-slate-400"
          value="PENDIENTE"
          onChange={(e) => {
            if (recordatorio.id) {
               onStateChange(recordatorio.id, e.target.value as 'DESCARTAR' | 'POSPONER');
               e.target.value = 'PENDIENTE';
            }
          }}
        >
          <option value="PENDIENTE" disabled>Estado</option>
          <option value="DESCARTAR">Descartar</option>
          <option value="POSPONER">Posponer</option>
        </select>
        {!recordatorio.activo && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
            Inactivo
          </span>
        )}
      </div>
    </div>
  );
};
