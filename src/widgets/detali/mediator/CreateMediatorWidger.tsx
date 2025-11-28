import { LabeledInput } from "@/shared";
import { FileBlock } from "@/shared/components/block/FileBlock";
import SelectField from "@/shared/components/form/SelectField";

export default function CreateMediatorWidget() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="grid text-left w-full gap-2.5">
        <span className="font-semibold text-[16px] text-[#000]">Обращение</span>
        <SelectField
          label="Выберите МФО"
          value={undefined}
          onChange={(val) => console.log(val)}
          options={[]}
        />
        <LabeledInput label="Описание проблемы" />
        <LabeledInput label="Что вы хотите в результате?" />

        <div className="grid text-left w-full gap-2.5 mt-2.5">
          <span className="font-semibold text-[16px] text-[#000]">
            Прикрепить файлы
          </span>

          <FileBlock />
          <FileBlock />
        </div>

        <div className="grid text-left w-full gap-2.5 mt-2.5">
          <span className="font-semibold text-[16px] text-[#000]">
            Способ связи
          </span>

          <LabeledInput label="телефон" type="number" />
          <LabeledInput label="Email" type="email" />
        </div>

        <a href="/auth/login" className="w-full flex justify-center mt-4">
          <button className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors">
            Отправить запрос медиатору
          </button>
        </a>
      </div>
    </div>
  );
}
