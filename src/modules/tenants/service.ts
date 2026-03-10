import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listTenants(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findTenantsById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchTenants(term || "");
}
