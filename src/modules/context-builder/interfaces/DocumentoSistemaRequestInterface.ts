import type { BaseDocumentInterface } from "./BaseDocumentInterface";

export interface DocumentoSistemaRequestInterface extends BaseDocumentInterface {
  tipo: "SISTEMA";
  urlRepos: string[];
  stack: string[];
  devs: string[];
}