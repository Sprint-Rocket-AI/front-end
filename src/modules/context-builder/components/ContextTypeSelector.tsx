import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";

interface ContextTypeSelectorProps {
  value: DocumentTipoEnum | "";
  onChange: (tipo: DocumentTipoEnum | "") => void;
}

const options = [
  DocumentTipoEnum.NEGOCIO,
  DocumentTipoEnum.DDL,
  DocumentTipoEnum.SISTEMA,
  DocumentTipoEnum.LINEAMIENTO,
];

export const ContextTypeSelector = ({ value, onChange }: ContextTypeSelectorProps) => (
  <div>
    <label className="label" htmlFor="document-type">
      Tipo de documento
    </label>
    <select
      id="document-type"
      className="field"
      value={value}
      onChange={(event) => onChange(event.target.value as DocumentTipoEnum | "")}
    >
      <option value="">Selecciona un tipo</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);