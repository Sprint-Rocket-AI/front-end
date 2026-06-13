import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import type { DocumentoDDLRequestInterface } from "../interfaces/DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "../interfaces/DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "../interfaces/DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "../interfaces/DocumentoSistemaRequestInterface";
import { DDLViewer } from "./viewers/DDLViewer";
import { NegocioViewer } from "./viewers/NegocioViewer";
import { SistemaViewer } from "./viewers/SistemaViewer";
import { LineamientoViewer } from "./viewers/LineamientoViewer";

interface DynamicDocumentViewerProps {
  tipo: DocumentTipoEnum | "";
  data: DocumentUnionType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicDocumentViewer = ({ tipo, data, isOpen, onClose }: DynamicDocumentViewerProps) => {
  if (!isOpen || !tipo || !data) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[2px] sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/95 max-h-[85vh] overflow-y-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">{tipo}</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl mt-1">
              {data.titulo || "Documento sin título"}
            </h2>
          </div>
          <button
            type="button"
            className="action-secondary self-start md:self-auto py-2 px-4 text-xs"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* Content Body based on type */}
        <div className="space-y-6">
          {tipo === DocumentTipoEnum.DDL && <DDLViewer data={data as DocumentoDDLRequestInterface} />}
          {tipo === DocumentTipoEnum.NEGOCIO && <NegocioViewer data={data as DocumentoNegocioRequestInterface} />}
          {tipo === DocumentTipoEnum.SISTEMA && <SistemaViewer data={data as DocumentoSistemaRequestInterface} />}
          {tipo === DocumentTipoEnum.LINEAMIENTO && <LineamientoViewer data={data as DocumentoLineamientoRequestInterface} />}
        </div>

        {/* Footer Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {data.updatedAt && (
            <div>Actualizado: {new Date(data.updatedAt).toLocaleString("es-CL")}</div>
          )}
        </div>
      </div>
    </div>
  );
};
