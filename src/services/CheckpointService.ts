import apiClient from "../api/interceptor";

import type {
  ActividadInterface,
  CrearActividadRequest,
} from "../modules/checkpoint/interfaces/ActividadInterface";

import type {
  RecordatorioInterface,
  CrearRecordatorioRequest,
} from "../modules/checkpoint/interfaces/RecordatorioInterface";

class CheckpointService {
  // ───────────────────────────────────────────────────────────────
  // Actividades
  // ───────────────────────────────────────────────────────────────

  async crearActividad(
    data: CrearActividadRequest
  ): Promise<ActividadInterface> {
    const response = await apiClient.post<ActividadInterface>(
      "/checkpoint/api/actividades",
      data
    );
    return response.data;
  }

  async getActividadesByDesarrollador(
    devId: string
  ): Promise<ActividadInterface[]> {
    const response = await apiClient.get<ActividadInterface[]>(
      `/checkpoint/api/actividades/desarrollador/${devId}`
    );
    return response.data;
  }

  async getActividadById(
    id: string
  ): Promise<ActividadInterface> {
    const response = await apiClient.get<ActividadInterface>(
      `/checkpoint/api/actividades/${id}`
    );
    return response.data;
  }

  async actualizarActividad(
    id: string,
    data: Partial<CrearActividadRequest>
  ): Promise<ActividadInterface> {
    const response = await apiClient.put<ActividadInterface>(
      `/checkpoint/api/actividades/${id}`,
      data
    );
    return response.data;
  }

  async actualizarActividadTitulo(
    id: string,
    titulo: string
  ): Promise<ActividadInterface> {
    const response = await apiClient.patch<ActividadInterface>(
      `/checkpoint/api/actividades/${id}/title`,
      { titulo }
    );
    return response.data;
  }

  async actualizarActividadDescripcion(
    id: string,
    descripcion: string
  ): Promise<ActividadInterface> {
    const response = await apiClient.patch<ActividadInterface>(
      `/checkpoint/api/actividades/${id}/description`,
      { descripcion }
    );
    return response.data;
  }

  async eliminarActividad(id: string): Promise<void> {
    await apiClient.delete(
      `/checkpoint/api/actividades/${id}`
    );
  }

  // ───────────────────────────────────────────────────────────────
  // Recordatorios
  // ───────────────────────────────────────────────────────────────

  async crearRecordatorio(
    data: CrearRecordatorioRequest
  ): Promise<RecordatorioInterface> {
    const response = await apiClient.post<RecordatorioInterface>(
      "/checkpoint/api/recordatorios",
      data
    );
    return response.data;
  }

  async getRecordatoriosByDesarrollador(
    devId: string
  ): Promise<RecordatorioInterface[]> {
    const response = await apiClient.get<RecordatorioInterface[]>(
      `/checkpoint/api/recordatorios/desarrollador/${devId}`
    );
    return response.data;
  }

  async getRecordatorioById(
    id: string
  ): Promise<RecordatorioInterface> {
    const response = await apiClient.get<RecordatorioInterface>(
      `/checkpoint/api/recordatorios/${id}`
    );
    return response.data;
  }

  async actualizarRecordatorio(
    id: string,
    data: Partial<CrearRecordatorioRequest & { activo: boolean }>
  ): Promise<RecordatorioInterface> {
    const response = await apiClient.put<RecordatorioInterface>(
      `/checkpoint/api/recordatorios/${id}`,
      data
    );
    return response.data;
  }

  async actualizarRecordatorioTitulo(
    id: string,
    titulo: string
  ): Promise<RecordatorioInterface> {
    const response = await apiClient.patch<RecordatorioInterface>(
      `/checkpoint/api/recordatorios/${id}/title`,
      { titulo }
    );
    return response.data;
  }

  async actualizarRecordatorioFecha(
    id: string,
    fechaExpiracion: string
  ): Promise<RecordatorioInterface> {
    const response = await apiClient.patch<RecordatorioInterface>(
      `/checkpoint/api/recordatorios/${id}/date-end`,
      { fechaExpiracion }
    );
    return response.data;
  }

  async eliminarRecordatorio(id: string): Promise<void> {
    await apiClient.delete(
      `/checkpoint/api/recordatorios/${id}`
    );
  }

  async formatIn(data: {
    columna: string;
    tipo: 'STRING' | 'INT';
    valores: string;
  }): Promise<{ statement: string }> {
    const response = await apiClient.post<{ statement: string }>(
      "/checkpoint/api/tools/format-in",
      data
    );
    return response.data;
  }

}

export const checkpointService = new CheckpointService();