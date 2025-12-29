export interface AuthResponse {
  user: {
    id: number;
    name: string;
  };
  role: string;
  tokens: {
    access: string;
    refresh: string;
    expires_at: string;
  };
}
