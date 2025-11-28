import CreateStatementWidger from "@/widgets/detali/statement/CreateStatementWidget";
import { TitleWidget } from "@/widgets/detali/statement/TitleWidget";

export default function CreateStatementScreen() {
  return (
    <>
      <TitleWidget name="Создать заявление" />

      <CreateStatementWidger />
    </>
  );
}
