import { ArrowLeft, X } from "lucide-react";

interface TitleWidgetProps {
  name: string;
}

export function TitleWidget({ name }: TitleWidgetProps) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <button onClick={() => window.history.back()} className="text-gray-700">
        <ArrowLeft size={28} strokeWidth={2.2} />
      </button>

      <h1 className="font-semibold text-[22px] text-[#17243e]">{name}</h1>

      <div className="flex items-center justify-center bg-[#FFFAF7] rounded-full w-[32px] h-[32px]">
        <X size={20} strokeWidth={2.2} />
      </div>
    </div>
  );
}
