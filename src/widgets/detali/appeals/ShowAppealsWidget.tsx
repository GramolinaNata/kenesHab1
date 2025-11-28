import { DefaultBlock } from "@/shared/components/block/DefaultBlock";
import { DefaultBlockButton } from "@/shared/components/block/DefaultButtonBlock";
import InformationBlock from "@/shared/components/block/InformationBlock";

export default function ShowAppealsWidget() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="grid text-left w-full gap-2.5">
        <DefaultBlock />
        <InformationBlock />
        <InformationBlock />
        <InformationBlock />
        <DefaultBlockButton />
      </div>
    </div>
  );
}
