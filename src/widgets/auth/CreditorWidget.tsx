import { LabeledInput } from "@/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/features/authentication";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

// Схема валидации с использованием Zod
const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "ФИО должно содержать минимум 2 символа")
      .max(100, "ФИО слишком длинное"),

    phone: z
      .string()
      .min(11, "Номер телефона должен содержать минимум 11 цифр")
      .max(15, "Номер телефона слишком длинный")
      .regex(/^[0-9]+$/, "Номер телефона должен содержать только цифры"),

    email: z.string().email("Введите корректный email"),

    password: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),

    confirm_password: z.string(),

    preferred_lang: z.enum(["ru", "kz", "en"]),
    role: z.enum(["creditor"]),
    sub_role: z.enum(["mfo", "bank", "private_investor"]).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function CreaditorWidget() {
  const { mutate: register, isPending } = useRegisterMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Получаем sub_role из URL параметра (ключ параметра и есть значение)
  // Например: /auth/register/creditor?mfo -> sub_role = "mfo"
  //          /auth/register/creditor?bank -> sub_role = "bank"
  const getSubRoleFromUrl = (): "mfo" | "bank" | "private_investor" | null => {
    const params = Object.fromEntries(searchParams.entries());
    const firstParam = Object.keys(params)[0]; // Получаем первый ключ параметра

    if (firstParam === "mfo") return "mfo";
    if (firstParam === "bank") return "bank";
    if (firstParam === "private_investor") return "private_investor";
    return null;
  };

  const subRoleFromUrl = getSubRoleFromUrl();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      preferred_lang: "ru",
      full_name: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "creditor",
      sub_role: subRoleFromUrl || "mfo", // Подставляем значение из URL, если нет - по умолчанию "mfo"
    },
  });

  // Устанавливаем sub_role из URL при загрузке компонента
  useEffect(() => {
    if (subRoleFromUrl) {
      setValue("sub_role", subRoleFromUrl);
      console.log("Установлен sub_role:", subRoleFromUrl); // Для отладки
    }
  }, [subRoleFromUrl, setValue]);

  // Функция для отображения выбранной роли
  const getRoleDisplay = () => {
    if (subRoleFromUrl === "bank") return "Банк";
    if (subRoleFromUrl === "private_investor") return "Частный инвестор";
    return "МФО";
  };

  // Функция для отображения иконки роли
  const getRoleIcon = () => {
    if (subRoleFromUrl === "bank") return "🏦";
    if (subRoleFromUrl === "private_investor") return "💼";
    return "💰";
  };

  const onSubmit = (data: RegisterFormData) => {
    // убираем confirm_password
    const { confirm_password, ...payload } = data;

    console.log("Отправляемые данные:", payload); // Для отладки

    register(payload, {
      onSuccess: () => {
        navigate("/auth/login");
      },
    });
  };

  return (
    <div className="bg-[#1F74EC] w-full min-h-screen flex flex-col items-center pt-6">
      <div className="bg-white w-full max-w-md flex-1 rounded-t-2xl p-5 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="grid">
              <span className="font-semibold text-[22px]">Регистрация</span>

              {/* Блок с выбранной ролью */}
              <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1F74EC] bg-opacity-10 flex items-center justify-center text-2xl">
                    {getRoleIcon()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#1F74EC] font-medium uppercase tracking-wider">
                      Выбранный статус
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {getRoleDisplay()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Тип кредитора</p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit((data) => onSubmit(data))}
              className="grid gap-[18px] pb-4 max-w-[331px] px-2"
            >
              <div className="w-full">
                <span className="pt-[20px] font-medium text-[22px] font-semibold">
                  Данные
                </span>

                <div className="space-y-4">
                  <div>
                    <LabeledInput
                      label="НОМЕР"
                      type="number"
                      placeholder="8 (747) 875 39 18"
                      error={errors.phone?.message}
                      {...registerField("phone")}
                    />
                  </div>

                  <div>
                    <LabeledInput
                      label="Название организации"
                      placeholder={
                        subRoleFromUrl === "bank"
                          ? "Название банка"
                          : "TOO MFO667"
                      }
                      error={errors.full_name?.message}
                      {...registerField("full_name")}
                    />
                  </div>

                  <div>
                    <LabeledInput
                      label="EMAIL"
                      type="email"
                      placeholder="user@example.com"
                      error={errors.email?.message}
                      {...registerField("email")}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <span className="pt-[20px] font-medium text-[22px] font-semibold">
                  Безопасность
                </span>

                <div className="space-y-4">
                  <div>
                    <LabeledInput
                      label="Пароль"
                      type="password"
                      placeholder="Введите свой пароль"
                      error={errors.password?.message}
                      {...registerField("password")}
                    />
                  </div>

                  <div>
                    <LabeledInput
                      label="Подтвердите пароль"
                      type="password"
                      placeholder="Подтвердите свой пароль"
                      error={errors.confirm_password?.message}
                      {...registerField("confirm_password")}
                    />
                  </div>
                </div>
              </div>

              {/* Скрытые поля для role, sub_role и языка */}
              <input type="hidden" {...registerField("role")} />
              <input type="hidden" {...registerField("sub_role")} />
              <input type="hidden" {...registerField("preferred_lang")} />

              <div className="flex-shrink-0 pt-4">
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Регистрация..." : "Зарегистрироваться"}
                  </button>

                  <a href="/auth/login">
                    <span className="text-sm text-[#1F74EC] hover:text-blue-600 transition-colors cursor-pointer">
                      У вас есть аккаунт?
                    </span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
