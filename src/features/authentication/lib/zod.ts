import z from "zod";

export const createLoginSchema = () => {
  return z.object({
    login: z.string()
      .trim()
      .min(1, "Номер обязательн"),
password: z.any()
  .refine(val => !!val, "Пароль обязателен"),
  });
};