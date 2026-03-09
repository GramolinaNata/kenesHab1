import { useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Download,
  FileSignature,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
} from "lucide-react";
import { useProposals } from "@/features/application/hooks/useApplication";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

interface Proposal {
  id: number;
  vacancy: {
    id: number;
    status: string;
    status_display_ru: string;
    comment: string;
    fee: string;
    created_at: string;
  };
  lawyer: number;
  application?: {
    id: string;
    document?: {
      id: number;
      template: number;
      file: string;
      template_name: string;
      signed: boolean;
      created_at: string;
    } | null;
    contract?: {
      id: number;
      number: string;
      date: string;
      file: string;
      created_at: string;
    } | null;
    creditor_response?: {
      file: string;
    } | null;
  };
  borrower: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    iin: string;
    address: string;
    preferred_lang: string;
    created_at: string;
  };
  fee: string;
  comment: string;
  status: string;
  created_at: string;
}

export default function Lawyer() {
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
    type: "document" | "contract" | "response";
  } | null>(null);

  const [selectedBorrower, setSelectedBorrower] = useState<
    Proposal["borrower"] | null
  >(null);
  const [isBorrowerDialogOpen, setIsBorrowerDialogOpen] = useState(false);

  const { data: proposalsData, isLoading } = useProposals();

  // Получаем массив результатов из ответа
  const proposals = proposalsData?.results || [];

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "На рассмотрении";
      case "accepted":
        return "Принято";
      case "rejected":
        return "Отклонено";
      default:
        return status;
    }
  };

  const handleViewDocument = (
    url: string,
    title: string,
    type: "document" | "contract" | "response",
  ) => {
    setSelectedDocument({ url, title, type });
  };

  const handleCloseDocument = () => {
    setSelectedDocument(null);
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewBorrower = (borrower: Proposal["borrower"]) => {
    setSelectedBorrower(borrower);
    setIsBorrowerDialogOpen(true);
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "document";
    const parts = url.split("/");
    return parts[parts.length - 1] || "document";
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Проверяем, есть ли документы для отображения
  const hasDocuments = (proposal: Proposal) => {
    return (
      proposal.application?.document ||
      proposal.application?.contract ||
      proposal.application?.creditor_response
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Мои предложения
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Мои предложения
        </h1>

        {proposals.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Нет предложений
                </h3>
                <p className="text-gray-500">
                  У вас пока нет отправленных предложений
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal: Proposal) => (
              <Card
                key={proposal.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3 bg-gray-50 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Предложение #{proposal.id}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          от {formatShortDate(proposal.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 text-sm ${getStatusColor(proposal.status)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(proposal.status)}
                        {getStatusText(proposal.status)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Левая колонка - информация о заявке */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Информация о вакансии */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Информация об обращении
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Статус обращения:
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {proposal.vacancy?.status_display_ru ||
                                "Не указан"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Гонорар клиента:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {proposal.vacancy?.fee
                                ? parseFloat(
                                    proposal.vacancy.fee,
                                  ).toLocaleString()
                                : "0"}{" "}
                              ₸
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Ваш гонорар:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {proposal.fee
                                ? parseFloat(proposal.fee).toLocaleString()
                                : "0"}{" "}
                              ₸
                            </span>
                          </div>
                          {proposal.vacancy?.comment && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">
                                  Комментарий клиента:
                                </span>{" "}
                                {proposal.vacancy.comment}
                              </p>
                            </div>
                          )}
                          {proposal.comment && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">
                                  Ваш комментарий:
                                </span>{" "}
                                {proposal.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Документы */}
                      {hasDocuments(proposal) && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            Документы
                          </h3>
                          <div className="space-y-2">
                            {/* Документ заявки */}
                            {proposal.application?.document && (
                              <button
                                onClick={() =>
                                  proposal.application?.document &&
                                  handleViewDocument(
                                    proposal.application.document.file,
                                    proposal.application.document.template_name,
                                    "document",
                                  )
                                }
                                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <FileSignature className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {
                                        proposal.application.document
                                          .template_name
                                      }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Загружен{" "}
                                      {formatShortDate(
                                        proposal.application.document
                                          .created_at,
                                      )}
                                      {proposal.application.document.signed &&
                                        " • Подписан"}
                                    </p>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
                              </button>
                            )}

                            {/* Договор */}
                            {proposal.application?.contract && (
                              <button
                                onClick={() =>
                                  proposal.application?.contract &&
                                  handleViewDocument(
                                    proposal.application.contract.file,
                                    `Договор ${proposal.application.contract.number ? `№${proposal.application.contract.number}` : ""}`,
                                    "contract",
                                  )
                                }
                                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                    <FileText className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      Договор{" "}
                                      {proposal.application.contract.number
                                        ? `№${proposal.application.contract.number}`
                                        : ""}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      от{" "}
                                      {formatShortDate(
                                        proposal.application.contract.date,
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-600 flex-shrink-0 ml-2" />
                              </button>
                            )}

                            {/* Ответ кредитора */}
                            {proposal.application?.creditor_response && (
                              <button
                                onClick={() =>
                                  proposal.application?.creditor_response &&
                                  handleViewDocument(
                                    proposal.application.creditor_response.file,
                                    "Ответ кредитора",
                                    "response",
                                  )
                                }
                                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <FileText className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      Ответ кредитора
                                    </p>
                                    <p className="text-xs text-purple-600">
                                      Файл ответа
                                    </p>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0 ml-2" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Правая колонка - информация о заемщике */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          Заемщик
                        </h3>

                        <div className="space-y-3">
                          <button
                            onClick={() =>
                              handleViewBorrower(proposal.borrower)
                            }
                            className="w-full text-left hover:bg-white p-2 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-green-100">
                                <AvatarFallback className="bg-green-100 text-green-600 font-medium text-sm">
                                  {getInitials(
                                    proposal.borrower?.full_name || "",
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                  {proposal.borrower?.full_name || "Не указано"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {proposal.borrower?.email || "Нет email"}
                                </p>
                              </div>
                            </div>
                          </button>

                          <div className="space-y-2 text-sm">
                            {proposal.borrower?.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs truncate">
                                  {proposal.borrower.phone}
                                </span>
                              </div>
                            )}
                            {proposal.borrower?.iin && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs">
                                  {proposal.borrower.iin}
                                </span>
                              </div>
                            )}
                            {proposal.borrower?.address && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs truncate">
                                  {proposal.borrower.address}
                                </span>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() =>
                              proposal.borrower &&
                              handleViewBorrower(proposal.borrower)
                            }
                          >
                            <User className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Диалог просмотра документа */}
      <Dialog open={!!selectedDocument} onOpenChange={handleCloseDocument}>
        <DialogContent className="sm:max-w-[600px] max-w-[90vw] mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              {selectedDocument?.type === "document" && (
                <FileSignature className="h-5 w-5 text-blue-600" />
              )}
              {selectedDocument?.type === "contract" && (
                <FileText className="h-5 w-5 text-green-600" />
              )}
              {selectedDocument?.type === "response" && (
                <FileText className="h-5 w-5 text-purple-600" />
              )}
              {selectedDocument?.title || "Документ"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDocument ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  {selectedDocument.type === "document" && (
                    <FileSignature
                      size={24}
                      className="text-blue-600 flex-shrink-0 mt-1"
                    />
                  )}
                  {selectedDocument.type === "contract" && (
                    <FileText
                      size={24}
                      className="text-green-600 flex-shrink-0 mt-1"
                    />
                  )}
                  {selectedDocument.type === "response" && (
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
                      <Button
                        onClick={() =>
                          handleDownloadDocument(
                            selectedDocument.url,
                            getFileNameFromUrl(selectedDocument.url),
                          )
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Скачать
                      </Button>
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

      {/* Диалог с информацией о заемщике */}
      <Dialog
        open={isBorrowerDialogOpen}
        onOpenChange={setIsBorrowerDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] max-w-[90vw] mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Информация о заемщике
            </DialogTitle>
          </DialogHeader>

          {selectedBorrower && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16 border-2 border-green-100">
                  <AvatarFallback className="bg-green-100 text-green-600 font-medium text-xl">
                    {getInitials(selectedBorrower.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedBorrower.full_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {selectedBorrower.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {selectedBorrower.email && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBorrower.email}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBorrower.phone && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Телефон</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBorrower.phone}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBorrower.iin && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">ИИН</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBorrower.iin}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBorrower.address && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Адрес</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBorrower.address}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Дата регистрации</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatShortDate(selectedBorrower.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Предпочитаемый язык</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBorrower.preferred_lang === "ru"
                        ? "Русский"
                        : selectedBorrower.preferred_lang === "kk"
                          ? "Қазақша"
                          : selectedBorrower.preferred_lang || "Не указан"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
