import type { BaseDocumentInterface } from "./BaseDocumentInterface";

export interface DocumentoNegocioRequestInterface extends BaseDocumentInterface {
  fuente: "CONFLUENCE" | "JIRA" | "OTRO";
  urlFuente?: string;
  criteriosAceptacion: string[];
  resumen?: string;
}