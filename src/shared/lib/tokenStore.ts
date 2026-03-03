export interface AuthData {
  access: string | null;
  refresh: string | null;
  roles: string[] | null;
}

export const tokenStore = {
  get(): AuthData {
    if (typeof window !== "undefined") {
      const roles = localStorage.getItem("userRoles");
      return {
        access: localStorage.getItem("accessToken"),
        refresh: localStorage.getItem("refreshToken"),
        roles: roles ? JSON.parse(roles) : null, // Парсим строку обратно в массив
      };
    }
    return { access: null, refresh: null, roles: null };
  },

  set(data: Partial<AuthData>) {
    if (typeof window !== "undefined") {
      if (data.access !== undefined) {
        if (data.access) localStorage.setItem("accessToken", data.access);
        else localStorage.removeItem("accessToken");
      }
      if (data.refresh !== undefined) {
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
        else localStorage.removeItem("refreshToken");
      }
      if (data.roles !== undefined) {
        if (data.roles) localStorage.setItem("userRoles", JSON.stringify(data.roles)); // Сохраняем как JSON-строку
        else localStorage.removeItem("userRoles");
      }
    }
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");
    }
  },
};