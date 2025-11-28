import { Bookmark } from "lucide-react";

export default function ComplaintCard() {
  return (
    <div className="rounded-[12px] bg-[#f4f5f7] p-4 transition-all duration-300 shadow-md">
      <div className="w-[250px] grid items-center gap-1">
        <span className="font-semibold text-[16px] text-[#23272c] ">
          Жалоба на начисление лишних процентов по микрозайму.
        </span>
        <span className="text-[#5d6675] text-[12px] font-bold">
          Жалоба №1042 - МФО «CrediFast»
        </span>
        <div>
          <span className="text-[#68707e] text-[12px] font-bold">
            СТАТУС: В работе 🔄
          </span>
        </div>
      </div>
      <div className="text-[#68707e] text-[12px] font-bold flex items-center gap-2.5 pt-3 border-b border-[#cdcbd2] pb-2">
        <span>Создано 10.10.2025</span>
        <span>Рассмотрен до 17.10.2025</span>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2.5">
          <Bookmark color="#1f74ec" />
          <span className="text-[#68707e] text-[12px]">2 документа</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Новые
          </div>
          <div className="bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Новые
          </div>
        </div>
      </div>
    </div>
  );
}
