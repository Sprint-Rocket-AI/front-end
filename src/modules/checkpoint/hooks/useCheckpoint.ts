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
import type {
  ActividadSugerida,
  FuenteContexto,
} from '../interfaces/SugerenciaIAInterface';
import {
  crearActividad,
  getActividadesByDesarrollador,
  actualizarActividad,
  crearRecordatorio,
  getRecordatoriosByDesarrollador,
  eliminarRecordatorio,
  getSugerenciasIA,
  actualizarRecordatorio,
} from '../../../services/CheckpointService';

const DEV_ID = 'dev-001';

export interface CheckpointState {
  actividades: ActividadInterface[];
  recordatorios: RecordatorioInterface[];
  sugerenciasActividad: ActividadSugerida[];
  sugerenciasSeleccionadas: Set<number>;
  sugerenciasContexto: ActividadSugerida[];
  sugerenciasContextoSeleccionadas: Set<number>;

  loadingActividades: boolean;
  loadingRecordatorios: boolean;
  loadingSugerencias: boolean;
  loadingSugerenciasContexto: boolean;
  loadingConfirmar: boolean;
  feedback: string | null;
  error: string | null;
}

const initialState: CheckpointState = {
  actividades: [],
  recordatorios: [],
  sugerenciasActividad: [],
  sugerenciasSeleccionadas: new Set(),
  sugerenciasContexto: [],
  sugerenciasContextoSeleccionadas: new Set(),
  loadingActividades: false,
  loadingRecordatorios: false,
  loadingSugerencias: false,
  loadingSugerenciasContexto: false,
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
      const res = await getActividadesByDesarrollador(DEV_ID);
      setState((s) => ({ ...s, actividades: res.data, loadingActividades: false }));
    } catch {
      setState((s) => ({ ...s, loadingActividades: false }));
      setError('No se pudieron cargar las actividades.');
    }
  }, []);

  const actualizarEstadoActividad = useCallback(async (id: string, estado: EstadoActividad) => {
    try {
      await actualizarActividad(id, { estado } as any);
      setState((s) => ({
        ...s,
        actividades: s.actividades.map((a) => (a.id === id ? { ...a, estado } : a)),
      }));
      setFeedback('Estado actualizado');
    } catch {
      setError('Error al actualizar el estado de la actividad.');
    }
  }, []);

  // ─── Sugerencias IA (actividades diarias) ───────────────────────────────────

  const pedirSugerenciasActividad = useCallback(async (prompt: string) => {
    setState((s) => ({ ...s, loadingSugerencias: true, sugerenciasActividad: [], sugerenciasSeleccionadas: new Set() }));
    try {
      const res = await getSugerenciasIA({ prompt, fuente: 'JIRA' });
      setState((s) => ({
        ...s,
        sugerenciasActividad: res.data.actividades,
        loadingSugerencias: false,
      }));
    } catch {
      setState((s) => ({ ...s, loadingSugerencias: false }));
      setError('No se pudieron obtener sugerencias de IA.');
    }
  }, []);

  const toggleSugerenciaActividad = useCallback((index: number) => {
    setState((s) => {
      const next = new Set(s.sugerenciasSeleccionadas);
      next.has(index) ? next.delete(index) : next.add(index);
      return { ...s, sugerenciasSeleccionadas: next };
    });
  }, []);

  const guardarSugerenciasActividad = useCallback(async () => {
    const seleccionadas = state.sugerenciasActividad.filter((_, i) =>
      state.sugerenciasSeleccionadas.has(i),
    );
    if (seleccionadas.length === 0) return;
    setState((s) => ({ ...s, loadingConfirmar: true }));
    try {
      const requests = seleccionadas.map((s) =>
        crearActividad({ ...s, userId: DEV_ID }),
      );
      const results = await Promise.all(requests);
      const nuevas = results.map((r) => r.data);
      setState((s) => ({
        ...s,
        actividades: [...s.actividades, ...nuevas],
        sugerenciasActividad: [],
        sugerenciasSeleccionadas: new Set(),
        loadingConfirmar: false,
      }));
      setFeedback(`${nuevas.length} sugerencia(s) guardada(s).`);
    } catch {
      setState((s) => ({ ...s, loadingConfirmar: false }));
      setError('Error al guardar las sugerencias seleccionadas.');
    }
  }, [state.sugerenciasActividad, state.sugerenciasSeleccionadas]);

  // ─── Recordatorios ──────────────────────────────────────────────────────────

  const cargarRecordatorios = useCallback(async () => {
    setState((s) => ({ ...s, loadingRecordatorios: true }));
    try {
      const res = await getRecordatoriosByDesarrollador(DEV_ID);
      // Ordenar por proximoEnvio ascendente
      const sorted = [...res.data].sort((a, b) => {
        if (!a.proximoEnvio) return 1;
        if (!b.proximoEnvio) return -1;
        return new Date(a.proximoEnvio).getTime() - new Date(b.proximoEnvio).getTime();
      });
      setState((s) => ({ ...s, recordatorios: sorted, loadingRecordatorios: false }));
    } catch {
      setState((s) => ({ ...s, loadingRecordatorios: false }));
      setError('No se pudieron cargar los recordatorios.');
    }
  }, []);

  const nuevoRecordatorio = useCallback(
    async (data: Omit<CrearRecordatorioRequest, 'userId'>) => {
      try {
        const res = await crearRecordatorio({ ...data, userId: DEV_ID });
        setState((s) => ({
          ...s,
          recordatorios: [...s.recordatorios, res.data].sort((a, b) => {
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

  const gestionarEstadoRecordatorio = useCallback(async (id: string, accion: 'DESCARTAR' | 'POSPONER') => {
    try {
      if (accion === 'DESCARTAR') {
        await eliminarRecordatorio(id);
        setState((s) => ({
          ...s,
          recordatorios: s.recordatorios.filter((r) => r.id !== id),
        }));
        setFeedback('Recordatorio descartado');
      } else if (accion === 'POSPONER') {
        const recordatorio = state.recordatorios.find((r) => r.id === id);
        if (recordatorio && recordatorio.horaExpiracion) {
          const [h, m] = recordatorio.horaExpiracion.split(':').map(Number);
          const date = new Date();
          date.setHours(h, m + 15);
          const newHora = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

          await actualizarRecordatorio(id, { horaExpiracion: newHora });
          setState((s) => ({
            ...s,
            recordatorios: s.recordatorios.map((r) => r.id === id ? { ...r, horaActivacion: newHora } : r)
          }));
          setFeedback(`Recordatorio pospuesto a las ${newHora}`);
        }
      }
    } catch {
      setError('Error al gestionar el recordatorio.');
    }
  }, [state.recordatorios]);

  // ─── Sugerencias IA desde contexto JIRA / GitHub ────────────────────────────

  const pedirSugerenciasContexto = useCallback(
    async (prompt: string, fuente: FuenteContexto) => {
      setState((s) => ({
        ...s,
        loadingSugerenciasContexto: true,
        sugerenciasContexto: [],
        sugerenciasContextoSeleccionadas: new Set(),
      }));
      try {
        const res = await getSugerenciasIA({ prompt, fuente });
        setState((s) => ({
          ...s,
          sugerenciasContexto: res.data.actividades,
          loadingSugerenciasContexto: false,
        }));
      } catch {
        setState((s) => ({ ...s, loadingSugerenciasContexto: false }));
        setError('No se obtuvieron sugerencias de IA para ese contexto.');
      }
    },
    [],
  );

  const toggleSugerenciaContexto = useCallback((index: number) => {
    setState((s) => {
      const next = new Set(s.sugerenciasContextoSeleccionadas);
      next.has(index) ? next.delete(index) : next.add(index);
      return { ...s, sugerenciasContextoSeleccionadas: next };
    });
  }, []);

  const guardarSugerenciasContexto = useCallback(async () => {
    const seleccionadas = state.sugerenciasContexto.filter((_, i) =>
      state.sugerenciasContextoSeleccionadas.has(i),
    );
    if (seleccionadas.length === 0) return;
    setState((s) => ({ ...s, loadingConfirmar: true }));
    try {
      const requests = seleccionadas.map((s) =>
        crearActividad({ ...s, userId: DEV_ID }),
      );
      const results = await Promise.all(requests);
      const nuevas = results.map((r) => r.data);
      setState((s) => ({
        ...s,
        actividades: [...s.actividades, ...nuevas],
        sugerenciasContexto: [],
        sugerenciasContextoSeleccionadas: new Set(),
        loadingConfirmar: false,
      }));
      setFeedback(`${nuevas.length} actividad(es) de contexto guardada(s).`);
    } catch {
      setState((s) => ({ ...s, loadingConfirmar: false }));
      setError('Error al guardar las sugerencias de contexto.');
    }
  }, [state.sugerenciasContexto, state.sugerenciasContextoSeleccionadas]);

  const crearActividadDirecta = useCallback(async (actividad: CrearActividadRequest) => {
     setState((s) => ({ ...s, loadingConfirmar: true }));
     try {
       const result = await crearActividad({ ...actividad, userId: DEV_ID });
       setState((s) => ({
         ...s,
         actividades: [...s.actividades, result.data],
         loadingConfirmar: false,
       }));
       setFeedback('Actividad guardada correctamente.');
     } catch {
       setState((s) => ({ ...s, loadingConfirmar: false }));
       setError('Error al guardar la actividad.');
     }
  }, []);

  return {
    ...state,
    cargarActividades,
    actualizarEstadoActividad,
    pedirSugerenciasActividad,
    toggleSugerenciaActividad,
    guardarSugerenciasActividad,
    cargarRecordatorios,
    nuevoRecordatorio,
    gestionarEstadoRecordatorio,
    pedirSugerenciasContexto,
    toggleSugerenciaContexto,
    guardarSugerenciasContexto,
    crearActividadDirecta,
  };
};
