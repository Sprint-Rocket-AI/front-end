import apiClient from "../api/interceptor";
import type { DocumentoLineamientoRequestInterface } from "../modules/context-builder/interfaces/DocumentoLineamientoRequestInterface";

const basePath = "/api/documentos-lineamientos";

export const DocumentoLineamientoService = {
  getById: (id: string) => {
    return apiClient.get<DocumentoLineamientoRequestInterface>(`${basePath}/${id}`);
  },

  create: (data: DocumentoLineamientoRequestInterface) => {
    return apiClient.post<DocumentoLineamientoRequestInterface>(basePath, data);
  },

  update: (id: string, data: DocumentoLineamientoRequestInterface) => {
    return apiClient.put<DocumentoLineamientoRequestInterface>(`${basePath}/${id}`, data);
  },
};
