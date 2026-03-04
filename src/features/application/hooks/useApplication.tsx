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
  GetCreditor,
  PreviewDocument,
  CreateFileApplication,
  CreateVacancy,
  GetVacancies,
  AcceptProposal,
  RejectProposal,
  RespondToVacancy,
  GetApplicationDetail,
  UploadApplicationResponse,
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

      // Проверяем структуру ответа от axios
      // axios оборачивает ответ в response.data
      if (response.data) {
        // Если API возвращает { success: true, data: { id: ... } }
        if (response.data.success === false) {
          throw new Error(response.data.error || "Ошибка при создании заявки");
        }

        // Возвращаем данные в зависимости от структуры
        // Вариант 1: API возвращает { id: "...", ... }
        if (response.data.id) {
          return response.data;
        }

        // Вариант 2: API возвращает { data: { id: "..." } }
        if (response.data.data?.id) {
          return response.data.data;
        }

        // Вариант 3: Просто возвращаем response.data
        return response.data;
      }

      throw new Error("Не удалось создать заявку");
    },
    onSuccess: (data) => {
      console.log("Заявка успешно создана:", data);
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании заявки:", error);
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

export const useCreditors = (type?: string) => {
  return useQuery({
    queryKey: ["Creditors", type],
    queryFn: async () => {
      const response = await GetCreditor(type);

      if (!response.success) {
        throw new Error(
          response.error?.detail ||
            response.error ||
            "Ошибка при получении списка кредиторов",
        );
      }

      return response.data;
    },
    enabled: !!type, // Запрос выполняется только если выбран тип
  });
};

export const useDocumentPreview = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const blob = await PreviewDocument(payload);
      return blob;
    },
  });
};

export const useApplicationUploadContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: FormData }) => {
      const response = await CreateFileApplication(payload, id);

      return response.data;
    },

    onSuccess: (variables) => {
      // Обновляем данные конкретной заявки, чтобы увидеть прикрепленный файл
      queryClient.invalidateQueries({
        queryKey: ["Application", variables.id],
      });

      // Обновляем общий список заявок
      queryClient.invalidateQueries({
        queryKey: ["Applications"],
      });
    },
  });
};

export const useVacancyCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await CreateVacancy(payload);

      // Обработка ответа согласно вашей логике в useApplicationCreate
      if (response.data) {
        if (response.data.success === false) {
          throw new Error(
            response.data.error || "Ошибка при создании вакансии",
          );
        }
        return response.data;
      }

      throw new Error("Не удалось создать вакансию");
    },
    onSuccess: (data) => {
      console.log("Вакансия успешно создана:", data);
      // Обновляем список вакансий, если он существует
      queryClient.invalidateQueries({ queryKey: ["Vacancies"] });
    },
    onError: (error: any) => {
      console.error("Ошибка при создании вакансии:", error);
    },
  });
};

export const useVacancies = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["Vacancies", params],
    queryFn: async () => {
      const response = await GetVacancies();

      // Логика обработки успеха, как в вашем useApplications
      if (!response.success) {
        throw new Error(
          response.error?.detail ||
            response.error ||
            "Ошибка при получении списка вакансий",
        );
      }

      return response.data;
    },
  });
};

export const useProposalAccept = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await AcceptProposal(id);
      if (!response.success) {
        throw new Error(response.error || "Ошибка при принятии предложения");
      }
      return id;
    },
    onSuccess: (id) => {
      // Обновляем списки и детализацию, чтобы UI синхронизировался
      queryClient.invalidateQueries({ queryKey: ["Proposals"] });
      queryClient.invalidateQueries({ queryKey: ["Proposal", id] });
    },
  });
};

export const useProposalReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await RejectProposal(id);
      if (!response.success) {
        throw new Error(response.error || "Ошибка при отклонении предложения");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["Proposals"] });
      queryClient.invalidateQueries({ queryKey: ["Proposal", id] });
    },
  });
};

export const useVacancyResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await RespondToVacancy(id, payload);

      if (!response.success) {
        throw new Error(response.error || "Ошибка при отправке отклика");
      }

      return { id };
    },
    onSuccess: (result) => {
      // Обновляем данные конкретной вакансии и общий список
      queryClient.invalidateQueries({ queryKey: ["Vacancy", result.id] });
      queryClient.invalidateQueries({ queryKey: ["Vacancies"] });
      console.log("Отклик успешно отправлен");
    },
    onError: (error: any) => {
      console.error("Ошибка при отклике:", error.message);
    },
  });
};

export const useApplicationDetail = (id: number | undefined) => {
  return useQuery({
    queryKey: ["Application", id],
    queryFn: async () => {
      // Если id нет, queryFn не должна вызываться благодаря enabled,
      // но добавим проверку для безопасности типов
      if (!id) throw new Error("ID заявки не указан");

      const response = await GetApplicationDetail(id);

      if (!response.success) {
        throw new Error(
          response.error?.detail ||
            response.error ||
            "Ошибка при получении данных заявки",
        );
      }

      return response.data;
    },
    enabled: !!id, // Запрос выполнится только если id существует (не 0, не undefined)
    retry: 1, // Количество попыток при ошибке
  });
};

export const useApplicationUploadResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: FormData }) => {
      const response = await UploadApplicationResponse(id, payload);

      // Проверка успеха согласно вашей архитектуре
      if (response.data && response.data.success === false) {
        throw new Error(response.data.error || "Ошибка при загрузке файла");
      }

      return { id, data: response.data };
    },

    onSuccess: (result) => {
      // Обновляем данные конкретной заявки
      queryClient.invalidateQueries({
        queryKey: ["Application", result.id],
      });

      // Обновляем список всех заявок
      queryClient.invalidateQueries({
        queryKey: ["Applications"],
      });

      console.log("Файл ответа успешно загружен");
    },
    onError: (error: any) => {
      console.error("Ошибка загрузки:", error.message);
    },
  });
};
