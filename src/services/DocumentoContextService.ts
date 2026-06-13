import apiClient from "../api/interceptor";
import type { DocumentUnionType } from "../modules/context-builder/interfaces/DocumentUnionType";

export type DocumentoResponse = DocumentUnionType;

const basePath = "/api/documentos-contexto";

export const DocumentoContextService = {
  getAll: () => {
    return apiClient.get<DocumentoResponse[]>(basePath);
  },

  getById: (id: string) => {
    return apiClient.get<DocumentoResponse>(`${basePath}/${id}`);
  },

  deleteById: (id: string) => {
    return apiClient.delete(`${basePath}/${id}`);
  },
};
