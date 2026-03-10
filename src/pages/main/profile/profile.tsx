import { useState, useEffect, useRef } from "react";
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
  Briefcase,
  Hash,
  Landmark,
  UserCircle,
  Camera,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

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

  // Поле для логотипа (будет отправляться как FormData)
  logo?: File;
}

export default function Profile() {
  const { data: userProfile, isLoading, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        });
      }
    }
    setIsEditing(false);
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsLogoUploading(true);
    try {
      // Используем тот же хук updateProfile для загрузки логотипа
      await updateProfile.mutateAsync({ logo: file });
      await refetch();
    } catch (error) {
    } finally {
      setIsLogoUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

  const getInitials = () => {
    if (userRole === "borrower") {
      const fullName =
        userProfile?.profile?.full_name || userProfile?.user?.first_name || "";
      return fullName
        .split(" ")
        .map((word: any) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else {
      const name = userProfile?.profile?.name || "";
      return name
        .split(" ")
        .map((word: any) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  };

  // Форматирование даты из ISO в локальный формат
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "Не указано";
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
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
      {/* Аватар/Логотип */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={profile?.logo || profile?.avatar_url}
              alt="Avatar"
              className="object-cover"
            />
            <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Кнопки управления для кредитора */}
          {userRole === "creditor" && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-8 w-8 p-0 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLogoUploading || updateProfile.isPending}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Скрытый input для загрузки файла */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleLogoUpload}
        />

        {userRole === "creditor" && (
          <p className="text-sm text-gray-500 mt-4">
            {profile?.logo
              ? "Нажмите на камеру чтобы изменить логотип"
              : "Добавьте логотип организации"}
          </p>
        )}
      </div>

      {/* Заголовок с основной информацией */}
      <div className="mb-10 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === "borrower"
                ? profile?.full_name || user?.first_name || "ФИО не указано"
                : profile?.name || "Название организации не указано"}
            </h1>
            {getRoleBadge()}
          </div>

          <div className="text-lg text-gray-600 font-medium">
            {userRole === "borrower"
              ? profile?.iin || "ИИН не указан"
              : profile?.bin_iin || "БИН/ИИН не указан"}
          </div>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Редактировать
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {userRole === "borrower"
                  ? "Редактирование профиля"
                  : "Редактирование организации"}
              </DialogTitle>
              <DialogDescription>
                {userRole === "borrower"
                  ? "Измените ваши личные данные ниже"
                  : "Измените информацию об организации ниже"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Основная информация */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Основная информация</h3>

                {userRole === "borrower" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ФИО</label>
                      <Input
                        name="full_name"
                        value={editForm.full_name || ""}
                        onChange={handleInputChange}
                        placeholder="Введите ФИО"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">ИИН</label>
                      <Input
                        name="iin"
                        value={editForm.iin || ""}
                        onChange={handleInputChange}
                        placeholder="Введите ИИН"
                        maxLength={12}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Название организации
                      </label>
                      <Input
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleInputChange}
                        placeholder="Введите название организации"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">БИН/ИИН</label>
                      <Input
                        name="bin_iin"
                        value={editForm.bin_iin || ""}
                        onChange={handleInputChange}
                        placeholder="Введите БИН/ИИН"
                        maxLength={12}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Адрес</label>
                  <Input
                    name="address"
                    value={editForm.address || ""}
                    onChange={handleInputChange}
                    placeholder="Введите адрес"
                  />
                </div>
              </div>

              {/* Банковские реквизиты для кредитора */}
              {userRole === "creditor" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Банковские реквизиты</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">БИК</label>
                    <Input
                      name="bik"
                      value={editForm.bik || ""}
                      onChange={handleInputChange}
                      placeholder="Введите БИК"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">IBAN</label>
                    <Input
                      name="iban"
                      value={editForm.iban || ""}
                      onChange={handleInputChange}
                      placeholder="Введите IBAN"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Контактное лицо
                    </label>
                    <Input
                      name="contact_person"
                      value={editForm.contact_person || ""}
                      onChange={handleInputChange}
                      placeholder="Введите ФИО контактного лица"
                    />
                  </div>
                </div>
              )}

              {/* Предпочитаемый язык для borrower */}
              {userRole === "borrower" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Настройки</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Предпочитаемый язык
                    </label>
                    <Select
                      value={editForm.preferred_lang}
                      onValueChange={(value) =>
                        handleSelectChange("preferred_lang", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите язык" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="kk">Қазақша</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
              >
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending
                  ? "Сохранение..."
                  : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                {formatDate(profile?.created_at)}
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
                <div className="text-lg font-medium text-gray-900">
                  {profile?.type === "mfo" && "Микрофинансовая организация"}
                  {profile?.type === "bank" && "Банк"}
                  {profile?.type === "other" && "Другое"}
                  {!profile?.type && "Не указан"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  БИК
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile?.bik || "БИК не указан"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  IBAN
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile?.iban || "IBAN не указан"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  КОНТАКТНОЕ ЛИЦО
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {profile?.contact_person || "Не указано"}
                </div>
              </div>
            </>
          )}

          {/* Адрес (общее поле) */}
          <div>
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              АДРЕС
            </div>
            <div className="text-lg font-medium text-gray-900">
              {profile?.address || "Адрес не указан"}
            </div>
          </div>

          {/* Предпочитаемый язык (только для borrower) */}
          {userRole === "borrower" && (
            <div>
              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                ПРЕДПОЧИТАЕМЫЙ ЯЗЫК
              </div>
              <div className="text-lg font-medium text-gray-900">
                {profile?.preferred_lang === "ru" && "Русский"}
                {profile?.preferred_lang === "kk" && "Қазақша"}
                {profile?.preferred_lang === "en" && "English"}
                {!profile?.preferred_lang && "Не указан"}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-8" />
      </div>

      {/* Раздел: Документ (только для borrower) */}
      {/* {userRole === "borrower" && (
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
      )} */}

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
