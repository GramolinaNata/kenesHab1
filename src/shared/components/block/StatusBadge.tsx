import React from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { ApplicationStatus } from "@/features/application/types/application";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "NEW":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Clock className="w-3 h-3 mr-1" />
          Новая
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <AlertCircle className="w-3 h-3 mr-1" />В работе
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Завершена
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
