import { MOCK_CREDITORS } from "@/features/application/constants/application";

// Форматирование даты
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Получение названия кредитора по ID
export const getCreditorName = (id: number): string => {
  const creditor = MOCK_CREDITORS.find((c) => c.id === id);
  return creditor ? creditor.name : `Кредитор #${id}`;
};

// Копирование в буфер обмена
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Текст скопирован в буфер обмена");
  } catch (err) {
    console.error("Ошибка при копировании: ", err);
  }
};

// Генерация имени файла для PDF
export const generatePdfFileName = (
  creditorName: string,
  templateName: string
): string => {
  const date = new Date().toISOString().split("T")[0];
  const fileName = `${templateName}_${creditorName}_${date}.pdf`
    .replace(/[^a-zA-Zа-яА-Я0-9\s_-]/g, "")
    .replace(/\s+/g, "_");
  return fileName;
};