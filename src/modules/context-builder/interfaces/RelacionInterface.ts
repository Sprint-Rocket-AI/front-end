export interface RelacionInterface {
  columnaOrigen: string;
  tablaReferenciada: string;
  columnaReferenciada: string;
  tipoRelacion: "UNO_A_UNO" | "UNO_A_MUCHOS" | "MUCHOS_A_UNO" | "MUCHOS_A_MUCHOS";
  onDelete: string;
  onUpdate: string;
}