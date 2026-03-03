

// Моковые данные для кредиторов
export const MOCK_CREDITORS = [{ id: 1, name: "ТОО 'Робокэш.кз'" }];

// Моковые данные для шаблонов
export const MOCK_TEMPLATES: any[] = [
  { id: 1, name: "Реструктуризация долга", type: "restructuring" },
  { id: 2, name: "Отсрочка платежа", type: "payment_deferral" },
  { id: 3, name: "Частичное списание долга", type: "partial_writeoff" },
  { id: 4, name: "Изменение графика выплат", type: "schedule_change" },
];

// Опции статусов
export const STATUS_OPTIONS = [
  { value: "NEW", label: "Новая" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Завершена" },
] as const;

// Соответствие template ID типу карточки
export const TEMPLATE_ID_BY_CARD_TYPE: Record<string, number> = {
  statement: 1,
  lawyer: 2,
  mediator: 3,
  ombudsman: 4,
};