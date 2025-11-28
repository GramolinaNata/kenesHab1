import CreateOmbudsmanWidget from "@/widgets/detali/ombudsman/CreateOmbudsmanWidget";
import { TitleWidget } from "@/widgets/detali/statement/TitleWidget";

export default function CreateOmbudsmanScreen() {
  return (
    <>
      <TitleWidget name="Обратиться к омбудсменту" />
      <CreateOmbudsmanWidget />
    </>
  );
}
