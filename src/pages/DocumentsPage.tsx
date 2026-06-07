import { useState } from "react";
import { useAppSelector } from "../commons/hooks/useAppSelector";
import type { DocumentRecordInterface } from "../commons/interfaces/DocumentRecordInterface";
import { DynamicDocumentViewer } from "../modules/context-builder/components/DynamicDocumentViewer";
import { DocumentFilterBar } from "../modules/context-builder/components/DocumentFilterBar";
import { useDocumentFilters } from "../modules/context-builder/hooks/useDocumentFilters";

export const DocumentsPage = () => {
  const documents = useAppSelector((state) => state.documents.items);
  const [viewingRecord, setViewingRecord] = useState<DocumentRecordInterface | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    filteredDocuments,
  } = useDocumentFilters(documents);

  return (
    <section className="space-y-6">
      <div className="panel space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Documentos</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">Vista general de registros</h2>
            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explora y filtra todos los documentos estructurados creados.
            </p>
          </div>
        </div>

        <DocumentFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((record) => (
            <article key={record.id} className="panel flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{record.tipo}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{record.data.titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {record.data.contenido?.slice(0, 140) || "Sin contenido disponible."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Estado</p>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">{record.data.estado}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Origen</p>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">{record.origin}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="action-secondary w-full py-2 flex items-center justify-center gap-1.5"
                onClick={() => setViewingRecord(record)}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Visualizar
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel text-center py-12 text-slate-500 dark:text-slate-400">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
          </svg>
          <p className="text-sm font-semibold">No se encontraron documentos</p>
          <p className="text-xs text-slate-400 mt-1">Prueba a ajustar tu búsqueda o tus filtros.</p>
        </div>
      )}

      <DynamicDocumentViewer
        tipo={viewingRecord?.tipo ?? ""}
        data={viewingRecord?.data ?? null}
        isOpen={Boolean(viewingRecord)}
        onClose={() => setViewingRecord(null)}
      />
    </section>
  );
};