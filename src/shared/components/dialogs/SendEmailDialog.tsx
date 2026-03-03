import React from "react";
import { Loader2, Mail } from "lucide-react";
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

interface SendEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  generateDocument: any;
  sendOtp: any;
  emailProcessStep: string;
  onStart: (id: number) => void;
}

export const SendEmailDialog: React.FC<SendEmailDialogProps> = ({
  isOpen,
  onClose,
  selectedApplication,
  generateDocument,
  sendOtp,
  emailProcessStep,
  onStart,
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
