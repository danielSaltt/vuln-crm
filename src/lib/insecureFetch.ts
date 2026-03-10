export async function proxyFetch(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}
