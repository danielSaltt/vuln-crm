import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "./postgres";

export async function ensureSchema(): Promise<void> {
  const schemaPath = path.join(process.cwd(), "src", "db", "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");
  await pool.query(sql);
}
