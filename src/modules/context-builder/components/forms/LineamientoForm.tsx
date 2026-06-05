import type { DocumentoLineamientoRequestInterface } from "../../interfaces/DocumentoLineamientoRequestInterface";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface LineamientoFormProps {
  data: DocumentoLineamientoRequestInterface;
  onChange: (nextData: DocumentoLineamientoRequestInterface) => void;
}

export const LineamientoForm = ({ data, onChange }: LineamientoFormProps) => {
  const updateField = <K extends keyof DocumentoLineamientoRequestInterface>(
    field: K,
    value: DocumentoLineamientoRequestInterface[K],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <CommonDocumentFields data={data} onChange={onChange} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="label" htmlFor="lineamiento">
            Lineamiento
          </label>
          <textarea
            id="lineamiento"
            className="field min-h-28"
            value={data.lineamiento}
            onChange={(event) => updateField("lineamiento", event.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="dominio">
            Dominio
          </label>
          <input id="dominio" className="field" value={data.dominio} onChange={(event) => updateField("dominio", event.target.value)} />
        </div>

        <div>
          <label className="label" htmlFor="categoria">
            Categoría
          </label>
          <input
            id="categoria"
            className="field"
            value={data.categoria}
            onChange={(event) => updateField("categoria", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};