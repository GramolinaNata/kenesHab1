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
  Users,
  FileText,
  Eye,
  Download,
  FileSignature,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useProposalAccept,
  useProposalReject,
  useVacancyDetail,
  useVacancyResponse,
  useVacancyResponses,
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

interface LawyerResponse {
  id: number;
  vacancy: number;
  lawyer: {
    id: number;
    type: string;
    full_name: string;
    email: string;
    phone: string;
    experience: string | null;
    bio: string | null;
  };
  borrower: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    iin: string;
    address: string;
    preferred_lang: string;
  };
  fee: string;
  comment: string;
  status: string;
  status_display: string;
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
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
    type: "application" | "contract" | "response";
  }>({ url: "", title: "", type: "application" });
  const [documentType, setDocumentType] = useState<
    "application" | "contract" | "response"
  >("application");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [, setSelectedLawyerId] = useState<number | null>(null);

  // Получаем роли пользователя и email из localStorage
  useEffect(() => {
    try {
      const roles = localStorage.getItem("userRoles");
      if (roles) {
        setUserRoles(JSON.parse(roles));
      }

      // Получаем email текущего пользователя
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || null);
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  }, []);

  const acceptProposal = useProposalAccept();
  const rejectProposal = useProposalReject();
  const respondToVacancy = useVacancyResponse();
  const { data: responses, refetch: refetchResponses } = useVacancyResponses(
    request.id,
  );

  // Получаем детальную информацию о вакансии с документами
  const { data: vacancyDetail, isLoading: isLoadingDetail } = useVacancyDetail(
    request.id,
  );

  // Извлекаем документы из детальной информации
  const applicationDocument = vacancyDetail?.application?.document;
  const contract = vacancyDetail?.application?.contract;
  const creditorResponse = vacancyDetail?.application?.creditor_response;

  // Собираем все документы в массив
  const documents = [
    ...(applicationDocument
      ? [{ ...applicationDocument, type: "application" as const }]
      : []),
    ...(contract ? [{ ...contract, type: "contract" as const }] : []),
    ...(creditorResponse
      ? [{ file: creditorResponse.file, type: "response" as const }]
      : []),
  ];

  const responseForm = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      comment: "",
      fee: request.fee || "",
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_work":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle size={14} className="text-green-600" />;
      case "in_work":
        return <Clock size={14} className="text-yellow-600" />;
      case "in_progress":
        return <Briefcase size={14} className="text-blue-600" />;
      case "closed":
        return <XCircle size={14} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const handleAccept = async () => {
    try {
      setActionError(null);

      await acceptProposal.mutateAsync(responses[0].id);
      setSelectedLawyerId(null);
      refetchResponses();
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при принятии");
    }
  };

  const handleReject = async () => {
    try {
      setActionError(null);

      await rejectProposal.mutateAsync(responses[0].id);
      setSelectedLawyerId(null);
      refetchResponses();
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при отклонении");
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
      refetchResponses();
      onStatusChange?.();
    } catch (error: any) {
      setActionError(error.message || "Ошибка при отправке отклика");
    }
  };

  const handleDocumentClick = (
    doc: any,
    type: "application" | "contract" | "response",
    title: string,
  ) => {
    setSelectedDocument({ url: doc.file, title, type });
    setDocumentType(type);
    setIsDocumentsDialogOpen(true);
  };

  const isPending =
    acceptProposal.isPending ||
    rejectProposal.isPending ||
    respondToVacancy.isPending;

  // Проверяем роли
  const isLawyer = userRoles.includes("lawyer");
  const isBorrower = userRoles.includes("borrower");

  // Проверяем, откликался ли текущий юрист по email
  const hasLawyerResponded = responses?.some(
    (r: LawyerResponse) => r.lawyer.email === userEmail,
  );

  // Фильтруем отклики для отображения
  const pendingResponses =
    responses?.filter((r: LawyerResponse) => r.status === "pending") || [];
  const acceptedResponse = responses?.find(
    (r: LawyerResponse) => r.status === "accepted",
  );
  const rejectedResponses =
    responses?.filter((r: LawyerResponse) => r.status === "rejected") || [];

  return (
    <>
      <div className="rounded-[12px] bg-[#f4f5f7] p-3 sm:p-4 transition-all duration-300 shadow-md hover:shadow-lg w-full max-w-full overflow-hidden">
        <div className="grid gap-3">
          {/* Заголовок */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <span className="font-semibold text-[14px] sm:text-[16px] text-[#23272c]">
                Обращение к юристу #{request.id}
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[#5d6675] text-[11px] sm:text-[12px] font-bold">
                  Заявка #{request.application.slice(0, 8)}
                </span>
                <span className="text-[#5d6675] text-[11px] sm:text-[12px] hidden sm:inline">
                  •
                </span>
                <span className="text-[#5d6675] text-[11px] sm:text-[12px] font-bold">
                  {request.creditor.name}
                </span>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-bold w-fit ${getStatusColor(request.status)}`}
            >
              {getStatusIcon(request.status)}
              <span>{request.status_display_ru}</span>
            </div>
          </div>

          {/* Информация о заемщике */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[#68707e] text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-1">
              <User size={14} className="flex-shrink-0" />
              <span className="truncate">
                {request.borrower.full_name || "Не указан"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase size={14} className="flex-shrink-0" />
              <span className="truncate">
                Гонорар: {parseFloat(request.fee).toLocaleString()} ₸
              </span>
            </div>
            {request.borrower.phone && (
              <div className="flex items-center gap-1">
                <span className="truncate">📞 {request.borrower.phone}</span>
              </div>
            )}
          </div>

          {/* Комментарий клиента (если есть) */}
          {request.comment && (
            <div className="text-[#68707e] text-[11px] sm:text-[12px] italic border-l-2 border-[#1f74ec] pl-2 overflow-hidden">
              <span className="font-medium">Клиент: </span>
              <span className="break-words">{request.comment}</span>
            </div>
          )}

          {/* Дата создания */}
          <div className="text-[#68707e] text-[11px] sm:text-[12px] font-bold flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 border-t border-[#cdcbd2]">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="flex-shrink-0" />
              <span>Создано {formatDate(request.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="flex-shrink-0" />
              <span>{formatDateTime(request.created_at)}</span>
            </div>
          </div>

          {/* Список документов */}
          {documents.length > 0 && (
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-[#1f74ec]" />
                <span className="text-[#23272c] text-[13px] sm:text-[14px] font-semibold">
                  Документы ({documents.length})
                </span>
              </div>

              <div className="space-y-2">
                {/* Документ заявки */}
                {applicationDocument && (
                  <button
                    onClick={() =>
                      handleDocumentClick(
                        applicationDocument,
                        "application",
                        applicationDocument.template_name,
                      )
                    }
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                    disabled={isLoadingDetail}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileSignature size={18} className="text-blue-600" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[13px] font-medium text-[#23272c] truncate">
                          {applicationDocument.template_name ||
                            "Документ заявки"}
                        </p>
                        <p className="text-[11px] text-[#68707e]">
                          Загружен {formatDate(applicationDocument.created_at)}
                          {applicationDocument.signed && " • Подписан"}
                        </p>
                      </div>
                    </div>
                    <Eye
                      size={16}
                      className="text-[#68707e] group-hover:text-blue-600 flex-shrink-0 ml-2"
                    />
                  </button>
                )}

                {/* Договор */}
                {contract && (
                  <button
                    onClick={() =>
                      handleDocumentClick(
                        contract,
                        "contract",
                        `Договор ${contract.number ? `№${contract.number}` : ""}`,
                      )
                    }
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all group"
                    disabled={isLoadingDetail}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                        <FileText size={18} className="text-green-600" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[13px] font-medium text-[#23272c] truncate">
                          Договор {contract.number ? `№${contract.number}` : ""}
                        </p>
                        <p className="text-[11px] text-[#68707e]">
                          от {formatDate(contract.date)}
                          {contract.created_at &&
                            ` • Загружен ${formatDate(contract.created_at)}`}
                        </p>
                      </div>
                    </div>
                    <Eye
                      size={16}
                      className="text-[#68707e] group-hover:text-green-600 flex-shrink-0 ml-2"
                    />
                  </button>
                )}

                {/* Ответ кредитора */}
                {creditorResponse && (
                  <button
                    onClick={() =>
                      handleDocumentClick(
                        creditorResponse,
                        "response",
                        "Ответ кредитора",
                      )
                    }
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all group"
                    disabled={isLoadingDetail}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <FileText size={18} className="text-purple-600" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[13px] font-medium text-[#23272c] truncate">
                          Ответ кредитора
                        </p>
                        <p className="text-[11px] text-purple-600">
                          Файл ответа
                        </p>
                      </div>
                    </div>
                    <Eye
                      size={16}
                      className="text-[#68707e] group-hover:text-purple-600 flex-shrink-0 ml-2"
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Отклики юристов (для заемщиков) */}
          {isBorrower && responses && responses.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#cdcbd2]">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[#1f74ec]" />
                <span className="text-[#23272c] text-[13px] sm:text-[14px] font-semibold">
                  Отклики юристов ({responses.length})
                </span>
              </div>

              <div className="space-y-3">
                {/* Принятый отклик (если есть) */}
                {acceptedResponse && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <span className="text-[13px] sm:text-[14px] font-semibold text-green-800">
                        ✓ Принятый отклик
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold w-fit ${getResponseStatusColor(acceptedResponse.status)}`}
                      >
                        {acceptedResponse.status_display}
                      </span>
                    </div>
                    <LawyerResponseCard
                      response={acceptedResponse}
                      isBorrower={isBorrower}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      isPending={isPending}
                      showActions={false}
                    />
                  </div>
                )}

                {/* Ожидающие отклики */}
                {pendingResponses.map((response: LawyerResponse) => (
                  <LawyerResponseCard
                    key={response.id}
                    response={response}
                    isBorrower={isBorrower}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    isPending={isPending}
                    showActions={true}
                  />
                ))}

                {/* Отклоненные отклики (сворачиваем) */}
                {rejectedResponses.length > 0 && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-[#68707e] hover:text-[#1f74ec]">
                      Отклоненные отклики ({rejectedResponses.length})
                    </summary>
                    <div className="mt-2 space-y-2">
                      {rejectedResponses.map((response: LawyerResponse) => (
                        <LawyerResponseCard
                          key={response.id}
                          response={response}
                          isBorrower={isBorrower}
                          onAccept={handleAccept}
                          onReject={handleReject}
                          isPending={isPending}
                          showActions={false}
                        />
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Информация для юриста о его отклике (если есть) */}
          {isLawyer && responses && (
            <div className="mt-2 pt-2 border-t border-[#cdcbd2]">
              <div className="text-[#68707e] text-[11px] sm:text-[12px]">
                {hasLawyerResponded ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Ваш отклик:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${getResponseStatusColor(
                        responses.find(
                          (r: LawyerResponse) => r.lawyer.email === userEmail,
                        )?.status || "pending",
                      )}`}
                    >
                      {
                        responses.find(
                          (r: LawyerResponse) => r.lawyer.email === userEmail,
                        )?.status_display
                      }
                    </span>
                  </div>
                ) : (
                  <span>Вы еще не откликнулись на это обращение</span>
                )}
              </div>
            </div>
          )}

          {/* Ошибка действия */}
          {actionError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600 flex items-center gap-1 break-words">
                <XCircle size={14} className="flex-shrink-0" />
                {actionError}
              </p>
            </div>
          )}

          {/* Действия */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <Bookmark color="#1f74ec" size={18} />
              <span className="text-[#68707e] text-[11px] sm:text-[12px]">
                {documents.length} {getDocumentWord(documents.length)}
              </span>
            </div>

            <div className="w-full sm:w-auto">
              {/* Кнопка "Откликнуться" для юристов - показываем всегда, если юрист еще не откликался */}
              {isLawyer && !hasLawyerResponded && (
                <div className="grid items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setIsResponseDialogOpen(true)}
                    disabled={isPending}
                    className="border border-green-600 rounded-[15px] w-full sm:w-[120px] h-[31px] text-green-600 text-[13px] sm:text-[14px] font-bold flex justify-center items-center gap-1 hover:bg-green-50 transition-colors"
                  >
                    <MessageSquare size={14} />
                    Откликнуться
                  </button>
                </div>
              )}

              {/* Сообщение для юриста, который уже откликнулся */}
              {isLawyer && hasLawyerResponded && (
                <div className="text-[#68707e] text-[11px] sm:text-[12px] font-medium">
                  ✓ Вы уже откликнулись
                </div>
              )}

              {/* Информация о статусе для всех остальных случаев */}
              {!isLawyer && !isBorrower && (
                <div className="text-[#68707e] text-[11px] sm:text-[12px] font-medium">
                  Статус: {request.status_display_ru}
                </div>
              )}

              {/* Информация для юриста при других статусах (если не откликался) */}
              {isLawyer && !hasLawyerResponded && request.status !== "open" && (
                <div className="text-[#68707e] text-[11px] sm:text-[12px] font-medium">
                  {request.status === "in_work" &&
                    "⏳ Ожидает решения заемщика"}
                  {request.status === "in_progress" && "✓ Принято в работу"}
                  {request.status === "closed" && "✗ Закрыто"}
                </div>
              )}

              {/* Информация для заемщика при других статусах */}
              {isBorrower && request.status !== "in_work" && (
                <div className="text-[#68707e] text-[11px] sm:text-[12px] font-medium">
                  {request.status === "open" &&
                    "⚡ Открыто для откликов юристов"}
                  {request.status === "in_progress" && "✓ Принято в работу"}
                  {request.status === "closed" && "✗ Закрыто"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Диалог просмотра документа */}
      <Dialog
        open={isDocumentsDialogOpen}
        onOpenChange={setIsDocumentsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-w-[90vw] mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              {documentType === "application" ? (
                <FileSignature className="h-5 w-5 text-blue-600" />
              ) : documentType === "contract" ? (
                <FileText className="h-5 w-5 text-green-600" />
              ) : (
                <FileText className="h-5 w-5 text-purple-600" />
              )}
              {selectedDocument?.title || "Документ"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoadingDetail ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : selectedDocument ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  {documentType === "application" ? (
                    <FileSignature
                      size={24}
                      className="text-blue-600 flex-shrink-0 mt-1"
                    />
                  ) : documentType === "contract" ? (
                    <FileText
                      size={24}
                      className="text-green-600 flex-shrink-0 mt-1"
                    />
                  ) : (
                    <FileText
                      size={24}
                      className="text-purple-600 flex-shrink-0 mt-1"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base mb-4">
                      {selectedDocument.title}
                    </h3>

                    <div className="flex gap-3">
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Просмотреть
                      </a>
                      <a
                        href={selectedDocument.url}
                        download={
                          selectedDocument.url.split("/").pop() || "document"
                        }
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Скачать
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p>Документ не найден</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог отклика на вакансию (только для юристов) */}
      {isLawyer && (
        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent className="sm:max-w-[450px] max-w-[90vw] mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
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
                      <FormLabel className="text-sm">
                        Ваше предложение *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишите, как вы можете помочь, и ваш опыт..."
                          className="min-h-[100px] w-full text-sm"
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
                      <FormLabel className="text-sm">Ваш гонорар *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="100000"
                            className="w-full pr-8 text-sm"
                            disabled={respondToVacancy.isPending}
                            {...field}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
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
                  <p className="text-xs sm:text-sm text-blue-700">
                    <span className="font-medium">Клиент предлагает:</span>{" "}
                    {parseFloat(request.fee).toLocaleString()} ₸
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Вы можете предложить свою сумму в поле выше
                  </p>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsResponseDialogOpen(false);
                      responseForm.reset();
                    }}
                    disabled={respondToVacancy.isPending}
                    className="w-full sm:w-auto"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={respondToVacancy.isPending}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
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

// Вспомогательная функция для склонения слова "документ"
function getDocumentWord(count: number): string {
  if (count === 1) return "документ";
  if (count >= 2 && count <= 4) return "документа";
  return "документов";
}

interface LawyerResponseCardProps {
  response: LawyerResponse;
  isBorrower: boolean;
  onAccept: (lawyerId?: number) => void;
  onReject: (lawyerId?: number) => void;
  isPending: boolean;
  showActions: boolean;
}

function LawyerResponseCard({
  response,
  isBorrower,
  onAccept,
  onReject,
  isPending,
  showActions,
}: LawyerResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const handleAcceptClick = () => {
    onAccept(response.lawyer.id);
  };

  const handleRejectClick = () => {
    onReject(response.lawyer.id);
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-[13px] sm:text-[14px] text-[#23272c] truncate">
              {response.lawyer.full_name}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${getStatusColor(response.status)}`}
            >
              {response.status_display}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#68707e] text-[10px] sm:text-[11px] mb-2">
            {response.lawyer.phone && (
              <span className="truncate">📞 {response.lawyer.phone}</span>
            )}
            {response.lawyer.email && (
              <span className="truncate">✉️ {response.lawyer.email}</span>
            )}
            <span className="whitespace-nowrap">
              📅 {formatDate(response.created_at)}
            </span>
          </div>

          <div className="text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[#1f74ec]">
                Гонорар: {parseFloat(response.fee).toLocaleString()} ₸
              </span>
            </div>

            <div className="text-[#68707e]">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#1f74ec] hover:underline text-[10px] sm:text-[11px] font-medium"
              >
                {isExpanded ? "Скрыть комментарий" : "Показать комментарий"}
              </button>

              {isExpanded && (
                <p className="mt-2 p-2 bg-gray-50 rounded text-[10px] sm:text-[11px] italic break-words">
                  {response.comment}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки действий для заемщика */}
        {isBorrower && showActions && response.status === "pending" && (
          <div className="flex flex-row sm:flex-col gap-2 sm:ml-4 w-full sm:w-auto">
            <button
              onClick={handleAcceptClick}
              disabled={isPending}
              className="bg-green-600 rounded-[15px] flex-1 sm:w-[80px] h-[28px] text-white text-[11px] sm:text-[12px] font-bold flex justify-center items-center hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Принять"
              )}
            </button>
            <button
              onClick={handleRejectClick}
              disabled={isPending}
              className="border border-red-600 rounded-[15px] flex-1 sm:w-[80px] h-[28px] text-red-600 text-[11px] sm:text-[12px] font-bold flex justify-center items-center hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Отклонить"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
