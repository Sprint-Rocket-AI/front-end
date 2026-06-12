import type { TipoActividad, PrioridadActividad } from './ActividadInterface';

export type FuenteContexto = 'JIRA' | 'GITHUB';

export interface SugerenciaIARequest {
  prompt: string;
  fuente: FuenteContexto;
}

/** Actividad sugerida por IA — sin id ni estado, lista para ser creada */
export interface ActividadSugerida {
  titulo: string;
  tipo: TipoActividad;
  prioridad: PrioridadActividad;
  ticketJira?: string;
  etiquetas?: string[];
  notas?: string;
}

export interface SugerenciaIAResponse {
  actividades: ActividadSugerida[];
}
