import type { DocumentUnionType } from "./DocumentUnionType";

export interface AIMapResponseInterface {
  data: Partial<DocumentUnionType>;
  confidence?: number;
}