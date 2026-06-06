import apiClient from "../api/interceptor";

export interface AIServiceMapperRequest {
  content: string;
  template: Record<string, any>;
}

export interface AIServiceMapperResponse {
  [key: string]: any;
}

export const mapWithAI = (content: string, template: Record<string, any>) =>
  apiClient.post<AIServiceMapperResponse>("/ai-engine/prompt/mapper", {
    content,
    template,
  });
