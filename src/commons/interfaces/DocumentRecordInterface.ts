import type { DocumentUnionType } from "../../modules/context-builder/interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../../modules/context-builder/interfaces/DocumentTipoEnum";

export interface DocumentRecordInterface {
  id: string;
  tipo: DocumentTipoEnum;
  origin: "AI" | "MANUAL";
  data: DocumentUnionType;
}