export type IResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string; status?: number; };

export interface ISuccessResponse {
	message: string;
}

export interface IErrorResponse {
	code: string;
	message: string;
	detail?: string | Record<string, unknown> | IErrorDetail;
}

export interface IErrorDetail {
	loc: string[];
	msg: string;
	type: string;
}

export interface IPaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}


export interface IPaginationParams extends Record<string, unknown> {
	lang?: "kk" | "ru" | "en";
	page?: number;
	page_size?: number;
}

export interface ISearchParams extends IPaginationParams {
	q?: string;
}

export type RequestsResponse = {
  data?: any[];
};