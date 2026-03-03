import React from "react";
import { CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { STATUS_OPTIONS } from "@/features/application/constants/application";

interface StatusDropdownProps {
  currentStatus: string;
  applicationId: number;
  onStatusChange: (id: number, status: string) => void;
  isPending: boolean;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  applicationId,
  onStatusChange,
  isPending,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <StatusBadge status={currentStatus} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => onStatusChange(applicationId, status.value)}
            disabled={status.value === currentStatus || isPending}
            className="flex items-center gap-2"
          >
            {status.value === currentStatus && (
              <CheckCircle className="h-4 w-4" />
            )}
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
