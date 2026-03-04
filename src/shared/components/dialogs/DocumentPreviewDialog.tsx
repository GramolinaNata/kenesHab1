import React from "react";
import { X, FileDown, Loader2, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentTitle: string;
  onDownload?: () => void;
}

export const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentTitle,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  // Определяем тип файла по расширению
  const isPdf = documentUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(documentUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] w-[100vw] h-[100vh] sm:h-auto sm:max-h-[95vh] p-0 m-0 rounded-none sm:rounded-lg overflow-hidden">
        {/* Мобильная шапка */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 sm:hidden flex items-center justify-between p-4">
          <div className="flex items-center gap-2 truncate max-w-[250px]">
            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="font-semibold text-base truncate">
              {documentTitle}
            </span>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full flex-shrink-0"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Десктопная шапка */}
        <DialogHeader className="hidden sm:block px-6 pt-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="truncate">{documentTitle}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Контент */}
        <div className="flex flex-col h-[calc(100vh-64px)] sm:h-auto">
          {/* Панель действий */}
          <div className="flex justify-end p-4 border-b">
            {onDownload && (
              <Button
                variant="default"
                size="sm"
                onClick={onDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FileDown className="h-4 w-4" />
                <span>Скачать</span>
              </Button>
            )}
          </div>

          {/* Превью документа */}
          <div className="relative flex-1 sm:h-[600px] bg-gray-100 overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {isError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Не удалось загрузить документ</p>
                  {onDownload && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDownload}
                      className="mt-4"
                    >
                      Скачать файл
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {isPdf && (
                  <iframe
                    src={documentUrl}
                    className="w-full h-full"
                    title={documentTitle}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}
                {isImage && (
                  <img
                    src={documentUrl}
                    alt={documentTitle}
                    className="w-full h-full object-contain"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}
                {!isPdf && !isImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">
                        Предпросмотр недоступен для этого типа файла
                      </p>
                      {onDownload && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={onDownload}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Скачать файл
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Кнопка закрытия для десктопа */}
        <DialogClose className="hidden sm:block absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
