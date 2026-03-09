import { clientApi, formDataApi } from "@/shared/services/client";
import type { QueryParams } from "../types/payload";


export const Applications = (params: QueryParams) => {
  return clientApi.get("/api/applications/", { params });
};

export const CreateApplication = (payload: any) => {
  return clientApi.post("/api/applications/", payload);
}

export const Application = (id: number) =>
   clientApi.get(`/api/applications/${id}`)

export const UpdateApplication = (id: number, payload: any) =>
  clientApi.put(`/api/applications/${id}/`, payload);

export const PathcApplication = (id: number, payload: any) =>
  clientApi.patch(`/api/applications/${id}`, payload);

export const DeleteApplication = (id: number) =>
   clientApi.delete(`/api/applications/${id}/`)

export const GenerateDocument = (id: number) =>
   clientApi.post(`/api/applications/${id}/generate-document/`)

export const Message = (id: number) =>
   clientApi.post(`/api/applications/${id}/messages`)

export const Otp = (id: number) =>
   clientApi.post(`/api/applications/${id}/request-otp/`)

export const SendEmail = (id: number) =>
   clientApi.post(`/api/applications/${id}/send-email/`)

export const SetStatus = (id: number, payload: any) =>
  clientApi.post(`/api/applications/${id}/set-status`, payload);

export const VerifyOtp = (id: number, payload: any) =>
  clientApi.post(`/api/applications/${id}/verify-otp/`, payload);

export const GetCreditor = (type?: string) =>
  clientApi.get(`/api/creditors/`, {
    params: type ? { type } : undefined,
  });
  
export const PreviewDocument = async (payload: any) => {
  try {
    const response = await clientApi.post('/api/document-preview', payload, {
      responseType: 'blob', // Просто получаем как blob
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
      return response.data; 
       
  } catch (error) {
    console.error("Ошибка в PreviewDocument:", error);
    throw error;
  }
};

export const CreateFileApplication = (payload: any, id: number) => {
  return formDataApi.post(`/api/applications/${id}/upload-contract/`, payload);
}

export const CreateVacancy = (payload: any) => {
  return clientApi.post("/api/vacancy/", payload);
};

export const GetVacancies = () => {
  return clientApi.get("/api/vacancy/");
};

export const AcceptProposal = (id: number) => {
  return clientApi.post(`/api/proposal/${id}/accept/`);
};

export const RejectProposal = (id: number) => {
  return clientApi.post(`/api/proposal/${id}/reject/`);
};

export const RespondToVacancy = (id: number, payload: any) => {
  return clientApi.post(`/api/vacancy/${id}/response/`, payload);
};

export const GetApplicationDetail = (id: number) => {
  return clientApi.get(`/api/applications/${id}/`);
};

export const UploadApplicationResponse = (id: number, payload: FormData) => {
  return formDataApi.post(`/api/applications/${id}/upload-response/`, payload);
};

export const GetVacancyResponses = (id: number) => {
  return clientApi.get(`/api/vacancy/${id}/response/`);
};
export const GetVacancyDetail = (id: number) => {
  return clientApi.get(`/api/vacancy/${id}/`);
};

export const GetProposals = () => {
  return clientApi.get("/api/proposal/");
};