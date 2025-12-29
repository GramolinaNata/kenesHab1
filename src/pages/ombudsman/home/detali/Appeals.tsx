import { LabeledInput } from "@/shared";
import ComplaintCard from "@/shared/components/block/ComplaintCard";

export default function Appeals() {
  return (
    <div className="mt-5">
      <div className="flex justify-center items-center">
        <span className="font-semibold text-[22px]">Обращение</span>
      </div>
      <div className="flex items-center gap-2.5 mt-6">
        <div className="bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
          Новые
        </div>
        <div className="bg-[#f5f5f5] rounded-[15px] w-[90px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
          В работе
        </div>
        <div className="bg-[#f5f5f5] rounded-[15px] w-[120px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
          Завершенные
        </div>
      </div>
      <div className="mt-3">
        <LabeledInput placeholder="Поиск: Обращение" />
      </div>
      <div className="mt-3.5 grid items-center gap-3">
        <ComplaintCard />
        <ComplaintCard />
        <ComplaintCard />
        <ComplaintCard />
      </div>
    </div>
  );
}
