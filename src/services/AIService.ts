import apiClient from "../api/interceptor";

export interface AIServiceMapperRequest {
  content: string;
  template: Record<string, any>;
}

export interface AIServiceMapperResponse {
  [key: string]: any;
}

export const mapWithAI = (content: string, template: Record<string, any>) => {
  const path = "/ai-engine/prompt/mapper";
  console.log("Llamando al endpoint ", path);
  return apiClient.post<AIServiceMapperResponse>(path, {
    content,
    template,
  });
};
