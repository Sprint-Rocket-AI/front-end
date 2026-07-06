import { useState, useCallback } from 'react';
import type {
  ActividadInterface,
  CrearActividadRequest,
  EstadoActividad,
} from '../interfaces/ActividadInterface';
import type {
  RecordatorioInterface,
  CrearRecordatorioRequest,
} from '../interfaces/RecordatorioInterface';

import { checkpointService } from '../../../services/CheckpointService';
import { getUserId } from '../../auth/utils/authHelper';

export interface CheckpointState {
  actividades: ActividadInterface[];
  recordatorios: RecordatorioInterface[];

  loadingActividades: boolean;
  loadingRecordatorios: boolean;
  loadingConfirmar: boolean;
  feedback: string | null;
  error: string | null;
}

const initialState: CheckpointState = {
  actividades: [],
  recordatorios: [],
  loadingActividades: false,
  loadingRecordatorios: false,
  loadingConfirmar: false,
  feedback: null,
  error: null,
};

export const useCheckpoint = () => {
  const [state, setState] = useState<CheckpointState>(initialState);

  const setFeedback = (msg: string) => {
    setState((s) => ({ ...s, feedback: msg, error: null }));
    setTimeout(() => setState((s) => ({ ...s, feedback: null })), 3500);
  };

  const setError = (msg: string) => {
    setState((s) => ({ ...s, error: msg, feedback: null }));
    setTimeout(() => setState((s) => ({ ...s, error: null })), 4000);
  };

  // ─── Actividades ────────────────────────────────────────────────────────────

  const cargarActividades = useCallback(async () => {
    setState((s) => ({ ...s, loadingActividades: true }));

    try {
      const userId = getUserId();
      const actividades =
        await checkpointService.getActividadesByDesarrollador(userId);

      setState((s) => ({
        ...s,
        actividades,
        loadingActividades: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingActividades: false }));
      setError("No se pudieron cargar las actividades.");
    }
  }, []);

  const actualizarEstadoActividad = useCallback(async (id: string, estado: EstadoActividad) => {
    try {
      await checkpointService.actualizarActividad(id, { estado } as any);
      setState((s) => ({
        ...s,
        actividades: s.actividades.map((a) => (a.id === id ? { ...a, estado } : a)),
      }));
      setFeedback('Estado actualizado');
    } catch {
      setError('Error al actualizar el estado de la actividad.');
    }
  }, []);


  // ─── Recordatorios ──────────────────────────────────────────────────────────

  const cargarRecordatorios = useCallback(async () => {
    setState((s) => ({ ...s, loadingRecordatorios: true }));
    try {
      const userId = getUserId();
      const recordatorios =
        await checkpointService.getRecordatoriosByDesarrollador(userId);

      const sorted = [...recordatorios]
      setState((s) => ({ ...s, recordatorios: sorted, loadingRecordatorios: false }));
    } catch {
      setState((s) => ({ ...s, loadingRecordatorios: false }));
      setError('No se pudieron cargar los recordatorios.');
    }
  }, []);

  const nuevoRecordatorio = useCallback(
    async (data: Omit<CrearRecordatorioRequest, 'userId'>) => {
      try {
        const userId = getUserId();
        const recordatorio =
          await checkpointService.crearRecordatorio({
            ...data,
            userId,
          });
        setState((s) => ({
          ...s,
          recordatorios: [...s.recordatorios, recordatorio].sort((a, b) => {
            if (!a.proximoEnvio) return 1;
            if (!b.proximoEnvio) return -1;
            return new Date(a.proximoEnvio).getTime() - new Date(b.proximoEnvio).getTime();
          }),
        }));
        setFeedback('Recordatorio creado correctamente.');
      } catch {
        setError('Error al crear el recordatorio.');
      }
    },
    [],
  );

  const eliminarRecordatorio = useCallback(async (id: string) => {
    try {
      await checkpointService.eliminarRecordatorio(id);
      setState((s) => ({
        ...s,
        recordatorios: s.recordatorios.filter((r) => r.id !== id),
      }));
      setFeedback('Recordatorio eliminado.');
    } catch {
      setError('Error al eliminar el recordatorio.');
    }
  }, []);


  const crearActividadDirecta = useCallback(async (actividad: Omit<CrearActividadRequest, 'userId'>) => {
     setState((s) => ({ ...s, loadingConfirmar: true }));
     try {
       const userId = getUserId();
       const actividadCreada =
         await checkpointService.crearActividad({
           ...actividad,
           userId,
         });
       setState((s) => ({
         ...s,
         actividades: [...s.actividades, actividadCreada],
         loadingConfirmar: false,
       }));
       setFeedback('Actividad guardada correctamente.');
     } catch {
       setState((s) => ({ ...s, loadingConfirmar: false }));
       setError('Error al guardar la actividad.');
     }
  }, []);

  const actualizarActividadTitulo = useCallback(async (id: string, titulo: string) => {
    try {
      const updated = await checkpointService.actualizarActividadTitulo(id, titulo);
      setState((s) => ({
        ...s,
        actividades: s.actividades.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      }));
      setFeedback('Título de actividad actualizado.');
    } catch {
      setError('Error al actualizar el título.');
    }
  }, []);

  const actualizarActividadDescripcion = useCallback(async (id: string, descripcion: string) => {
    try {
      const updated = await checkpointService.actualizarActividadDescripcion(id, descripcion);
      setState((s) => ({
        ...s,
        actividades: s.actividades.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      }));
      setFeedback('Descripción de actividad actualizada.');
    } catch {
      setError('Error al actualizar la descripción.');
    }
  }, []);

  const actualizarRecordatorioTitulo = useCallback(async (id: string, titulo: string) => {
    try {
      const updated = await checkpointService.actualizarRecordatorioTitulo(id, titulo);
      setState((s) => ({
        ...s,
        recordatorios: s.recordatorios.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      }));
      setFeedback('Título de recordatorio actualizado.');
    } catch {
      setError('Error al actualizar el título.');
    }
  }, []);

  const actualizarRecordatorioFecha = useCallback(async (id: string, fechaExpiracion: string) => {
    try {
      const updated = await checkpointService.actualizarRecordatorioFecha(id, fechaExpiracion);
      setState((s) => ({
        ...s,
        recordatorios: s.recordatorios.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      }));
      setFeedback('Fecha de recordatorio actualizada.');
    } catch {
      setError('Error al actualizar la fecha.');
    }
  }, []);

  return {
    ...state,
    cargarActividades,
    actualizarEstadoActividad,
    actualizarActividadTitulo,
    actualizarActividadDescripcion,
    cargarRecordatorios,
    nuevoRecordatorio,
    actualizarRecordatorioTitulo,
    actualizarRecordatorioFecha,
    eliminarRecordatorio,
    crearActividadDirecta,
  };
};
