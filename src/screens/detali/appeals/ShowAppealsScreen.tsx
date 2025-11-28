import ShowAppealsWidget from "@/widgets/detali/appeals/ShowAppealsWidget";
import { TitleWidget } from "@/widgets/detali/statement/TitleWidget";

export default function ShowAppealsScreen() {
  return (
    <>
      <TitleWidget name="Обращение 1042" />
      <ShowAppealsWidget />
    </>
  );
}
