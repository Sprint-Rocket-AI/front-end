import type { DocumentRecordInterface } from "../commons/interfaces/DocumentRecordInterface";
import apiClient from "../api/interceptor";
import type { AIMapResponseInterface } from "../modules/context-builder/interfaces/AIMapResponseInterface";
import type { DocumentUnionType } from "../modules/context-builder/interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../modules/context-builder/interfaces/DocumentTipoEnum";

export const mapWithAI = (rawText: string, tipo: DocumentTipoEnum) =>
  apiClient.post<AIMapResponseInterface>("/api/ai/map", { rawText, tipo });

export const getDocuments = () => apiClient.get<DocumentRecordInterface[]>("/api/docs");

export const createDocument = (data: DocumentUnionType) => apiClient.post<DocumentUnionType>("/api/docs", data);

export const updateDocument = (id: string, data: DocumentUnionType) =>
  apiClient.put<DocumentUnionType>(`/api/docs/${id}`, data);

export const deleteDocument = (id: string) => apiClient.delete(`/api/docs/${id}`);