import { useAppSelector } from "../commons/hooks/useAppSelector";

export const DocumentsPage = () => {
  const documents = useAppSelector((state) => state.documents.items);

  return (
    <section className="space-y-6">
      <div className="panel space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Documentos</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Vista general de registros</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Esta página deja lista una sección independiente para explorar documentos sin entrar al flujo completo del builder.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((record) => (
          <article key={record.id} className="panel space-y-4">
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
          </article>
        ))}
      </div>
    </section>
  );
};