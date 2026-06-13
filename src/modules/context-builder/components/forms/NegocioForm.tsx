import type { DocumentoNegocioRequestInterface } from "../../interfaces/DocumentoNegocioRequestInterface";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface NegocioFormProps {
  data: DocumentoNegocioRequestInterface;
  onChange: (nextData: DocumentoNegocioRequestInterface) => void;
}

export const NegocioForm = ({ data, onChange }: NegocioFormProps) => {
  const updateField = <K extends keyof DocumentoNegocioRequestInterface>(
    field: K,
    value: DocumentoNegocioRequestInterface[K],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <CommonDocumentFields data={data} onChange={onChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label" htmlFor="criteriosAceptacion">
            Criterios de aceptación
          </label>
          <textarea
            id="criteriosAceptacion"
            className="field min-h-28"
            value={data.criteriosAceptacion.join("\n")}
            onChange={(event) =>
              updateField(
                "criteriosAceptacion",
                event.target.value
                  .split(/\r?\n/)
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            placeholder="Un criterio por línea"
          />
        </div>
      </div>
    </div>
  );
};