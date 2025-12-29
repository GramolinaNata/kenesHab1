import { useProfile } from "@/features/profile/hook/useProfile";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Building,
  CreditCard,
  IdCard,
  Smartphone,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";

export default function Profile() {
  const { data: userProfile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-48" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Форматирование даты регистрации (пример - используйте реальную дату из API если есть)
  const registrationDate = "12/12/28"; // Замените на userProfile?.created_at или аналогичное поле

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Заголовок с ИИН */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {userProfile?.borrower?.full_name || "ФИО не указано"}
        </h1>
        <div className="text-lg text-gray-600 font-medium">
          {userProfile?.borrower?.iin || "9711145263256"}
        </div>
      </div>

      {/* Раздел: Личные данные */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Личные данные
        </h2>

        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-1">ФИО</div>
            <div className="text-lg font-medium text-gray-900">
              {userProfile?.borrower?.full_name || "Безотходы Инкумарихан"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                ДАТА РЕГИСТРАЦИИ
              </div>
              <div className="text-lg font-medium text-gray-900">
                {registrationDate}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                НОМЕР ТЕЛЕФОНА
              </div>
              <div className="text-lg font-medium text-gray-900">
                {userProfile?.borrower?.phone
                  ? userProfile.borrower.phone.replace(
                      /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
                      "$1 $2 $3 $4 $5"
                    )
                  : "8 747 875 39 18"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              ПОЧТА
            </div>
            <div className="text-lg font-medium text-gray-900">
              {userProfile?.borrower?.email || "emily.janson@example.com"}
            </div>
          </div>
        </div>

        <Separator className="my-8" />
      </div>

      {/* Раздел: Документ */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Документ
        </h2>

        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              ТИП ДОКУМЕНТА
            </div>
            <div className="text-lg font-medium text-gray-900">
              Удостоверение личности
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">НОМЕР ДОКУМЕНТА</div>
            <div className="text-lg font-medium text-gray-900">043066162</div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Building className="h-4 w-4" />
              ОРГАН ВЫДАЧИ ДОКУМЕНТА
            </div>
            <div className="text-lg font-medium text-gray-900">МВД</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                ДОКУМЕНТ ВЫДАН ОТ
              </div>
              <div className="text-lg font-medium text-gray-900">
                13.12.2016
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">
                ДОКУМЕНТ ВЫДАН ДО
              </div>
              <div className="text-lg font-medium text-gray-900">
                13.12.2026
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
      </div>

      {/* Раздел: Контакт и платеж */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Контакт и платеж
        </h2>

        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              МОБИЛЬНЫЙ ТЕЛЕФОН
            </div>
            <div className="text-lg font-medium text-gray-900">
              {userProfile?.borrower?.phone
                ? userProfile.borrower.phone.replace(
                    /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
                    "$1 $2 $3 $4 $5"
                  )
                : "8 747 875 39 18"}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              АДРЕС ПОЧТЫ
            </div>
            <div className="text-lg font-medium text-gray-900">
              {userProfile?.borrower?.email || "libelekid@gmail.com"}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              ВАШ СЧЕТ IBAN
            </div>
            <div className="text-lg font-medium text-gray-900 text-red-500">
              -
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              БАНКОВСКАЯ КАРТА (КОМИССИЯ 1,9%)
            </div>
            <div className="text-lg font-medium text-gray-900 text-red-500">
              -
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
