import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Applications,
  Application,
  CreateApplication,
  UpdateApplication,
  PathcApplication,
  DeleteApplication,
  GenerateDocument,
  Message,
  Otp,
  SendEmail,
  SetStatus,
  VerifyOtp,
} from "../services/api";
import type { QueryParams } from "../types/payload";

// --- QUERIES (ПОЛУЧЕНИЕ ДАННЫХ) ---

export const useApplications = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["Applications", params],
    queryFn: async () => {
      const response = await Applications(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useApplicationId = (id: number) => {
  return useQuery({
    queryKey: ["Application", id],
    queryFn: async () => {
      const res = await Application(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!id, // Запрос не выполнится, если id не передан
  });
};

// --- MUTATIONS (ИЗМЕНЕНИЕ ДАННЫХ) ---

export const useApplicationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await CreateApplication(payload);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
    },
  });
};

export const useApplicationUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await UpdateApplication(id, payload); // В API обычно (payload, id), проверьте порядок
      if (!response.success) throw new Error(response.error);
      return { id, data: response.data };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
      queryClient.invalidateQueries({ queryKey: ["Application", result.id] });
    },
  });
};

export const useApplicationPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await PathcApplication(id, payload);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
      queryClient.invalidateQueries({ queryKey: ["Application", result.id] });
    },
  });
};

export const useApplicationDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await DeleteApplication(id);
      if (!response.success) throw new Error(response.error);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
      queryClient.removeQueries({ queryKey: ["Application", id] });
    },
  });
};

// --- SPECIAL ACTIONS (ДОПОЛНИТЕЛЬНЫЕ ДЕЙСТВИЯ) ---

export const useApplicationSetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await SetStatus(id, payload);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["Application", result.id] });
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
    },
  });
};

export const useApplicationSendOtp = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await Otp(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useApplicationVerifyOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await VerifyOtp(id, payload);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["Application", result.id] });
    },
  });
};

export const useApplicationGenerateDocument = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await GenerateDocument(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

// --- MESSAGING & NOTIFICATIONS ---

export const useApplicationSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await Message(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Инвалидируем данные приложения, если сообщение должно там отобразиться
      queryClient.invalidateQueries({ queryKey: ["Application", id] });
    },
    onError: (error) => {
      console.error("Ошибка при отправке сообщения:", error);
    },
  });
};

export const useApplicationSendEmail = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await SendEmail(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // Обычно после отправки письма просто показываем уведомление (Toast)
      console.log("Email успешно отправлен");
    },
    onError: (error) => {
      console.error("Ошибка при отправке Email:", error);
    },
  });
};
