
export interface BaseDocumentInterface {
  id?: string;
  titulo: string;
  contenido: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}