import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Landmark,
  FileText,
  CreditCard,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useApplicationDetail } from "@/features/application/hooks/useApplication";
import { useApplicationUploadResponse } from "@/features/application/hooks/useApplication";
import { DocumentPreviewDialog } from "@/shared/components/dialogs/DocumentPreviewDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

export default function ApplicationId() {
  const { id } = useParams<{ id: any }>();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const { data: application, isLoading } = useApplicationDetail(id);
  const uploadResponse = useApplicationUploadResponse();

  const isCreditor = userRoles.includes("creditor");
  const isBorrower = userRoles.includes("borrower");

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDocument = (url: string, title: string) => {
    setSelectedDocument({ url, title });
  };

  const handleCloseDocument = () => {
    setSelectedDocument(null);
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !application?.id) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);

      await uploadResponse.mutateAsync({
        id: application.id,
        payload: formData,
      });

      setUploadFile(null);
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "document";
  };

  const formatDate = (dateString: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "IN_WORK":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "IN_WORK":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Заявка не найдена
          </h2>
          <p className="text-gray-500">
            Запрошенная заявка не существует или у вас нет прав доступа
          </p>
        </div>
      </div>
    );
  }

  // Определяем, показывать ли кнопки
  const showSendButton = isBorrower && application.status === "NEW";
  const showUploadButton = isCreditor && application.status === "IN_WORK";

  // Определяем, показывать ли ответ кредитора (для статуса "Завершена")
  const showCreditorResponse =
    application.status === "COMPLETED" && application.creditor_response?.file;

  // Проверяем наличие документов
  const hasDocument = application.document?.file;
  const hasContract = application.contract?.file;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Заявка #{application.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                Создана: {formatDate(application.created_at)}
              </span>
            </div>
          </div>

          {/* Бейдж статуса */}
          <Badge
            className={`px-3 py-1 text-sm ${getStatusColor(application.status)}`}
          >
            <span className="flex items-center gap-1">
              {getStatusIcon(application.status)}
              {application.status_display}
            </span>
          </Badge>

          {/* Кнопки действий */}
          <div className="flex items-center gap-2">
            {showSendButton && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                Отправить
              </Button>
            )}
            {showUploadButton && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="file"
                  id="response-file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="response-file"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  Выбрать файл
                </label>
                {uploadFile && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {uploadFile.name}
                    </span>
                    <Button
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-sm"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Загрузка...
                        </>
                      ) : (
                        "Загрузить"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Две колонки: Кому и От кого */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Кому: Кредитор */}
        <Card>
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Кому: Кредитор
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-blue-100">
                <AvatarImage
                  src={application.creditor?.logo}
                  alt={application.creditor?.name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  {getInitials(application.creditor?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {application.creditor?.name || "Не указано"}
                </h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {application.creditor?.type === "bank"
                    ? "Банк"
                    : "Микрофинансовая организация"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium text-gray-900">
                    {application.creditor?.email || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Телефон</p>
                  <p className="font-medium text-gray-900">
                    {application.creditor?.phone || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Адрес</p>
                  <p className="font-medium text-gray-900">
                    {application.creditor?.address || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Hash className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">БИН/ИИН</p>
                    <p className="font-medium text-gray-900">
                      {application.creditor?.bin_iin || "Не указан"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Landmark className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">БИК</p>
                    <p className="font-medium text-gray-900">
                      {application.creditor?.bik || "Не указан"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 col-span-2">
                  <CreditCard className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">IBAN</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {application.creditor?.iban || "Не указан"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* От кого: Заемщик */}
        <Card>
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              От кого: Заемщик
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-green-100">
                <AvatarFallback className="bg-green-100 text-green-600 font-medium">
                  {getInitials(application.borrower?.full_name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {application.borrower?.full_name || "Не указано"}
                </h3>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium text-gray-900">
                    {application.borrower?.email || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Телефон</p>
                  <p className="font-medium text-gray-900">
                    {application.borrower?.phone || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-500 text-xs">Адрес</p>
                  <p className="font-medium text-gray-900">
                    {application.borrower?.address || "Не указан"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Hash className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">ИИН</p>
                  <p className="font-medium text-gray-900">
                    {application.borrower?.iin || "Не указан"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Данные о заявке */}
      <Card className="mb-6">
        <CardHeader className="pb-3 bg-gray-50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Данные о заявке
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Шаблон</p>
              <p className="font-medium text-gray-900">
                {application.template_name || "Не указан"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Сумма задолженности</p>
              <p className="font-medium text-gray-900">
                {parseFloat(application.amount).toLocaleString("ru-RU")} ₸
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Обстоятельства</p>
              <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-md">
                {application.comment || "Нет комментария"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Документы */}
      <Card>
        <CardHeader className="pb-3 bg-gray-50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Документы
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Сгенерированный документ */}
            {hasDocument && (
              <div
                onClick={() =>
                  handleViewDocument(
                    application.document.file,
                    "Сгенерированный документ",
                  )
                }
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Сгенерированный документ
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.document.template_name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(
                      application.document.file,
                      getFileNameFromUrl(application.document.file),
                    );
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Договор */}
            {hasContract && (
              <div
                onClick={() =>
                  handleViewDocument(application.contract.file, "Договор")
                }
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Договор</p>
                    <p className="text-sm text-gray-500">
                      {application.contract.number
                        ? `№${application.contract.number}${application.contract.date ? ` от ${application.contract.date}` : ""}`
                        : "Договор"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(
                      application.contract.file,
                      getFileNameFromUrl(application.contract.file),
                    );
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Ответ кредитора (только для завершенных заявок) */}
            {showCreditorResponse && (
              <div
                onClick={() =>
                  handleViewDocument(
                    application.creditor_response.file,
                    "Ответ кредитора",
                  )
                }
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Ответ кредитора</p>
                    <p className="text-sm text-purple-600">Файл ответа</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(
                      application.creditor_response.file,
                      getFileNameFromUrl(application.creditor_response.file),
                    );
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Если нет документов */}
            {!hasDocument && !hasContract && !showCreditorResponse && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Нет доступных документов</p>
                <p className="text-sm text-gray-400 mt-1">
                  Документы появятся после обработки заявки
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Диалог предпросмотра документа */}
      {selectedDocument && (
        <DocumentPreviewDialog
          isOpen={!!selectedDocument}
          onClose={handleCloseDocument}
          documentUrl={selectedDocument.url}
          documentTitle={selectedDocument.title}
          onDownload={() =>
            handleDownloadDocument(
              selectedDocument.url,
              getFileNameFromUrl(selectedDocument.url),
            )
          }
        />
      )}
    </div>
  );
}
