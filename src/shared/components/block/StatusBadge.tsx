import React from "react";

interface StatusBadgeProps {
  status: string;
  statusDisplay: string; // Обязательное поле для отображения
}

const statusStyles = {
  NEW: "bg-blue-100 text-blue-800",
  IN_WORK: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
  open: "bg-green-100 text-green-800",
  in_work: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-800",
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusDisplay,
}) => {
  const style =
    statusStyles[status as keyof typeof statusStyles] ||
    "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {statusDisplay}
    </span>
  );
};
