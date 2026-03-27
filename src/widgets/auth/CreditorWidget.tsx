import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/features/authentication";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

// Zod schema
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending, error: apiError } = useRegisterMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getSubRoleFromUrl = (): "mfo" | "bank" | "private_investor" | null => {
    const params = Object.fromEntries(searchParams.entries());
    const firstParam = Object.keys(params)[0];
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
      sub_role: subRoleFromUrl || "mfo",
    },
  });

  useEffect(() => {
    if (subRoleFromUrl) {
      setValue("sub_role", subRoleFromUrl);
    }
  }, [subRoleFromUrl, setValue]);

  const getRoleDisplay = () => {
    if (subRoleFromUrl === "bank") return "Банк";
    if (subRoleFromUrl === "private_investor") return "Частный инвестор";
    return "МФО";
  };



  const onSubmit = (data: RegisterFormData) => {
    const { confirm_password, ...payload } = data;
    register(payload, {
      onSuccess: () => {
        navigate("/auth/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[500px]"
      >
        {/* Logo */}
<div className="relative flex justify-center mb-12">
  <a href="/dashboard" className="relative w-full h-16">
    <img
      src="/logo1.png"
      alt="logo"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-auto object-contain"
    />
  </a>
</div>

        <div className="text-center mb-10">
          <h1 className="font-serif text-[32px] md:text-[40px] text-black leading-tight tracking-tight">
            Регистрация {getRoleDisplay()}
          </h1>
          <p className="text-[14px] text-zinc-400 font-medium mt-2">
            Заполните данные для создания аккаунта
          </p>
        </div>



        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              Номер телефона
            </label>
            <div className="keneshub-input-pill p-[14px]">
              <input
                type="tel"
                placeholder="7777777777"
                {...registerField("phone")}
                className="w-full bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              Название организации
            </label>
            <div className="keneshub-input-pill p-[14px]">
              <input
                type="text"
                placeholder={subRoleFromUrl === "bank" ? "Название банка" : "TOO MFO667"}
                {...registerField("full_name")}
                className="w-full bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              Email
            </label>
            <div className="keneshub-input-pill p-[14px]">
              <input
                type="email"
                placeholder="your@email.com"
                {...registerField("email")}
                className="w-full bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              Пароль
            </label>
            <div className="keneshub-input-pill p-[14px] flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerField("password")}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-300 hover:text-black transition-colors px-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              Подтвердите пароль
            </label>
            <div className="keneshub-input-pill p-[14px] flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerField("confirm_password")}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-zinc-300 hover:text-black transition-colors px-2"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Hidden fields */}
          <input type="hidden" {...registerField("role")} />
          <input type="hidden" {...registerField("sub_role")} />
          <input type="hidden" {...registerField("preferred_lang")} />

          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm font-medium text-center">
                Ошибка: {apiError.message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-keneshub btn-black w-full py-4 rounded-xl text-[14px] uppercase tracking-[0.2em] font-bold justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Регистрация...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Зарегистрироваться <ArrowUp className="rotate-90" size={16} />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-[13px] mt-10 text-zinc-400 font-medium">
          Уже есть аккаунт?{' '}
          <a href="/auth/login" className="text-black font-bold border-b border-black pb-0.5">
            Войти
          </a>
        </p>

        <div className="mt-20 pt-10 border-t border-zinc-100 text-center">
          <a href="/auth/select" className="text-[11px] font-bold text-zinc-300 hover:text-black uppercase tracking-[0.2em] transition-colors">
            ← Выбрать другой статус
          </a>
        </div>
      </motion.div>
    </div>
  );
}