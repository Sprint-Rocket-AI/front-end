import { useState } from 'react';
import type { CrearActividadRequest } from '../interfaces/ActividadInterface';

interface ActividadFormModalProps {
  onAdd: (actividad: CrearActividadRequest) => void;
  onClose: () => void;
}

const emptyForm = (): Omit<CrearActividadRequest, 'userId'> => ({
  titulo: '',
  tipo: 'TAREA',
  prioridad: 'MEDIA',
  descripcion: '',
});

export const ActividadFormModal = ({ onAdd, onClose }: ActividadFormModalProps) => {
  const [form, setForm] = useState(emptyForm());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onAdd({ ...form, userId: 'dev-001' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel w-full max-w-lg animate-[fadeInUp_0.2s_ease]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Nueva actividad</h3>
          <button type="button" className="action-secondary py-2 px-4" onClick={onClose}>
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="act-titulo">Título *</label>
            <input
              id="act-titulo"
              name="titulo"
              className="field"
              placeholder="Ej: Implementar endpoint de usuarios"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="act-descripcion">Descripción (opcional)</label>
            <input
              id="act-descripcion"
              name="descripcion"
              className="field min-h-32 resize-y"
              placeholder="Describe brevemente la actividad..."
              value={form.descripcion ?? ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" className="action-primary">
              Guardar actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
