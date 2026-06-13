import apiClient from "../api/interceptor";
import type { DocumentoDDLRequestInterface } from "../modules/context-builder/interfaces/DocumentoDDLRequestInterface";

const basePath = "/api/documentos-ddl";

export const DocumentoDDLService = {
  getById: (id: string) => {
    return apiClient.get<DocumentoDDLRequestInterface>(`${basePath}/${id}`);
  },

  create: (data: DocumentoDDLRequestInterface) => {
    return apiClient.post<DocumentoDDLRequestInterface>(basePath, data);
  },

  update: (id: string, data: DocumentoDDLRequestInterface) => {
    return apiClient.put<DocumentoDDLRequestInterface>(`${basePath}/${id}`, data);
  },
};
