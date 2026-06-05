import type { DocumentoLineamientoRequestInterface } from "../../interfaces/DocumentoLineamientoRequestInterface";
import { TagListInput } from "../TagListInput";
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

        <TagListInput
          id="dominio"
          label="Dominio"
          values={data.dominio}
          onChange={(nextValues) => updateField("dominio", nextValues)}
          placeholder="Escribe un dominio y presiona Enter"
        />

        <TagListInput
          id="categoria"
          label="Categoría"
          values={data.categoria}
          onChange={(nextValues) => updateField("categoria", nextValues)}
          placeholder="Escribe una categoría y presiona Enter"
        />
      </div>
    </div>
  );
};