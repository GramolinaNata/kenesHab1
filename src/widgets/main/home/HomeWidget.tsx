import { AppealCard } from "@/shared/components/block/AppealCard";
import ComplaintCard from "@/shared/components/block/ComplaintCard";
import DebtsCard from "@/shared/components/block/DebtsCard";
import { Bookmark, EllipsisVertical } from "lucide-react";

export default function HomeWidget() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-5">
      <div className="flex flex-col gap-4">
        <AppealCard
          variant="big"
          title="Реструктуризация/урегулирование просроченной задолженности"
          subtitle="Решим любые проблемы с МФО"
          image="/blocknout.svg"
          href="/detali/create/statement"
        />

        <div className="grid grid-cols-2 gap-3">
          <AppealCard
            title={
              <>
                Обратиться <br /> к юристу
              </>
            }
            image="/man.svg"
            href="/detali/create/lawyer"
          />
          <AppealCard
            title={
              <>
                Обратиться <br /> к медиатору
              </>
            }
            image="/man.svg"
            href="/detali/create/mediator"
          />
        </div>
        <AppealCard
          variant="big"
          title={
            <>
              Обратиться <br /> к омбудсмену
            </>
          }
          image="/Lawyer.svg"
          href="/detali/create/ombudsman"
        />
      </div>
      <div className="mt-10 w-full">
        <div className="flex justify-between items-center">
          <span className="text-black font-semibold text-[22px]">ДОЛГИ</span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-3">
          <div className="bg-[#1f74ec] rounded-[15px] w-[122px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Просрочен
          </div>
          <div className="bg-[#f5f5f5] rounded-[15px] w-[122px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Активные
          </div>
        </div>
        <div className="mt-3.5 grid items-center gap-3">
          <DebtsCard title="ТОО Микрофинансовая организация “Робокэш.кз”" />
          <DebtsCard title="ТОО Микрофинансовая организация “Робокэш.кз”" />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-black font-semibold text-[22px]">
            Обьявление
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
        <div className="flex justify-between items-center mt-[31px]">
          <span className="text-black font-semibold text-[22px]">
            Мои документы
          </span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex justify-between items-center mt-[11px]">
          <span className="text-[#666e7d] font-medium text-[12px] uppercase">
            Документы по делу №1042
          </span>
          <div className="flex items-center gap-2.5">
            <Bookmark color="#969da6" />
            <span className="text-[#68707e] text-[12px]">Прикрепить</span>
          </div>
        </div>
        <div className="grid gap-2.5 mt-2">
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
        </div>
        <div className="flex justify-between items-center mt-[11px]">
          <span className="text-[#666e7d] font-medium text-[12px] uppercase">
            Документы по делу №1042
          </span>
          <div className="flex items-center gap-2.5">
            <Bookmark color="#969da6" />
            <span className="text-[#68707e] text-[12px]">Прикрепить</span>
          </div>
        </div>
        <div className="grid gap-2.5 mt-2 mb-7">
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
        </div>
      </div>
    </div>
  );
}
