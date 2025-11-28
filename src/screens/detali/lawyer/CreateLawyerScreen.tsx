import CreateLawyerWidget from "@/widgets/detali/lawyer/CreateLawyerWidget";
import { TitleWidget } from "@/widgets/detali/statement/TitleWidget";

export default function CreateLawyerScreen() {
  return (
    <>
      <TitleWidget name="Обратиться к Юристу" />
      <CreateLawyerWidget />
    </>
  );
}
