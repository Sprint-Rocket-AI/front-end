import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatService, type ChatMessage } from "../../../services/ChatService";

import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  setChats,
  setMessages,
  addMessage,
  deleteChat
} from "../../../store/slices/chatSlice";
import { getUserId } from "../../auth/utils/authHelper";

export const useChat = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const dispatch = useAppDispatch();
  const threads = useAppSelector((state) => state.chat.threads);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const activeThread = useMemo(
    () => threads.find((thread) => thread.sessionId === sessionId) ?? null,
    [threads, sessionId],
  );

  const cargarChats = useCallback(async () => {
    setLoadingThreads(true);
    try {
      const userId = getUserId();
      const chats = await chatService.getChatsByUserId(userId);
      dispatch(setChats(chats));
    } catch (error) {
      console.error("Error cargando chats", error);
    } finally {
      setLoadingThreads(false);
    }
  }, [dispatch]);

  const isSendingMessage = useRef(false);

  const cargarMensajes = useCallback(async (sid: string, force = false) => {
    if (isSendingMessage.current && !force) return;
    setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessagesBySessionId(sid);
      dispatch(setMessages({ sessionId: sid, messages: msgs }));
    } catch (error) {
      console.error("Error cargando mensajes", error);
    } finally {
      if (!isSendingMessage.current) {
        setLoadingMessages(false);
      }
    }
  }, [dispatch]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const messageContent = inputValue;
    setInputValue("");

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      isSendingMessage.current = true;
      setIsSending(true);

      try {
        const userId = getUserId();
        const chatTitle = messageContent.substring(0, 15);
        const newSessionId = await chatService.createChat(userId, messageContent, chatTitle);
        currentSessionId = newSessionId;

        // 1. Add user's message locally first
        const tempUserMsg: ChatMessage = {
          role: "USER",
          content: messageContent,
          timestamp: new Date().toISOString()
        };
        dispatch(addMessage({ sessionId: currentSessionId, message: tempUserMsg, title: chatTitle }));

        // 2. Reload the sidebar chats list so that the new chat thread appears
        await cargarChats();

        // 3. Navigate to the new chat page
        navigate(`/chat/${currentSessionId}`);

        // 4. Send RAG query to get assistant response
        try {
          const aiResponse = await chatService.sendRAGQuery(currentSessionId, messageContent);

          // 5. Add assistant response locally
          const tempAssistantMsg: ChatMessage = {
            role: "ASSISTANT",
            content: aiResponse.answer,
            timestamp: new Date().toISOString()
          };
          dispatch(addMessage({ sessionId: currentSessionId, message: tempAssistantMsg }));
        } catch (ragError) {
          console.error("Error enviando consulta RAG", ragError);
          const tempAssistantMsg: ChatMessage = {
            role: "ASSISTANT",
            content: "Hubo un error, intente nuevamente.",
            timestamp: new Date().toISOString()
          };
          dispatch(addMessage({ sessionId: currentSessionId, message: tempAssistantMsg }));
        }
      } catch (error) {
        console.error("Error creando chat o enviando consulta RAG", error);
      } finally {
        isSendingMessage.current = false;
        setIsSending(false);
      }
      return;
    }

    if (currentSessionId) {
      const tempUserMsg: ChatMessage = {
        role: "USER",
        content: messageContent,
        timestamp: new Date().toISOString()
      };

      const title = messageContent.split(" ").slice(0, 10).join(" ");
      dispatch(addMessage({ sessionId: currentSessionId, message: tempUserMsg, title }));

      isSendingMessage.current = true;
      setIsSending(true);
      try {
        const aiResponse = await chatService.sendRAGQuery(currentSessionId, messageContent);

        const tempAssistantMsg: ChatMessage = {
          role: "ASSISTANT",
          content: aiResponse.answer,
          timestamp: new Date().toISOString()
        };
        dispatch(addMessage({ sessionId: currentSessionId, message: tempAssistantMsg }));
      } catch (error) {
        console.error("Error enviando consulta RAG", error);
        const tempAssistantMsg: ChatMessage = {
          role: "ASSISTANT",
          content: "Hubo un error, intente nuevamente.",
          timestamp: new Date().toISOString()
        };
        dispatch(addMessage({ sessionId: currentSessionId, message: tempAssistantMsg }));
      } finally {
        isSendingMessage.current = false;
        setIsSending(false);
      }
    }
  }, [inputValue, sessionId, navigate, cargarChats, cargarMensajes, dispatch]);

  const handleDeleteChat = useCallback(async (sid: string) => {
    try {
      await chatService.deleteChatBySessionId(sid);
      dispatch(deleteChat(sid));
      if (sid === sessionId) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error eliminando chat", error);
    }
  }, [dispatch, sessionId, navigate]);

  return {
    threads,
    loadingThreads,
    loadingMessages,
    isSending,
    inputValue,
    setInputValue,
    activeThread,
    sessionId,
    handleSendMessage,
    navigate,
    cargarChats,
    cargarMensajes,
    handleDeleteChat,
  };
};
