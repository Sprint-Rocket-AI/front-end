import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatResponse, ChatMessage } from "../../services/ChatService";

interface ChatState {
  threads: ChatResponse[];
}

const initialState: ChatState = {
  threads: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setChats(state, action: PayloadAction<ChatResponse[]>) {
      state.threads = action.payload.map(newThread => {
        const existingThread = state.threads.find(t => t.sessionId === newThread.sessionId);
        return {
          ...newThread,
          messages: existingThread?.messages || newThread.messages
        };
      });
    },
    setMessages(state, action: PayloadAction<{ sessionId: string; messages: ChatMessage[] }>) {
      const thread = state.threads.find((t) => t.sessionId === action.payload.sessionId);
      if (thread) {
        thread.messages = action.payload.messages;
      }
    },
    addMessage(state, action: PayloadAction<{ sessionId: string; message: ChatMessage; title?: string }>) {
      let thread = state.threads.find((t) => t.sessionId === action.payload.sessionId);
      if (!thread) {
        thread = {
          sessionId: action.payload.sessionId,
          title: action.payload.title || "Nuevo Chat",
          messages: [],
        };
        state.threads.unshift(thread);
      }
      if (!thread.messages) {
        thread.messages = [];
      }
      thread.messages.push(action.payload.message);
    },
    deleteChat(state, action: PayloadAction<string>) {
      state.threads = state.threads.filter((t) => t.sessionId !== action.payload);
    },
  },
});

export const { 
  setChats, 
  setMessages, 
  addMessage,
  deleteChat
} = chatSlice.actions;

export default chatSlice.reducer;
