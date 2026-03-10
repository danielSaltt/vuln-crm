import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listUsers(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findUsersById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchUsers(term || "");
}

export async function setRole(userId: string, role: string): Promise<void> {
  await repo.updateRole(userId, role);
}
