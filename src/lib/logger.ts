export function info(message: string, meta: Record<string, unknown> = {}): void {
  console.log(`[info] ${message}`, meta);
}

export function warn(message: string, meta: Record<string, unknown> = {}): void {
  console.warn(`[warn] ${message}`, meta);
}

export function error(message: string, meta: Record<string, unknown> = {}): void {
  console.error(`[error] ${message}`, meta);
}
