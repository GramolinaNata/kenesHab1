import { useState, useEffect } from "react";
import {
  Bookmark,
  Calendar,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  MessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useProposalAccept,
  useProposalReject,
  useVacancyResponse,
} from "@/features/application/hooks/useApplication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

// Схема для формы отклика
const responseFormSchema = z.object({
  comment: z.string().min(5, "Опишите ваше предложение"),
  fee: z.string().min(1, "Укажите сумму гонорара"),
});

type ResponseFormValues = z.infer<typeof responseFormSchema>;

interface LawyerRequest {
  id: number;
  application: string;
  borrower: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    iin: string;
    address: string;
    preferred_lang: string;
  };
  creditor: {
    id: number;
    name: string;
    type: string;
    email: string;
    phone: string;
    logo: null | string;
    address: string;
    bin_iin: string;
    bik: string;
    iban: string;
    contact_person: string;
  };
  status: string;
  status_display_ru: string;
  selected_lawyer: null | any;
  lawyer_type: string;
  comment: string;
  fee: string;
  created_at: string;
}

interface LawyerRequestsCardProps {
  request: LawyerRequest;
  onStatusChange?: () => void;
}

export default function LawyerRequestsCard({
  request,
  onStatusChange,
}: LawyerRequestsCardProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Получаем роли пользователя из localStorage
  useEffect(() => {
    try {
      const roles = localStorage.getItem("userRoles");
      if (roles) {
        setUserRoles(JSON.parse(roles));
      }
    } catch (error) {
      console.error("Ошибка при получении ролей пользователя:", error);
    }
  }, []);

  const acceptProposal = useProposalAccept();
  const rejectProposal = useProposalReject();
  const respondToVacancy = useVacancyResponse();

  const responseForm = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      comment: "",
      fee: request.fee || "",
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle size={14} className="text-green-600" />;
      case "in_progress":
        return <Clock size={14} className="text-yellow-600" />;
      case "closed":
        return <XCircle size={14} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const handleAccept = async () => {
    try {
      setActionError(null);
      await acceptProposal.mutateAsync(request.id);
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при принятии обращения");
    }
  };

  const handleReject = async () => {
    try {
      setActionError(null);
      await rejectProposal.mutateAsync(request.id);
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при отклонении обращения");
    }
  };

  const handleResponse = async (data: ResponseFormValues) => {
    try {
      setActionError(null);
      await respondToVacancy.mutateAsync({
        id: request.id,
        payload: {
          comment: data.comment,
          fee: data.fee,
        },
      });
      setIsResponseDialogOpen(false);
      responseForm.reset();
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при отправке отклика");
    }
  };

  const isPending =
    acceptProposal.isPending ||
    rejectProposal.isPending ||
    respondToVacancy.isPending;

  // Проверяем роли
  const isLawyer = userRoles.includes("lawyer");
  const isBorrower = userRoles.includes("borrower");

  // Рендерим кнопки в зависимости от роли
  const renderActionButtons = () => {
    // Для юриста показываем кнопку "Откликнуться"
    if (isLawyer) {
      return (
        <button
          onClick={() => setIsResponseDialogOpen(true)}
          disabled={isPending}
          className="border border-green-600 rounded-[15px] w-[120px] h-[31px] text-green-600 text-[14px] font-bold flex justify-center items-center gap-1 hover:bg-green-50 transition-colors"
        >
          <MessageSquare size={14} />
          Откликнуться
        </button>
      );
    }

    // Для заемщика показываем кнопки "Принять/Отклонить"
    if (isBorrower) {
      return (
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAccept}
            disabled={isPending}
            className={`bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center transition-colors ${
              isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1a65d4]"
            }`}
          >
            {acceptProposal.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Принять"
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className={`border border-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-[#1f74ec] text-[14px] font-bold flex justify-center items-center transition-colors ${
              isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
            }`}
          >
            {rejectProposal.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Отклонить"
            )}
          </button>
        </div>
      );
    }

    // Если роль не определена, показываем заглушку
    return null;
  };

  return (
    <>
      <div className="rounded-[12px] bg-[#f4f5f7] p-4 transition-all duration-300 shadow-md hover:shadow-lg">
        <div className="grid gap-3">
          {/* Заголовок */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-semibold text-[16px] text-[#23272c]">
                Обращение к юристу #{request.id}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#5d6675] text-[12px] font-bold">
                  Заявка #{request.application.slice(0, 8)}
                </span>
                <span className="text-[#5d6675] text-[12px]">•</span>
                <span className="text-[#5d6675] text-[12px] font-bold">
                  {request.creditor.name}
                </span>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold ${getStatusColor(request.status)}`}
            >
              {getStatusIcon(request.status)}
              <span>{request.status_display_ru}</span>
            </div>
          </div>

          {/* Информация о заемщике */}
          <div className="flex items-center gap-4 text-[#68707e] text-[12px]">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{request.borrower.full_name || "Не указан"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase size={14} />
              <span>
                Предлагаемый гонорар: {parseFloat(request.fee).toLocaleString()}{" "}
                ₸
              </span>
            </div>
            {request.borrower.phone && (
              <div className="flex items-center gap-1">
                <span>📞 {request.borrower.phone}</span>
              </div>
            )}
          </div>

          {/* Комментарий клиента (если есть) */}
          {request.comment && (
            <div className="text-[#68707e] text-[12px] italic border-l-2 border-[#1f74ec] pl-2">
              <span className="font-medium">Клиент: </span>
              {request.comment}
            </div>
          )}

          {/* Дата создания */}
          <div className="text-[#68707e] text-[12px] font-bold flex items-center gap-2.5 pt-2 border-t border-[#cdcbd2]">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Создано {formatDate(request.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatTime(request.created_at)}</span>
            </div>
          </div>

          {/* Ошибка действия */}
          {actionError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {actionError}
              </p>
            </div>
          )}

          {/* Действия */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <Bookmark color="#1f74ec" size={18} />
              <span className="text-[#68707e] text-[12px]">0 документов</span>
            </div>

            {/* Кнопки для открытых обращений */}
            {request.status === "open" && (
              <div className="grid items-center gap-2.5">
                {renderActionButtons()}
              </div>
            )}

            {/* Если статус не open, показываем статус */}
            {request.status !== "open" && (
              <div className="text-[#68707e] text-[12px] font-medium">
                {request.status === "in_progress" && "✓ Принято в работу"}
                {request.status === "closed" && "✗ Отклонено"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Диалог отклика на вакансию (только для юристов) */}
      {isLawyer && (
        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Send className="h-5 w-5 text-green-600" />
                Отклик на обращение #{request.id}
              </DialogTitle>
            </DialogHeader>

            <Form {...responseForm}>
              <form
                onSubmit={responseForm.handleSubmit(handleResponse)}
                className="space-y-4"
              >
                {/* Комментарий */}
                <FormField
                  control={responseForm.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ваше предложение *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишите, как вы можете помочь, и ваш опыт..."
                          className="min-h-[100px] w-full"
                          disabled={respondToVacancy.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Гонорар */}
                <FormField
                  control={responseForm.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ваш гонорар *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="100000"
                            className="w-full pr-8"
                            disabled={respondToVacancy.isPending}
                            {...field}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₸
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Информация для юриста */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Клиент предлагает:</span>{" "}
                    {parseFloat(request.fee).toLocaleString()} ₸
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Вы можете предложить свою сумму в поле выше
                  </p>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsResponseDialogOpen(false);
                      responseForm.reset();
                    }}
                    disabled={respondToVacancy.isPending}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={respondToVacancy.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {respondToVacancy.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Отправить отклик
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
