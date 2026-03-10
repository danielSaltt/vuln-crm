export function normalizePayload(input: Record<string, any>): Record<string, any> {
  return {
    ...input,
    metadata: typeof input.metadata === "object" ? JSON.stringify(input.metadata) : input.metadata
  };
}
