export function FileBlock() {
  return (
    <div className="rounded-[16px] bg-[#FFFFFF] p-4 transition-all duration-300 shadow-md">
      <div className="flex items-center">
        <img src="/blue-man.svg" />
        <div className="grid pl-2.5">
          <span className="font-semibold text-[14px]">Паспорт</span>
          <span className="font-medium text-[12px]">Загрузите файл</span>
        </div>
      </div>
      <div>
        <a href="/auth/login" className="w-full flex justify-center pt-3">
          <button className="bg-[#f4f5f7] text-black font-medium rounded-[21px] w-full max-w-[313px] h-[32px] transition-colors">
            Загрузить
          </button>
        </a>
      </div>
    </div>
  );
}
