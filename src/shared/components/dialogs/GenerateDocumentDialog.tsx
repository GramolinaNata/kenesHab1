import React from "react";
import { Loader2, FileText } from "lucide-react";
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

interface GenerateDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  generateDocument: any;
  onGenerate: (id: number) => void;
}

export const GenerateDocumentDialog: React.FC<GenerateDocumentDialogProps> = ({
  isOpen,
  onClose,
  selectedApplication,
  generateDocument,
  onGenerate,
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
