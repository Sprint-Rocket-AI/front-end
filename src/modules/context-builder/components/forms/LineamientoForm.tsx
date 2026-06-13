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
    </div>
  );
};