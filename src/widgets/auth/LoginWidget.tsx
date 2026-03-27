import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema } from "@/features/authentication/lib/zod";
import { useLoginMutation } from "@/features/authentication";
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n';

export function LoginWidget() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const router = useNavigate();
  
  const schema = createLoginSchema();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  
  const { mutate, isPending, error: apiError } = useLoginMutation();
  
  const onSubmit = async (loginData: any) => {
    try {
      await mutate(
        {
          login: loginData.login,
          password: loginData.password,
        },
        {
          onSuccess: () => {
            router("/");
          },
        }
      );
    } catch (err) {
      console.error("Ошибка логина", err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px]"
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
            {t('С возвращением')}
          </h1>
          <p className="text-[14px] text-zinc-400 font-medium mt-2">
            {t('Введите свои данные для доступа к платформе')}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Login/Email */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
              {t('Электронная почта или телефон')}
            </label>
            <div className="keneshub-input-pill p-[14px]">
              <input
                type="text"
                placeholder="your@email.com или +7777777777"
                {...register("login")}
                className="w-full bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
            </div>
            {errors.login && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.login.message as string}
              </p>
            )}
          </div>
          
          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">
                {t('Пароль')}
              </label>
              <Link to="#" className="text-[11px] font-bold text-[#397EEF] hover:text-[#254C92] transition-colors uppercase tracking-widest">
                {t('Забыли?')}
              </Link>
            </div>
            <div className="keneshub-input-pill p-[14px] flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register("password")}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-black placeholder:text-zinc-300 px-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-300 hover:text-[#397EEF] transition-colors px-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                {errors.password.message as string}
              </p>
            )}
          </div>
          
          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm font-medium text-center">
                Код ошибки: {apiError.message}
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isPending}
            className="btn-keneshub w-full py-4 rounded-xl text-[14px] uppercase tracking-[0.2em] font-bold justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#397EEF', color: 'white' }}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                {t('Вход...')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t('Войти')} <ArrowUp className="rotate-90" size={16} />
              </span>
            )}
          </button>
        </form>
        
        <p className="text-center text-[13px] mt-10 text-zinc-400 font-medium">
          {t('Нет аккаунта?')} {' '}
          <a href="/auth/select" className="text-[#397EEF] font-bold border-b border-[#397EEF] pb-0.5 hover:text-[#254C92] hover:border-[#254C92] transition-colors">
            {t('Создать')}
          </a>
        </p>
        
        <div className="mt-20 pt-10 border-t border-zinc-100 text-center">
          <a href="/dashboard" className="text-[11px] font-bold text-zinc-300 hover:text-[#397EEF] uppercase tracking-[0.2em] transition-colors">
            {t('← Вернуться на главную')}
          </a>
        </div>
      </motion.div>
    </div>
  );
}