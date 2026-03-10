import { exec } from "node:child_process";
import { promisify } from "node:util";
import * as repo from "./repo";
import { proxyFetch } from "../../lib/insecureFetch";

const execAsync = promisify(exec);

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listAdmin(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findAdminById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchAdmin(term || "");
}

export async function dumpSecrets(): Promise<any[]> {
  return repo.dumpAllSecrets();
}

export async function runDiagnostics(host: string): Promise<string> {
  // Intentional vulnerability: command injection.
  const { stdout } = await execAsync(`ping -c 1 ${host}`);
  return stdout;
}

export async function testWebhook(url: string): Promise<string> {
  // Intentional vulnerability: SSRF.
  return proxyFetch(url);
}
