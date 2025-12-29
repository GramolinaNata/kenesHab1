import { useState } from "react";
import {
  useApplicationCreate,
  useApplicationDelete,
  useApplications,
  useApplicationUpdate,
} from "@/features/application/hooks/useApplication";
import { AppealCard } from "@/shared/components/block/AppealCard";
import ComplaintCard from "@/shared/components/block/ComplaintCard";
import DebtsCard from "@/shared/components/block/DebtsCard";
import {
  Bookmark,
  EllipsisVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

// Схема валидации для формы заявки с указанными полями
const applicationFormSchema = z.object({
  creditor: z.number({ message: "Выберите кредитора" }),
  amount: z.number().positive("Сумма должна быть положительной"),
  comment: z.string().optional(),
  template: z.number({ message: "Выберите шаблон" }),
  bank_email: z.string().email("Некорректный email"),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Моковые данные для кредиторов (замените на реальные данные из API)
const MOCK_CREDITORS = [
  { id: 1, name: "ТОО 'Робокэш.кз'" },
  // { id: 2, name: "ТОО 'КредитФаст'" },
  // { id: 3, name: "ТОО 'Деньги Онлайн'" },
  // { id: 4, name: "ТОО 'Быстроденьги'" },
  // { id: 5, name: "ТОО 'Е-Капитал'" },
  // { id: 6, name: "Казкоммерцбанк" },
  // { id: 7, name: "Халык Банк" },
  // { id: 8, name: "ForteBank" },
];

// Моковые данные для шаблонов (замените на реальные данные из API)
const MOCK_TEMPLATES = [
  { id: 1, name: "Реструктуризация долга", type: "restructuring" },
  // { id: 2, name: "Юридическая консультация", type: "legal" },
  // { id: 3, name: "Медиация", type: "mediation" },
  // { id: 4, name: "Обращение к омбудсмену", type: "ombudsman" },
  // { id: 5, name: "Жалоба на действия МФО", type: "complaint" },
];

// Функция для форматирования даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Функция для получения названия кредитора по ID
const getCreditorName = (id: number) => {
  const creditor = MOCK_CREDITORS.find((c) => c.id === id);
  return creditor ? creditor.name : `Кредитор #${id}`;
};

// Компонент для отображения статуса
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "NEW":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Clock className="w-3 h-3 mr-1" />
          Новая
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <AlertCircle className="w-3 h-3 mr-1" />В работе
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Завершена
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function HomeWidget() {
  const { data: applicationsData, isLoading } = useApplications();
  const createApplication = useApplicationCreate();
  const updateApplication = useApplicationUpdate();
  const deleteApplication = useApplicationDelete();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [, setApplicationType] = useState<string>("");

  const createForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      creditor: undefined,
      amount: 0,
      comment: "",
      template: undefined,
      bank_email: "",
    },
  });

  const editForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      creditor: undefined,
      amount: 0,
      comment: "",
      template: undefined,
      bank_email: "",
    },
  });

  const handleCardClick = (type: string) => {
    setApplicationType(type);

    // Устанавливаем соответствующий шаблон в зависимости от типа карточки
    let templateId: number | undefined;
    if (type === "statement") templateId = 1; // Реструктуризация
    if (type === "lawyer") templateId = 2; // Юридическая консультация
    if (type === "mediator") templateId = 3; // Медиация
    if (type === "ombudsman") templateId = 4; // Омбудсмен

    if (templateId) {
      createForm.setValue("template", templateId);
    }
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (application: any) => {
    setSelectedApplication(application);
    editForm.reset({
      creditor: application.creditor,
      amount: parseFloat(application.amount),
      comment: "", // Можно добавить поле comment в данные заявки
      template: 1, // Можно добавить поле template в данные заявки
      bank_email: "", // Можно добавить поле bank_email в данные заявки
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (application: any) => {
    setSelectedApplication(application);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedApplication) {
      try {
        await deleteApplication.mutateAsync(selectedApplication.id);
        setIsDeleteDialogOpen(false);
        setSelectedApplication(null);
      } catch (error) {
        console.error("Ошибка при удалении заявки:", error);
      }
    }
  };

  const onCreateSubmit = async (data: ApplicationFormValues) => {
    try {
      console.log("Отправляемые данные:", data);
      await createApplication.mutateAsync({
        creditor: data.creditor,
        amount: data.amount,
        comment: data.comment,
        template: data.template,
        bank_email: data.bank_email,
      });
      setIsCreateDialogOpen(false);
      createForm.reset({
        creditor: undefined,
        amount: 0,
        comment: "",
        template: undefined,
        bank_email: "",
      });
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
    }
  };

  const onEditSubmit = async (data: ApplicationFormValues) => {
    if (!selectedApplication) return;

    try {
      await updateApplication.mutateAsync({
        id: selectedApplication.id,
        payload: {
          creditor: data.creditor,
          amount: data.amount,
          comment: data.comment,
          template: data.template,
          bank_email: data.bank_email,
        },
      });
      setIsEditDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Ошибка при обновлении заявки:", error);
    }
  };

  // Диалоговое окно для создания заявки
  const CreateApplicationDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Создать новую заявку
          </DialogTitle>
        </DialogHeader>
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="space-y-4"
          >
            <FormField
              control={createForm.control}
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кредитор (МФО/Банк) *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите кредитора" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_CREDITORS.map((creditor) => (
                        <SelectItem
                          key={creditor.id}
                          value={creditor.id.toString()}
                        >
                          {creditor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма задолженности *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        className="pr-8 w-full"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип заявки *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тип заявки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_TEMPLATES.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="bank_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email банка/МФО *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о вашей ситуации..."
                      className="min-h-[100px] w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-500 mt-2">
              <p>* Поля обязательные для заполнения</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  createForm.reset({
                    creditor: undefined,
                    amount: 0,
                    comment: "",
                    template: undefined,
                    bank_email: "",
                  });
                }}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={createApplication.isPending}
                className="bg-[#1f74ec] hover:bg-[#1a65d4]"
              >
                {createApplication.isPending ? "Отправка..." : "Создать заявку"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  // Диалоговое окно для редактирования заявки
  const EditApplicationDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Редактировать заявку
          </DialogTitle>
          <DialogDescription>
            Заявка #{selectedApplication?.id?.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <FormField
              control={editForm.control}
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кредитор (МФО/Банк) *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите кредитора" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_CREDITORS.map((creditor) => (
                        <SelectItem
                          key={creditor.id}
                          value={creditor.id.toString()}
                        >
                          {creditor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма задолженности *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        className="pr-8 w-full"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип заявки *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тип заявки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_TEMPLATES.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="bank_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email банка/МФО *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о вашей ситуации..."
                      className="min-h-[100px] w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedApplication(null);
                }}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={updateApplication.isPending}
                className="bg-[#1f74ec] hover:bg-[#1a65d4]"
              >
                {updateApplication.isPending
                  ? "Сохранение..."
                  : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  // Диалоговое окно подтверждения удаления
  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь удалить заявку #
            {selectedApplication?.id?.slice(0, 8)}. Это действие нельзя
            отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedApplication(null);
            }}
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteApplication.isPending}
          >
            {deleteApplication.isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-5">
      <CreateApplicationDialog />
      <EditApplicationDialog />
      <DeleteConfirmationDialog />

      <div className="flex flex-col gap-4">
        <div
          onClick={() => handleCardClick("statement")}
          className="cursor-pointer"
        >
          <AppealCard
            variant="big"
            title="Реструктуризация/урегулирование просроченной задолженности"
            subtitle="Решим любые проблемы с МФО"
            image="/blocknout.svg"
            href="#"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => handleCardClick("lawyer")}
            className="cursor-pointer"
          >
            <AppealCard
              title={
                <>
                  Обратиться <br /> к юристу
                </>
              }
              image="/man.svg"
              href="#"
            />
          </div>
          <div
            onClick={() => handleCardClick("mediator")}
            className="cursor-pointer"
          >
            <AppealCard
              title={
                <>
                  Обратиться <br /> к медиатору
                </>
              }
              image="/man.svg"
              href="#"
            />
          </div>
        </div>

        <div
          onClick={() => handleCardClick("ombudsman")}
          className="cursor-pointer"
        >
          <AppealCard
            variant="big"
            title={
              <>
                Обратиться <br /> к омбудсмену
              </>
            }
            image="/Lawyer.svg"
            href="#"
          />
        </div>
      </div>

      {/* Секция "Мои заявки" */}
      <div className="mt-10 w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-black font-semibold text-[22px]">
            Мои заявки
          </span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Все заявки
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f74ec] mx-auto"></div>
            <p className="mt-2 text-gray-500">Загрузка заявок...</p>
          </div>
        ) : applicationsData?.results &&
          applicationsData?.results.length > 0 ? (
          <div className="space-y-3">
            {applicationsData?.results.map((application: any) => (
              <div
                key={application.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Заявка #{application.id.slice(0, 8)}
                      </h3>
                      <StatusBadge status={application.status} />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Кредитор:</span>
                        {getCreditorName(application.creditor)}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Сумма:</span>
                        {parseFloat(application.amount).toLocaleString(
                          "ru-RU"
                        )}{" "}
                        ₸
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Создана:</span>
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEdit(application)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(application)}
                        className="flex items-center gap-2 cursor-pointer text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">У вас пока нет созданных заявок</p>
            <p className="text-sm text-gray-400 mt-1">
              Создайте свою первую заявку выше
            </p>
          </div>
        )}
      </div>

      {/* Остальные секции остаются без изменений */}
      {/* Секция "Долги" */}
      <div className="mt-10 w-full">
        <div className="flex justify-between items-center">
          <span className="text-black font-semibold text-[22px]">ДОЛГИ</span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-3">
          <div className="bg-[#1f74ec] rounded-[15px] w-[122px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Просрочен
          </div>
          <div className="bg-[#f5f5f5] rounded-[15px] w-[122px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Активные
          </div>
        </div>
        <div className="mt-3.5 grid items-center gap-3">
          <DebtsCard title="ТОО Микрофинансовая организация 'Робокэш.кз'" />
          <DebtsCard title="ТОО Микрофинансовая организация 'Робокэш.кз'" />
        </div>
      </div>

      {/* Секция "Объявления" */}
      <div className="mt-10 w-full">
        <div className="flex justify-between items-center">
          <span className="text-black font-semibold text-[22px]">
            Объявления
          </span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-3">
          <div className="bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Новые
          </div>
          <div className="bg-[#f5f5f5] rounded-[15px] w-[90px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            В работе
          </div>
          <div className="bg-[#f5f5f5] rounded-[15px] w-[120px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
            Завершенные
          </div>
        </div>
        <div className="mt-3.5 grid items-center gap-3">
          <ComplaintCard />
          <ComplaintCard />
          <ComplaintCard />
          <ComplaintCard />
        </div>
      </div>

      {/* Секция "Мои документы" */}
      <div className="mt-10 w-full">
        <div className="flex justify-between items-center">
          <span className="text-black font-semibold text-[22px]">
            Мои документы
          </span>
          <span className="text-[#1f74ec] text-[12px] font-bold">
            Подробнее
          </span>
        </div>
        <div className="flex justify-between items-center mt-[11px]">
          <span className="text-[#666e7d] font-medium text-[12px] uppercase">
            Документы по делу №1042
          </span>
          <div className="flex items-center gap-2.5">
            <Bookmark color="#969da6" />
            <span className="text-[#68707e] text-[12px]">Прикрепить</span>
          </div>
        </div>
        <div className="grid gap-2.5 mt-2">
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
        </div>
        <div className="flex justify-between items-center mt-[11px]">
          <span className="text-[#666e7d] font-medium text-[12px] uppercase">
            Документы по делу №1042
          </span>
          <div className="flex items-center gap-2.5">
            <Bookmark color="#969da6" />
            <span className="text-[#68707e] text-[12px]">Прикрепить</span>
          </div>
        </div>
        <div className="grid gap-2.5 mt-2 mb-7">
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
          <div className="flex items-center gap-[11px] justify-between">
            <div className="flex gap-4">
              <div className="rounded-[10px] w-[41px] h-[41px] bg-[#eeedf4] flex justify-center items-center">
                <img src="/pdf.svg" alt="" />
              </div>
              <div className="grid font-normal">
                <span className="text-[15px]">text</span>
                <span className="text-[12px]">
                  Клиент: Иван Петров | МФО: CrediFast
                </span>
              </div>
            </div>
            <EllipsisVertical />
          </div>
        </div>
      </div>
    </div>
  );
}
