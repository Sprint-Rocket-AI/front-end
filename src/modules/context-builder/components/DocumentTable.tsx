import { useState, useMemo } from "react";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";

interface DocumentTableProps {
  documents: DocumentRecordInterface[];
  onView: (record: DocumentRecordInterface) => void;
  onEdit: (record: DocumentRecordInterface) => void;
  onDelete: (id: string) => void;
}

export const DocumentTable = ({ documents, onView, onEdit, onDelete }: DocumentTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredDocs = useMemo(() => {
    if (!search) return documents;
    return documents.filter((doc) => doc.data.titulo.toLowerCase().includes(search.toLowerCase()));
  }, [documents, search]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const currentDocs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredDocs.slice(start, start + itemsPerPage);
  }, [filteredDocs, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <section className="panel space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">CRUD</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Tabla de documentos</h2>
        </div>


      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={handleSearchChange}
          className="field w-full sm:w-64 text-sm"
        />
      </div>
      <div className="space-y-3 md:hidden">
        {currentDocs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No se encontraron documentos.</p>
        ) : (
          currentDocs.map((record) => (
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Actualizado</p>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">{record.data.fechaActualizacion?.slice(0, 10) ?? "-"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="action-secondary flex-1 inline-flex items-center justify-center gap-1.5 py-2"
                    onClick={() => onView(record)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </button>
                  <button
                    type="button"
                    className="action-secondary flex-1 py-2"
                    onClick={() => onEdit(record)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="action-secondary flex-1 py-2 text-red-500 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => onDelete(record.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <th className="px-4">Título</th>
              <th className="px-4">Tipo</th>
              <th className="px-4">Creado</th>
              <th className="px-4">Actualizado</th>
              <th className="px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDocs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  No se encontraron documentos.
                </td>
              </tr>
            ) : (
              currentDocs.map((record) => (
                <tr key={record.id} className="rounded-2xl bg-slate-100/90 text-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
                  <td className="rounded-l-2xl px-4 py-4 font-medium">{record.data.titulo}</td>
                  <td className="px-4 py-4">{record.tipo}</td>
                  <td className="px-4 py-4">{record.data.fechaCreacion?.slice(0, 10) ?? "-"}</td>
                  <td className="px-4 py-4">{record.data.fechaActualizacion?.slice(0, 10) ?? "-"}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="action-secondary p-2 inline-flex items-center justify-center rounded-full"
                        title="Visualizar documento"
                        onClick={() => onView(record)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="action-secondary p-2 inline-flex items-center justify-center rounded-full"
                        title="Editar documento"
                        onClick={() => onEdit(record)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="action-secondary p-2 inline-flex items-center justify-center rounded-full text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800"
                        title="Eliminar documento"
                        onClick={() => onDelete(record.id)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(totalPages > 1 || filteredDocs.length > 5) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Página <span className="font-semibold text-slate-700 dark:text-slate-300">{page}</span> de <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="field text-xs py-1 pl-2 pr-6 rounded-md bg-transparent border-slate-200 dark:border-slate-700 focus:ring-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  );
};