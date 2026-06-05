import type { DocumentoDDLRequestInterface } from "./DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "./DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "./DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "./DocumentoSistemaRequestInterface";
import type { DocumentUnionType } from "./DocumentUnionType";

export const isDDL = (doc: DocumentUnionType): doc is DocumentoDDLRequestInterface => "motorBd" in doc;

export const isNegocio = (doc: DocumentUnionType): doc is DocumentoNegocioRequestInterface => "fuente" in doc;

export const isSistema = (doc: DocumentUnionType): doc is DocumentoSistemaRequestInterface => "urlRepos" in doc;

export const isLineamiento = (doc: DocumentUnionType): doc is DocumentoLineamientoRequestInterface => "lineamiento" in doc;