import type { ColumnaInterface } from "./ColumnaInterface";
import type { RelacionInterface } from "./RelacionInterface";

export interface TablaInterface {
  nombre: string;
  esquema: string;
  descripcion?: string;
  columnas: ColumnaInterface[];
  relaciones?: RelacionInterface[];
}