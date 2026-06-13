import { useState, useEffect } from "react";
import type { DocumentoNegocioRequestInterface } from "../../interfaces/DocumentoNegocioRequestInterface";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface NegocioFormProps {
  data: DocumentoNegocioRequestInterface;
  onChange: (nextData: DocumentoNegocioRequestInterface) => void;
}

export const NegocioForm = ({ data, onChange }: NegocioFormProps) => {
  const [localCriterios, setLocalCriterios] = useState(() => data.criteriosAceptacion.join("\n"));

  useEffect(() => {
    const currentVal = data.criteriosAceptacion.join("\n");
    if (localCriterios !== currentVal) {
      setLocalCriterios(currentVal);
    }
  }, [data.criteriosAceptacion]);

  const handleCriteriosChange = (val: string) => {
    setLocalCriterios(val);
    const lines = val.split(/\r?\n/);
    onChange({
      ...data,
      criteriosAceptacion: lines,
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
            value={localCriterios}
            onChange={(event) => handleCriteriosChange(event.target.value)}
            placeholder="Un criterio por línea"
          />
        </div>
      </div>
    </div>
  );
};