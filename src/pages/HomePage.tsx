import { Link, useNavigate } from "react-router-dom";

const recentActivity = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Arquitectura_Final_v2.pdf",
    meta: "Modificado hace 2 horas por IA Assistant",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    title: "Flujo de Navegación UX",
    meta: "Diagrama generado hace 5 horas",
  },
];

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 animate-fade-in">
      <div className="panel space-y-6 sm:p-8">
        <div className="space-y-4">
          <span className="badge w-fit bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
            Inicio
          </span>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-[2.75rem]">
            Un punto de entrada para navegar entre los distintos módulos de la aplicación
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-[15px]">
            Esta vista deja preparada una estructura de navegación para que el proyecto crezca con más
            páginas sin mezclar layout, rutas y lógica del módulo principal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/documents/builder"
            className="panel panel-interactive group relative overflow-hidden !rounded-2xl"
          >
            <span className="pointer-events-none absolute right-5 top-5 text-slate-600/60 transition-colors group-hover:text-orange-500/70">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" /><path d="M5 21l4.5-9" /><path d="M19 21l-4.5-9" /><path d="M12 7v6" />
              </svg>
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Builder</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Ir al constructor</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Crear documentos desde texto libre, formularios manuales o ayuda de IA.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-400">
              Lanzar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>

          <Link
            to="/documents/view"
            className="panel panel-interactive group relative overflow-hidden !rounded-2xl"
          >
            <span className="pointer-events-none absolute right-5 top-5 text-slate-600/60 transition-colors group-hover:text-orange-500/70">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Documentos</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Ver registros</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Revisar el conjunto de documentos disponibles y su estado actual.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-400">
              Explorar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Actividad Reciente</h2>
            <button type="button" className="text-sm font-semibold text-accent-400 transition hover:text-accent-300">
              Ver todo
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="panel panel-interactive flex items-center gap-4 !rounded-2xl !p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{item.meta}</p>
                </div>
                <button type="button" className="shrink-0 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel flex flex-col gap-4 border-assistant-500/30 !rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-assistant-gradient text-lg shadow-glow-assistant">
              🚀
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-teal-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Sprint Rocket AI</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400">En línea</p>
            </div>
          </div>
          <p className="text-sm italic leading-6 text-slate-600 dark:text-slate-300">
            "Hola, estoy listo para ayudarte a construir diagramas o documentos técnicos. ¿En qué podemos
            avanzar hoy?"
          </p>
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="mt-auto w-full rounded-xl bg-assistant-gradient py-3 text-sm font-semibold text-white transition hover:brightness-110 hover:shadow-glow-assistant"
          >
            Abrir Asistente
          </button>
        </div>
      </div>
    </section>
  );
};
