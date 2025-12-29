import { LabeledInput } from "@/shared";
import ComplaintCard from "@/shared/components/block/ComplaintCard";

import { BellRing } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div>
        <div className="flex items-center justify-around mt-5">
          <div className="flex items-center gap-2.5">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJpp3XhMaWsHmwSNbS-smmCmIER3aHmB0Qw&s"
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-[18px] text-[#343942]">
                Займер.кз
              </p>
              <p className="font-medium text-[12px] text-[#626b79]">
                Микрофинансовая организация
              </p>
            </div>
          </div>

          <div className="w-10 h-10 bg-[#d1ebfa] rounded-full grid items-center justify-center">
            <BellRing className="text-[#1f74ec]" />
          </div>
        </div>
        <div className="mt-3">
          <img src="/zaimer.svg" alt="" />
        </div>
        <div className="mt-3">
          <LabeledInput placeholder="Поиск: Обращение" />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-black font-semibold text-[22px]">
            Обращение
          </span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-3">
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
        <div className="mt-3.5 grid items-center gap-3">
          <ComplaintCard />
          <ComplaintCard />
          <ComplaintCard />
          <ComplaintCard />
        </div>
      </div>
    </div>
  );
}
