export type TipoRecordatorio = 'DIARIO' | 'HORA_POR_HORA' | 'CUSTOM' | 'EVENTO' | 'SEMANAL';
export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO';

export interface RecordatorioInterface {
  id?: string;
  userId: string;
  titulo: string;
  tipoRecordatorio: TipoRecordatorio;
  horaActivacion?: string; // HH:mm
  diasSemana?: DiaSemana[];
  activo: boolean;
  fechaExpiracion?: string; // ISO date
  proximoEnvio?: string; // ISO datetime – viene en el Response
}

export interface CrearRecordatorioRequest {
  userId: string;
  titulo: string;
  tipoRecordatorio: TipoRecordatorio;
  horaActivacion?: string;
  diasSemana?: DiaSemana[];
  fechaExpiracion?: string;
}
