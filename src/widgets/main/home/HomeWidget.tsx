import { useEffect, useState } from "react";
import {
  useApplicationCreate,
  useApplicationDelete,
  useApplications,
  useApplicationUpdate,
  useApplicationSetStatus,
  useApplicationGenerateDocument,
  useApplicationSendEmail,
  useApplicationSendOtp,
  useApplicationVerifyOtp,
  useCreditors,
  useDocumentPreview,
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
  FileText,
  Mail,
  Loader2,
  ShieldCheck,
  Copy,
  Eye,
  FileDown,
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

// Схема для OTP кода
const otpFormSchema = z.object({
  code: z.string().min(1, "Введите код подтверждения"),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

// Моковые данные для кредиторов
const MOCK_CREDITORS = [{ id: 1, name: "ТОО 'Робокэш.кз'" }];

// Моковые данные для шаблонов
const MOCK_TEMPLATES = [
  { id: 1, name: "Реструктуризация долга", type: "restructuring" },
  { id: 2, name: "Отсрочка платежа", type: "payment_deferral" },
  { id: 3, name: "Частичное списание долга", type: "partial_writeoff" },
  { id: 4, name: "Изменение графика выплат", type: "schedule_change" },
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

// Опции статусов
const STATUS_OPTIONS = [
  { value: "NEW", label: "Новая" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Завершена" },
];

// Компонент для выбора статуса
const StatusDropdown = ({
  currentStatus,
  applicationId,
  onStatusChange,
  isPending,
}: {
  currentStatus: string;
  applicationId: number;
  onStatusChange: (id: number, status: string) => void;
  isPending: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <StatusBadge status={currentStatus} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => onStatusChange(applicationId, status.value)}
            disabled={status.value === currentStatus || isPending}
            className="flex items-center gap-2"
          >
            {status.value === currentStatus && (
              <CheckCircle className="h-4 w-4" />
            )}
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Компонент CreateApplicationDialog
const CreateApplicationDialog = ({
  isOpen,
  onClose,
  selectedType,
  setSelectedType,
  creditors,
  isLoadingCreditors,
  createForm,
  documentPreview,
  onGeneratePDF,
  createApplication,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedType: "bank" | "mfo" | null;
  setSelectedType: (type: "bank" | "mfo" | null) => void;
  creditors: any[];
  isLoadingCreditors: boolean;
  createForm: any;
  documentPreview: any;
  onGeneratePDF: (data: any) => void;
  createApplication: any;
  onSubmit: (data: any) => void;
}) => {
  const watchedCreditor = createForm.watch("creditor");
  const watchedAmount = createForm.watch("amount");
  const watchedTemplate = createForm.watch("template");
  const watchedBankEmail = createForm.watch("bank_email");

  const isFormValid =
    !!watchedCreditor &&
    watchedAmount > 0 &&
    !!watchedTemplate &&
    !!watchedBankEmail &&
    !!selectedType;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Создать новую заявку
          </DialogTitle>
        </DialogHeader>
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Поле выбора типа организации */}
            <div className="space-y-2">
              <FormLabel>Тип организации *</FormLabel>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={selectedType === "bank" ? "default" : "outline"}
                  className={selectedType === "bank" ? "bg-[#1f74ec]" : ""}
                  onClick={() => {
                    setSelectedType("bank");
                    createForm.setValue("creditor", undefined);
                  }}
                >
                  Банк
                </Button>
                <Button
                  type="button"
                  variant={selectedType === "mfo" ? "default" : "outline"}
                  className={selectedType === "mfo" ? "bg-[#1f74ec]" : ""}
                  onClick={() => {
                    setSelectedType("mfo");
                    createForm.setValue("creditor", undefined);
                  }}
                >
                  МФО
                </Button>
              </div>
            </div>

            <FormField
              control={createForm.control}
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кредитор (МФО/Банк) *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingCreditors || !selectedType}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !selectedType
                              ? "Сначала выберите тип организации"
                              : isLoadingCreditors
                                ? "Загрузка кредиторов..."
                                : "Выберите кредитора"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!selectedType ? (
                        <SelectItem value="no-type" disabled>
                          Выберите тип организации
                        </SelectItem>
                      ) : isLoadingCreditors ? (
                        <SelectItem value="loading" disabled>
                          Загрузка...
                        </SelectItem>
                      ) : creditors && creditors.length > 0 ? (
                        creditors.map((creditor) => (
                          <SelectItem
                            key={creditor.id}
                            value={creditor.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span>{creditor.name}</span>
                              <span className="text-xs text-gray-500">
                                {creditor.type === "bank" ? "Банк" : "МФО"} •{" "}
                                {creditor.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>
                          Нет доступных кредиторов для выбранного типа
                        </SelectItem>
                      )}
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

            <div className="flex flex-col gap-3 pt-4">
              {/* Кнопка генерации PDF */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const formData = createForm.getValues();
                  onGeneratePDF(formData);
                }}
                disabled={documentPreview?.isPending || !isFormValid}
                className={`w-full border-2 ${
                  isFormValid
                    ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                {documentPreview?.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерация PDF...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Предпросмотр PDF
                  </>
                )}
              </Button>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    setSelectedType(null);
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
                  disabled={
                    createApplication?.isPending ||
                    isLoadingCreditors ||
                    !selectedType ||
                    !isFormValid
                  }
                  className="bg-[#1f74ec] hover:bg-[#1a65d4]"
                >
                  {createApplication?.isPending
                    ? "Отправка..."
                    : "Создать заявку"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Компонент EditApplicationDialog
const EditApplicationDialog = ({
  isOpen,
  onClose,
  selectedApplication,
  editForm,
  updateApplication,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  editForm: any;
  updateApplication: any;
  onSubmit: (data: any) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onSubmit={editForm.handleSubmit(onSubmit)}
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
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={updateApplication?.isPending}
                className="bg-[#1f74ec] hover:bg-[#1a65d4]"
              >
                {updateApplication?.isPending
                  ? "Сохранение..."
                  : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Компонент DeleteConfirmationDialog
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  selectedApplication,
  deleteApplication,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  deleteApplication: any;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
          <AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteApplication?.isPending}
          >
            {deleteApplication?.isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Компонент GenerateDocumentDialog
const GenerateDocumentDialog = ({
  isOpen,
  onClose,
  selectedApplication,
  generateDocument,
  onGenerate,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  generateDocument: any;
  onGenerate: (id: number) => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Сгенерировать документ?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь сгенерировать документ для заявки #
            {selectedApplication?.id?.slice(0, 8)}. Это может занять некоторое
            время.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onGenerate(selectedApplication?.id)}
            className="bg-green-600 hover:bg-green-700"
            disabled={generateDocument?.isPending}
          >
            {generateDocument?.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Сгенерировать
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Компонент SendEmailDialog
const SendEmailDialog = ({
  isOpen,
  onClose,
  selectedApplication,
  generateDocument,
  sendOtp,
  emailProcessStep,
  onStart,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  generateDocument: any;
  sendOtp: any;
  emailProcessStep: string;
  onStart: (id: number) => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отправить документ на email?</AlertDialogTitle>
          <AlertDialogDescription>
            Для отправки документа заявки #
            {selectedApplication?.id?.slice(0, 8)}:
            <ol className="list-decimal pl-4 mt-2 space-y-1">
              <li>Будет сгенерирован документ</li>
              <li>Будет отправлен OTP код для подтверждения</li>
              <li>После верификации OTP документ будет отправлен на email</li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onStart(selectedApplication?.id)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={generateDocument?.isPending || sendOtp?.isPending}
          >
            {generateDocument?.isPending || sendOtp?.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {emailProcessStep === "generating_document"
                  ? "Генерация документа..."
                  : "Отправка OTP..."}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Начать процесс отправки
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Компонент OtpDialog
const OtpDialog = ({
  isOpen,
  onClose,
  selectedApplication,
  otpCode,
  isOtpSent,
  emailProcessStep,
  otpForm,
  verifyOtp,
  sendEmail,
  copyToClipboard,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  otpCode: string;
  isOtpSent: boolean;
  emailProcessStep: string;
  otpForm: any;
  verifyOtp: any;
  sendEmail: any;
  copyToClipboard: (text: string) => void;
  onSubmit: (data: any) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            OTP Подтверждение
          </DialogTitle>
          <DialogDescription>
            Подтвердите отправку email для заявки #
            {selectedApplication?.id?.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Отображение статуса процесса */}
          {emailProcessStep === "verifying_otp" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">OTP отправлен</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Код подтверждения был отправлен. Введите его ниже.
              </p>
            </div>
          )}

          {/* Отображение OTP кода */}
          {isOtpSent && otpCode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Ваш OTP код:
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(otpCode)}
                  className="h-7 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать
                </Button>
              </div>
              <div className="text-center">
                <div className="inline-block bg-white border-2 border-yellow-300 rounded-lg px-6 py-3">
                  <span className="text-2xl font-bold tracking-widest text-gray-900">
                    {otpCode}
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Введите этот код в поле ниже для подтверждения
                </p>
              </div>
            </div>
          )}

          {/* Форма для ввода OTP кода */}
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Введите OTP код</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите код подтверждения"
                        className="text-center text-lg tracking-widest"
                        disabled={verifyOtp?.isPending || sendEmail?.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Индикатор текущего шага */}
              <div className="text-sm text-gray-500">
                {emailProcessStep === "verifying_otp" &&
                  "Введите код для подтверждения"}
                {emailProcessStep === "sending_email" && "Отправка email..."}
                {emailProcessStep === "completed" && "Email успешно отправлен!"}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    otpForm.reset({ code: "" });
                  }}
                  disabled={verifyOtp?.isPending || sendEmail?.isPending}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={verifyOtp?.isPending || sendEmail?.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {verifyOtp?.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : sendEmail?.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Подтвердить и отправить
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Компонент StatusChangeDialog
const StatusChangeDialog = ({
  isOpen,
  onClose,
  statusChangeData,
  setApplicationStatus,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  statusChangeData: any;
  setApplicationStatus: any;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Изменить статус заявки?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы хотите изменить статус заявки с "
            {
              STATUS_OPTIONS.find(
                (s) => s.value === statusChangeData?.currentStatus,
              )?.label
            }
            " на "
            {
              STATUS_OPTIONS.find(
                (s) => s.value === statusChangeData?.newStatus,
              )?.label
            }
            ".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#1f74ec] hover:bg-[#1a65d4]"
            disabled={setApplicationStatus?.isPending}
          >
            {setApplicationStatus?.isPending ? "Изменение..." : "Изменить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PDFPreview = ({
  pdfBlob,
  fileName,
}: {
  pdfBlob: Blob | null;
  fileName: string;
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Управляем открытием/закрытием на основе pdfBlob
  useEffect(() => {
    if (pdfBlob) {
      setIsOpen(true);
      setIsLoading(true);

      // Создаем URL из Blob
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setIsLoading(false);

      // Очищаем URL при размонтировании или изменении pdfBlob
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setIsOpen(false);
      setPdfUrl(null);
    }
  }, [pdfBlob]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    if (pdfBlob && pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  // Не рендерим ничего, если нет blob или url
  if (!pdfBlob || !pdfUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[900px] w-[95vw] max-h-[95vh] p-4 sm:p-6"
        // Предотвращаем всплытие событий, которые могут закрыть другие модалки
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          handleClose();
        }}
      >
        <DialogHeader className="space-y-1.5 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <span className="truncate">Предпросмотр документа</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Сгенерированный PDF документ для заявки
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
          {/* Адаптивная панель инструментов */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-full px-1">
              {fileName}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Печать</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
              >
                <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Скачать PDF</span>
              </Button>
            </div>
          </div>

          {/* Адаптивный предпросмотр PDF */}
          <div className="relative w-full h-[50vh] sm:h-[600px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
                style={{ minHeight: "300px" }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default function HomeWidget() {
  const { data: applicationsData, isLoading } = useApplications();
  const createApplication = useApplicationCreate();
  const updateApplication = useApplicationUpdate();
  const deleteApplication = useApplicationDelete();
  const setApplicationStatus = useApplicationSetStatus();
  const generateDocument = useApplicationGenerateDocument();
  const sendEmail = useApplicationSendEmail();
  const sendOtp = useApplicationSendOtp();
  const verifyOtp = useApplicationVerifyOtp();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("document.pdf");
  const [, setIsPdfLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [, setApplicationType] = useState<string>("");
  const [statusChangeData, setStatusChangeData] = useState<{
    id: number;
    currentStatus: string;
    newStatus: string;
  } | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [emailProcessStep, setEmailProcessStep] = useState<
    | "generating_document"
    | "sending_otp"
    | "verifying_otp"
    | "sending_email"
    | "completed"
  >("generating_document");
  const [selectedType, setSelectedType] = useState<"bank" | "mfo" | null>(null);

  const { data: creditors, isLoading: isLoadingCreditors } = useCreditors(
    selectedType || undefined,
  );

  const documentPreview = useDocumentPreview();

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

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleCardClick = (type: string) => {
    setApplicationType(type);
    let templateId: number | undefined;
    if (type === "statement") templateId = 1;
    if (type === "lawyer") templateId = 2;
    if (type === "mediator") templateId = 3;
    if (type === "ombudsman") templateId = 4;

    if (templateId) {
      createForm.setValue("template", templateId);
    }
    setIsCreateDialogOpen(true);
  };

  const handleGeneratePDF = async (data: ApplicationFormValues) => {
    try {
      setIsPdfLoading(true);

      // Получаем название кредитора
      const creditor = creditors?.find((c: any) => c.id === data.creditor);
      const creditorName = creditor?.name || "creditor";

      // Получаем название шаблона
      const template = MOCK_TEMPLATES.find((t) => t.id === data.template);
      const templateName = template?.name || "document";

      // Формируем имя файла
      const date = new Date().toISOString().split("T")[0];
      const fileName = `${templateName}_${creditorName}_${date}.pdf`
        .replace(/[^a-zA-Zа-яА-Я0-9\s_-]/g, "") // Удаляем спецсимволы
        .replace(/\s+/g, "_"); // Заменяем пробелы на подчеркивания

      const blob = await documentPreview.mutateAsync({
        creditor: data.creditor,
        amount: data.amount,
        comment: data.comment,
        template: data.template,
        bank_email: data.bank_email,
      });

      setPdfBlob(blob);
      setPdfFileName(fileName);
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
      // Здесь можно показать уведомление об ошибке
      alert("Ошибка при генерации PDF. Пожалуйста, попробуйте снова.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleEdit = (application: any) => {
    setSelectedApplication(application);
    editForm.reset({
      creditor: application.creditor,
      amount: parseFloat(application.amount),
      comment: "",
      template: 1,
      bank_email: "",
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

  const handleGenerateDocument = async (applicationId: number) => {
    try {
      const result = await generateDocument.mutateAsync(applicationId);
      console.log("Документ сгенерирован:", result);
      setIsDocumentDialogOpen(false);
    } catch (error) {
      console.error("Ошибка при генерации документа:", error);
    }
  };

  const startEmailProcess = async (applicationId: number) => {
    try {
      setEmailProcessStep("generating_document");

      const documentResult = await generateDocument.mutateAsync(applicationId);
      console.log("Документ сгенерирован для отправки:", documentResult);

      setEmailProcessStep("sending_otp");
      const otpResult = await sendOtp.mutateAsync(applicationId);
      console.log("OTP отправлен:", otpResult);

      const code = otpResult?.code || otpResult?.dev_code || "123456";
      setOtpCode(code);
      setIsOtpSent(true);
      setEmailProcessStep("verifying_otp");

      setIsEmailDialogOpen(false);
      setIsOtpDialogOpen(true);
    } catch (error) {
      console.error("Ошибка в процессе отправки email:", error);
      setEmailProcessStep("generating_document");
    }
  };

  const handleVerifyOtp = async (applicationId: number, code: string) => {
    try {
      setEmailProcessStep("verifying_otp");

      const verifyResult = await verifyOtp.mutateAsync({
        id: applicationId,
        payload: { code },
      });
      console.log("OTP верифицирован:", verifyResult);

      setEmailProcessStep("sending_email");
      const emailResult = await sendEmail.mutateAsync(applicationId);
      console.log("Email отправлен:", emailResult);

      setEmailProcessStep("completed");

      setTimeout(() => {
        setIsOtpDialogOpen(false);
        setSelectedApplication(null);
        setOtpCode("");
        setIsOtpSent(false);
        otpForm.reset({ code: "" });
        setEmailProcessStep("generating_document");
      }, 1500);
    } catch (error) {
      console.error("Ошибка при верификации OTP:", error);
    }
  };

  const handleStatusChange = async (
    applicationId: number,
    newStatus: string,
  ) => {
    setStatusChangeData({
      id: applicationId,
      currentStatus:
        applicationsData?.results.find((app: any) => app.id === applicationId)
          ?.status || "",
      newStatus,
    });
    setIsStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (statusChangeData) {
      try {
        await setApplicationStatus.mutateAsync({
          id: statusChangeData.id,
          payload: { status: statusChangeData.newStatus },
        });
        setIsStatusDialogOpen(false);
        setStatusChangeData(null);
      } catch (error) {
        console.error("Ошибка при изменении статуса:", error);
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
      setSelectedType(null);
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

  const onOtpSubmit = async (data: OtpFormValues) => {
    if (!selectedApplication) return;

    try {
      await handleVerifyOtp(selectedApplication.id, data.code);
    } catch (error) {
      console.error("Ошибка при верификации OTP:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Код скопирован в буфер обмена");
      })
      .catch((err) => {
        console.error("Ошибка при копировании: ", err);
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-5">
      <CreateApplicationDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setSelectedType(null);
          createForm.reset({
            creditor: undefined,
            amount: 0,
            comment: "",
            template: undefined,
            bank_email: "",
          });
        }}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        creditors={creditors || []}
        isLoadingCreditors={isLoadingCreditors}
        createForm={createForm}
        documentPreview={documentPreview}
        onGeneratePDF={handleGeneratePDF}
        createApplication={createApplication}
        onSubmit={onCreateSubmit}
      />

      <EditApplicationDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedApplication(null);
        }}
        selectedApplication={selectedApplication}
        editForm={editForm}
        updateApplication={updateApplication}
        onSubmit={onEditSubmit}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedApplication(null);
        }}
        selectedApplication={selectedApplication}
        deleteApplication={deleteApplication}
        onConfirm={confirmDelete}
      />

      <GenerateDocumentDialog
        isOpen={isDocumentDialogOpen}
        onClose={() => {
          setIsDocumentDialogOpen(false);
          setSelectedApplication(null);
        }}
        selectedApplication={selectedApplication}
        generateDocument={generateDocument}
        onGenerate={handleGenerateDocument}
      />

      <SendEmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => {
          setIsEmailDialogOpen(false);
          setSelectedApplication(null);
        }}
        selectedApplication={selectedApplication}
        generateDocument={generateDocument}
        sendOtp={sendOtp}
        emailProcessStep={emailProcessStep}
        onStart={startEmailProcess}
      />

      <OtpDialog
        isOpen={isOtpDialogOpen}
        onClose={() => {
          setIsOtpDialogOpen(false);
          setSelectedApplication(null);
          setOtpCode("");
          setIsOtpSent(false);
          otpForm.reset({ code: "" });
          setEmailProcessStep("generating_document");
        }}
        selectedApplication={selectedApplication}
        otpCode={otpCode}
        isOtpSent={isOtpSent}
        emailProcessStep={emailProcessStep}
        otpForm={otpForm}
        verifyOtp={verifyOtp}
        sendEmail={sendEmail}
        copyToClipboard={copyToClipboard}
        onSubmit={onOtpSubmit}
      />

      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setStatusChangeData(null);
        }}
        statusChangeData={statusChangeData}
        setApplicationStatus={setApplicationStatus}
        onConfirm={confirmStatusChange}
      />

      <PDFPreview pdfBlob={pdfBlob} fileName={pdfFileName} />

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
                      <StatusDropdown
                        currentStatus={application.status}
                        applicationId={application.id}
                        onStatusChange={handleStatusChange}
                        isPending={setApplicationStatus.isPending}
                      />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Кредитор:</span>
                        {getCreditorName(application.creditor)}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Сумма:</span>
                        {parseFloat(application.amount).toLocaleString(
                          "ru-RU",
                        )}{" "}
                        ₸
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">Создана:</span>
                        {formatDate(application.created_at)}
                      </p>
                      {application.bank_email && (
                        <p className="flex items-center gap-1">
                          <span className="font-medium">Email:</span>
                          {application.bank_email}
                        </p>
                      )}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsDocumentDialogOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={generateDocument.isPending}
                      >
                        <FileText className="h-4 w-4" />
                        Сгенерировать документ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsEmailDialogOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={
                          generateDocument.isPending ||
                          sendOtp.isPending ||
                          verifyOtp.isPending ||
                          sendEmail.isPending
                        }
                      >
                        <Mail className="h-4 w-4" />
                        Отправить на email
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

      {/* Остальные секции */}
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-[11px] justify-between"
            >
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
          ))}
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-[11px] justify-between"
            >
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
          ))}
        </div>
      </div>
    </div>
  );
}
