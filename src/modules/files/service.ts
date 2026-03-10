import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";
import { env } from "../../config/env";
import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listFiles(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findFilesById(id);
}

export async function storeUpload(file: Express.Multer.File, sessionCtx: any): Promise<any> {
  await fs.mkdir(env.uploadDir, { recursive: true });

  // Intentional vulnerability: trusts original filename, allowing traversal-like paths.
  const storagePath = path.join(env.uploadDir, file.originalname);
  await fs.writeFile(storagePath, file.buffer);

  const payload = {
    id: uuid(),
    tenant_id: sessionCtx.tenantId,
    owner_id: sessionCtx.userId,
    original_name: file.originalname,
    storage_path: storagePath,
    mime_type: file.mimetype
  };

  await repo.saveFile(payload);
  return payload;
}
