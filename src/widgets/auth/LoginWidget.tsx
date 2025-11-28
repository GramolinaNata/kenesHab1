import { LabeledInput } from "@/shared";

export function LoginWidget() {
  return (
    <div className="bg-[#1F74EC] w-full min-h-screen flex flex-col items-center pt-48">
      <div className="bg-white w-full max-w-md flex-1 rounded-t-2xl p-5 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="grid">
              <span className="font-semibold text-[22px]">ВОЙТИ</span>
            </div>

            <div className="grid gap-[33px] pb-4 max-w-[331px] px-2">
              <div className="w-full">
                <span className="pt-[20px] font-medium text-[22px] font-semibold">
                  Данные
                </span>
                <LabeledInput
                  label="НОМЕР"
                  type="number"
                  placeholder="8 (747) 875 39 18"
                />
                <LabeledInput
                  label="Пароль"
                  type="password"
                  placeholder="Введите свой пароль"
                />
              </div>
              <div>
                <a href="/" className="w-full flex justify-center">
                  <button className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors">
                    Войти
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-4">
          <div className="flex flex-col items-center gap-3">
            <a href="/auth/select">
              <span className="text-sm text-[#1F74EC] hover:text-blue-600 transition-colors cursor-pointer">
                У вас нету аккаунта?
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
