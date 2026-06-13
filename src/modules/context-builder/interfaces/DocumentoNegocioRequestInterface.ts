import type { BaseDocumentInterface } from "./BaseDocumentInterface";

export interface DocumentoNegocioRequestInterface extends BaseDocumentInterface {
  criteriosAceptacion: string[];
}