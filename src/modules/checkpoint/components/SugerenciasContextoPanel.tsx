import { useState } from 'react';
import type { ActividadSugerida, FuenteContexto } from '../interfaces/SugerenciaIAInterface';

interface SugerenciasContextoPanelProps {
  sugerencias: ActividadSugerida[];
  seleccionadas: Set<number>;
  loading: boolean;
  onPedir: (prompt: string, fuente: FuenteContexto) => void;
  onToggle: (index: number) => void;
  onGuardar: () => void;
}

const PRIORIDAD_COLORS: Record<string, string> = {
  ALTA: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
  MEDIA: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300',
  BAJA: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300',
};

const FUENTE_CONFIG: { value: FuenteContexto; label: string; icon: string; color: string }[] = [
  {
    value: 'JIRA',
    label: 'Jira',
    icon: '🎫',
    color: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-300',
  },
  {
    value: 'GITHUB',
    label: 'GitHub',
    icon: '🐙',
    color: 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-300',
  },
];

export const SugerenciasContextoPanel = ({
  sugerencias,
  seleccionadas,
  loading,
  onPedir,
  onToggle,
  onGuardar,
}: SugerenciasContextoPanelProps) => {
  const [fuente, setFuente] = useState<FuenteContexto>('JIRA');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onPedir(prompt.trim(), fuente);
  };

  return (
    <div className="panel flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-lg text-orange-500 dark:bg-orange-500/20">
          🤖
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Sugerencias IA — Contexto JIRA / GitHub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Describe el contexto y obtén actividades sugeridas según tu tablero o repositorio.
          </p>
        </div>
      </div>

      {/* Selector de fuente */}
      <div className="flex gap-3">
        {FUENTE_CONFIG.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFuente(f.value)}
            className={[
              'flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition',
              fuente === f.value
                ? f.color
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700',
            ].join(' ')}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Prompt */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="label" htmlFor="ctx-prompt">
          Prompt — describe el contexto de {fuente === 'JIRA' ? 'Jira' : 'GitHub'}
        </label>
        <textarea
          id="ctx-prompt"
          className="field min-h-[96px]"
          placeholder={
            fuente === 'JIRA'
              ? 'Ej: Tengo los tickets SPRINT-101 y SPRINT-102 en progreso, revisar y actualizar estados…'
              : 'Ej: Hay un PR abierto en el repo auth-service que necesita revisión y un issue de seguridad abierto…'
          }
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
              Analizando {fuente === 'JIRA' ? 'Jira' : 'GitHub'}…
            </>
          ) : (
            `🤖 Sugerir desde ${fuente === 'JIRA' ? 'Jira' : 'GitHub'}`
          )}
        </button>
      </form>

      {/* Resultados */}
      {sugerencias.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {sugerencias.length} actividad(es) sugerida(s) — {seleccionadas.size} seleccionada(s)
            </p>
          </div>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
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
                    {act.notas && (
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
                        {act.notas}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={seleccionadas.size === 0}
            onClick={onGuardar}
            className="action-primary w-full"
          >
            Guardar {seleccionadas.size > 0 ? `${seleccionadas.size} actividad(es)` : 'seleccionadas'}
          </button>
        </div>
      )}

      {!loading && sugerencias.length === 0 && prompt && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Ingresa un prompt y pulsa el botón para obtener sugerencias.
          </p>
        </div>
      )}
    </div>
  );
};
