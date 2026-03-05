import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  AlertCircle,
  X,
  Briefcase,
  Scale,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  useApplications,
  useVacancyCreate,
} from "@/features/application/hooks/useApplication";

// Типы обращений
export type AppealType = "lawyer" | "mediator" | "ombudsman";

// Конфигурация для каждого типа обращения
const APPEAL_CONFIG = {
  lawyer: {
    title: "Обращение к юристу",
    icon: Briefcase,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    buttonColor: "bg-green-600 hover:bg-green-700",
    lawyerType: "lawyer",
    description: "Получите профессиональную юридическую консультацию",
  },
  mediator: {
    title: "Обращение к медиатору",
    icon: Scale,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    lawyerType: "mediator",
    description: "Поможем урегулировать спор мирным путем",
  },
  ombudsman: {
    title: "Обращение к омбудсмену",
    icon: Shield,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    lawyerType: "ombudsman",
    description: "Защита ваших прав и законных интересов",
  },
} as const;

// Схема валидации
const appealFormSchema = z.object({
  application: z.string().min(1, "Выберите заявку"),
  lawyer_type: z.string(),
  comment: z.string().optional(),
  fee: z.string().min(1, "Укажите сумму гонорара"),
});

type AppealFormValues = z.infer<typeof appealFormSchema>;

interface AppealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: AppealType;
}

export const AppealDialog: React.FC<AppealDialogProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useApplications();
  const createLawyerRequest = useVacancyCreate();

  const config = APPEAL_CONFIG[type];
  const Icon = config.icon;

  // Форма
  const form = useForm<AppealFormValues>({
    resolver: zodResolver(appealFormSchema),
    defaultValues: {
      application: "",
      lawyer_type: config.lawyerType,
      comment: "",
      fee: "",
    },
  });

  // Сбрасываем форму при смене типа
  React.useEffect(() => {
    if (isOpen) {
      form.setValue("lawyer_type", config.lawyerType);
    }
  }, [isOpen, type, config.lawyerType, form]);

  const onSubmit = async (data: AppealFormValues) => {
    try {
      setSubmitError(null);
      await createLawyerRequest.mutateAsync({
        ...data,
        lawyer_type: config.lawyerType, // Убеждаемся, что тип правильный
      });
      form.reset();
      onClose();
    } catch (error: any) {
      setSubmitError(
        error.message ||
          "Ошибка при отправке обращения. Пожалуйста, попробуйте снова.",
      );
    }
  };

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] w-[100vw] h-[100vh] sm:h-auto sm:max-h-[90vh] p-0 m-0 rounded-none sm:rounded-lg overflow-hidden">
        {/* Мобильная шапка */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 sm:hidden flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            <DialogTitle className="text-lg font-semibold">
              {config.title}
            </DialogTitle>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Десктопная шапка */}
        <DialogHeader className="hidden sm:block px-6 pt-6">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <DialogTitle className="text-xl font-semibold">
              {config.title}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">{config.description}</p>
        </DialogHeader>

        {/* Форма */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] sm:h-auto sm:max-h-[calc(90vh-140px)] p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Выбор заявки */}
              <FormField
                control={form.control}
                name="application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Выберите заявку *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        isLoadingApplications || createLawyerRequest.isPending
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingApplications
                                ? "Загрузка заявок..."
                                : "Выберите заявку"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingApplications ? (
                          <SelectItem value="loading" disabled>
                            Загрузка...
                          </SelectItem>
                        ) : applicationsData?.results &&
                          applicationsData.results.length > 0 ? (
                          applicationsData.results.map((app: any) => (
                            <SelectItem key={app.id} value={app.id}>
                              Заявка #{app.id.slice(0, 8)} -{" "}
                              {parseFloat(app.amount).toLocaleString()} ₸
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            Нет доступных заявок
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Скрытое поле для lawyer_type */}
              <input type="hidden" {...form.register("lawyer_type")} />

              {/* Комментарий */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий (необязательно)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Опишите вашу ситуацию..."
                        className="min-h-[100px] w-full"
                        disabled={createLawyerRequest.isPending}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Гонорар */}
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сумма гонорара *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="100000"
                          className="w-full pr-8"
                          disabled={createLawyerRequest.isPending}
                          {...field}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ₸
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Информационный блок */}
              <div className={`${config.bgColor} p-3 rounded-lg`}>
                <p className={`text-xs ${config.iconColor}`}>
                  <span className="font-medium">Важно:</span> После отправки
                  обращения вы получите уведомление о его статусе. Обычно ответ
                  приходит в течение 24 часов.
                </p>
              </div>

              {/* Ошибка отправки */}
              {submitError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {submitError}
                  </p>
                </div>
              )}

              {/* Кнопки */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={createLawyerRequest.isPending}
                  className="w-full sm:w-auto"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createLawyerRequest.isPending || isLoadingApplications
                  }
                  className={`w-full sm:w-auto ${config.buttonColor}`}
                >
                  {createLawyerRequest.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    `Отправить обращение`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
