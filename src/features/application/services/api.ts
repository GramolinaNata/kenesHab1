import { clientApi } from "@/shared/services/client";
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
   clientApi.post(`/api/applications/${id}/request-otp`)

export const SendEmail = (id: number) =>
   clientApi.post(`/api/applications/${id}/send-email`)

export const SetStatus = (id: number, payload: any) =>
  clientApi.post(`/api/applications/${id}/set-status`, payload);

export const VerifyOtp = (id: number, payload: any) =>
  clientApi.post(`/api/applications/${id}/verify-otp`, payload);