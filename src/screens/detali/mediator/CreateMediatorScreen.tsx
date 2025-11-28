import CreateMediatorWidget from "@/widgets/detali/mediator/CreateMediatorWidger";
import { TitleWidget } from "@/widgets/detali/statement/TitleWidget";

export default function CreateMediatorScreen() {
  return (
    <>
      <TitleWidget name="Обратиться к медиатору" />

      <CreateMediatorWidget />
    </>
  );
}
