import React, { useState, useRef } from "react";
import {
  MoreVertical,
  Edit,
  FileText,
  Mail,
  Trash2,
  Eye,
  FileDown,
  File,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { StatusDropdown } from "./StatusDropdown";
import {
  formatDate,
  getCreditorName,
} from "@/features/application/utils/application";
import { useApplicationDetail } from "@/features/application/hooks/useApplication";
import { useApplicationUploadResponse } from "@/features/application/hooks/useApplication";
import { DocumentPreviewDialog } from "@/shared/components/dialogs/DocumentPreviewDialog";

interface ApplicationCardProps {
  application: any;
  onEdit: (app: any) => void;
  onDelete: (app: any) => void;
  onGenerateDocument: (app: any) => void;
  onSendEmail: (app: any) => void;
  onStatusChange: (id: number, status: string) => void;
  isStatusPending: boolean;
  isGeneratePending: boolean;
  isEmailPending: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onGenerateDocument,
  onSendEmail,
  onStatusChange,
  isStatusPending,
  isGeneratePending,
  isEmailPending,
}) => {
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загружаем детальную информацию о заявке при открытии диалога
  const { data: applicationDetail, isLoading: isLoadingDetail } =
    useApplicationDetail(isDocumentsDialogOpen ? application.id : undefined);

  const uploadResponse = useApplicationUploadResponse();

  const handleViewDocument = (url: string, title: string) => {
    setSelectedDocument({ url, title });
    setIsDocumentsDialogOpen(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      await uploadResponse.mutateAsync({
        id: application.id,
        payload: formData,
      });

      // Закрываем диалог после успешной загрузки
      setIsDocumentsDialogOpen(false);
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Получаем имя файла из URL
  const getFileNameFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "document";
  };

  // Проверяем наличие документов
  const hasDocuments =
    applicationDetail &&
    (applicationDetail.document?.file ||
      applicationDetail.contract?.file ||
      applicationDetail.creditor_response?.file ||
      (applicationDetail.documents && applicationDetail.documents.length > 0) ||
      (applicationDetail.contracts && applicationDetail.contracts.length > 0) ||
      (applicationDetail.creditor_responses &&
        applicationDetail.creditor_responses.length > 0));

  // Собираем все документы в один массив для удобного отображения
  const getAllDocuments = () => {
    const docs = [];

    // Сгенерированный документ
    if (applicationDetail?.document?.file) {
      docs.push({
        id: `doc-main-${applicationDetail.document.id}`,
        url: applicationDetail.document.file,
        title: "Генерированный документ",
        subtitle: applicationDetail.document.template_name,
        icon: <FileText className="h-5 w-5 text-blue-600" />,
        type: "generated",
        signed: applicationDetail.document.signed,
      });
    }

    // Массив documents
    if (applicationDetail?.documents) {
      applicationDetail.documents.forEach((doc: any, index: number) => {
        docs.push({
          id: `doc-${doc.id || index}`,
          url: doc.file,
          title: doc.template_name || `Документ ${index + 1}`,
          subtitle: doc.signed ? "✓ Подписан" : null,
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          type: "document",
          signed: doc.signed,
        });
      });
    }

    // Договор заемщика
    if (applicationDetail?.contract?.file) {
      docs.push({
        id: `contract-main-${applicationDetail.contract.id}`,
        url: applicationDetail.contract.file,
        title: "Договор заемщика",
        subtitle: applicationDetail.contract.number
          ? `№${applicationDetail.contract.number}${applicationDetail.contract.date ? ` от ${applicationDetail.contract.date}` : ""}`
          : null,
        icon: <File className="h-5 w-5 text-green-600" />,
        type: "contract",
      });
    }

    // Массив contracts
    if (applicationDetail?.contracts) {
      applicationDetail.contracts.forEach((contract: any, index: number) => {
        docs.push({
          id: `contract-${contract.id || index}`,
          url: contract.file,
          title: contract.number
            ? `Договор №${contract.number}`
            : `Договор ${index + 1}`,
          subtitle: contract.date ? `от ${contract.date}` : null,
          icon: <File className="h-5 w-5 text-green-600" />,
          type: "contract",
        });
      });
    }

    // Ответ кредитора
    if (applicationDetail?.creditor_response?.file) {
      docs.push({
        id: `response-main`,
        url: applicationDetail.creditor_response.file,
        title: "Ответ кредитора",
        subtitle: null,
        icon: <FileText className="h-5 w-5 text-purple-600" />,
        type: "response",
      });
    }

    // Массив creditor_responses
    if (applicationDetail?.creditor_responses) {
      applicationDetail.creditor_responses.forEach(
        (response: any, index: number) => {
          docs.push({
            id: `response-${index}`,
            url: response.file,
            title: `Ответ кредитора ${index + 1}`,
            subtitle: null,
            icon: <FileText className="h-5 w-5 text-purple-600" />,
            type: "response",
          });
        },
      );
    }

    return docs;
  };

  const documents = getAllDocuments();

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                Заявка #{application.id.slice(0, 8)}
              </h3>
              <StatusDropdown
                currentStatus={application.status}
                applicationId={application.id}
                onStatusChange={onStatusChange}
                isPending={isStatusPending}
              />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span className="font-medium">Кредитор:</span>
                {getCreditorName(application.creditor)}
              </p>
              <p className="flex items-center gap-1">
                <span className="font-medium">Сумма:</span>
                {parseFloat(application.amount).toLocaleString("ru-RU")} ₸
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => onEdit(application)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setIsDocumentsDialogOpen(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>Просмотр документов</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onGenerateDocument(application)}
                className="flex items-center gap-2 cursor-pointer"
                disabled={isGeneratePending}
              >
                <FileText className="h-4 w-4" />
                Сгенерировать документ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSendEmail(application)}
                className="flex items-center gap-2 cursor-pointer"
                disabled={isGeneratePending || isEmailPending}
              >
                <Mail className="h-4 w-4" />
                Отправить на email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(application)}
                className="flex items-center gap-2 cursor-pointer text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Диалог со списком документов */}
      <Dialog
        open={isDocumentsDialogOpen}
        onOpenChange={setIsDocumentsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] w-[100vw] h-[100vh] sm:h-auto sm:max-h-[90vh] p-0 m-0 rounded-none sm:rounded-lg overflow-hidden">
          {/* Мобильная шапка */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 sm:hidden flex items-center justify-between p-4">
            <DialogTitle className="text-lg font-semibold">
              Документы заявки
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>

          {/* Десктопная шапка */}
          <DialogHeader className="hidden sm:block px-6 pt-6">
            <DialogTitle className="text-xl font-semibold">
              Документы заявки #{application.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>

          {/* Список документов */}
          <div className="overflow-y-auto h-[calc(100vh-64px)] sm:h-auto sm:max-h-[calc(90vh-180px)] p-4 sm:p-6">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !hasDocuments ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Нет доступных документов</p>
                <p className="text-sm text-gray-400 mt-1">
                  Документы появятся после создания заявки
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleViewDocument(doc.url, doc.title)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  >
                    <div className="flex-shrink-0">{doc.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {doc.title}
                      </p>
                      {doc.subtitle && (
                        <p className="text-sm text-gray-500 truncate">
                          {doc.subtitle}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDocument(
                          doc.url,
                          getFileNameFromUrl(doc.url),
                        );
                      }}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Нижняя панель с кнопкой загрузки ответа кредитора */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Загрузить ответ кредитора
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};
