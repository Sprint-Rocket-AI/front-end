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
      state.threads = action.payload;
    },
    setMessages(state, action: PayloadAction<{ sessionId: string; messages: ChatMessage[] }>) {
      const thread = state.threads.find((t) => t.sessionId === action.payload.sessionId);
      if (thread) {
        thread.messages = action.payload.messages;
      }
    },
    addMessage(state, action: PayloadAction<{ sessionId: string; message: ChatMessage }>) {
      const thread = state.threads.find((t) => t.sessionId === action.payload.sessionId);
      if (thread) {
        if (!thread.messages) {
          thread.messages = [];
        }
        thread.messages.push(action.payload.message);
      }
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
