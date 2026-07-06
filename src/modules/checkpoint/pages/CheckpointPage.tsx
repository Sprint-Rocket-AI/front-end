import { useState, useEffect } from 'react';
import { useCheckpoint } from '../hooks/useCheckpoint';
import { ActividadFormModal } from '../components/ActividadFormModal';
import { RecordatorioFormModal } from '../components/RecordatorioFormModal';
import { ActividadesSeccion } from '../components/ActividadesSeccion';
import { RecordatoriosSeccion } from '../components/RecordatoriosSeccion';
import { CheckCircleIcon, ExclamationCircleIcon } from '../../../assets/Icons';

export const CheckpointPage = () => {
  const hook = useCheckpoint();
  const [showActividadModal, setShowActividadModal] = useState(false);
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
          <CheckCircleIcon className="w-5 h-5 shrink-0" /> {hook.feedback}
        </div>
      )}
      {hook.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <ExclamationCircleIcon className="w-5 h-5 shrink-0" /> {hook.error}
        </div>
      )}

      {/* ─── Grid de dos columnas en desktop ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActividadesSeccion
          actividades={hook.actividades}
          loadingActividades={hook.loadingActividades}
          onNuevaActividadClick={() => setShowActividadModal(true)}
          onActualizarEstadoActividad={hook.actualizarEstadoActividad}
        />

        <RecordatoriosSeccion
          recordatorios={hook.recordatorios}
          loadingRecordatorios={hook.loadingRecordatorios}
          onNuevoRecordatorioClick={() => setShowRecordatorioModal(true)}
          onDelete={hook.eliminarRecordatorio}
        />
      </div>

      {/* ─── Modals ─── */}
      {showActividadModal && (
        <ActividadFormModal
          onAdd={hook.crearActividadDirecta}
          onClose={() => setShowActividadModal(false)}
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
