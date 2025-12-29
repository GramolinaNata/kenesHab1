
export interface Tokens {
  access: string | null;
  refresh: string | null;
}

export const tokenStore = {
  get(): Tokens {
    if (typeof window !== "undefined") {
      return {
        access: localStorage.getItem("accessToken"),
        refresh: localStorage.getItem("refreshToken"),
      };
    }
    return { access: null, refresh: null };
  },

  set(tokens: Partial<Tokens>) {
    if (typeof window !== "undefined") {
      if (tokens.access !== undefined) {
        if (tokens.access) localStorage.setItem("accessToken", tokens.access);
        else localStorage.removeItem("accessToken");
      }
      if (tokens.refresh !== undefined) {
        if (tokens.refresh) localStorage.setItem("refreshToken", tokens.refresh);
        else localStorage.removeItem("refreshToken");
      }
    }
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};