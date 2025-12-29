import { clientApi } from "@/shared/services/client";


export const userProfile = (): Promise<any> => {
  return clientApi.get("/api/me/");
};