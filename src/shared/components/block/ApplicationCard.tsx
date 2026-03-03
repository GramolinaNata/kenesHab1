import React from "react";
import { MoreVertical, Edit, FileText, Mail, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { StatusDropdown } from "./StatusDropdown";
import {
  formatDate,
  getCreditorName,
} from "@/features/application/utils/application";

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
  return (
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(application)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              Редактировать
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
  );
};
