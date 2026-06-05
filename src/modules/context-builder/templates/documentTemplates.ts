import type { BaseDocumentInterface } from "../interfaces/BaseDocumentInterface";
import type { ColumnaInterface } from "../interfaces/ColumnaInterface";
import { DocumentEstadoEnum } from "../interfaces/DocumentEstadoEnum";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import type { DocumentoDDLRequestInterface } from "../interfaces/DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "../interfaces/DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "../interfaces/DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "../interfaces/DocumentoSistemaRequestInterface";
import type { TablaInterface } from "../interfaces/TablaInterface";

const defaultProjectId = "CTX-001";

const getNow = () => new Date().toISOString();

const cleanLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const normalizeStringList = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const extractTags = (rawText: string) =>
  Array.from(
    new Set(
      rawText
        .split(/\s+/)
        .filter((word) => word.startsWith("#"))
        .map((word) => word.replace(/[^\w-]/g, "").slice(1))
        .filter(Boolean),
    ),
  );

const createBaseDocument = (rawText = ""): BaseDocumentInterface => ({
  titulo: cleanLines(rawText)[0] ?? "Nuevo documento",
  contenido: rawText,
  proyectoId: defaultProjectId,
  estado: DocumentEstadoEnum.BORRADOR,
  tags: extractTags(rawText),
  createdAt: getNow(),
  updatedAt: getNow(),
});

export const createEmptyColumn = (): ColumnaInterface => ({
  nombre: "",
  tipoDato: "varchar(255)",
  esPk: false,
  esFk: false,
  esNullable: true,
  esUnique: false,
  valorPorDefecto: null,
  descripcion: "",
});

export const createEmptyTable = (): TablaInterface => ({
  nombre: "",
  esquema: "public",
  descripcion: "",
  columnas: [createEmptyColumn()],
  relaciones: [],
});

export const createEmptyDocumentByType = (tipo: DocumentTipoEnum): DocumentUnionType => {
  const base = createBaseDocument();

  switch (tipo) {
    case DocumentTipoEnum.DDL:
      return {
        ...base,
        motorBd: "POSTGRESQL",
        version: "16",
        tablas: [createEmptyTable()],
      };
    case DocumentTipoEnum.NEGOCIO:
      return {
        ...base,
        fuente: "OTRO",
        urlFuente: "",
        criteriosAceptacion: [],
        resumen: "",
      };
    case DocumentTipoEnum.SISTEMA:
      return {
        ...base,
        tipo: "SISTEMA",
        urlRepos: [],
        stack: [],
        devs: [],
      };
    case DocumentTipoEnum.LINEAMIENTO:
      return {
        ...base,
        lineamiento: "",
        dominio: [],
        categoria: [],
      };
  }
};

const createExcerpt = (rawText: string) => cleanLines(rawText).slice(0, 3).join(" ").slice(0, 220);

export const createFallbackFromRawText = (tipo: DocumentTipoEnum, rawText: string): DocumentUnionType => {
  const base = createBaseDocument(rawText);

  switch (tipo) {
    case DocumentTipoEnum.DDL:
      return {
        ...createEmptyDocumentByType(tipo),
        ...base,
        titulo: base.titulo || "Modelo DDL inicial",
        tablas: [
          {
            ...createEmptyTable(),
            nombre: "tabla_principal",
            descripcion: createExcerpt(rawText),
            columnas: [
              {
                ...createEmptyColumn(),
                nombre: "id",
                tipoDato: "uuid",
                esPk: true,
                esNullable: false,
              },
            ],
          },
        ],
      };
    case DocumentTipoEnum.NEGOCIO:
      return {
        ...createEmptyDocumentByType(tipo),
        ...base,
        resumen: createExcerpt(rawText),
        criteriosAceptacion: cleanLines(rawText).slice(0, 4),
      };
    case DocumentTipoEnum.SISTEMA:
      return {
        ...createEmptyDocumentByType(tipo),
        ...base,
        stack: cleanLines(rawText).slice(0, 4),
        urlRepos: [],
        devs: [],
      };
    case DocumentTipoEnum.LINEAMIENTO:
      return {
        ...createEmptyDocumentByType(tipo),
        ...base,
        lineamiento: createExcerpt(rawText),
        dominio: ["Arquitectura"],
        categoria: ["General"],
      };
  }
};

export const mergeAiResult = (tipo: DocumentTipoEnum, partial: Partial<DocumentUnionType>): DocumentUnionType => {
  switch (tipo) {
    case DocumentTipoEnum.DDL: {
      const base = createEmptyDocumentByType(tipo) as DocumentoDDLRequestInterface;
      const draft = partial as Partial<DocumentoDDLRequestInterface>;
      return {
        ...base,
        ...draft,
        tablas: draft.tablas?.length ? draft.tablas : base.tablas,
      };
    }
    case DocumentTipoEnum.NEGOCIO: {
      const base = createEmptyDocumentByType(tipo) as DocumentoNegocioRequestInterface;
      const draft = partial as Partial<DocumentoNegocioRequestInterface>;
      return {
        ...base,
        ...draft,
        criteriosAceptacion: draft.criteriosAceptacion ?? base.criteriosAceptacion,
      };
    }
    case DocumentTipoEnum.SISTEMA: {
      const base = createEmptyDocumentByType(tipo) as DocumentoSistemaRequestInterface;
      const draft = partial as Partial<DocumentoSistemaRequestInterface>;
      return {
        ...base,
        ...draft,
        urlRepos: draft.urlRepos ?? base.urlRepos,
        stack: draft.stack ?? base.stack,
        devs: draft.devs ?? base.devs,
      };
    }
    case DocumentTipoEnum.LINEAMIENTO: {
      const base = createEmptyDocumentByType(tipo) as DocumentoLineamientoRequestInterface;
      const draft = partial as Partial<DocumentoLineamientoRequestInterface>;
      return {
        ...base,
        ...draft,
        dominio: normalizeStringList(draft.dominio),
        categoria: normalizeStringList(draft.categoria),
      };
    }
  }
};