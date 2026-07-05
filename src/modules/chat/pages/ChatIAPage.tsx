import { useEffect, useState } from "react";
import { ActividadFormModal } from "../../checkpoint/components/ActividadFormModal";
import { RecordatorioFormModal } from "../../checkpoint/components/RecordatorioFormModal";
import { RecordatoriosPanel } from "../components/RecordatoriosPanel";
import { ActividadesPanel } from "../components/ActividadesPanel";
import { LoadingSpinner } from "../../../commons/components/LoadingSpinner";
import { ConfirmModal } from "../../../commons/components/ConfirmModal";
import { useCheckpoint } from "../../checkpoint/hooks/useCheckpoint";
import { useChat } from "../hooks/useChat";
import { MarkdownRenderer } from "../../../commons/components/MarkdownRenderer";

export const ChatIAPage = () => {
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const checkpoint = useCheckpoint();
  
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showRecordatorioOptions, setShowRecordatorioOptions] = useState(false);
  const [showActividadOptions, setShowActividadOptions] = useState(false);
  const [showRecordatoriosPanel, setShowRecordatoriosPanel] = useState(false);
  const [showActividadesPanel, setShowActividadesPanel] = useState(false);

  const {
    threads,
    loadingThreads,
    loadingMessages,
    inputValue,
    setInputValue,
    activeThread,
    sessionId,
    handleSendMessage,
    navigate,
    cargarChats,
    cargarMensajes,
    handleDeleteChat,
    isSending
  } = useChat();

  useEffect(() => {
    checkpoint.cargarActividades();
    checkpoint.cargarRecordatorios();
    cargarChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargarChats]);

  useEffect(() => {
    if (sessionId && (!activeThread || !activeThread.messages || activeThread.messages.length === 0)) {
      cargarMensajes(sessionId);
    }
  }, [sessionId, cargarMensajes, activeThread?.messages?.length]);

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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                  title="Volver al inicio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </button>
              </div>
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
              <div className="flex items-center justify-between px-2 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Historial de Chats
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                  + Nuevo
                </button>
              </div>

              {loadingThreads ? (
                <div className="py-4"><LoadingSpinner /></div>
              ) : (
                threads.map((thread) => {
                  const isActive = thread.sessionId === sessionId;

                  return (
                    <div
                      key={thread.sessionId}
                      className={`mb-1 flex w-full items-center justify-between rounded-full px-4 py-2.5 transition ${isActive
                        ? "bg-slate-900 text-slate-100 border border-slate-800"
                        : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/chat/${thread.sessionId}`)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="truncate text-sm font-medium">{thread.title || "Nuevo Chat"}</p>
                        {thread.createdAt && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {new Date(thread.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatToDelete(thread.sessionId);
                        }}
                        className="ml-2 flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Eliminar chat"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-900 px-4 py-3 bg-slate-950">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-base font-semibold text-slate-200">{activeThread?.title || "Nuevo Chat"}</h1>
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
            {loadingMessages ? (
              <div className="mt-10"><LoadingSpinner /></div>
            ) : activeThread?.messages && activeThread.messages.length > 0 ? (
              <>
                {activeThread.messages.map((message, index) => (
                  <article
                    key={`${message.timestamp || index}-${index}`}
                    className={`text-sm leading-relaxed ${message.role === "ASSISTANT" || message.role === "SYSTEM"
                      ? "bg-transparent border-transparent px-0 py-2 text-slate-300 w-full"
                      : "rounded-3xl border border-slate-700/50 bg-slate-800/80 text-slate-200 px-5 py-3 w-fit max-w-[85%] ml-auto"
                      }`}
                  >
                    <MarkdownRenderer content={message.content} />
                  </article>
                ))}
                {isSending && (
                  <article className="bg-transparent border-transparent px-0 py-2 text-slate-300 w-full text-sm leading-relaxed">
                    <div className="flex gap-2 items-center h-6">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></span>
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </article>
                )}
              </>
            ) : (
              <div className="text-center text-slate-500 mt-10">
                Aún no hay mensajes. Escribe algo para empezar.
              </div>
            )}
          </div>
        </div>

        <footer className="border-t border-slate-900 px-4 py-4 bg-slate-950">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Escribe un mensaje..."
              className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-full border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700"
            />
            <button
              type="button"
              onClick={handleSendMessage}
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
          onAdd={checkpoint.nuevoRecordatorio}
          onClose={() => setShowRecordatorioModal(false)}
        />
      )}

      {showActividadModal && (
        <ActividadFormModal
          onAdd={checkpoint.crearActividadDirecta}
          onClose={() => setShowActividadModal(false)}
        />
      )}

      <RecordatoriosPanel
        isOpen={showRecordatoriosPanel}
        onClose={() => setShowRecordatoriosPanel(false)}
        loading={checkpoint.loadingRecordatorios}
        recordatorios={checkpoint.recordatorios}
        onStateChange={checkpoint.gestionarEstadoRecordatorio}
      />

      <ActividadesPanel
        isOpen={showActividadesPanel}
        onClose={() => setShowActividadesPanel(false)}
        loading={checkpoint.loadingActividades}
        actividades={checkpoint.actividades}
      />

      <ConfirmModal
        isOpen={chatToDelete !== null}
        title="Eliminar Chat"
        message="¿Estás seguro de que deseas eliminar este chat? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={() => {
          if (chatToDelete) {
            handleDeleteChat(chatToDelete);
            setChatToDelete(null);
          }
        }}
        onCancel={() => setChatToDelete(null)}
      />
    </section>
  );
};
