import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";

interface DocumentTableProps {
  documents: DocumentRecordInterface[];
  onEdit: (record: DocumentRecordInterface) => void;
  onDelete: (id: string) => void;
}

export const DocumentTable = ({ documents, onEdit, onDelete }: DocumentTableProps) => (
  <section className="panel space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">CRUD</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Tabla de documentos</h2>
      </div>
      <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        {documents.length} registros
      </span>
    </div>

    <div className="space-y-3 md:hidden">
      {documents.map((record) => (
        <article key={record.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Título</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{record.data.titulo}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Tipo</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{record.tipo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Origen</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{record.origin}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Estado</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{record.data.estado}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Actualizado</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{record.data.updatedAt?.slice(0, 10) ?? "-"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="action-secondary w-full sm:w-auto" onClick={() => onEdit(record)}>
                Editar
              </button>
              <button type="button" className="action-secondary w-full sm:w-auto" onClick={() => onDelete(record.id)}>
                Eliminar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <th className="px-4">Título</th>
            <th className="px-4">Tipo</th>
            <th className="px-4">Estado</th>
            <th className="px-4">Origen</th>
            <th className="px-4">Actualizado</th>
            <th className="px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((record) => (
            <tr key={record.id} className="rounded-2xl bg-slate-100/90 text-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
              <td className="rounded-l-2xl px-4 py-4 font-medium">{record.data.titulo}</td>
              <td className="px-4 py-4">{record.tipo}</td>
              <td className="px-4 py-4">{record.data.estado}</td>
              <td className="px-4 py-4">{record.origin}</td>
              <td className="px-4 py-4">{record.data.updatedAt?.slice(0, 10) ?? "-"}</td>
              <td className="rounded-r-2xl px-4 py-4">
                <div className="flex gap-3">
                  <button type="button" className="action-secondary" onClick={() => onEdit(record)}>
                    Editar
                  </button>
                  <button type="button" className="action-secondary" onClick={() => onDelete(record.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);