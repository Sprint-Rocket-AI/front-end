import React from "react";
import type { ActividadInterface, EstadoActividad } from "../../checkpoint/interfaces/ActividadInterface";

interface ActividadesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  actividades: ActividadInterface[];
}

export const ActividadesPanel: React.FC<ActividadesPanelProps> = ({
  isOpen,
  onClose,
  loading,
  actividades,
}) => {
  if (!isOpen) return null;

  const getEstadoEstilo = (estado: EstadoActividad | undefined) => {
    switch (estado) {
      case "COMPLETADA":
        return "bg-green-500/20 text-green-300";
      case "CANCELADA":
        return "bg-red-500/20 text-red-300";
      case "EN_PROCESO":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">Actividades</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando actividades...</p>
          ) : actividades.length > 0 ? (
            actividades.map((act) => (
              <div
                key={act.id ?? act.titulo}
                className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-slate-200">
                    {act.titulo}
                  </span>
                  {act.descripcion && (
                    <span className="text-xs text-slate-400">{act.descripcion}</span>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getEstadoEstilo(act.estado)}`}
                >
                  {act.estado ?? "PENDIENTE"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No hay actividades para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
