export interface AuthData {
  access: string | null;
  refresh: string | null;
  roles: string[] | null;
  user?: {
    id: number;
    email: string;
    full_name?: string;
    phone?: string;
    [key: string]: any;
  } | null;
}

export const tokenStore = {
  get(): AuthData {
    if (typeof window !== "undefined") {
      const roles = localStorage.getItem("userRoles");
      const userStr = localStorage.getItem("user");
      return {
        access: localStorage.getItem("accessToken"),
        refresh: localStorage.getItem("refreshToken"),
        roles: roles ? JSON.parse(roles) : null,
        user: userStr ? JSON.parse(userStr) : null,
      };
    }
    return { access: null, refresh: null, roles: null, user: null };
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
        if (data.roles) localStorage.setItem("userRoles", JSON.stringify(data.roles));
        else localStorage.removeItem("userRoles");
      }
      if (data.user !== undefined) {
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        else localStorage.removeItem("user");
      }
    }
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");
      localStorage.removeItem("user");
    }
  },
};

