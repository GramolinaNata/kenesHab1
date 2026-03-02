import { clientApi, formDataApi } from "@/shared/services/client";


export const userProfile = (): Promise<any> => {
  return clientApi.get("/api/me/");
};

export const updateUserProfile = (payload: any): Promise<any> => {
  return formDataApi.patch("/api/me/", payload);
};