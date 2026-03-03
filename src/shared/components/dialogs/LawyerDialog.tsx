import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

// Схема валидации
const lawyerFormSchema = z.object({
  application: z.string({ message: "Выберите заявку" }),
  lawyer_type: z.optional,
  comment: z.string().optional(),
  fee: z.string().min(1, "Укажите сумму гонорара"),
});

// Экспортируем тип формы
type LawyerFormValues = z.infer<typeof lawyerFormSchema>;

interface LawyerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LawyerDialog: React.FC<LawyerDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useApplications();
  const createLawyerRequest = useVacancyCreate();

  // Явно указываем тип для useForm
  const form = useForm<LawyerFormValues>({
    resolver: zodResolver(lawyerFormSchema),
    defaultValues: {
      application: "",
      lawyer_type: "lawyer",
      comment: "",
      fee: "",
    },
  });

  const onSubmit = async (data: LawyerFormValues) => {
    try {
      setSubmitError(null);
      await createLawyerRequest.mutateAsync(data);
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Обращение к юристу
          </DialogTitle>
        </DialogHeader>

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

            {/* Тип обращения (скрытое поле) */}
            <input
              type="hidden"
              {...form.register("lawyer_type")}
              value="lawyer"
            />

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
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createLawyerRequest.isPending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={
                  createLawyerRequest.isPending || isLoadingApplications
                }
                className="bg-[#1f74ec] hover:bg-[#1a65d4]"
              >
                {createLawyerRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить обращение"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
