import type { BaseDocumentInterface } from "../interfaces/BaseDocumentInterface";
import type { ColumnaInterface } from "../interfaces/ColumnaInterface";
import { DocumentEstadoEnum } from "../interfaces/DocumentEstadoEnum";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import type { TablaInterface } from "../interfaces/TablaInterface";


const getNow = () => new Date().toISOString();

const cleanLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);


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
  titulo: cleanLines(rawText)[0] ?? "",
  contenido: rawText,
  tags: extractTags(rawText),
  createdAt: getNow(),
  updatedAt: getNow(),
});

export const createEmptyColumn = (): ColumnaInterface => ({
  nombre: "",
  tipoDato: "",
  esPk: false,
  esFk: false,
  esNullable: true,
  esUnique: false,
  valorPorDefecto: null,
  descripcion: "",
});

export const createEmptyTable = (): TablaInterface => ({
  nombre: "",
  esquema: "",
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
        motorBd: "" as any,
        version: "",
        tablas: [createEmptyTable()],
      };
    case DocumentTipoEnum.NEGOCIO:
      return {
        ...base,
        fuente: "" as any,
        urlFuente: "",
        criteriosAceptacion: [],
        resumen: "",
      };
    case DocumentTipoEnum.SISTEMA:
      return {
        ...base,
        tipo: "" as any,
        urlRepos: [],
        stack: [],
        devs: [],
      };
    case DocumentTipoEnum.LINEAMIENTO:
      return {
        ...base,
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
      };
  }
};

export const mergeAiResult = (tipo: DocumentTipoEnum, partial: Partial<DocumentUnionType>): DocumentUnionType => {
  const merged = {
    ...createEmptyDocumentByType(tipo),
    ...partial,
  } as DocumentUnionType;

  // Normalización para prevenir advertencias de React sobre valores null y asegurar el mapeo de DDL
  if (tipo === DocumentTipoEnum.DDL) {
    const ddl = merged as any;
    if (ddl.motorBd) {
      ddl.motorBd = ddl.motorBd.toUpperCase();
    }
    if (ddl.tablas) {
      ddl.tablas = ddl.tablas.map((t: any) => ({
        ...t,
        nombre: t.nombre ?? "",
        esquema: t.esquema ?? "",
        descripcion: t.descripcion ?? "",
        columnas: (t.columnas ?? []).map((c: any) => ({
          ...c,
          nombre: c.nombre ?? "",
          tipoDato: c.tipoDato ?? "",
          descripcion: c.descripcion ?? "",
          esPk: !!c.esPk,
          esFk: !!c.esFk,
          esNullable: c.esNullable !== false,
          esUnique: !!c.esUnique,
        })),
      }));
    }
  }

  return merged;
};