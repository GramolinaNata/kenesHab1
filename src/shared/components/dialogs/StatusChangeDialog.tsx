import React from "react";
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
import { STATUS_OPTIONS } from "@/features/application/constants/application";

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  statusChangeData: any;
  setApplicationStatus: any;
  onConfirm: () => void;
}

export const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  isOpen,
  onClose,
  statusChangeData,
  setApplicationStatus,
  onConfirm,
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
