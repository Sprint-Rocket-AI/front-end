import apiClient from "../api/interceptor";
import type { Node, Edge } from "@xyflow/react";

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

const MOCK_DIAGRAMS: Diagram[] = [
  {
    id: '1',
    title: 'Mapa Mental APV-123',
    description: 'Diagrama principal de arquitectura de la aplicación.',
    updatedAt: new Date('2026-06-11').toISOString(),
    type: 'mental_map',
    nodes: [],
    edges: [],
    markdown: INITIAL_MARKDOWN
  },
  {
    id: '2',
    title: 'Flujo de Autenticación',
    description: 'Diagrama detallado del proceso de login y registro.',
    updatedAt: new Date('2026-06-10').toISOString(),
    type: 'flow',
    nodes: [
      { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Inicio Login' }, type: 'nodeInputText' },
      { id: 'n2', position: { x: 100, y: 220 }, data: { label: 'Validar Credenciales' }, type: 'nodeInputText' },
      { id: 'n3', position: { x: 350, y: 220 }, data: { label: '¿Token Expirado?' }, type: 'nodeInputText' },
      { id: 'n4', position: { x: 100, y: 340 }, data: { label: 'Sesión Activa' }, type: 'nodeInputText' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true, type: 'edgeInputText', label: '' },
      { id: 'e2', source: 'n2', target: 'n3', animated: false, type: 'edgeInputText', label: 'error' },
      { id: 'e3', source: 'n2', target: 'n4', animated: true, type: 'edgeInputText', label: 'ok' },
    ],
    markdown: ''
  },
  {
    id: '3',
    title: 'Base de Datos Relacional',
    description: 'Modelo Entidad-Relación de los usuarios y documentos.',
    updatedAt: new Date('2026-06-09').toISOString(),
    type: 'flow',
    nodes: [
      { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Tabla Usuarios' }, type: 'nodeInputText' },
      { id: 'n2', position: { x: 350, y: 100 }, data: { label: 'Tabla Documentos' }, type: 'nodeInputText' },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: false, type: 'edgeInputText', label: '1 a muchos' },
    ],
    markdown: ''
  }
];

class DiagramService {
  private getLocalDiagrams(): Diagram[] {
    const data = localStorage.getItem("diagrams");
    if (!data) {
      localStorage.setItem("diagrams", JSON.stringify(MOCK_DIAGRAMS));
      return MOCK_DIAGRAMS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_DIAGRAMS;
    }
  }

  private saveLocalDiagrams(diagrams: Diagram[]) {
    localStorage.setItem("diagrams", JSON.stringify(diagrams));
  }

  async getDiagrams(): Promise<Diagram[]> {
    try {
      const response = await apiClient.get<Diagram[]>("/api/diagrams");
      return response.data;
    } catch (error) {
      console.warn("Error calling getDiagrams API, falling back to local storage:", error);
      return this.getLocalDiagrams();
    }
  }

  async getDiagramById(id: string): Promise<Diagram> {
    try {
      const response = await apiClient.get<Diagram>(`/api/diagrams/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Error calling getDiagramById API for ${id}, falling back to local storage:`, error);
      const local = this.getLocalDiagrams();
      const diag = local.find(d => d.id === id);
      if (!diag) throw new Error("Diagrama no encontrado", { cause: error });
      return diag;
    }
  }

  async createDiagram(title: string, type: 'mental_map' | 'flow', description?: string): Promise<Diagram> {
    const payload = {
      title,
      type,
      description: description || "Nuevo diagrama sin descripción.",
      nodes: type === 'flow' ? [
        { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Nodo Inicio' }, type: 'nodeInputText' }
      ] : [],
      edges: [],
      markdown: type === 'mental_map' ? `# ${title}\n## Primer Nodo` : ''
    };

    try {
      const response = await apiClient.post<Diagram>("/api/diagrams", payload);
      return response.data;
    } catch (error) {
      console.warn("Error calling createDiagram API, falling back to local storage:", error);
      const local = this.getLocalDiagrams();
      const newDiagram: Diagram = {
        id: `diag-${Date.now()}`,
        ...payload,
        updatedAt: new Date().toISOString()
      };
      local.push(newDiagram);
      this.saveLocalDiagrams(local);
      return newDiagram;
    }
  }

  async updateDiagram(id: string, updates: Partial<Diagram>): Promise<Diagram> {
    try {
      const response = await apiClient.put<Diagram>(`/api/diagrams/${id}`, updates);
      return response.data;
    } catch (error) {
      console.warn(`Error calling updateDiagram API for ${id}, falling back to local storage:`, error);
      const local = this.getLocalDiagrams();
      const index = local.findIndex(d => d.id === id);
      if (index === -1) throw new Error("Diagrama no encontrado", { cause: error });
      
      const updated: Diagram = {
        ...local[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      local[index] = updated;
      this.saveLocalDiagrams(local);
      return updated;
    }
  }

  async deleteDiagram(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/diagrams/${id}`);
    } catch (error) {
      console.warn(`Error calling deleteDiagram API for ${id}, falling back to local storage:`, error);
    } finally {
      const local = this.getLocalDiagrams();
      const filtered = local.filter(d => d.id !== id);
      this.saveLocalDiagrams(filtered);
    }
  }
}

export const diagramService = new DiagramService();
export { INITIAL_MARKDOWN };
