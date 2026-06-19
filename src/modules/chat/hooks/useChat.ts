import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatService, type ChatMessage } from "../../../services/ChatService";
import { useCheckpoint } from "../../checkpoint/hooks/useCheckpoint";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  setChats,
  setMessages,
  addMessage,
  deleteChat
} from "../../../store/slices/chatSlice";

export const useChat = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const checkpoint = useCheckpoint();
  const dispatch = useAppDispatch();
  const threads = useAppSelector((state) => state.chat.threads);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showRecordatorioOptions, setShowRecordatorioOptions] = useState(false);
  const [showActividadOptions, setShowActividadOptions] = useState(false);
  const [showRecordatoriosPanel, setShowRecordatoriosPanel] = useState(false);
  const [showActividadesPanel, setShowActividadesPanel] = useState(false);

  const defaultUserId = "1";

  const activeThread = useMemo(
    () => threads.find((thread) => thread.sessionId === sessionId) ?? null,
    [threads, sessionId],
  );



  const cargarChats = useCallback(async () => {
    setLoadingThreads(true);
    try {
      const chats = await chatService.getChatsByUserId(defaultUserId);
      dispatch(setChats(chats));
    } catch (error) {
      console.error("Error cargando chats", error);
    } finally {
      setLoadingThreads(false);
    }
  }, [dispatch]);

  const cargarMensajes = useCallback(async (sid: string) => {
    setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessagesBySessionId(sid);
      dispatch(setMessages({ sessionId: sid, messages: msgs }));
    } catch (error) {
      console.error("Error cargando mensajes", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [dispatch]);



  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const messageContent = inputValue;
    setInputValue("");

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const title = messageContent.split(" ").slice(0, 10).join(" ");
      try {
        currentSessionId = await chatService.createChat(defaultUserId, title);
        navigate(`/chat/${currentSessionId}`);
        await cargarChats();
      } catch (error) {
        console.error("Error creando chat", error);
        return;
      }
    }

    if (currentSessionId) {
      // Add local message immediately
      const tempUserMsg: ChatMessage = {
        role: "USER",
        content: messageContent,
        timestamp: new Date().toISOString()
      };

      dispatch(addMessage({ sessionId: currentSessionId, message: tempUserMsg }));

      setLoadingMessages(true);
      try {
        await chatService.sendRAGQuery(currentSessionId, messageContent);
        await cargarMensajes(currentSessionId);
      } catch (error) {
        console.error("Error enviando consulta RAG", error);
      } finally {
        setLoadingMessages(false);
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
    inputValue,
    setInputValue,
    activeThread,
    sessionId,
    isHistoryVisible,
    setIsHistoryVisible,
    showRecordatorioModal,
    setShowRecordatorioModal,
    showActividadModal,
    setShowActividadModal,
    showRecordatorioOptions,
    setShowRecordatorioOptions,
    showActividadOptions,
    setShowActividadOptions,
    showRecordatoriosPanel,
    setShowRecordatoriosPanel,
    showActividadesPanel,
    setShowActividadesPanel,
    handleSendMessage,
    checkpoint,
    navigate,
    cargarChats,
    cargarMensajes,
    handleDeleteChat,
  };
};
