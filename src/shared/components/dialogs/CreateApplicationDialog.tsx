import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  Loader2,
  Mail,
  FileText,
  Upload,
  AlertCircle,
  X,
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
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  type ApplicationFormValues,
  type OtpFormValues,
  otpFormSchema,
} from "@/features/application/types/application";
import { MOCK_TEMPLATES } from "@/features/application/constants/application";
import { OtpDialog } from "./OtpDialog";

interface CreateApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: "bank" | "mfo" | null;
  setSelectedType: (type: "bank" | "mfo" | null) => void;
  creditors: any[];
  isLoadingCreditors: boolean;
  createForm: any;
  documentPreview: any;
  onGeneratePDF: (data: any) => void;
  createApplication: any;
  onSubmit: (data: any) => Promise<any>;
  uploadContract: any;
  generateDocument: any;
  sendOtp: any;
  verifyOtp: any;
  sendEmail: any;
}

export const CreateApplicationDialog: React.FC<
  CreateApplicationDialogProps
> = ({
  isOpen,
  onClose,
  selectedType,
  setSelectedType,
  creditors,
  isLoadingCreditors,
  createForm,
  documentPreview,
  onGeneratePDF,
  createApplication,
  onSubmit,
  uploadContract,
  generateDocument,
  sendOtp,
  verifyOtp,
  sendEmail,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<
    number | null
  >(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [emailProcessStep, setEmailProcessStep] = useState<string>("");

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { code: "" },
  });

  const watchedCreditor = createForm.watch("creditor");
  const watchedAmount = createForm.watch("amount");
  const watchedTemplate = createForm.watch("template");
  const watchedBankEmail = createForm.watch("bank_email");

  // Эффект для автоматической подстановки email кредитора
  useEffect(() => {
    if (watchedCreditor && creditors) {
      const selectedCreditor = creditors.find(
        (c: any) => c.id === watchedCreditor,
      );
      if (selectedCreditor?.email) {
        createForm.setValue("bank_email", selectedCreditor.email);
      }
    }
  }, [watchedCreditor, creditors, createForm]);

  const isFormValid =
    !!watchedCreditor &&
    watchedAmount > 0 &&
    !!watchedTemplate &&
    !!watchedBankEmail &&
    !!selectedType;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      field.onChange(file);
      setUploadError(null);
    }
  };

  const createApplicationAndUploadContract = async (
    data: ApplicationFormValues,
  ) => {
    const applicationData = {
      creditor: data.creditor,
      amount: data.amount,
      comment: data.comment || "",
      template: data.template,
      bank_email: data.bank_email,
    };

    const result = await onSubmit(applicationData);
    const applicationId = result?.id;

    if (!applicationId) {
      throw new Error("Не удалось получить ID заявки");
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile); // ← вот здесь меняем "contract" на "file"
      formData.append("number", data.contract_number || "");

      if (data.contract_date) {
        const dateStr = String(data.contract_date);
        formData.append("date", dateStr);
      } else {
        formData.append("date", "");
      }

      try {
        await uploadContract.mutateAsync({
          id: applicationId,
          payload: formData, // теперь FormData содержит поле "file" вместо "contract"
        });
      } catch (error: any) {
        console.error("Ошибка загрузки:", error);
        throw error;
      }
    }

    return applicationId;
  };

  const handleCreateOnly = async (data: ApplicationFormValues) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      await createApplicationAndUploadContract(data);
      resetAndClose();
    } catch (error) {
      setUploadError(
        "Ошибка при создании заявки. Пожалуйста, попробуйте снова.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateAndGenerate = async (data: ApplicationFormValues) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const applicationId = await createApplicationAndUploadContract(data);
      await generateDocument.mutateAsync(applicationId);
      resetAndClose();
    } catch (error) {
      setUploadError("Ошибка при создании заявки или генерации документа.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateAndSend = async (data: ApplicationFormValues) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const applicationId = await createApplicationAndUploadContract(data);
      setCurrentApplicationId(applicationId);

      setEmailProcessStep("generating_document");
      await generateDocument.mutateAsync(applicationId);

      setEmailProcessStep("sending_otp");
      const otpResult = await sendOtp.mutateAsync(applicationId);
      const code = otpResult?.code || otpResult?.dev_code || "123456";
      setOtpCode(code);
      setEmailProcessStep("verifying_otp");

      setIsUploading(false);
      setShowOtpDialog(true);
    } catch (error) {
      setUploadError("Ошибка при создании заявки или отправке.");
      setIsUploading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormValues) => {
    if (!currentApplicationId) return;

    try {
      setEmailProcessStep("verifying_otp");
      await verifyOtp.mutateAsync({
        id: currentApplicationId,
        payload: { code: data.code },
      });

      setEmailProcessStep("sending_email");
      await sendEmail.mutateAsync(currentApplicationId);

      setEmailProcessStep("completed");
      setTimeout(() => {
        setShowOtpDialog(false);
        setCurrentApplicationId(null);
        setOtpCode("");
        otpForm.reset({ code: "" });
        resetAndClose();
      }, 1500);
    } catch (error) {}
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    createForm.reset();
    setSelectedType(null);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Обработчик для предотвращения закрытия при клике вне диалога
  const handlePointerDownOutside = (e: Event) => {
    e.preventDefault();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetAndClose();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[500px] w-[100vw] h-[100vh] sm:h-auto sm:max-h-[90vh] p-0 m-0 rounded-none sm:rounded-lg overflow-hidden"
          onPointerDownOutside={handlePointerDownOutside}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            resetAndClose();
          }}
        >
          {/* Мобильная шапка с кнопкой закрытия */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 sm:hidden flex items-center justify-between p-4">
            <DialogTitle className="text-lg font-semibold">
              Создать новую заявку
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={resetAndClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>

          {/* Десктопная шапка */}
          <DialogHeader className="hidden sm:block px-6 pt-6">
            <DialogTitle className="text-xl font-semibold">
              Создать новую заявку
            </DialogTitle>
          </DialogHeader>

          {/* Контент формы с прокруткой */}
          <div className="overflow-y-auto h-[calc(100vh-64px)] sm:h-auto sm:max-h-[calc(90vh-120px)] p-4 sm:p-6">
            <Form {...createForm}>
              <form className="space-y-4">
                {/* Тип организации */}
                <div className="space-y-2">
                  <FormLabel>Тип организации *</FormLabel>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={selectedType === "bank" ? "default" : "outline"}
                      className={selectedType === "bank" ? "bg-[#1f74ec]" : ""}
                      onClick={() => {
                        setSelectedType("bank");
                        createForm.setValue("creditor", undefined);
                        createForm.setValue("bank_email", "");
                      }}
                    >
                      Банк
                    </Button>
                    <Button
                      type="button"
                      variant={selectedType === "mfo" ? "default" : "outline"}
                      className={selectedType === "mfo" ? "bg-[#1f74ec]" : ""}
                      onClick={() => {
                        setSelectedType("mfo");
                        createForm.setValue("creditor", undefined);
                        createForm.setValue("bank_email", "");
                      }}
                    >
                      МФО
                    </Button>
                  </div>
                </div>

                {/* Кредитор */}
                <FormField
                  control={createForm.control}
                  name="creditor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Кредитор (МФО/Банк) *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                        disabled={
                          isLoadingCreditors || !selectedType || isUploading
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                !selectedType
                                  ? "Сначала выберите тип организации"
                                  : isLoadingCreditors
                                    ? "Загрузка кредиторов..."
                                    : "Выберите кредитора"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{renderCreditorOptions()}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Остальные поля формы */}
                <FormField
                  control={createForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сумма задолженности *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-full"
                          disabled={isUploading}
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип заявки *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                        disabled={isUploading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип заявки" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_TEMPLATES.map((template) => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="bank_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email банка/МФО *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="w-full"
                          disabled={isUploading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Номер договора */}
                <FormField
                  control={createForm.control}
                  name="contract_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер договора (необязательно)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Введите номер договора"
                          className="w-full"
                          disabled={isUploading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Дата договора */}
                <FormField
                  control={createForm.control}
                  name="contract_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата договора (необязательно)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="w-full"
                          disabled={isUploading}
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Загрузка файла */}
                <FormField
                  control={createForm.control}
                  name="contract_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Договор (PDF, JPEG, PNG) (необязательно)
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                document
                                  .getElementById("contract-file")
                                  ?.click()
                              }
                              disabled={isUploading}
                            >
                              <Upload className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {selectedFile
                                  ? selectedFile.name.length > 30
                                    ? selectedFile.name.substring(0, 20) +
                                      "..." +
                                      selectedFile.name.slice(-10)
                                    : selectedFile.name
                                  : "Выберите файл"}
                              </span>
                            </Button>
                            <input
                              id="contract-file"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, field)}
                              disabled={isUploading}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        Максимальный размер: 10MB
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Комментарий (опционально)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Дополнительная информация о вашей ситуации..."
                          className="min-h-[100px] w-full"
                          disabled={isUploading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-gray-500 mt-2">
                  <p>* Поля обязательные для заполнения</p>
                  <p className="text-xs mt-1">Поля договора необязательны</p>
                </div>

                {uploadError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {uploadError}
                    </p>
                  </div>
                )}

                {isUploading && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-600 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {getUploadingMessage()}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onGeneratePDF(createForm.getValues())}
                    disabled={
                      documentPreview?.isPending || !isFormValid || isUploading
                    }
                    className={`w-full border-2 ${
                      isFormValid && !isUploading
                        ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {documentPreview?.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Генерация PDF...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Предпросмотр PDF
                      </>
                    )}
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      onClick={createForm.handleSubmit(handleCreateOnly)}
                      disabled={!isFormValid || isUploading || !selectedType}
                      className="w-full bg-[#1f74ec] hover:bg-[#1a65d4]"
                    >
                      {isUploading && !emailProcessStep ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Создание...
                        </>
                      ) : (
                        "Создать заявку"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={createForm.handleSubmit(handleCreateAndGenerate)}
                      disabled={!isFormValid || isUploading || !selectedType}
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {isUploading &&
                      emailProcessStep === "generating_document" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Создать и сгенерировать документ
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={createForm.handleSubmit(handleCreateAndSend)}
                      disabled={!isFormValid || isUploading || !selectedType}
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      {isUploading &&
                      (emailProcessStep === "sending_otp" ||
                        emailProcessStep === "generating_document") ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {emailProcessStep === "generating_document"
                            ? "Генерация..."
                            : "Отправка OTP..."}
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Создать и отправить на email
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Кнопка отмены для мобильных */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAndClose}
                    disabled={isUploading}
                    className="w-full sm:hidden mt-2"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Кнопка закрытия для десктопа */}
          <DialogClose className="hidden sm:block absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <OtpDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        applicationId={currentApplicationId}
        otpCode={otpCode}
        emailProcessStep={emailProcessStep}
        otpForm={otpForm}
        verifyOtp={verifyOtp}
        sendEmail={sendEmail}
        copyToClipboard={copyToClipboard}
        onSubmit={handleVerifyOtp}
      />
    </>
  );

  function renderCreditorOptions() {
    if (!selectedType) {
      return (
        <SelectItem value="no-type" disabled>
          Выберите тип организации
        </SelectItem>
      );
    }
    if (isLoadingCreditors) {
      return (
        <SelectItem value="loading" disabled>
          Загрузка...
        </SelectItem>
      );
    }
    if (creditors && creditors.length > 0) {
      return creditors.map((creditor) => (
        <SelectItem key={creditor.id} value={creditor.id.toString()}>
          <div className="flex flex-col">
            <span>{creditor.name}</span>
            <span className="text-xs text-gray-500">
              {creditor.type === "bank" ? "Банк" : "МФО"} • {creditor.email}
            </span>
          </div>
        </SelectItem>
      ));
    }
    return (
      <SelectItem value="no-data" disabled>
        Нет доступных кредиторов для выбранного типа
      </SelectItem>
    );
  }

  function getUploadingMessage() {
    if (createApplication?.isPending) return "Создание заявки...";
    if (emailProcessStep === "generating_document")
      return "Генерация документа...";
    if (emailProcessStep === "sending_otp") return "Отправка OTP...";
    if (selectedFile) return "Загрузка файла...";
    return "Обработка...";
  }
};
