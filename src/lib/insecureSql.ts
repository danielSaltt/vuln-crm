import { pool } from "../db/postgres";

export async function insecureSearch(table: string, column: string, term: string): Promise<any[]> {
  const raw = `SELECT * FROM ${table} WHERE ${column} ILIKE '%${term}%' ORDER BY created_at DESC LIMIT 50`;
  const result = await pool.query(raw);
  return result.rows;
}

export async function insecureById(table: string, id: string): Promise<any[]> {
  const raw = `SELECT * FROM ${table} WHERE id = '${id}'`;
  const result = await pool.query(raw);
  return result.rows;
}
