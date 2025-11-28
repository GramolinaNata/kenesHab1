export default function InformationBlock() {
  return (
    <div className="rounded-[16px] bg-[#FFFFFF] p-3 transition-all duration-300 shadow-md">
      <div className="flex items-center w-full">
        <div className="grid pl-2.5 w-full">
          <span className="font-semibold text-[16px] text-black pb-4">
            ДАННЫЕ КЛИЕНТА
          </span>
          <div className={`overflow-hidden transition-all duration-500`}>
            <div className="grid gap-2.5 uppercase font-medium text-[12px] text-[#68707e]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
