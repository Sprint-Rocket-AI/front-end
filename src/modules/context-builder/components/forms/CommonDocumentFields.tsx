import type { BaseDocumentInterface } from "../../interfaces/BaseDocumentInterface";
import { DocumentEstadoEnum } from "../../interfaces/DocumentEstadoEnum";
import { TagListInput } from "../TagListInput";

interface CommonDocumentFieldsProps<T extends BaseDocumentInterface> {
  data: T;
  onChange: (nextData: T) => void;
}

export const CommonDocumentFields = <T extends BaseDocumentInterface>({
  data,
  onChange,
}: CommonDocumentFieldsProps<T>) => {
  const updateField = <K extends keyof BaseDocumentInterface>(field: K, value: BaseDocumentInterface[K]) => {
    onChange({
      ...data,
      [field]: value,
    } as T);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="label" htmlFor="titulo">
          Título
        </label>
        <input id="titulo" className="field" value={data.titulo} onChange={(event) => updateField("titulo", event.target.value)} />
      </div>

      <div className="md:col-span-2">
        <label className="label" htmlFor="contenido">
          Contenido
        </label>
        <textarea
          id="contenido"
          className="field min-h-36"
          value={data.contenido}
          onChange={(event) => updateField("contenido", event.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <TagListInput
          id="tags"
          label="Tags"
          values={data.tags ?? []}
          onChange={(nextValues) => updateField("tags", nextValues)}
          placeholder="frontend, ia, negocio"
        />
      </div>
    </div>
  );
};