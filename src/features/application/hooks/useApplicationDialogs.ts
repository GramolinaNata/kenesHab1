import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ApplicationFormValues,
  applicationFormSchema,
  type OtpFormValues,
  otpFormSchema,
  type StatusChangeData,
  type EmailProcessStep,
} from "@/features/application/types/application";

export const useApplicationDialogs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [applicationType, setApplicationType] = useState<string>("");
  const [statusChangeData, setStatusChangeData] = useState<StatusChangeData | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [emailProcessStep, setEmailProcessStep] = useState<EmailProcessStep>("generating_document");
  const [selectedType, setSelectedType] = useState<"bank" | "mfo" | null>(null);

  const createForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      creditor: undefined,
      amount: 0,
      comment: "",
      template: undefined,
      bank_email: "",
      contract_number: "",
      contract_date: null,
      contract_file: undefined,
    },
  });

  const editForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      creditor: undefined,
      amount: 0,
      comment: "",
      template: undefined,
      bank_email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { code: "" },
  });

  const resetCreateDialog = () => {
    setSelectedType(null);
    createForm.reset({
      creditor: undefined,
      amount: 0,
      comment: "",
      template: undefined,
      bank_email: "",
      contract_number: "",
      contract_date: null,
      contract_file: undefined,
    });
  };

  const resetEditDialog = () => {
    setSelectedApplication(null);
    editForm.reset();
  };

  const resetDeleteDialog = () => {
    setSelectedApplication(null);
  };

  const resetDocumentDialog = () => {
    setSelectedApplication(null);
  };

  const resetEmailDialog = () => {
    setSelectedApplication(null);
  };

  const resetOtpDialog = () => {
    setSelectedApplication(null);
    setOtpCode("");
    setIsOtpSent(false);
    otpForm.reset({ code: "" });
    setEmailProcessStep("generating_document");
  };

  const resetStatusDialog = () => {
    setStatusChangeData(null);
  };

  return {
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
    applicationType,
    setApplicationType,
    statusChangeData,
    setStatusChangeData,
    otpCode,
    setOtpCode,
    isOtpSent,
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
  };
};