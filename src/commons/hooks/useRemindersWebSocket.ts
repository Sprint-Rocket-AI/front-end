import { useEffect } from 'react';
export const useRemindersWebSocket = () => {

     useEffect(() => {
         if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
           Notification.requestPermission();
         }

         const wsUrl = import.meta.env.VITE_CHECKPOINT_WS_URL ?? 'ws://localhost:8082/ws/reminders?userId=dev-001';
         const ws = new WebSocket(wsUrl);

         ws.onmessage = (event) => {
           try {
             const data = JSON.parse(event.data);
             if (data.type === 'reminder.triggered') {
               if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                 new Notification('⏰ ¡RECORDATORIO!', { body: data.payload.titulo });
               } else {
                 alert(`⏰ ¡RECORDATORIO!\n\n${data.payload.titulo}`);
               }
             }
           } catch (e) {
             console.error("Error procesando mensaje WebSocket", e);
           }
         };

         return () => {
           ws.close();
         };
     }, []);
}