import apiClient from "../api/interceptor";
import type { DocumentoSistemaRequestInterface } from "../modules/context-builder/interfaces/DocumentoSistemaRequestInterface";

const basePath = "context-builder/api/documentos-sistemas";

export const DocumentoSistemaService = {
  getById: (id: string) => {
    return apiClient.get<DocumentoSistemaRequestInterface>(`${basePath}/${id}`);
  },

  create: (data: DocumentoSistemaRequestInterface) => {
    return apiClient.post<DocumentoSistemaRequestInterface>(basePath, data);
  },

  update: (id: string, data: DocumentoSistemaRequestInterface) => {
    return apiClient.put<DocumentoSistemaRequestInterface>(`${basePath}/${id}`, data);
  },
};
