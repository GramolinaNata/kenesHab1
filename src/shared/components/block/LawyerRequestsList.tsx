import { useVacancies } from "@/features/application/hooks/useApplication";
import LawyerRequestsCard from "./LawyerRequestsCard";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LawyerRequestsList() {
  const {
    data: vacancies,
    isLoading,
    isError,
    error,
    refetch,
  } = useVacancies();

  if (isLoading) {
    return (
      <div className="w-full py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1f74ec]" />
        <span className="ml-2 text-gray-500">Загрузка обращений...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center bg-red-50 rounded-xl">
        <AlertCircle className="h-12 w-12 text-red-400 mb-2" />
        <p className="text-red-600 font-medium">Ошибка при загрузке</p>
        <p className="text-sm text-red-400 mt-1">
          {error?.message || "Попробуйте позже"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!vacancies?.results || vacancies.results.length === 0) {
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center bg-gray-50 rounded-xl">
        <AlertCircle className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500">Нет обращений к юристу</p>
        <p className="text-sm text-gray-400 mt-1">
          Создайте обращение через форму выше
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vacancies.results.map((request: any) => (
        <LawyerRequestsCard
          key={request.id}
          request={request}
          onStatusChange={() => refetch()}
        />
      ))}
    </div>
  );
}
