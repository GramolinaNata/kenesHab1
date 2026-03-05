import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";

interface StatusDropdownProps {
  currentStatus: string;
  currentStatusDisplay: string; // Обязательное поле для отображения статуса
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  currentStatusDisplay,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <StatusBadge
            status={currentStatus}
            statusDisplay={currentStatusDisplay}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start"></DropdownMenuContent>
    </DropdownMenu>
  );
};
