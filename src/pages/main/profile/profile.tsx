import { useState, useEffect } from "react";
import {
  useProfile,
  useUpdateProfile,
} from "@/features/profile/hook/useProfile";
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
  MapPin,
  Globe,
  Edit2,
  Save,
  X,
  Briefcase,
  Hash,
  Landmark,
  UserCircle,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";

type UserRole = "borrower" | "creditor";

interface EditFormData {
  // Общие поля
  name?: string;
  email?: string;
  phone?: string;
  address?: string;

  // Поля для borrower
  full_name?: string;
  iin?: string;
  preferred_lang?: string;

  // Поля для creditor
  bin_iin?: string;
  bik?: string;
  iban?: string;
  contact_person?: string;
  type?: string;
}

export default function Profile() {
  const { data: userProfile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});

  // Определяем роль пользователя
  const userRole: UserRole = userProfile?.user?.roles?.includes("creditor")
    ? "creditor"
    : "borrower";

  // Инициализация формы при загрузке данных
  useEffect(() => {
    if (userProfile?.profile) {
      if (userRole === "borrower") {
        setEditForm({
          full_name: userProfile.profile.full_name || "",
          iin: userProfile.profile.iin || "",
          address: userProfile.profile.address || "",
          preferred_lang: userProfile.profile.preferred_lang || "ru",
        });
      } else {
        setEditForm({
          name: userProfile.profile.name || "",
          bin_iin: userProfile.profile.bin_iin || "",
          bik: userProfile.profile.bik || "",
          iban: userProfile.profile.iban || "",
          address: userProfile.profile.address || "",
          contact_person: userProfile.profile.contact_person || "",
          type: userProfile.profile.type || "mfo",
        });
      }
    }
  }, [userProfile, userRole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editForm);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleCancel = () => {
    if (userProfile?.profile) {
      if (userRole === "borrower") {
        setEditForm({
          full_name: userProfile.profile.full_name || "",
          iin: userProfile.profile.iin || "",
          address: userProfile.profile.address || "",
          preferred_lang: userProfile.profile.preferred_lang || "ru",
        });
      } else {
        setEditForm({
          name: userProfile.profile.name || "",
          bin_iin: userProfile.profile.bin_iin || "",
          bik: userProfile.profile.bik || "",
          iban: userProfile.profile.iban || "",
          address: userProfile.profile.address || "",
          contact_person: userProfile.profile.contact_person || "",
          type: userProfile.profile.type || "mfo",
        });
      }
    }
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case "borrower":
        return <Badge variant="secondary">Заемщик</Badge>;
      case "creditor":
        return <Badge variant="default">Кредитор</Badge>;
      default:
        return null;
    }
  };

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

  const user = userProfile?.user;
  const profile = userProfile?.profile;

  // Форматирование даты регистрации
  const registrationDate = "12/12/28"; // Замените на реальное поле, когда появится в API

  // Форматирование телефона
  const formatPhone = (phone: string) => {
    if (!phone) return "Не указан";
    return phone.replace(
      /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5",
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Заголовок с основной информацией */}
      <div className="mb-10 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                userRole === "borrower" ? (
                  <Input
                    name="full_name"
                    value={editForm.full_name || ""}
                    onChange={handleInputChange}
                    placeholder="Введите ФИО"
                    className="text-2xl font-bold h-auto py-1 px-2"
                  />
                ) : (
                  <Input
                    name="name"
                    value={editForm.name || ""}
                    onChange={handleInputChange}
                    placeholder="Введите название организации"
                    className="text-2xl font-bold h-auto py-1 px-2"
                  />
                )
              ) : userRole === "borrower" ? (
                profile?.full_name || user?.first_name || "ФИО не указано"
              ) : (
                profile?.name || "Название организации не указано"
              )}
            </h1>
            {getRoleBadge()}
          </div>

          <div className="text-lg text-gray-600 font-medium">
            {isEditing ? (
              userRole === "borrower" ? (
                <Input
                  name="iin"
                  value={editForm.iin || ""}
                  onChange={handleInputChange}
                  placeholder="Введите ИИН"
                  className="text-lg h-auto py-1 px-2"
                  maxLength={12}
                />
              ) : (
                <Input
                  name="bin_iin"
                  value={editForm.bin_iin || ""}
                  onChange={handleInputChange}
                  placeholder="Введите БИН/ИИН"
                  className="text-lg h-auto py-1 px-2"
                  maxLength={12}
                />
              )
            ) : userRole === "borrower" ? (
              profile?.iin || "ИИН не указан"
            ) : (
              profile?.bin_iin || "БИН/ИИН не указан"
            )}
          </div>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Редактировать
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              disabled={updateProfile.isPending}
            >
              <Save className="h-4 w-4" />
              {updateProfile.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={updateProfile.isPending}
            >
              <X className="h-4 w-4" />
              Отмена
            </Button>
          </div>
        )}
      </div>

      {/* Раздел: Основная информация */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          {userRole === "borrower"
            ? "Личные данные"
            : "Информация об организации"}
        </h2>

        <div className="space-y-5">
          {/* Общие поля для всех типов */}
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {userRole === "borrower" ? "ФИО" : "Наименование организации"}
            </div>
            <div className="text-lg font-medium text-gray-900">
              {userRole === "borrower"
                ? profile?.full_name || user?.first_name || "ФИО не указано"
                : profile?.name || "Название не указано"}
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
                {formatPhone(profile?.phone || user?.username || "")}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              ЭЛЕКТРОННАЯ ПОЧТА
            </div>
            <div className="text-lg font-medium text-gray-900">
              {profile?.email || user?.email || "Почта не указана"}
            </div>
          </div>

          {/* Специфические поля для кредитора */}
          {userRole === "creditor" && (
            <>
              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  ТИП ОРГАНИЗАЦИИ
                </div>
                {isEditing ? (
                  <Select
                    value={editForm.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mfo">
                        Микрофинансовая организация
                      </SelectItem>
                      <SelectItem value="bank">Банк</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {profile?.type === "mfo" && "Микрофинансовая организация"}
                    {profile?.type === "bank" && "Банк"}
                    {profile?.type === "other" && "Другое"}
                    {!profile?.type && "Не указан"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  БИК
                </div>
                {isEditing ? (
                  <Input
                    name="bik"
                    value={editForm.bik || ""}
                    onChange={handleInputChange}
                    placeholder="Введите БИК"
                    className="text-lg"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {profile?.bik || "БИК не указан"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  IBAN
                </div>
                {isEditing ? (
                  <Input
                    name="iban"
                    value={editForm.iban || ""}
                    onChange={handleInputChange}
                    placeholder="Введите IBAN"
                    className="text-lg"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {profile?.iban || "IBAN не указан"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  КОНТАКТНОЕ ЛИЦО
                </div>
                {isEditing ? (
                  <Input
                    name="contact_person"
                    value={editForm.contact_person || ""}
                    onChange={handleInputChange}
                    placeholder="Введите ФИО контактного лица"
                    className="text-lg"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {profile?.contact_person || "Не указано"}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Адрес (общее поле) */}
          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              АДРЕС
            </div>
            {isEditing ? (
              <Input
                name="address"
                value={editForm.address || ""}
                onChange={handleInputChange}
                placeholder="Введите адрес"
                className="text-lg"
              />
            ) : (
              <div className="text-lg font-medium text-gray-900">
                {profile?.address || "Адрес не указан"}
              </div>
            )}
          </div>

          {/* Предпочитаемый язык (только для borrower) */}
          {userRole === "borrower" && (
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                ПРЕДПОЧИТАЕМЫЙ ЯЗЫК
              </div>
              {isEditing ? (
                <Select
                  value={editForm.preferred_lang}
                  onValueChange={(value) =>
                    handleSelectChange("preferred_lang", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите язык" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="kk">Қазақша</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-lg font-medium text-gray-900">
                  {profile?.preferred_lang === "ru" && "Русский"}
                  {profile?.preferred_lang === "kk" && "Қазақша"}
                  {profile?.preferred_lang === "en" && "English"}
                  {!profile?.preferred_lang && "Не указан"}
                </div>
              )}
            </div>
          )}
        </div>

        <Separator className="my-8" />
      </div>

      {/* Раздел: Документ (только для borrower) */}
      {userRole === "borrower" && (
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
              <div className="text-lg font-medium text-gray-900 text-red-500">
                Не указано
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                <Building className="h-4 w-4" />
                ОРГАН ВЫДАЧИ ДОКУМЕНТА
              </div>
              <div className="text-lg font-medium text-gray-900 text-red-500">
                Не указано
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  ДОКУМЕНТ ВЫДАН ОТ
                </div>
                <div className="text-lg font-medium text-gray-900 text-red-500">
                  Не указано
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">
                  ДОКУМЕНТ ВЫДАН ДО
                </div>
                <div className="text-lg font-medium text-gray-900 text-red-500">
                  Не указано
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
        </div>
      )}

      {/* Раздел: Контакт и платеж (общий) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Контактная информация
        </h2>

        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              МОБИЛЬНЫЙ ТЕЛЕФОН
            </div>
            <div className="text-lg font-medium text-gray-900">
              {formatPhone(profile?.phone || user?.username || "")}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              АДРЕС ПОЧТЫ
            </div>
            <div className="text-lg font-medium text-gray-900">
              {profile?.email || user?.email || "Почта не указана"}
            </div>
          </div>

          {/* Дополнительные поля для кредитора в этом разделе */}
          {userRole === "creditor" && (
            <>
              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  IBAN СЧЕТ
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile?.iban || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  БИК
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile?.bik || "-"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
