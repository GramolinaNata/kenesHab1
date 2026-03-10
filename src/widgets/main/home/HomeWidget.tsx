import { useState } from "react";
import {
  useApplicationCreate,
  useApplicationDelete,
  useApplications,
  useApplicationUpdate,
  useApplicationSetStatus,
  useApplicationGenerateDocument,
  useApplicationSendEmail,
  useApplicationSendOtp,
  useApplicationVerifyOtp,
  useCreditors,
  useDocumentPreview,
  useApplicationUploadContract,
} from "@/features/application/hooks/useApplication";
import { AppealCard } from "@/shared/components/block/AppealCard";

import { AlertCircle } from "lucide-react";

import { EditApplicationDialog } from "@/shared/components/dialogs/EditApplicationDialog";
import { DeleteConfirmationDialog } from "@/shared/components/dialogs/DeleteConfirmationDialog";
import { GenerateDocumentDialog } from "@/shared/components/dialogs/GenerateDocumentDialog";
import { SendEmailDialog } from "@/shared/components/dialogs/SendEmailDialog";
import { OtpDialog } from "@/shared/components/dialogs/OtpDialog";
import { StatusChangeDialog } from "@/shared/components/dialogs/StatusChangeDialog";

import {
  generatePdfFileName,
  copyToClipboard,
} from "@/features/application/utils/application";
import { useApplicationDialogs } from "@/features/application/hooks/useApplicationDialogs";
import { CreateApplicationDialog } from "@/shared/components/dialogs/CreateApplicationDialog";
import { PDFPreview } from "@/shared/components/block/PDFPreview";
import { ApplicationCard } from "@/shared/components/block/ApplicationCard";
import {
  MOCK_TEMPLATES,
  TEMPLATE_ID_BY_CARD_TYPE,
} from "@/features/application/constants/application";
import {
  AppealDialog,
  type AppealType,
} from "@/shared/components/dialogs/AppealDialog";
import LawyerRequestsList from "@/shared/components/block/LawyerRequestsList";

