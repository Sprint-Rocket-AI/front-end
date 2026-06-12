import type { CrearActividadRequest } from '../interfaces/ActividadInterface';

interface ActividadBorradorItemProps {
  actividad: CrearActividadRequest;
  index: number;
  onRemove: (index: number) => void;
}

const PRIORIDAD_COLORS: Record<string, string> = {
  ALTA: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  MEDIA: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
  BAJA: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
};

export const ActividadBorradorItem = ({
  actividad,
  index,
  onRemove,
}: ActividadBorradorItemProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {actividad.titulo}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORIDAD_COLORS[actividad.prioridad] ?? ''}`}
          >
            {actividad.prioridad}
          </span>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {actividad.tipo}
          </span>
        </div>
        {actividad.ticketJira && (
          <span className="text-xs text-orange-500 dark:text-orange-400">
            🎫 {actividad.ticketJira}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label="Quitar actividad"
        onClick={() => onRemove(index)}
        className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
