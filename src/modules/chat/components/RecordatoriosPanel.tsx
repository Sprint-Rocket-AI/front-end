import React from "react";
import { RecordatorioItem } from "../../checkpoint/components/RecordatorioItem";
import type { RecordatorioInterface } from "../../checkpoint/interfaces/RecordatorioInterface";

interface RecordatoriosPanelProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  recordatorios: RecordatorioInterface[];
  onDelete: (id: string) => void;
}

export const RecordatoriosPanel: React.FC<RecordatoriosPanelProps> = ({
  isOpen,
  onClose,
  loading,
  recordatorios,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">Recordatorios</h3>
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
            <p className="text-sm text-slate-500">Cargando recordatorios...</p>
          ) : recordatorios.length > 0 ? (
            recordatorios.map((rec) => (
              <RecordatorioItem
                key={rec.id ?? rec.titulo}
                recordatorio={rec}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">No hay recordatorios para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
