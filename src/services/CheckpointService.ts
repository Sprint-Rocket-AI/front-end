import axios from 'axios';
import type {
  ActividadInterface,
  CrearActividadRequest,
} from '../modules/checkpoint/interfaces/ActividadInterface';
import type {
  RecordatorioInterface,
  CrearRecordatorioRequest,
} from '../modules/checkpoint/interfaces/RecordatorioInterface';
import type {
  SugerenciaIARequest,
  SugerenciaIAResponse,
} from '../modules/checkpoint/interfaces/SugerenciaIAInterface';

const checkpointClient = axios.create({
  baseURL: import.meta.env.VITE_CHECKPOINT_API_URL ?? 'http://localhost:8082/api',
  timeout: 30000,
});

checkpointClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// ─── Actividades ──────────────────────────────────────────────────────────────

export const crearActividad = (data: CrearActividadRequest) =>
  checkpointClient.post<ActividadInterface>('/actividades', data);

export const getActividadesByDesarrollador = (devId: string) =>
  checkpointClient.get<ActividadInterface[]>(`/actividades/desarrollador/${devId}`);

export const getActividadById = (id: string) =>
  checkpointClient.get<ActividadInterface>(`/actividades/${id}`);

export const actualizarActividad = (id: string, data: Partial<CrearActividadRequest>) =>
  checkpointClient.put<ActividadInterface>(`/actividades/${id}`, data);

export const eliminarActividad = (id: string) =>
  checkpointClient.delete(`/actividades/${id}`);

// ─── Recordatorios ───────────────────────────────────────────────────────────

export const crearRecordatorio = (data: CrearRecordatorioRequest) =>
  checkpointClient.post<RecordatorioInterface>('/recordatorios', data);

export const getRecordatoriosByDesarrollador = (devId: string) =>
  checkpointClient.get<RecordatorioInterface[]>(`/recordatorios/desarrollador/${devId}`);

export const getRecordatorioById = (id: string) =>
  checkpointClient.get<RecordatorioInterface>(`/recordatorios/${id}`);

export const actualizarRecordatorio = (id: string, data: Partial<CrearRecordatorioRequest & { activo: boolean }>) =>
  checkpointClient.put<RecordatorioInterface>(`/recordatorios/${id}`, data);

export const eliminarRecordatorio = (id: string) =>
  checkpointClient.delete(`/recordatorios/${id}`);

// ─── Sugerencias IA (vía ms-ia-engine por el body del ms-checkpoint) ─────────

export const getSugerenciasIA = (data: SugerenciaIARequest) =>
  checkpointClient.post<SugerenciaIAResponse>('/ia/sugerencias', data);
