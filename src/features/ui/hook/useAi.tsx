import { useQuery } from "@tanstack/react-query";
import { GetMessageBot } from "../services/api";

export const useAi = (
  message?: string,
  history?: Array<{ role: string; content: string }>,
) => {
  return useQuery({
    queryKey: ["GetMessageBot", message, history],
    queryFn: async () => {
      if (!message) throw new Error("Message is required");
      const response = await GetMessageBot(message, history || []);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: false,
  });
};
