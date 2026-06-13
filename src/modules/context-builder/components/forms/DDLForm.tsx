import type { ColumnaInterface } from "../../interfaces/ColumnaInterface";
import type { DocumentoDDLRequestInterface } from "../../interfaces/DocumentoDDLRequestInterface";
import type { TablaInterface } from "../../interfaces/TablaInterface";
import { createEmptyColumn, createEmptyTable } from "../../templates/documentTemplates";
import { CommonDocumentFields } from "./CommonDocumentFields";

interface DDLFormProps {
  data: DocumentoDDLRequestInterface;
  onChange: (nextData: DocumentoDDLRequestInterface) => void;
}

export const DDLForm = ({ data, onChange }: DDLFormProps) => {
  const updateField = <K extends keyof DocumentoDDLRequestInterface>(field: K, value: DocumentoDDLRequestInterface[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateTable = (tableIndex: number, nextTable: TablaInterface) => {
    updateField(
      "tablas",
      data.tablas.map((table, index) => (index === tableIndex ? nextTable : table)),
    );
  };

  const updateColumn = (tableIndex: number, columnIndex: number, nextColumn: ColumnaInterface) => {
    const table = data.tablas[tableIndex];
    updateTable(tableIndex, {
      ...table,
      columnas: table.columnas.map((column, index) => (index === columnIndex ? nextColumn : column)),
    });
  };

  return (
    <div className="space-y-6">
      <CommonDocumentFields data={data} onChange={onChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="motorBd">
            Motor BD
          </label>
          <select
            id="motorBd"
            className="field"
            value={data.motorBd || ""}
            onChange={(event) => updateField("motorBd", event.target.value as DocumentoDDLRequestInterface["motorBd"])}
          >
            <option value="" disabled>Elija una opción</option>
            <option value="POSTGRESQL">POSTGRESQL</option>
            <option value="MYSQL">MYSQL</option>
            <option value="ORACLE">ORACLE</option>
            <option value="SQLSERVER">SQLSERVER</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="version">
            Versión
          </label>
          <input id="version" className="field" value={data.version} onChange={(event) => updateField("version", event.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tablas</h3>
          <button
            type="button"
            className="action-secondary w-full sm:w-auto"
            onClick={() => updateField("tablas", [...data.tablas, createEmptyTable()])}
          >
            Agregar tabla
          </button>
        </div>

        {data.tablas.map((table, tableIndex) => (
          <article key={tableIndex} className="rounded-3xl border border-slate-200/80 p-4 dark:border-slate-700 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="label">Nombre tabla</label>
                <input
                  className="field"
                  value={table.nombre}
                  onChange={(event) => updateTable(tableIndex, { ...table, nombre: event.target.value })}
                />
              </div>

              <div>
                <label className="label">Esquema</label>
                <input
                  className="field"
                  value={table.esquema}
                  onChange={(event) => updateTable(tableIndex, { ...table, esquema: event.target.value })}
                />
              </div>

              <div>
                <label className="label">Descripción</label>
                <input
                  className="field"
                  value={table.descripcion ?? ""}
                  onChange={(event) => updateTable(tableIndex, { ...table, descripcion: event.target.value })}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Columnas</h4>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="action-secondary w-full sm:w-auto"
                    onClick={() => updateTable(tableIndex, { ...table, columnas: [...table.columnas, createEmptyColumn()] })}
                  >
                    Agregar columna
                  </button>
                  <button
                    type="button"
                    className="action-secondary w-full sm:w-auto"
                    onClick={() => updateField("tablas", data.tablas.filter((_, index) => index !== tableIndex))}
                    disabled={data.tablas.length === 1}
                  >
                    Eliminar tabla
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {table.columnas.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-4 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/60">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Nombre</label>
                        <input
                          className="field w-full"
                          value={column.nombre}
                          onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, nombre: event.target.value })}
                          placeholder="Ej: id_usuario"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Tipo de Dato</label>
                        <input
                          className="field w-full"
                          value={column.tipoDato}
                          onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, tipoDato: event.target.value })}
                          placeholder="Ej: uuid, varchar(50)"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Descripción</label>
                      <input
                        className="field w-full"
                        value={column.descripcion ?? ""}
                        onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, descripcion: event.target.value })}
                        placeholder="Propósito de la columna..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={column.esPk}
                            onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esPk: event.target.checked })}
                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                          />
                          PK
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={column.esFk}
                            onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esFk: event.target.checked })}
                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                          />
                          FK
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={column.esNullable}
                            onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esNullable: event.target.checked })}
                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                          />
                          Nullable
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={column.esUnique}
                            onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esUnique: event.target.checked })}
                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                          />
                          Unique
                        </label>
                      </div>
                      
                      <button
                        type="button"
                        className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          updateTable(tableIndex, {
                            ...table,
                            columnas: table.columnas.filter((_, index) => index !== columnIndex),
                          })
                        }
                        disabled={table.columnas.length === 1}
                        title="Eliminar columna"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};