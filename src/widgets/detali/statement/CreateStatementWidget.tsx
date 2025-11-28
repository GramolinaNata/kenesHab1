import { LabeledInput } from "@/shared";
import { FileBlock } from "@/shared/components/block/FileBlock";
import SelectField from "@/shared/components/form/SelectField";

export default function CreateStatementWidger() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="grid text-left w-full gap-2.5">
        <span className="font-semibold text-[16px] text-[#000]">
          ДАННЫЕ КЛИЕНТА
        </span>
        <LabeledInput label="Фамилия" placeholder="Белескызы (автоматом)" />
        <LabeledInput label="Имя" placeholder="Инжу (автоматом)" />
        <LabeledInput
          label="Телефон"
          placeholder="8 747 875 39 18"
          type="number"
        />
        <LabeledInput
          label="Email"
          placeholder="i.beleskizi@gmail.com"
          type="email"
        />
        <div className="grid text-left w-full gap-2.5 mt-2.5">
          <span className="font-semibold text-[16px] text-[#000]">
            Документ
          </span>
          <SelectField
            label="Тип Документ"
            value={undefined}
            onChange={(val) => console.log(val)}
            options={[]}
          />
          <LabeledInput
            label="ИИН"
            placeholder="971121450361 (автоматом заполняется если есть)"
            type="number"
          />
          <LabeledInput
            label="Номер документа"
            placeholder="043086162"
            type="number"
          />
          <LabeledInput label="Орган выдачи документа" placeholder="МВД" />
          <LabeledInput
            label="Документ выдан от"
            placeholder="13.12.2016"
            type="number"
          />
          <LabeledInput
            label="Документ выдан до"
            placeholder="13.12.2026"
            type="number"
          />
        </div>
        <div className="grid text-left w-full gap-2.5 mt-2.5">
          <span className="font-semibold text-[16px] text-[#000]">
            О кредите
          </span>

          <LabeledInput
            label="Номер договора"
            placeholder="№ 561651"
            type="number"
          />
          <LabeledInput
            label="Сумма кредита"
            placeholder="160 000 тг"
            type="number"
          />
          <LabeledInput
            label="Дата договора"
            placeholder="26.09.2025 г "
            type="number"
          />

          <SelectField
            label="Рекунстрация"
            value={undefined}
            onChange={(val) => console.log(val)}
            options={[]}
          />
          <LabeledInput label="Текст заявления (редактируемый шаблон)" />
        </div>
        <div className="grid text-left w-full gap-2.5 mt-2.5">
          <span className="font-semibold text-[16px] text-[#000]">
            Прикрепить файлы
          </span>

          <FileBlock />
          <FileBlock />
        </div>
        <a href="/auth/login" className="w-full flex justify-center mt-4">
          <button className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors">
            Отправить запрос
          </button>
        </a>
      </div>
    </div>
  );
}
