import apiClient from "../api/interceptor";

export interface AIServiceMapperRequest {
  content: string;
  template: Record<string, any>;
}

export interface AIServiceMapperResponse {
  [key: string]: any;
}

export const mapWithAI = (content: string, template: Record<string, any>) =>
  apiClient.post<AIServiceMapperResponse>("/ai-engine/api/prompt/mapper", {
    content,
    template,
  });

export const indexPdf = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post("/ai-engine/api/index/pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
