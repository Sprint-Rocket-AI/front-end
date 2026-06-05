import type { DocumentoSistemaRequestInterface } from "../../interfaces/DocumentoSistemaRequestInterface";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface SistemaFormProps {
  data: DocumentoSistemaRequestInterface;
  onChange: (nextData: DocumentoSistemaRequestInterface) => void;
}

const parseLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

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

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="repos">
            Repositorios
          </label>
          <textarea
            id="repos"
            className="field min-h-28"
            value={data.urlRepos.join("\n")}
            onChange={(event) => updateField("urlRepos", parseLines(event.target.value))}
            placeholder="Un repo por línea"
          />
        </div>

        <div>
          <label className="label" htmlFor="stack">
            Stack
          </label>
          <textarea
            id="stack"
            className="field min-h-28"
            value={data.stack.join("\n")}
            onChange={(event) => updateField("stack", parseLines(event.target.value))}
            placeholder="React 19&#10;Node.js 26.3"
          />
        </div>

        <div>
          <label className="label" htmlFor="devs">
            Developers
          </label>
          <textarea
            id="devs"
            className="field min-h-28"
            value={data.devs.join("\n")}
            onChange={(event) => updateField("devs", parseLines(event.target.value))}
            placeholder="Un nombre por línea"
          />
        </div>
      </div>
    </div>
  );
};