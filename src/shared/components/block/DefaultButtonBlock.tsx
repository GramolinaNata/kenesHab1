import { Pencil } from "lucide-react";

export function DefaultBlockButton() {
  return (
    <div className="rounded-[16px] bg-[#FFFFFF] px-2 pt-7 pb-4 transition-all duration-300 shadow-md">
      <div className="flex items-center w-full">
        <div className="grid pl-2.5 w-full">
          <div className="flex items-center justify-between pb-3">
            <span className="font-semibold text-[16px] text-black">
              ОПИСАНИЕ ЖАЛОБЫ
            </span>

            <button
              className="
      w-[129px] h-[30px] 
      rounded-[15px] 
      bg-[#f3f5f6] 
      text-[#8e9090]
      text-[12px] font-normal leading-[133%]
      flex items-center gap-2 px-3
    "
            >
              <Pencil size={14} className="text-[#8e9090]" />
              Редактировать
            </button>
          </div>

          <div className="flex items-center w-full text-[#68707e]">
            <span className="font-normal text-[14px]">
              Я погасила займ полностью 2 октября, но МФО «CrediFast» начислило
              дополнительные проценты и требует оплату. Прошу провести проверку
              и вернуть излишне уплаченную сумму.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
