export type EstadoActividad = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
export type PrioridadActividad = 'ALTA' | 'MEDIA' | 'BAJA';
export type TipoActividad = 'TAREA' | 'BUG' | 'MEJORA' | 'REUNION' | 'OTRO';
export type OrigenActividad = 'MANUAL' | 'IA';

export interface ActividadInterface {
  id?: string;
  userId: string;
  titulo: string;
  tipo: TipoActividad;
  prioridad: PrioridadActividad;
  estado?: EstadoActividad;
  ticketJira?: string;
  fechaVencimiento?: string; // ISO date YYYY-MM-DD
  etiquetas?: string[];
  notas?: string;
  origen?: OrigenActividad;
  vencida?: boolean; // flag del backend en la response
}

export interface CrearActividadRequest {
  userId: string;
  titulo: string;
  tipo: TipoActividad;
  prioridad: PrioridadActividad;
  ticketJira?: string;
  fechaVencimiento?: string;
  etiquetas?: string[];
  notas?: string;
}
