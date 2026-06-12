import { useEffect, useState } from 'react';
import { useCheckpoint } from '../hooks/useCheckpoint';
import { ActividadBorradorItem } from '../components/ActividadBorradorItem';
import { ActividadFormModal } from '../components/ActividadFormModal';
import { SugerenciasIAPanel } from '../components/SugerenciasIAPanel';
import { RecordatorioFormModal } from '../components/RecordatorioFormModal';
import { RecordatorioItem } from '../components/RecordatorioItem';

export const CheckpointPage = () => {
  const hook = useCheckpoint();
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showSugerenciasIAPanel, setShowSugerenciasIAPanel] = useState(false);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);

  useEffect(() => {
    hook.cargarActividades();
    hook.cargarRecordatorios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getEstadoEstilo = (estado) => {
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

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">
          Sprint Rocket.AI — Checkpoint
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Tu día de trabajo
        </h2>
        <p className="text-sm capitalize text-slate-500 dark:text-slate-400">{today}</p>
      </div>

      {/* Feedback / error banners */}
      {hook.feedback && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
          <span>✅</span> {hook.feedback}
        </div>
      )}
      {hook.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <span>⚠️</span> {hook.error}
        </div>
      )}

      {/* ─── Grid de dos columnas en desktop ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* SECCIÓN 1 — ACTIVIDADES DIARIAS */}
        <section className="panel flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/10 text-lg text-accent-500 dark:bg-accent-500/20">
                📋
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Actividades del día
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {hook.actividades.length} confirmada(s) · {hook.borradores.length} en borrador
                </p>
              </div>
            </div>
            <button
              type="button"
              id="btn-nueva-actividad"
              onClick={() => setShowActividadModal(true)}
              className="action-primary gap-2 px-4 py-2.5 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nueva manual
            </button>
          </div>

          {hook.borradores.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label">Pendientes de confirmar</p>
              {hook.borradores.map((b, i) => (
                <ActividadBorradorItem
                  key={i}
                  actividad={b}
                  index={i}
                  onRemove={hook.removeBorrador}
                />
              ))}
              <button
                type="button"
                id="btn-confirmar-actividades"
                disabled={hook.loadingConfirmar}
                onClick={hook.confirmarBorradores}
                className="action-primary mt-1 w-full gap-2"
              >
                {hook.loadingConfirmar ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando…
                  </>
                ) : (
                  `✅ Confirmar y guardar (${hook.borradores.length})`
                )}
              </button>
            </div>
          )}

          {hook.loadingActividades ? (
            <div className="flex items-center justify-center py-6 text-sm text-slate-400">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500 dark:border-slate-700 dark:border-t-accent-500" />
              Cargando actividades…
            </div>
          ) : hook.actividades.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="label">Confirmadas hoy</p>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {hook.actividades.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {act.titulo}
                      </span>
                      {act.ticketJira && (
                        <span className="text-xs text-accent-400">{act.ticketJira}</span>
                      )}
                    </div>
                    <select
                      className={`shrink-0 cursor-pointer rounded-full border-none px-2 py-0.5 text-[10px] font-bold uppercase outline-none focus:ring-0 appearance-none text-center ${getEstadoEstilo(act.estado)}`}
                      value={act.estado ?? 'PENDIENTE'}
                      onChange={(e) => {
                        if (act.id) hook.actualizarEstadoActividad(act.id, e.target.value);
                      }}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_PROCESO">EN PROCESO</option>
                      <option value="COMPLETADA">COMPLETADA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !hook.borradores.length && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-white/5">
                <span className="text-3xl">📭</span>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  No hay actividades aún
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Añade una manualmente o pide sugerencias a la IA
                </p>
              </div>
            )
          )}
        </section>

        {/* SECCIÓN 2 — RECORDATORIOS */}
        <section className="panel flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-assistant-500/10 text-lg text-assistant-400 dark:bg-assistant-500/20">
                🔔
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
              id="btn-nuevo-recordatorio"
              onClick={() => setShowRecordatorioModal(true)}
              className="action-ghost px-3 py-2 text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo
            </button>
          </div>

          {hook.loadingRecordatorios ? (
            <div className="flex items-center justify-center py-6 text-sm text-slate-400">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500 dark:border-slate-700 dark:border-t-accent-500" />
              Cargando recordatorios…
            </div>
          ) : hook.recordatorios.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {hook.recordatorios.map((rec) => (
                <RecordatorioItem key={rec.id ?? rec.titulo} recordatorio={rec} onStateChange={hook.gestionarEstadoRecordatorio} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-white/10 dark:bg-white/5">
              <span className="text-3xl">🔕</span>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Sin recordatorios activos
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Crea uno para que el sistema te avise a tiempo
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ─── Fila de métricas ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="panel panel-interactive flex items-center gap-4 !rounded-2xl !p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Velocidad Sprint</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">94% Óptimo</p>
          </div>
        </div>

        <div className="panel panel-interactive flex items-center gap-4 !rounded-2xl !p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Capacidad Equipo</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">12 Tareas Libres</p>
          </div>
        </div>

        <div className="panel panel-interactive flex items-center gap-4 !rounded-2xl !p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-assistant-500/10 text-assistant-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0 3-3 3 3 0 0 0 0-6 3 3 0 0 0-3-3V5a3 3 0 0 0-3-3z" /></svg>
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Estado AI</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Asistente Activo</p>
          </div>
        </div>
      </div>

      {/* ─── Modals ─── */}
      {showActividadModal && (
        <ActividadFormModal
          onAdd={hook.addBorrador}
          onClose={() => setShowActividadModal(false)}
        />
      )}

      {showSugerenciasIAPanel && (
        <SugerenciasIAPanel
          sugerencias={hook.sugerenciasActividad}
          seleccionadas={hook.sugerenciasSeleccionadas}
          loading={hook.loadingSugerencias}
          onPedir={hook.pedirSugerenciasActividad}
          onToggle={hook.toggleSugerenciaActividad}
          onGuardar={hook.guardarSugerenciasActividad}
          onClose={() => setShowSugerenciasIAPanel(false)}
        />
      )}

      {showRecordatorioModal && (
        <RecordatorioFormModal
          onAdd={hook.nuevoRecordatorio}
          onClose={() => setShowRecordatorioModal(false)}
        />
      )}
    </div>
  );
};
