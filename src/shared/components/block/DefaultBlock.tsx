export function DefaultBlock() {
  return (
    <div className="rounded-[16px] bg-[#FFFFFF] p-3 transition-all duration-300 shadow-md">
      <div className="flex items-center w-full">
        <div className="grid pl-2.5 w-full">
          <span className="font-semibold text-[16px] text-black">
            Жалоба на МФО «CrediFast»
          </span>

          <div className="flex items-center justify-between w-full text-[#68707e]">
            <span className="font-normal text-[14px]">
              Статус: 🟢 Новое обращение
            </span>

            <span className="font-medium text-[12px]">14.10.2025, 12:42</span>
          </div>
        </div>
      </div>
    </div>
  );
}
