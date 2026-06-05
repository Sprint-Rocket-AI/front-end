import { DocumentEstadoEnum } from "./DocumentEstadoEnum";

export interface BaseDocumentInterface {
  id?: string;
  titulo: string;
  contenido: string;
  proyectoId: string;
  estado: DocumentEstadoEnum;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}