import { DocumentTipoEnum } from "./DocumentTipoEnum";

export interface AIMapRequestInterface {
  tipo: DocumentTipoEnum;
  rawText: string;
}