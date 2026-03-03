import React from "react";

import { ShieldCheck, Copy, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  type EmailProcessStep,
  type OtpFormValues,
} from "@/features/application/types/application";

interface OtpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
  otpCode: string;
  emailProcessStep: EmailProcessStep | string;
  otpForm: any;
  verifyOtp: any;
  sendEmail: any;
  copyToClipboard: (text: string) => void;
  onSubmit: (data: OtpFormValues) => void;
}

export const OtpDialog: React.FC<OtpDialogProps> = ({
  isOpen,
  onClose,
  otpCode,
  emailProcessStep,
  otpForm,
  verifyOtp,
  sendEmail,
  copyToClipboard,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            OTP Подтверждение
          </DialogTitle>
          <DialogDescription>
            Подтвердите отправку email для заявки
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Отображение статуса процесса */}
          {emailProcessStep === "verifying_otp" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">OTP отправлен</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Код подтверждения был отправлен. Введите его ниже.
              </p>
            </div>
          )}

          {/* Отображение OTP кода */}
          {otpCode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Ваш OTP код:
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(otpCode)}
                  className="h-7 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать
                </Button>
              </div>
              <div className="text-center">
                <div className="inline-block bg-white border-2 border-yellow-300 rounded-lg px-6 py-3">
                  <span className="text-2xl font-bold tracking-widest text-gray-900">
                    {otpCode}
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Введите этот код в поле ниже для подтверждения
                </p>
              </div>
            </div>
          )}

          {/* Форма для ввода OTP кода */}
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Введите OTP код</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите код подтверждения"
                        className="text-center text-lg tracking-widest"
                        disabled={verifyOtp?.isPending || sendEmail?.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Индикатор текущего шага */}
              <div className="text-sm text-gray-500">
                {emailProcessStep === "verifying_otp" &&
                  "Введите код для подтверждения"}
                {emailProcessStep === "sending_email" && "Отправка email..."}
                {emailProcessStep === "completed" && "Email успешно отправлен!"}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={verifyOtp?.isPending || sendEmail?.isPending}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={verifyOtp?.isPending || sendEmail?.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {verifyOtp?.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : sendEmail?.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Подтвердить и отправить
                    </>
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
