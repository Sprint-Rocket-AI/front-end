import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActividadFormModal } from "../../checkpoint/components/ActividadFormModal";
import { RecordatorioFormModal } from "../../checkpoint/components/RecordatorioFormModal";
import { RecordatoriosPanel } from "../components/RecordatoriosPanel";
import { ActividadesPanel } from "../components/ActividadesPanel";
import { useCheckpoint } from "../../checkpoint/hooks/useCheckpoint";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const initialThreads: ChatThread[] = [
  {
    id: "thread-1",
    title: "Prioridades de hoy",
    updatedAt: "Hace 5 min",
    messages: [
      {
        id: "m-1",
        role: "assistant",
        content: "Hola. Puedo ayudarte a priorizar tareas y resumir avances del sprint.",
      },
      {
        id: "m-2",
        role: "user",
        content: "Cuales son las tareas mas urgentes para hoy?",
      },
      {
        id: "m-3",
        role: "assistant",
        content: "Te recomiendo empezar por SPRINT-42 (bug de login) y luego SPRINT-45 (migracion DB).",
      },
    ],
  },
  {
    id: "thread-2",
    title: "Resumen de PR",
    updatedAt: "Ayer",
    messages: [
      {
        id: "m-4",
        role: "user",
        content: "Resume los cambios del PR-102 en bullets.",
      },
      {
        id: "m-5",
        role: "assistant",
        content: "1) Refactor de auth service. 2) Manejo centralizado de errores HTTP. 3) Mejoras de tipado.",
      },
    ],
  },
  {
    id: "thread-3",
    title: "SQL optimization",
    updatedAt: "Hace 2 dias",
    messages: [
      {
        id: "m-6",
        role: "user",
        content: "Dame ideas para optimizar una consulta con JOINs pesados.",
      },
      {
        id: "m-7",
        role: "assistant",
        content: "Primero revisa indices compuestos y luego analiza el plan de ejecucion para detectar full scans.",
      },
    ],
  },
];

export const ChatIAPage = () => {
  const navigate = useNavigate();
  const hook = useCheckpoint();
  const [threads] = useState<ChatThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showRecordatorioOptions, setShowRecordatorioOptions] = useState(false);
  const [showActividadOptions, setShowActividadOptions] = useState(false);
  const [showRecordatoriosPanel, setShowRecordatoriosPanel] = useState(false);
  const [showActividadesPanel, setShowActividadesPanel] = useState(false);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId],
  );

  useEffect(() => {
    hook.cargarActividades();
    hook.cargarRecordatorios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="dark fixed inset-0 z-40 flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <aside
        className={`hidden shrink-0 border-r border-slate-900 bg-slate-900/40 transition-all duration-300 md:flex md:flex-col overflow-hidden ${isHistoryVisible ? "w-72" : "w-14"
          }`}
      >
        {!isHistoryVisible ? (
          <div className="flex h-full items-start justify-center py-4">
            <button
              type="button"
              onClick={() => setIsHistoryVisible(true)}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              title="Mostrar historial"
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="w-72 flex flex-col h-full shrink-0">
            <div className="flex items-center justify-between border-b border-slate-900 px-4 py-4">
              <button
                type="button"
                className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors whitespace-nowrap"
              >
                + Nuevo chat
              </button>
              <button
                type="button"
                onClick={() => setIsHistoryVisible(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                title="Ocultar historial"
              >
                ◀
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Historial
              </p>

              {threads.map((thread) => {
                const isActive = thread.id === activeThread.id;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`mb-1 w-full rounded-full px-4 py-2.5 text-left transition ${isActive
                        ? "bg-slate-900 text-slate-100 border border-slate-800"
                        : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                      }`}
                  >
                    <p className="truncate text-sm font-medium">{thread.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{thread.updatedAt}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-900 px-4 py-3 bg-slate-950">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              title="Ir al inicio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </button>
            <h1 className="truncate text-base font-semibold text-slate-200">{activeThread.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowRecordatorioOptions((v) => !v);
                  setShowActividadOptions(false);
                }}
                className="group relative rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                title="Recordatorios"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] text-slate-300 opacity-0 transition group-hover:opacity-100">
                  Recordatorios
                </span>
              </button>
              {showRecordatorioOptions && (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecordatorioModal(true);
                      setShowRecordatorioOptions(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
                  >
                    Crear recordatorio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecordatoriosPanel(true);
                      setShowActividadesPanel(false);
                      setShowRecordatorioOptions(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
                  >
                    Ver recordatorios
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowActividadOptions((v) => !v);
                  setShowRecordatorioOptions(false);
                }}
                className="group relative rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                title="Actividades"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.481A26.253 26.253 0 0 1 12 15.75c.647-.006 1.295-.014 1.94-.025m-4.399 2.507A26.012 26.012 0 0 1 7.5 18a26.25 26.25 0 0 1 1.94-.025M7.5 18a2.25 2.25 0 0 1-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08" />
                </svg>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] text-slate-300 opacity-0 transition group-hover:opacity-100">
                  Actividades
                </span>
              </button>
              {showActividadOptions && (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setShowActividadModal(true);
                      setShowActividadOptions(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
                  >
                    Crear actividad
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowActividadesPanel(true);
                      setShowRecordatoriosPanel(false);
                      setShowActividadOptions(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
                  >
                    Ver actividades
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
            {activeThread.messages.map((message) => (
              <article
                key={message.id}
                className={`text-sm leading-relaxed ${message.role === "assistant"
                    ? "bg-transparent border-transparent px-0 py-2 text-slate-300 w-full"
                    : "rounded-3xl border border-slate-700/50 bg-slate-800/80 text-slate-200 px-5 py-3 w-fit max-w-[85%] ml-auto"
                  }`}
              >
                <p>{message.content}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className="border-t border-slate-900 px-4 py-4 bg-slate-950">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
            <textarea
              rows={1}
              placeholder="Escribe un mensaje..."
              className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-full border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700"
            />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center shrink-0 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              title="Enviar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </footer>
      </div>

      {showRecordatorioModal && (
        <RecordatorioFormModal
          onAdd={hook.nuevoRecordatorio}
          onClose={() => setShowRecordatorioModal(false)}
        />
      )}

      {showActividadModal && (
        <ActividadFormModal
          onAdd={hook.crearActividadDirecta}
          onClose={() => setShowActividadModal(false)}
        />
      )}

      <RecordatoriosPanel
        isOpen={showRecordatoriosPanel}
        onClose={() => setShowRecordatoriosPanel(false)}
        loading={hook.loadingRecordatorios}
        recordatorios={hook.recordatorios}
        onStateChange={hook.gestionarEstadoRecordatorio}
      />

      <ActividadesPanel
        isOpen={showActividadesPanel}
        onClose={() => setShowActividadesPanel(false)}
        loading={hook.loadingActividades}
        actividades={hook.actividades}
      />
    </section>
  );
};
