import { LabeledInput } from "@/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/features/authentication";
import { useNavigate } from "react-router-dom";

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

    // iin: z.string()
    //   .length(12, "ИИН должен содержать 12 цифр")
    //   .regex(/^[0-9]+$/, "ИИН должен содержать только цифры"),

    preferred_lang: z.enum(["ru", "kz", "en"]),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function ClientWidget() {
  const { mutate: register, isPending } = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
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
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // убираем confirm_password
    const { confirm_password, ...payload } = data;

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
                      label="ФИО"
                      placeholder="Белескызы Инжу"
                      error={errors.full_name?.message}
                      {...registerField("full_name")}
                    />
                  </div>

                  {/* <div>
                    <LabeledInput
                      label="ИИН"
                      type="text"
                      placeholder="97 11 21 45 03 61"
                      maxLength={12}
                      error={errors.iin?.message}
                      {...registerField("iin")}
                    />
                  </div> */}

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

              {/* Скрытое поле для языка */}
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
