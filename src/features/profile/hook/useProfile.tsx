import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { userProfile, updateUserProfile } from "../services/api";

// Ваш существующий хук получения профиля
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

// НОВЫЙ ХУК: Редактирование профиля
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await updateUserProfile(payload);

      if (!response.success) {
        // Извлекаем ошибку (например, "detail" от бэкенда)
        throw new Error(
          response.error?.detail ||
            response.error ||
            "Ошибка при обновлении профиля",
        );
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Вариант 1: Сразу обновляем данные в кеше (оптимистично)
      queryClient.setQueryData(["Profile"], data);

      // Вариант 2: Либо просто инвалидируем запрос, чтобы он скачался заново
      // queryClient.invalidateQueries({ queryKey: ["Profile"] });
    },
  });
};
