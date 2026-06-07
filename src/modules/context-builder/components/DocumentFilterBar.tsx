import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";

interface DocumentFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: DocumentTipoEnum | "";
  onTypeChange: (value: DocumentTipoEnum | "") => void;
}

const typeOptions = Object.values(DocumentTipoEnum);

export const DocumentFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
}: DocumentFilterBarProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <div className="sm:col-span-2">
      <label className="label" htmlFor="search-filter">Buscar por nombre o código</label>
      <div className="relative">
        <input
          id="search-filter"
          type="text"
          placeholder="Ej: título, id, código de proyecto..."
          className="field pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <div>
      <label className="label" htmlFor="type-filter">Filtrar por tipo</label>
      <select
        id="type-filter"
        className="field"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value as DocumentTipoEnum | "")}
      >
        <option value="">Todos los tipos</option>
        {typeOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  </div>
);
