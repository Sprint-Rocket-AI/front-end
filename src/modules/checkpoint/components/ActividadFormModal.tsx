import { useState } from 'react';
import type { CrearActividadRequest, PrioridadActividad, TipoActividad } from '../interfaces/ActividadInterface';

interface ActividadFormModalProps {
  onAdd: (actividad: CrearActividadRequest) => void;
  onClose: () => void;
}

const TIPOS: TipoActividad[] = ['TAREA', 'BUG', 'MEJORA', 'REUNION', 'OTRO'];
const PRIORIDADES: PrioridadActividad[] = ['ALTA', 'MEDIA', 'BAJA'];

const emptyForm = (): Omit<CrearActividadRequest, 'userId'> => ({
  titulo: '',
  tipo: 'TAREA',
  prioridad: 'MEDIA',
  ticketJira: '',
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
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título */}
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

          {/* Tipo y Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="act-tipo">Tipo</label>
              <select id="act-tipo" name="tipo" className="field" value={form.tipo} onChange={handleChange}>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="act-prioridad">Prioridad</label>
              <select id="act-prioridad" name="prioridad" className="field" value={form.prioridad} onChange={handleChange}>
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ticket Jira */}
          <div>
            <label className="label" htmlFor="act-ticket">Ticket Jira (opcional)</label>
            <input
              id="act-ticket"
              name="ticketJira"
              className="field"
              placeholder="SPRINT-1234"
              value={form.ticketJira}
              onChange={handleChange}
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="action-secondary">
              Cancelar
            </button>
            <button type="submit" className="action-primary">
              Agregar a la lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
