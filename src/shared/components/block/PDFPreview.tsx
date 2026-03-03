import React, { useEffect, useState } from "react";
import { FileText, FileDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface PDFPreviewProps {
  pdfBlob: any | null;
  fileName: string;
  onClose?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  pdfBlob,
  fileName,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pdfBlob) {
      setIsOpen(true);
      setIsLoading(true);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setIsLoading(false);

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
    onClose?.();
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

  if (!pdfBlob || !pdfUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[900px] w-[95vw] max-h-[95vh] p-4 sm:p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-full px-1">
              {fileName}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial"
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Печать</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-initial"
              >
                <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Скачать PDF</span>
              </Button>
            </div>
          </div>

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
