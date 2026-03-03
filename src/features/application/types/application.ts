import * as z from "zod";

// Схемы валидации
export const applicationFormSchema = z.object({
  creditor: z.number({ message: "Выберите кредитора" }),
  amount: z.number().positive("Сумма должна быть положительной"),
  comment: z.string().optional(),
  template: z.number({ message: "Выберите шаблон" }),
  bank_email: z.string().email("Некорректный email"),
  contract_number: z.string().optional(),
  contract_date: z.date().optional().nullable(),
  contract_file: z.any().optional(),
});

export const otpFormSchema = z.object({
  code: z.string().min(1, "Введите код подтверждения"),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type OtpFormValues = z.infer<typeof otpFormSchema>;

export type ApplicationStatus = "NEW" | "IN_PROGRESS" | "COMPLETED";

export interface Application {
  id: string;
  creditor: number;
  amount: string;
  status: ApplicationStatus;
  created_at: string;
  bank_email?: string;
}

export interface Creditor {
  id: number;
  name: string;
  type: "bank" | "mfo";
  email: string;
}

export interface Template {
  id: number;
  name: string;
  type: string;
}

export interface StatusChangeData {
  id: number;
  currentStatus: string;
  newStatus: string;
}

export type EmailProcessStep = 
  | "generating_document"
  | "sending_otp"
  | "verifying_otp"
  | "sending_email"
  | "completed";