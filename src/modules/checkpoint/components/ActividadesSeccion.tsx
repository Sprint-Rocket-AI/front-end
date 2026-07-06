import { useState } from 'react';
import type { ActividadInterface, EstadoActividad } from '../interfaces/ActividadInterface';
import { ClipboardDocumentListIcon, InboxIcon, PlusIcon, PencilIcon, CheckCircleIcon } from '../../../assets/Icons';

interface ActividadesSeccionProps {
  actividades: ActividadInterface[];
  loadingActividades: boolean;
  onNuevaActividadClick: () => void;
  onActualizarEstadoActividad: (id: string, estado: EstadoActividad) => void;
  onActualizarActividadTitulo?: (id: string, titulo: string) => void;
  onActualizarActividadDescripcion?: (id: string, descripcion: string) => void;
}

const getEstadoEstilo = (estado: EstadoActividad | undefined) => {
  switch (estado) {
    case 'COMPLETADA':
      return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
    case 'CANCELADA':
      return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    case 'EN_PROCESO':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
    default:
      return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }
};

interface ActividadItemProps {
  act: ActividadInterface;
  onActualizarEstadoActividad: (id: string, estado: EstadoActividad) => void;
  onActualizarActividadTitulo?: (id: string, titulo: string) => void;
  onActualizarActividadDescripcion?: (id: string, descripcion: string) => void;
}

const ActividadItem = ({
  act,
  onActualizarEstadoActividad,
  onActualizarActividadTitulo,
  onActualizarActividadDescripcion,
}: ActividadItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitulo, setTempTitulo] = useState(act.titulo);
  const [tempDescripcion, setTempDescripcion] = useState(act.descripcion || '');

  const handleSave = () => {
    if (!tempTitulo.trim()) return;
    if (act.id) {
      if (tempTitulo.trim() !== act.titulo && onActualizarActividadTitulo) {
        onActualizarActividadTitulo(act.id, tempTitulo.trim());
      }
      if (tempDescripcion.trim() !== (act.descripcion || '') && onActualizarActividadDescripcion) {
        onActualizarActividadDescripcion(act.id, tempDescripcion.trim());
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitulo(act.titulo);
    setTempDescripcion(act.descripcion || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-white/5 dark:bg-white/5 transition hover:border-orange-200/50">
      {isEditing ? (
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 focus:ring-1 focus:ring-orange-500/20"
            value={tempTitulo}
            onChange={(e) => setTempTitulo(e.target.value)}
            placeholder="Título de la actividad"
            autoFocus
          />
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 focus:ring-1 focus:ring-orange-500/20 resize-y min-h-12"
            value={tempDescripcion}
            onChange={(e) => setTempDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
          />
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
            {act.titulo}
          </span>
          {act.descripcion && (
            <span className="text-xs text-accent-400 mt-0.5">{act.descripcion}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Guardar actividad"
              onClick={handleSave}
              className="rounded-full p-1 text-slate-400 transition hover:bg-green-50 hover:text-green-500 dark:hover:bg-green-500/10 dark:hover:text-green-400"
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Cancelar edición"
              onClick={handleCancel}
              className="rounded-full px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition"
            >
              ❌
            </button>
          </div>
        ) : (
          <>
            {(onActualizarActividadTitulo || onActualizarActividadDescripcion) && (
              <button
                type="button"
                aria-label="Editar actividad"
                onClick={() => setIsEditing(true)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              >
                <PencilIcon className="w-3.5 h-3.5" />
              </button>
            )}

            <select
              className={`shrink-0 cursor-pointer rounded-full border-none px-2 py-0.5 text-[10px] font-bold uppercase outline-none focus:ring-0 appearance-none text-center ${getEstadoEstilo(act.estado)}`}
              value={act.estado ?? 'PENDIENTE'}
              onChange={(e) => {
                if (act.id) onActualizarEstadoActividad(act.id, e.target.value as EstadoActividad);
              }}
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_PROCESO">EN PROCESO</option>
              <option value="COMPLETADA">COMPLETADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export const ActividadesSeccion = ({
  actividades,
  loadingActividades,
  onNuevaActividadClick,
  onActualizarEstadoActividad,
  onActualizarActividadTitulo,
  onActualizarActividadDescripcion,
}: ActividadesSeccionProps) => {
  return (
    <section className="panel flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/10 text-lg text-accent-500 dark:bg-accent-500/20">
            <ClipboardDocumentListIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Actividades del día
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {actividades.length} confirmada(s)
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-nueva-actividad"
          onClick={onNuevaActividadClick}
          className="action-primary gap-2 px-4 py-2.5 text-sm"
        >
          <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {loadingActividades ? (
        <div className="flex items-center justify-center py-6 text-sm text-slate-400">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500 dark:border-slate-700 dark:border-t-accent-500" />
          Cargando actividades…
        </div>
      ) : actividades.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="label">Confirmadas hoy</p>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {actividades.map((act) => (
              <ActividadItem
                key={act.id}
                act={act}
                onActualizarEstadoActividad={onActualizarEstadoActividad}
                onActualizarActividadTitulo={onActualizarActividadTitulo}
                onActualizarActividadDescripcion={onActualizarActividadDescripcion}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-white/5">
          <InboxIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            No hay actividades aún
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Agrega nuevas actividades
          </p>
        </div>
      )}
    </section>
  );
};
