import apiClient from "../api/interceptor";
import type { DocumentoNegocioRequestInterface } from "../modules/context-builder/interfaces/DocumentoNegocioRequestInterface";

const basePath = "context-builder/api/documentos-negocio";

export const DocumentoNegocioService = {
  getById: (id: string) => {
    return apiClient.get<DocumentoNegocioRequestInterface>(`${basePath}/${id}`);
  },

  create: (data: DocumentoNegocioRequestInterface) => {
    return apiClient.post<DocumentoNegocioRequestInterface>(basePath, data);
  },

  update: (id: string, data: DocumentoNegocioRequestInterface) => {
    return apiClient.put<DocumentoNegocioRequestInterface>(`${basePath}/${id}`, data);
  },
};
