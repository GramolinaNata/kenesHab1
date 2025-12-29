import { useQuery } from "@tanstack/react-query";
import { userProfile } from "../services/api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["Profile"],
    queryFn: async () => {
      const response = await userProfile();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};
