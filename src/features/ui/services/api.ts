import { clientApi } from "@/shared/services/client";

export const GetMessageBot = (message: string, history: Array<{role: string, content: string}>): Promise<any> => {
  return clientApi.post("/api/ai/chat/", {
    message,
    lang: "ru",
    history
  });
};