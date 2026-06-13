
export interface BaseDocumentInterface {
  id?: string;
  titulo: string;
  contenido: string;
  tags?: string[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}