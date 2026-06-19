import apiClient from "../api/interceptor";

export interface ChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  sessionId: string;
  title: string;
  createdAt?: string;
  messages?: ChatMessage[];
}

class ChatService {
  async getChatsByUserId(userId: string): Promise<ChatResponse[]> {
    const response = await apiClient.post<ChatResponse[]>("/ai-engine/chat/list", { userId });
    return response.data;
  }

  async createChat(userId: string, title: string): Promise<string> {
    const response = await apiClient.post<string>("/ai-engine/chat", { userId, title });
    return response.data;
  }

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`/ai-engine/chat/${sessionId}/messages`);
    return response.data;
  }

  async sendRAGQuery(sessionId: string, userPrompt: string): Promise<string> {
    const response = await apiClient.post<{ answer: string }>("/ai-engine/api/rag/query", {
      sessionId,
      userPrompt,
    });
    return response.data.answer;
  }
}

export const chatService = new ChatService();
