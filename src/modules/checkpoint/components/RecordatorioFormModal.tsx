import { useState } from 'react';
import type { CrearRecordatorioRequest, TipoRecordatorio, DiaSemana } from '../interfaces/RecordatorioInterface';

interface RecordatorioFormModalProps {
  onAdd: (data: Omit<CrearRecordatorioRequest, 'userId'>) => void;
  onClose: () => void;
}

const TIPOS: TipoRecordatorio[] = ['DIARIO', 'SEMANAL', 'HORA_POR_HORA', 'CUSTOM', 'EVENTO'];
const DIAS: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

export const RecordatorioFormModal = ({ onAdd, onClose }: RecordatorioFormModalProps) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoRecordatorio>('DIARIO');
  const [horaActivacion, setHoraActivacion] = useState('08:30');
  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']);

  const toggleDia = (dia: DiaSemana) => {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    onAdd({
      titulo: titulo.trim(),
      tipoRecordatorio: tipo,
      horaActivacion: horaActivacion, // Obligatorio en backend
      diasSemana: tipo === 'SEMANAL' ? diasSemana : undefined,
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

          {/* Tipo */}
          <div>
            <label className="label" htmlFor="rec-tipo">Tipo de recordatorio</label>
            <select
              id="rec-tipo"
              className="field"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoRecordatorio)}
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Hora de activación */}
          <div>
            <label className="label" htmlFor="rec-hora">Hora de activación</label>
            <input
              id="rec-hora"
              type="time"
              className="field"
              value={horaActivacion}
              onChange={(e) => setHoraActivacion(e.target.value)}
            />
          </div>

          {/* Días de la semana (solo SEMANAL) */}
          {tipo === 'SEMANAL' && (
            <div>
              <label className="label">Días de la semana</label>
              <div className="flex flex-wrap gap-2">
                {DIAS.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    className={[
                      'rounded-full border px-3 py-1 text-xs font-semibold transition',
                      diasSemana.includes(dia)
                        ? 'border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-300'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
                    ].join(' ')}
                  >
                    {dia.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="action-secondary">Cancelar</button>
            <button type="submit" className="action-primary">Crear recordatorio</button>
          </div>
        </form>
      </div>
    </div>
  );
};
