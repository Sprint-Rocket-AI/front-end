import apiClient from "../api/interceptor";
import type { Node, Edge } from "@xyflow/react";
import { getUserId } from "../modules/auth/utils/authHelper";

export interface Diagram {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  markdown?: string;
  type: 'mental_map' | 'flow';
  updatedAt: string;
}

const INITIAL_MARKDOWN = `# DESARROLLO
## EXTRA PRIMA (EN DESARROLLO - PABLO)
## RECIBOS PENDIENTES 

# DEUDA TECNICA
## STEP FUNCTION
### OMITIR ROLLBACK JOB CUANDO NO HAY ERRORES (CREAR LAMBDA) (OK)
### APLICAR PATRON batch-processing-with-step-functions-map-state
### ELIMINAR BUCKET POR PARAMETROS (OK)

## MIGRATION GLUE
### ORACLE 
#### USUARIO LECTURA APVC_AHORRO CON SOLO TABLAS UTILIZADAS
#### INSTANT_CLIENT
##### VALIDAR TIEMPO EN INGESTA MASIVA
#### DATALAKE
### MYSQL
#### ELIMINAR Y TESTEAR PING (OK)
### MANEJAR ERROR POLIZA (OK)

## QUADRATURE GLUE
### CONEXION SINGLETON (OK)

## MOTOR DE REGLAS
### IMPLEMETACIÓN NUEVAS ESTRATEGIAS

## PENDIENTE 
### CHECKMARX (OK)
### GET_METADATA (OK)
#### REGULARIZAR FECHA (OK)
#### INDEPOTENCIA = BATCH_ID POR PARAMETRO DEL STEP FUNCTION (OK)`;

function mapResponseToDiagram(res: any): Diagram {
  return {
    id: res.id,
    title: res.name || '',
    description: res.description || '',
    type: res.tipo === 'MENTAL' ? 'mental_map' : 'flow',
    updatedAt: res.fechaActualizacion || res.fechaCreacion || new Date().toISOString(),
    nodes: (res.nodes || []).map((n: any) => ({
      id: n.id,
      type: n.type || 'default',
      position: { x: n.positionX ?? 0, y: n.positionY ?? 0 },
      data: { label: n.label || '' }
    })),
    edges: (res.edges || []).map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label || '',
      type: e.type || 'default'
    }))
  };
}

function mapNodeToDTO(node: any): any {
  return {
    id: node.id,
    type: node.type || 'default',
    label: node.data?.label || '',
    positionX: node.position?.x ?? 0,
    positionY: node.position?.y ?? 0
  };
}

function mapEdgeToDTO(edge: any): any {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label || '',
    type: edge.type || 'default'
  };
}

class DiagramService {
  async getDiagrams(): Promise<Diagram[]> {
    try {
      const userId = getUserId();
      const response = await apiClient.get<any[]>(`/checkpoint/api/diagrams/desarrollador/${userId}`);
      return response.data.map(mapResponseToDiagram);
    } catch (error) {
      console.error("Error calling getDiagrams API:", error);
      return [];
    }
  }

  async getDiagramById(id: string): Promise<Diagram> {
    const response = await apiClient.get<any>(`/checkpoint/api/diagrams/${id}`);
    return mapResponseToDiagram(response.data);
  }

  async createDiagram(title: string, type: 'mental_map' | 'flow', description?: string): Promise<Diagram> {
    const payload = {
      name: title,
      description: description || "",
      tipo: type === 'mental_map' ? 'MENTAL' : 'FLUJO',
      userId: getUserId()
    };

    const response = await apiClient.post<any>("/checkpoint/api/diagrams", payload);
    return mapResponseToDiagram(response.data);
  }

  async updateDiagram(id: string, updates: Partial<Diagram>): Promise<Diagram> {
    let response;
    
    // Si se están modificando los nodos o bordes (el canvas)
    if (updates.nodes !== undefined || updates.edges !== undefined) {
      response = await apiClient.patch<any>(`/checkpoint/api/diagrams/${id}/graph`, {
        nodes: (updates.nodes || []).map(mapNodeToDTO),
        edges: (updates.edges || []).map(mapEdgeToDTO)
      });
    } 
    // Si se está cambiando el título/nombre
    else if (updates.title !== undefined) {
      response = await apiClient.patch<any>(`/checkpoint/api/diagrams/${id}/name`, {
        name: updates.title
      });
    } 
    // Si se está cambiando la descripción
    else if (updates.description !== undefined) {
      response = await apiClient.patch<any>(`/checkpoint/api/diagrams/${id}/description`, {
        description: updates.description
      });
    } 
    else {
      throw new Error("No fields to update");
    }

    return mapResponseToDiagram(response.data);
  }

  async deleteDiagram(id: string): Promise<void> {
    await apiClient.delete(`/checkpoint/api/diagrams/${id}`);
  }
}

export const diagramService = new DiagramService();
export { INITIAL_MARKDOWN };
