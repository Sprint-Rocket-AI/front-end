import type { DocumentRecordInterface } from "../interfaces/DocumentRecordInterface";
import { DocumentTipoEnum } from "../../modules/context-builder/interfaces/DocumentTipoEnum";

export const mockDocuments: DocumentRecordInterface[] = [
  {
    id: "demo-negocio-1",
    tipo: DocumentTipoEnum.NEGOCIO,
    data: {
      id: "demo-negocio-1",
      titulo: "Flujo de onboarding digital",
      contenido: "El cliente debe validar identidad, firmar términos y recibir confirmación automática.",
      tags: ["onboarding", "cliente"],
      createdAt: "2026-06-05T10:00:00.000Z",
      updatedAt: "2026-06-05T10:00:00.000Z",
      criteriosAceptacion: [
        "El usuario completa identidad en menos de 3 minutos.",
        "La evidencia queda disponible para auditoría.",
      ],
    },
  },
  {
    id: "demo-sistema-1",
    tipo: DocumentTipoEnum.SISTEMA,
    data: {
      id: "demo-sistema-1",
      titulo: "Portal Context Builder",
      contenido: "Frontend React con servicios Node para documentar y estructurar conocimiento de proyecto.",
      tags: ["frontend", "node"],
      createdAt: "2026-06-05T11:00:00.000Z",
      updatedAt: "2026-06-05T11:00:00.000Z",
      tipo: "SISTEMA",
      urlRepos: ["https://github.com/example/context-builder-app"],
      stack: ["React 19", "TypeScript", "Node.js 26.3"],
      devs: ["Matias", "Copilot"],
    },
  },
];