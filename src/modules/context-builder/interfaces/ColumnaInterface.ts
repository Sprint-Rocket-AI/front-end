export interface ColumnaInterface {
  nombre: string;
  tipoDato: string;
  esPk: boolean;
  esFk: boolean;
  esNullable: boolean;
  esUnique: boolean;
  valorPorDefecto?: string | null;
  descripcion?: string;
}