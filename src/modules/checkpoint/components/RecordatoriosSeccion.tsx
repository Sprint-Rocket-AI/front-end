import type { RecordatorioInterface } from '../interfaces/RecordatorioInterface';
import { RecordatorioItem } from './RecordatorioItem';
import { BellIcon, BellSlashIcon, PlusIcon } from '../../../assets/Icons';

interface RecordatoriosSeccionProps {
  recordatorios: RecordatorioInterface[];
  loadingRecordatorios: boolean;
  onNuevoRecordatorioClick: () => void;
  onDelete: (id: string) => void;
  onUpdateTitulo?: (id: string, titulo: string) => void;
  onUpdateFecha?: (id: string, fechaExpiracion: string) => void;
}

export const RecordatoriosSeccion = ({
  recordatorios,
  loadingRecordatorios,
  onNuevoRecordatorioClick,
  onDelete,
  onUpdateTitulo,
  onUpdateFecha,
}: RecordatoriosSeccionProps) => {
  return (
    <section className="panel flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-assistant-500/10 text-lg text-assistant-400 dark:bg-assistant-500/20">
            <BellIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recordatorios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ordenados por proximidad de vencimiento
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-nueva-actividad"
          onClick={onNuevoRecordatorioClick}
          className="action-primary gap-2 px-4 py-2.5 text-sm"
        >
          <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {loadingRecordatorios ? (
        <div className="flex items-center justify-center py-6 text-sm text-slate-400">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500 dark:border-slate-700 dark:border-t-accent-500" />
          Cargando recordatorios…
        </div>
      ) : recordatorios.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {recordatorios.map((rec) => (
            <RecordatorioItem
              key={rec.id ?? rec.titulo}
              recordatorio={rec}
              onDelete={onDelete}
              onUpdateTitulo={onUpdateTitulo}
              onUpdateFecha={onUpdateFecha}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-white/5">
          <BellSlashIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Sin recordatorios activos
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Crea uno para que el sistema te avise a tiempo
          </p>
        </div>
      )}
    </section>
  );
};
