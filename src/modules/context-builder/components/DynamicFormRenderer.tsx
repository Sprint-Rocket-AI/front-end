import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import type { DocumentoDDLRequestInterface } from "../interfaces/DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "../interfaces/DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "../interfaces/DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "../interfaces/DocumentoSistemaRequestInterface";
import { DDLForm } from "./forms/DDLForm";
import { LineamientoForm } from "./forms/LineamientoForm";
import { NegocioForm } from "./forms/NegocioForm";
import { SistemaForm } from "./forms/SistemaForm";

interface DynamicFormRendererProps {
  tipo: DocumentTipoEnum | "";
  data: DocumentUnionType | null;
  showStructuredForm: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
  canSave: boolean;
  canReset: boolean;
  onChange: (nextData: DocumentUnionType) => void;
}

export const DynamicFormRenderer = ({
  tipo,
  data,
  showStructuredForm,
  mode,
  onClose,
  onSave,
  onReset,
  canSave,
  canReset,
  onChange,
}: DynamicFormRendererProps) => {
  const modeLabel = mode === "create" ? "Creación" : "Edición";

  if (!showStructuredForm) {
    return null;
  }

  if (!tipo || !data) {
    return (
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[2px] sm:p-6">
        <div className="mx-auto flex min-h-full w-full max-w-3xl items-start justify-center">
          <div className="panel mt-6 w-full border-dashed text-sm leading-6 text-slate-500 shadow-2xl dark:text-slate-300 sm:mt-10">
            Selecciona un tipo y genera el formulario con IA o inicia un borrador manual.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[2px] sm:p-6">
      <div className="mx-auto flex min-h-full w-full max-w-2xl items-start justify-center">
        <section className="panel mt-6 w-full space-y-6 shadow-2xl sm:mt-10">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Formulario</p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">{tipo}</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Modo: {modeLabel}</p>
              <button type="button" className="action-secondary self-start md:self-auto py-2 px-4" onClick={onClose}>
                ❌
              </button>
            </div>
          </div>

          {tipo === DocumentTipoEnum.DDL && (
            <DDLForm data={data as DocumentoDDLRequestInterface} onChange={(nextData) => onChange(nextData)} />
          )}

          {tipo === DocumentTipoEnum.NEGOCIO && (
            <NegocioForm data={data as DocumentoNegocioRequestInterface} onChange={(nextData) => onChange(nextData)} />
          )}

          {tipo === DocumentTipoEnum.SISTEMA && (
            <SistemaForm data={data as DocumentoSistemaRequestInterface} onChange={(nextData) => onChange(nextData)} />
          )}

          {tipo === DocumentTipoEnum.LINEAMIENTO && (
            <LineamientoForm data={data as DocumentoLineamientoRequestInterface} onChange={(nextData) => onChange(nextData)} />
          )}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row">
            <button type="button" className="action-primary w-full sm:w-auto" onClick={onSave} disabled={!canSave}>
              Guardar
            </button>
            <button type="button" className="action-secondary w-full sm:w-auto" onClick={onReset} disabled={!canReset}>
              Restablecer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};