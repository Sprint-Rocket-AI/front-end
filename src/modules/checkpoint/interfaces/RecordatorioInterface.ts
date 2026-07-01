export interface RecordatorioInterface {
  id?: string;
  userId: string;
  titulo: string;
  activo: boolean;
  fechaExpiracion?: string; // Formato ISO completo: YYYY-MM-DDTHH:mm:ss
  proximoEnvio?: string;   // Formato ISO completo: YYYY-MM-DDTHH:mm:ss (viene en el Response)
}

export interface CrearRecordatorioRequest {
  userId: string;
  titulo: string;
  fechaExpiracion?: string; // Formato ISO completo: YYYY-MM-DDTHH:mm:ss
}