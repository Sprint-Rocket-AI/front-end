import type { DocumentoDDLRequestInterface } from "./DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "./DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "./DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "./DocumentoSistemaRequestInterface";

export type DocumentUnionType =
  | DocumentoDDLRequestInterface
  | DocumentoNegocioRequestInterface
  | DocumentoSistemaRequestInterface
  | DocumentoLineamientoRequestInterface;