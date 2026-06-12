import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const suggestions = ['"¿Cómo va el PR-102?"', '"Optimizar consulta SQL"', '"Resumir chat de ayer"'];

const tasks = [
  {
    id: "SPRINT-42",
    title: "Resolver bug de autenticación en login.",
    meta: "Prioridad: Alta · 2 horas estimadas",
  },
  {
    id: "SPRINT-45",
    title: "Terminar la migración de la base de datos a PostgreSQL.",
    meta: "Prioridad: Media · 4 horas estimadas",
  },
];

export const ChatIAPage = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/checkpoint")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a Checkpoint
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
          Sprint Rocket AI
        </h1>
        <div className="w-32" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="panel flex min-h-[640px] flex-col gap-6 !p-0">
          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
            <ChatBubbleIA>
              ¡Hola! Soy tu asistente de desarrollo impulsado por IA. Puedes preguntarme sobre tus tickets
              de JIRA, repositorios en GitHub o pedirme sugerencias de código. ¿En qué te puedo ayudar hoy?
            </ChatBubbleIA>

            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl border-r-[3px] border-accent-500 bg-accent-500/15 px-4 py-3 text-sm leading-relaxed text-slate-100">
                ¿Cuáles son mis tareas prioritarias para hoy?
              </div>
            </div>

            <ChatBubbleIA>
              <p className="mb-4">Revisando tu tablero actual, te sugiero enfocarte en:</p>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-orange-500/30"
                  >
                    <div className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <div>
                        <p className="text-sm text-slate-100">
                          <span className="font-bold text-accent-300">[{task.id}]</span> {task.title}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {task.meta}
                        </p>
                      </div>
                    </div>
                    <button className="shrink-0 text-slate-500 transition group-hover:text-accent-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">¿Quieres que te agregue alguna de estas tareas a tu Checkpoint diario?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  Sí, agregar SPRINT-42
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10">
                  Ver más detalles
                </button>
              </div>
            </ChatBubbleIA>
          </div>

          <div className="border-t border-white/5 p-4 sm:p-5">
            <div className="relative">
              <textarea
                rows={1}
                disabled
                placeholder="Escribe un mensaje..."
                className="field min-h-[52px] resize-none py-3.5 pr-12"
              />
              <button className="absolute right-3 top-3.5 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-4 font-mono uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-orange-500">⚡</span> LLM: Rocket-V4
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-accent-400">⌗</span> Contexto: JIRA / GitHub
                </span>
              </div>
              <span>Presiona Shift + Enter para salto de línea</span>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="panel !rounded-2xl">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-orange-500">Sugerencias AI</h3>
            <div className="space-y-2.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-accent-500/40 hover:bg-accent-500/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="panel !rounded-2xl">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-orange-500">Métricas Sprint</h3>
            <Metric label="Progreso Sprint" value="68%" pct={68} color="bg-accent-500" />
            <div className="mt-5">
              <Metric label="Velocidad" value="High" pct={88} color="bg-orange-500" />
            </div>
          </div>

          <div className="panel relative h-40 overflow-hidden !rounded-2xl !p-0">
            <div className="absolute inset-0 bg-assistant-gradient opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">🚀</div>
          </div>
        </aside>
      </div>
    </section>
  );
};

function ChatBubbleIA({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-assistant-gradient text-base shadow-glow-assistant">
        🤖
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-sm font-bold text-slate-100">Sprint Rocket AI</p>
        <div className="rounded-2xl border-l-[3px] border-assistant-500 bg-assistant-500/10 px-4 py-3 text-sm leading-relaxed text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-slate-100">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
