import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "../src/db/postgres";

const TABLES = [
  "tenants",
  "users",
  "contacts",
  "accounts",
  "deals",
  "notes",
  "apikeys",
  "files",
  "audits",
  "tasks",
  "tickets",
  "campaigns",
  "invoices",
  "activities",
  "webhooks",
  "workflows",
  "reports"
] as const;

const TABLE_MAP: Record<string, string> = {
  tenants: "tenants",
  users: "users",
  contacts: "contacts",
  accounts: "accounts",
  deals: "deals",
  notes: "notes",
  apikeys: "api_keys",
  files: "files",
  audits: "audit_logs",
  tasks: "tasks",
  tickets: "tickets",
  campaigns: "campaigns",
  invoices: "invoices",
  activities: "activities",
  webhooks: "webhooks",
  workflows: "workflows",
  reports: "reports"
};

async function loadFixtureRows(dirName: string): Promise<Record<string, any>[]> {
  const dir = path.join(process.cwd(), "fixtures", dirName);
  const entries = await fs.readdir(dir);
  const rows: Record<string, any>[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".json")) {
      continue;
    }
    const full = path.join(dir, entry);
    const raw = await fs.readFile(full, "utf8");
    rows.push(JSON.parse(raw));
  }
  return rows;
}

async function clearTables(): Promise<void> {
  await pool.query(
    "TRUNCATE TABLE credit_ledger, api_keys, files, notes, deals, accounts, contacts, users, tenants, audit_logs, tasks, tickets, campaigns, invoices, activities, webhooks, workflows, reports RESTART IDENTITY CASCADE"
  );
}

async function seedTable(tableKey: string): Promise<number> {
  const rows = await loadFixtureRows(tableKey);
  const table = TABLE_MAP[tableKey];
  let count = 0;

  for (const row of rows) {
    const columns = Object.keys(row);
    const values = Object.values(row);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
    const sql = `INSERT INTO ${table} (${columns.join(",")}) VALUES (${placeholders})`;
    await pool.query(sql, values);
    count += 1;
  }
  return count;
}

export async function seedAllFixtures(): Promise<Record<string, number>> {
  await clearTables();
  const stats: Record<string, number> = {};
  for (const table of TABLES) {
    stats[table] = await seedTable(table);
  }
  return stats;
}
