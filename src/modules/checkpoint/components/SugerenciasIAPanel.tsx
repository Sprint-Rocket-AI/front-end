import { useState } from 'react';
import type { ActividadSugerida } from '../interfaces/SugerenciaIAInterface';

interface SugerenciasIAPanelProps {
  sugerencias: ActividadSugerida[];
  seleccionadas: Set<number>;
  loading: boolean;
  onPedir: (prompt: string) => void;
  onToggle: (index: number) => void;
  onGuardar: () => void;
  onClose: () => void;
}

const PRIORIDAD_COLORS: Record<string, string> = {
  ALTA: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
  MEDIA: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300',
  BAJA: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300',
};

export const SugerenciasIAPanel = ({
  sugerencias,
  seleccionadas,
  loading,
  onPedir,
  onToggle,
  onGuardar,
  onClose,
}: SugerenciasIAPanelProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onPedir(prompt.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel flex w-full max-w-xl flex-col gap-5 animate-[fadeInUp_0.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/20">
              ✨
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sugeridas por IA</h3>
          </div>
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

        {/* Prompt input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="label" htmlFor="ia-prompt-daily">
            Describe tus actividades o el contexto del día
          </label>
          <textarea
            id="ia-prompt-daily"
            className="field min-h-[80px]"
            placeholder="Ej: Hoy tengo que revisar el PR de autenticación, arreglar el bug de SPRINT-99 y hacer la reunión de planning…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="action-primary self-end gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generando…
              </>
            ) : (
              '✨ Obtener sugerencias'
            )}
          </button>
        </form>

        {/* Lista de sugerencias */}
        {sugerencias.length > 0 && (
          <>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Selecciona las actividades que quieres agregar ({seleccionadas.size} seleccionadas)
              </p>
              {sugerencias.map((act, i) => {
                const isSelected = seleccionadas.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onToggle(i)}
                    className={[
                      'flex items-start gap-3 rounded-2xl border p-3 text-left transition',
                      isSelected
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10'
                        : 'border-slate-200 bg-slate-50 hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition',
                        isSelected
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900',
                      ].join(' ')}
                    >
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{act.titulo}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORIDAD_COLORS[act.prioridad] ?? ''}`}>
                          {act.prioridad}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {act.tipo}
                        </span>
                        {act.ticketJira && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                            {act.ticketJira}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="action-secondary">
                Cancelar
              </button>
              <button
                type="button"
                disabled={seleccionadas.size === 0}
                onClick={onGuardar}
                className="action-primary"
              >
                Guardar seleccionadas ({seleccionadas.size})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
