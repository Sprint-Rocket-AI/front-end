import type { BaseDocumentInterface } from "./BaseDocumentInterface";

export interface DocumentoLineamientoRequestInterface extends BaseDocumentInterface {
  lineamiento: string;
  dominio: string[];
  categoria: string[];
}