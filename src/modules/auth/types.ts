export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  tenant_id: string;
  username: string;
  role: "viewer" | "agent" | "manager" | "admin";
}
