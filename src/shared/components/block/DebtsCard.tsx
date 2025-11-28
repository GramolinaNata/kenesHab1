import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DebtsCardProps {
  title: string;
  price?: number;
}

export default function DebtsCard({ title }: DebtsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-[12px] bg-[#f4f5f7] p-4 transition-all duration-300 shadow-md">
      {/* Верхняя часть */}
      <div className="flex items-center gap-[11px]">
        <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
          <img src="/pdf.svg" alt="" />
        </div>
        <span className="font-normal text-[15px]">{title}</span>
      </div>

      {/* Сумма и стрелка */}
      <div className="grid gap-2.5 uppercase font-medium text-[15px] text-[#68707e] pt-2">
        <div className="grid">
          <span>Общая сумма задолженности</span>
          <span className="text-black font-bold">11111 тг</span>
        </div>

        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[#c3496b] font-bold">Просрочен</span>
          <ChevronDown
            color="#254d8c"
            className={`transform transition-transform duration-300 ${
              isOpen ? "-rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Контент, который раскрывается */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[1000px] mt-2" : "max-h-0"
        }`}
      >
        <div className="grid gap-2.5 uppercase font-medium text-[15px] text-[#68707e]">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
            <span>Номер договора</span>
            <span className="text-black">№ 561651</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
            <span>Сумма кредита</span>
            <span className="text-black">160 000 тг</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
            <span>Дата договора </span>
            <span className="text-black">26.09.2025 г</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
            <span>Тип обращение</span>
            <span className="text-black">Реструктуризация</span>
          </div>
          <a href="/" className="w-full flex justify-center">
            <button className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors">
              ОТПРАВИТЬ ЗАПРОС
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
