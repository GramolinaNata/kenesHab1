import { Controller, useForm } from "react-hook-form";
import { LabeledInput } from "@/shared";
import { useLoginMutation } from "@/features/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema } from "@/features/authentication/lib/zod";
import { useNavigate } from "react-router-dom";

export function LoginWidget() {
  const router = useNavigate();
  const schema = createLoginSchema();

  const {
    control,
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

  async function onSubmit(loginData: any) {
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
  }

  return (
    <div className="bg-[#1F74EC] w-full min-h-screen flex flex-col items-center pt-48">
      <div className="bg-white w-full max-w-md flex-1 rounded-t-2xl p-5 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid">
              <span className="font-semibold text-[22px]">ВОЙТИ</span>
            </div>

            <div className="grid gap-[33px] pb-4 max-w-[331px] px-2">
              <div className="w-full flex flex-col gap-2">
                <span className="pt-[20px] font-medium text-[22px]">
                  Данные
                </span>

                {/* login */}
                <Controller
                  name="login"
                  control={control}
                  render={({ field }) => (
                    <LabeledInput
                      label="login"
                      type="login"
                      placeholder="+7777777777"
                      {...field}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   if (!value.startsWith("+")) {
                      //     field.onChange("+" + value.replace(/\D+/g, ""));
                      //   } else {
                      //     field.onChange(
                      //       "+" + value.slice(1).replace(/\D+/g, "")
                      //     );
                      //   }
                      // }}
                      value={field.value}
                    />
                  )}
                />

                {errors.login && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.login.message as string}
                  </p>
                )}

                {/* PASSWORD */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <LabeledInput
                      label="ПАРОЛЬ"
                      type="password"
                      placeholder="Введите свой пароль"
                      {...field}
                    />
                  )}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.password.message as string}
                  </p>
                )}

                {/* API error */}
                {apiError && (
                  <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded">
                    Код ошибки: {apiError.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isPending ? "Загрузка..." : "Войти"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 pt-4">
          <div className="flex flex-col items-center gap-3">
            <a href="/auth/select">
              <span className="text-sm text-[#1F74EC] hover:text-blue-600 transition-colors cursor-pointer">
                У вас нет аккаунта?
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
