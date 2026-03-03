

import { clientApi } from "@/shared/services/client";
import type { AuthResponse } from "../types";
import type { IResponse, RequestsResponse } from "@/shared/types";
import { tokenStore } from "@/shared/lib/tokenStore";


export const login = async (payload: any): Promise<AuthResponse> => {
  const response = await clientApi.post<AuthResponse>("/api/auth/login/", payload);

  if (!response.success) {
    throw new Error(response.error);
  }

  const authData = response.data;


tokenStore.set({
  access: authData.tokens.access,
  refresh: authData.tokens.refresh,
  roles: authData.user.roles
});

  return authData;
};

// Исправленный вариант
export const register = async (payload: any): Promise<IResponse<RequestsResponse>> => {
  // Указываем в generic только тип данных (RequestsResponse), 
  // так как clientApi сам добавит обертку IResponse
  const response = await clientApi.post<RequestsResponse>("/api/auth/register/", payload);
  
  if (!response.success) {
    // В случае ошибки выбрасываем ее (или обрабатываем иначе)
    throw new Error(response.error);
  }

  // Теперь response имеет тип IResponse<RequestsResponse>, что соответствует Promise
  return response;
};