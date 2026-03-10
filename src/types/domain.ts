export type Role = "viewer" | "agent" | "manager" | "admin";

export interface SessionContext {
  sid: string;
  userId?: string;
  tenantId?: string;
  role?: Role;
  username?: string;
}

export interface TenantScoped {
  id: string;
  tenant_id: string;
}

export interface VulnerabilityDescriptor {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  severity: "low" | "medium" | "high" | "critical";
  precondition: string;
}
