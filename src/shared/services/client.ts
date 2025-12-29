
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { makeApiWithHandler } from "./api";
import { tokenStore } from "../lib/tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Расширяем тип конфига для поддержки флага повтора
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Интерцептор запроса: добавляет Access Token
apiClient.interceptors.request.use(
  (config) => {
    const tokens = tokenStore.get();
    if (tokens.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Функция обновления токена
const refreshAccessToken = async () => {
  const tokens = tokenStore.get();
  if (!tokens.refresh) throw new Error("No refresh token");

  const response = await axios.post(
    `${API_BASE_URL}/api/auth/refresh/`,
    { refresh: tokens.refresh },
    { headers: { "Content-Type": "application/json" } }
  );

  const newAccess = response.data?.access;
  if (!newAccess) throw new Error("Invalid response");

  tokenStore.set({ access: newAccess });
  return newAccess;
};

// Интерцептор ответа: обработка 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosConfig;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (currentPath.startsWith("/auth")) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        isRefreshing = false;
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        tokenStore.clear();
        
        if (typeof window !== "undefined") {
          sessionStorage.setItem("redirectPath", currentPath);
          window.location.href = "/auth/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// Методы API
export const clientApi = makeApiWithHandler(apiClient);

