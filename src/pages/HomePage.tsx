import { Link } from "react-router-dom";
import { useAppSelector } from "../commons/hooks/useAppSelector";

export const HomePage = () => {
  const documents = useAppSelector((state) => state.documents.items);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <div className="panel space-y-6">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
            Inicio
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Un punto de entrada para navegar entre módulos del frontend.
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-[15px]">
            Esta vista deja preparada una estructura de navegación para que el proyecto crezca con más páginas sin mezclar layout, rutas y lógica del módulo principal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/context-builder"
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-orange-200 hover:bg-orange-50/60 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Builder</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Ir al constructor</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Crear documentos desde texto libre, formularios manuales o ayuda de IA.
            </p>
          </Link>

          <Link
            to="/documents"
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 transition hover:border-orange-200 hover:bg-orange-50/60 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Documentos</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Ver registros</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Revisar el conjunto de documentos disponibles y su estado actual.
            </p>
          </Link>
        </div>
      </div>

      <aside className="panel space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Resumen</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{documents.length}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">documentos cargados en el workspace.</p>
        </div>

        <div className="rounded-[1.5rem] border border-dashed border-slate-300/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Uso esperado</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Usa la barra superior para cambiar entre páginas. El modo oscuro o claro queda disponible a nivel de toda la app.
          </p>
        </div>
      </aside>
    </section>
  );
};