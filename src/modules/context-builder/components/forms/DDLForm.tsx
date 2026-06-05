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
            value={data.motorBd}
            onChange={(event) => updateField("motorBd", event.target.value as DocumentoDDLRequestInterface["motorBd"])}
          >
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tablas</h3>
          <button
            type="button"
            className="action-secondary"
            onClick={() => updateField("tablas", [...data.tablas, createEmptyTable()])}
          >
            Add Table
          </button>
        </div>

        {data.tablas.map((table, tableIndex) => (
          <article key={`${tableIndex}-${table.nombre || "tabla"}`} className="rounded-3xl border border-slate-200/80 p-5 dark:border-slate-700">
            <div className="grid gap-4 md:grid-cols-3">
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
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Columnas</h4>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="action-secondary"
                    onClick={() => updateTable(tableIndex, { ...table, columnas: [...table.columnas, createEmptyColumn()] })}
                  >
                    Add Column
                  </button>
                  <button
                    type="button"
                    className="action-secondary"
                    onClick={() => updateField("tablas", data.tablas.filter((_, index) => index !== tableIndex))}
                    disabled={data.tablas.length === 1}
                  >
                    Remove Table
                  </button>
                </div>
              </div>

              {table.columnas.map((column, columnIndex) => (
                <div key={`${tableIndex}-${columnIndex}-${column.nombre || "col"}`} className="grid gap-3 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/60 lg:grid-cols-6">
                  <input
                    className="field lg:col-span-2"
                    value={column.nombre}
                    onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, nombre: event.target.value })}
                    placeholder="nombre"
                  />
                  <input
                    className="field"
                    value={column.tipoDato}
                    onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, tipoDato: event.target.value })}
                    placeholder="tipoDato"
                  />
                  <input
                    className="field lg:col-span-2"
                    value={column.descripcion ?? ""}
                    onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, descripcion: event.target.value })}
                    placeholder="descripcion"
                  />
                  <button
                    type="button"
                    className="action-secondary"
                    onClick={() =>
                      updateTable(tableIndex, {
                        ...table,
                        columnas: table.columnas.filter((_, index) => index !== columnIndex),
                      })
                    }
                    disabled={table.columnas.length === 1}
                  >
                    Remove
                  </button>

                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={column.esPk}
                      onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esPk: event.target.checked })}
                    />
                    PK
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={column.esFk}
                      onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esFk: event.target.checked })}
                    />
                    FK
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={column.esNullable}
                      onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esNullable: event.target.checked })}
                    />
                    Nullable
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={column.esUnique}
                      onChange={(event) => updateColumn(tableIndex, columnIndex, { ...column, esUnique: event.target.checked })}
                    />
                    Unique
                  </label>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};