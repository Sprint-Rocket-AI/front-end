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

export interface AIResponse {
  answer: string;
}
export interface CreateChatResponse {
  sessionId: string;
  title: string;
  query: string;
  answer: string;
  createdAt: string;
}

class ChatService {
  async getChatsByUserId(userId: string): Promise<ChatResponse[]> {
    const response = await apiClient.get<ChatResponse[]>(`/ai-engine/api/chat/user/${userId}`, {
      data: { userId }
    });
    return response.data;
  }

  async createChat(userId: string, content: string, title: string): Promise<CreateChatResponse> {
    const response = await apiClient.post<CreateChatResponse>("/ai-engine/api/chat", { userId, content, title });
    return response.data;
  }

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`/ai-engine/api/chat/${sessionId}`);
    return response.data;
  }

  async sendRAGQuery(sessionId: string, userPrompt: string): Promise<AIResponse> {
    const response = await apiClient.post<AIResponse>("/ai-engine/api/rag/query", {
      sessionId,
      userPrompt,
    });
    return response.data;
  }

  async deleteChatBySessionId(sessionId: string): Promise<void> {
    await apiClient.delete(`/ai-engine/api/chat/${sessionId}`);
  }
}

export const chatService = new ChatService();
