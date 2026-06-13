import type { DocumentoSistemaRequestInterface } from "../../interfaces/DocumentoSistemaRequestInterface";
import { TagListInput } from "../TagListInput";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface SistemaFormProps {
  data: DocumentoSistemaRequestInterface;
  onChange: (nextData: DocumentoSistemaRequestInterface) => void;
}

export const SistemaForm = ({ data, onChange }: SistemaFormProps) => {
  const updateField = <K extends keyof DocumentoSistemaRequestInterface>(
    field: K,
    value: DocumentoSistemaRequestInterface[K],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <CommonDocumentFields data={data} onChange={onChange} />
      <TagListInput
        id="repos"
        label="Repositorios"
        values={data.urlRepos}
        onChange={(nextValues) => updateField("urlRepos", nextValues)}
        placeholder="Escribe un repositorio y presiona Enter"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TagListInput
          id="stack"
          label="Stack"
          values={data.stack}
          onChange={(nextValues) => updateField("stack", nextValues)}
          placeholder="Escribe una tecnología y presiona Enter"
        />

        <TagListInput
          id="devs"
          label="Developers"
          values={data.devs}
          onChange={(nextValues) => updateField("devs", nextValues)}
          placeholder="Escribe un nombre y presiona Enter"
        />
      </div>
    </div>
  );
};