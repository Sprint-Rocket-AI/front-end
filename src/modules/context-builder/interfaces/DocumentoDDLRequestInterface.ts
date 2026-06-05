import type { BaseDocumentInterface } from "./BaseDocumentInterface";
import type { TablaInterface } from "./TablaInterface";

export interface DocumentoDDLRequestInterface extends BaseDocumentInterface {
  motorBd: "POSTGRESQL" | "MYSQL" | "ORACLE" | "SQLSERVER";
  version: string;
  tablas: TablaInterface[];
}