import { useState } from 'react';
import type { CrearRecordatorioRequest, TipoRecordatorio } from '../interfaces/RecordatorioInterface';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface RecordatorioFormModalProps {
  onAdd: (data: Omit<CrearRecordatorioRequest, 'userId'>) => void;
  onClose: () => void;
}


export const RecordatorioFormModal = ({ onAdd, onClose }: RecordatorioFormModalProps) => {
  const [titulo, setTitulo] = useState('');
  const [horaActivacion, setHoraActivacion] = useState('08:30');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const fechaExpiracion = fechaSeleccionada
    ? fechaSeleccionada.toISOString().split('T')[0]
    : undefined;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    onAdd({
      titulo: titulo.trim(),
      tipoRecordatorio: 'EVENTO',
      horaActivacion: horaActivacion,
      fechaExpiracion: fechaExpiracion,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel w-full max-w-md animate-[fadeInUp_0.2s_ease]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Nuevo recordatorio</h3>
          <button type="button" className="action-secondary py-2 px-4" onClick={onClose}>
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título */}
          <div>
            <label className="label" htmlFor="rec-titulo">Título *</label>
            <input
              id="rec-titulo"
              className="field"
              placeholder="Ej: Sincronización matutina"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>



          <div className="flex flex-col gap-3">
            <label className="label">Fecha y hora de activación</label>
            <DayPicker
              mode="single"
              selected={fechaSeleccionada}
              onSelect={setFechaSeleccionada}
              disabled={{ before: new Date() }}
            />
            <input
              type="time"
              className="field"
              value={horaActivacion}
              onChange={(e) => setHoraActivacion(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end pt-1">
            <button type="submit" className="action-primary">Crear recordatorio</button>
          </div>
        </form>
      </div>
    </div>
  );
};
