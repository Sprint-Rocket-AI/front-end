import type { DocumentoLineamientoRequestInterface } from "../../interfaces/DocumentoLineamientoRequestInterface";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface LineamientoFormProps {
  data: DocumentoLineamientoRequestInterface;
  onChange: (nextData: DocumentoLineamientoRequestInterface) => void;
}

export const LineamientoForm = ({ data, onChange }: LineamientoFormProps) => {
  return (
    <div className="space-y-6">
      <CommonDocumentFields data={data} onChange={onChange} />
    </div>
  );
};