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
  onChange: (nextData: DocumentUnionType) => void;
}

export const DynamicFormRenderer = ({
  tipo,
  data,
  showStructuredForm,
  mode,
  onChange,
}: DynamicFormRendererProps) => {
  const modeLabel = mode === "create" ? "Creación" : "Edición";

  if (!tipo || !data || !showStructuredForm) {
    return (
      <div className="panel border-dashed text-sm text-slate-500 dark:text-slate-300">
        Selecciona un tipo y genera el formulario con IA o inicia un borrador manual.
      </div>
    );
  }

  return (
    <section className="panel space-y-6">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Formulario de tipo: </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{tipo}</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Modo: {modeLabel}</p>
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
    </section>
  );
};