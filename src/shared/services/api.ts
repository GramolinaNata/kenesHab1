
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { IErrorResponse } from "../types";

export function extractErrorMessage(error: unknown): string {
	if (!axios.isAxiosError(error)) {
		return "UNKNOWN_ERROR";
	}
  
	const { response, code, message } = error;

	// Если нет ответа от сервера (проблемы с сетью, таймаут и т.д.)
	if (!response) {
		return code || message || "NETWORK_ERROR";
	}

	const {
		code: resCode,
		message: resMessage,
		detail,
	} = (response.data as IErrorResponse) || {};

	let detailMessage = "";
	if (detail) {
		if (typeof detail === "string") {
			detailMessage = detail;
		} else if (typeof detail === "object") {
			try {
				detailMessage = JSON.stringify(detail, null, 2);
			} catch {
				detailMessage = String(detail);
			}
		}
	}

	
	const baseMessage = resCode || resMessage || code || "UNKNOWN_ERROR";

	return detailMessage ? `${baseMessage}\n\n${detailMessage}` : baseMessage;
}


export function makeApiWithHandler(http: AxiosInstance) {
	async function handleResponse<T>(req: Promise<any>): Promise<any> {
		try {
			const res = await req;
			return { success: true, data: res.data as T };
		} catch (e) {
			return { success: false, error: extractErrorMessage(e) };
		}
	}

	return {
		get: <T>(url: string, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.get(url, config)),
		post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.post(url, data, config)),
		patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.patch(url, data, config)),
		put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.put(url, data, config)),
		delete: <T>(url: string, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.delete(url, config)),
	};
}