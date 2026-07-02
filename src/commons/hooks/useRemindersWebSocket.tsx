import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useRemindersWebSocket = () => {
  const userId = "dev-001";
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const connectWebSocket = () => {
      const baseUrl = import.meta.env.VITE_CHECKPOINT_WS_URL;
      const wsUrl = `${baseUrl}userId=${userId}`;

      console.log(`[WS] Conectando a recordatorios para el usuario: ${userId}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Conexión establecida exitosamente.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'reminder.triggered') {
            const tituloRecordatorio = data.payload?.titulo ?? 'Tienes una actividad pendiente';
            const recordatorioId = data.payload?.id;

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              const notification = new Notification('⏰ SpringRocket', {
                body: `${tituloRecordatorio}\n\nRevisa tus pendientes de hoy en la plataforma.`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: recordatorioId ?? 'sprint-rocket-alert',
                requireInteraction: true,
                silent: false
              });

              notification.onclick = (e) => {
                e.preventDefault();
                window.focus();
                notification.close();
              };
            }

            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white dark:bg-slate-950 shadow-xl rounded-2xl pointer-events-auto flex border border-slate-200 dark:border-slate-800 p-4 transition-all duration-300`}
              >
                <div className="flex-1 w-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5 text-2xl">
                      ⏰
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        SpringRocket
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {tituloRecordatorio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-shrink-0 items-center justify-center gap-1 border-l border-slate-100 dark:border-slate-800 pl-3">
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    OK
                  </button>
                </div>
              </div>
            ), { duration: 15000 });
          }
        } catch (e) {
          console.error('[WS] Error procesando mensaje recibido', e);
        }
      };

      ws.onclose = (event) => {
        if (!event.wasClean) {
          console.warn('[WS] Conexión cerrada inesperadamente. Reintentando en 5 segundos...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error en la conexión:', error);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userId]);
};