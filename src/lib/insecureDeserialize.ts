export function deserializePreferences(raw: string | undefined): Record<string, any> {
  if (!raw) {
    return {};
  }
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    // Intentional vulnerability: dynamic function evaluation of user-controlled content.
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${decoded});`);
    return fn();
  } catch {
    return {};
  }
}