export default function HomeWidget() {
  // Получаем роли пользователя из localStorage
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const isBorrower = userRoles.includes("borrower");
  const isCreditor = userRoles.includes("creditor");
  const isLawyer = userRoles.includes("lawyer");

  // Показывать заявки могут creditor и borrower
  const canViewApplications = isBorrower || isCreditor;

  // Показывать объявления могут lawyer и borrower
  const canViewAnnouncements = isLawyer || isBorrower;

  const { data: applicationsData, isLoading } = useApplications();
  const createApplication = useApplicationCreate();
  const updateApplication = useApplicationUpdate();
  const deleteApplication = useApplicationDelete();
  const setApplicationStatus = useApplicationSetStatus();
  const generateDocument = useApplicationGenerateDocument();
  const sendEmail = useApplicationSendEmail();
  const sendOtp = useApplicationSendOtp();
  const verifyOtp = useApplicationVerifyOtp();
  const uploadContract = useApplicationUploadContract();

  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfFileName, setPdfFileName] = useState<string>("document.pdf");
  const [, setIsPdfLoading] = useState(false);

  // Состояния для диалогов обращений
  const [appealDialog, setAppealDialog] = useState<{
    isOpen: boolean;
    type: AppealType;
  }>({
    isOpen: false,
    type: "lawyer",
  });

  const {
    // States
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDocumentDialogOpen,
    setIsDocumentDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    isOtpDialogOpen,
    setIsOtpDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    selectedApplication,
    setSelectedApplication,
    setApplicationType,
    statusChangeData,
    otpCode,
    setOtpCode,
    setIsOtpSent,
    emailProcessStep,
    setEmailProcessStep,
    selectedType,
    setSelectedType,

    // Forms
    createForm,
    editForm,
    otpForm,

    // Reset functions
    resetCreateDialog,
    resetEditDialog,
    resetDeleteDialog,
    resetDocumentDialog,
    resetEmailDialog,
    resetOtpDialog,
    resetStatusDialog,
  } = useApplicationDialogs();

  const { data: creditors, isLoading: isLoadingCreditors } = useCreditors(
    selectedType || undefined,
  );

  const documentPreview = useDocumentPreview();

  const handleCardClick = (type: string) => {
    setApplicationType(type);

    // Для lawyer, mediator, ombudsman открываем универсальный диалог
    if (type === "lawyer" || type === "mediator" || type === "ombudsman") {
      setAppealDialog({
        isOpen: true,
        type: type as AppealType,
      });
      return;
    }

    // Для остальных типов открываем обычный диалог создания заявки
    const templateId = TEMPLATE_ID_BY_CARD_TYPE[type];
    if (templateId) {
      createForm.setValue("template", templateId);
    }
    setIsCreateDialogOpen(true);
  };

  const handleGeneratePDF = async (data: any) => {
    try {
      setIsPdfLoading(true);

      const creditor = creditors?.find((c: any) => c.id === data.creditor);
      const creditorName = creditor?.name || "creditor";
      const template = MOCK_TEMPLATES.find((t: any) => t.id === data.template);
      const templateName = template?.name || "document";

      const fileName = generatePdfFileName(creditorName, templateName);
      const blob = await documentPreview.mutateAsync({
        creditor: data.creditor,
        amount: data.amount,
        comment: data.comment,
        template: data.template,
        bank_email: data.bank_email,
        contract_date: data.contract_date,
        contract_number: data.contract_number,
      });

      setPdfBlob(blob);
      setPdfFileName(fileName);
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
      alert("Ошибка при генерации PDF. Пожалуйста, попробуйте снова.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleEdit = (application: any) => {
    setSelectedApplication(application);
    editForm.reset({
      creditor: application.creditor,
      amount: parseFloat(application.amount),
      comment: "",
      template: 1,
      bank_email: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (application: any) => {
    setSelectedApplication(application);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedApplication) {
      try {
        await deleteApplication.mutateAsync(selectedApplication.id);
        resetDeleteDialog();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Ошибка при удалении заявки:", error);
      }
    }
  };

  const handleGenerateDocument = async (applicationId: number) => {
    try {
      await generateDocument.mutateAsync(applicationId);
      setIsDocumentDialogOpen(false);
      resetDocumentDialog();
    } catch (error) {
      console.error("Ошибка при генерации документа:", error);
    }
  };

  const startEmailProcess = async (applicationId: number) => {
    try {
      setEmailProcessStep("generating_document");
      await generateDocument.mutateAsync(applicationId);

      setEmailProcessStep("sending_otp");
      const otpResult = await sendOtp.mutateAsync(applicationId);
      const code = otpResult?.code || otpResult?.dev_code || "123456";

      setOtpCode(code);
      setIsOtpSent(true);
      setEmailProcessStep("verifying_otp");

      setIsEmailDialogOpen(false);
      setIsOtpDialogOpen(true);
    } catch (error) {
      console.error("Ошибка в процессе отправки email:", error);
      setEmailProcessStep("generating_document");
    }
  };

  const handleVerifyOtp = async (applicationId: number, code: string) => {
    try {
      setEmailProcessStep("verifying_otp");
      await verifyOtp.mutateAsync({
        id: applicationId,
        payload: { code },
      });

      setEmailProcessStep("sending_email");
      await sendEmail.mutateAsync(applicationId);

      setEmailProcessStep("completed");

      setTimeout(() => {
        setIsOtpDialogOpen(false);
        resetOtpDialog();
      }, 1500);
    } catch (error) {
      console.error("Ошибка при верификации OTP:", error);
    }
  };

  const confirmStatusChange = async () => {
    if (statusChangeData) {
      try {
        await setApplicationStatus.mutateAsync({
          id: statusChangeData.id,
          payload: { status: statusChangeData.newStatus },
        });
        setIsStatusDialogOpen(false);
        resetStatusDialog();
      } catch (error) {
        console.error("Ошибка при изменении статуса:", error);
      }
    }
  };

  const onCreateSubmit = async (data: any) => {
    try {
      const result = await createApplication.mutateAsync({
        creditor: data.creditor,
        amount: data.amount,
        comment: data.comment,
        template: data.template,
        bank_email: data.bank_email,
        contract_date: data.contract_date,
        contract_number: data.contract_number,
      });
      return result;
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
      throw error;
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedApplication) return;

    try {
      await updateApplication.mutateAsync({
        id: selectedApplication.id,
        payload: {
          creditor: data.creditor,
          amount: data.amount,
          comment: data.comment,
          template: data.template,
          bank_email: data.bank_email,
          contract_date: data.contract_date,
          contract_number: data.contract_number,
        },
      });
      setIsEditDialogOpen(false);
      resetEditDialog();
    } catch (error) {
      console.error("Ошибка при обновлении заявки:", error);
    }
  };

  const onOtpSubmit = async (data: any) => {
    if (!selectedApplication) return;
    await handleVerifyOtp(selectedApplication.id, data.code);
  };

  const closeAppealDialog = () => {
    setAppealDialog({ ...appealDialog, isOpen: false });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-5">
      <CreateApplicationDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          resetCreateDialog();
        }}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        creditors={creditors || []}
        isLoadingCreditors={isLoadingCreditors}
        createForm={createForm}
        documentPreview={documentPreview}
        onGeneratePDF={handleGeneratePDF}
        createApplication={createApplication}
        onSubmit={onCreateSubmit}
        uploadContract={uploadContract}
        generateDocument={generateDocument}
        sendOtp={sendOtp}
        verifyOtp={verifyOtp}
        sendEmail={sendEmail}
      />

      <EditApplicationDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          resetEditDialog();
        }}
        selectedApplication={selectedApplication}
        editForm={editForm}
        updateApplication={updateApplication}
        onSubmit={onEditSubmit}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          resetDeleteDialog();
        }}
        selectedApplication={selectedApplication}
        deleteApplication={deleteApplication}
        onConfirm={confirmDelete}
      />

      <GenerateDocumentDialog
        isOpen={isDocumentDialogOpen}
        onClose={() => {
          setIsDocumentDialogOpen(false);
          resetDocumentDialog();
        }}
        selectedApplication={selectedApplication}
        generateDocument={generateDocument}
        onGenerate={handleGenerateDocument}
      />

      <SendEmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => {
          setIsEmailDialogOpen(false);
          resetEmailDialog();
        }}
        selectedApplication={selectedApplication}
        generateDocument={generateDocument}
        sendOtp={sendOtp}
        emailProcessStep={emailProcessStep}
        onStart={startEmailProcess}
      />

      <OtpDialog
        isOpen={isOtpDialogOpen}
        onClose={() => {
          setIsOtpDialogOpen(false);
          resetOtpDialog();
        }}
        applicationId={selectedApplication?.id}
        otpCode={otpCode}
        emailProcessStep={emailProcessStep}
        otpForm={otpForm}
        verifyOtp={verifyOtp}
        sendEmail={sendEmail}
        copyToClipboard={copyToClipboard}
        onSubmit={onOtpSubmit}
      />

      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          resetStatusDialog();
        }}
        statusChangeData={statusChangeData}
        setApplicationStatus={setApplicationStatus}
        onConfirm={confirmStatusChange}
      />

      {/* Универсальный диалог для обращений */}
      <AppealDialog
        isOpen={appealDialog.isOpen}
        onClose={closeAppealDialog}
        type={appealDialog.type}
      />

      <PDFPreview
        pdfBlob={pdfBlob}
        fileName={pdfFileName}
        onClose={() => setPdfBlob(null)}
        preventCloseOnOverlayClick={isCreateDialogOpen}
      />

      {/* Отображаем AppealCard только для роли borrower */}
      {isBorrower && (
        <div className="flex flex-col gap-4">
          <div
            onClick={() => handleCardClick("statement")}
            className="cursor-pointer"
          >
            <AppealCard
              variant="big"
              title="Реструктуризация/урегулирование просроченной задолженности"
              subtitle="Решим любые проблемы с МФО"
              image="/blocknout.svg"
              href="#"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => handleCardClick("lawyer")}
              className="cursor-pointer"
            >
              <AppealCard
                title={
                  <>
                    Обратиться <br /> к юристу
                  </>
                }
                image="/man.svg"
                href="#"
              />
            </div>
            <div
              onClick={() => handleCardClick("mediator")}
              className="cursor-pointer"
            >
              <AppealCard
                title={
                  <>
                    Обратиться <br /> к медиатору
                  </>
                }
                image="/man.svg"
                href="#"
              />
            </div>
          </div>

          <div
            onClick={() => handleCardClick("ombudsman")}
            className="cursor-pointer"
          >
            <AppealCard
              variant="big"
              title={
                <>
                  Обратиться <br /> к омбудсмену
                </>
              }
              image="/Lawyer.svg"
              href="#"
            />
          </div>
        </div>
      )}

      {/* Секция "Мои заявки" - только для creditor и borrower */}
      {canViewApplications && (
        <div className="mt-10 w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-black font-semibold text-[22px]">
              Мои заявки
            </span>
            <span className="text-[#1f74ec] text-[12px] font-bold">
              Все заявки
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f74ec] mx-auto"></div>
              <p className="mt-2 text-gray-500">Загрузка заявок...</p>
            </div>
          ) : applicationsData?.results &&
            applicationsData?.results.length > 0 ? (
            <div className="space-y-3">
              {applicationsData?.results.map((application: any) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  // onGenerateDocument={(app) => {
                  //   setSelectedApplication(app);
                  //   setIsDocumentDialogOpen(true);
                  // }}
                  // onSendEmail={(app) => {
                  //   setSelectedApplication(app);
                  //   setIsEmailDialogOpen(true);
                  // }}
                  // isGeneratePending={generateDocument.isPending}
                  // isEmailPending={
                  //   generateDocument.isPending ||
                  //   sendOtp.isPending ||
                  //   verifyOtp.isPending ||
                  //   sendEmail.isPending
                  // }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">У вас пока нет созданных заявок</p>
              <p className="text-sm text-gray-400 mt-1">
                Создайте свою первую заявку выше
              </p>
            </div>
          )}
        </div>
      )}

      {/* Секция "Объявления" - только для lawyer и borrower */}
      {canViewAnnouncements && (
        <div className="mt-10 w-full">
          <div className="flex justify-between items-center">
            <span className="text-black font-semibold text-[22px]">
              Объявления
            </span>
            <span className="text-[#1f74ec] text-[12px] font-bold">
              Подробнее
            </span>
          </div>

          <div className="mt-3.5 grid items-center gap-3">
            <LawyerRequestsList />
          </div>
        </div>
      )}
    </div>
  );
}
