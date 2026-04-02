/**
 * Nest JSON yerine Next HTML (404 sayfası vb.) dönünce anlamlı hata üretir.
 */
export async function parseJsonFromApi(
  res: Response,
  apiBaseUrl: string,
): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error(
      `HTML yanıtı alındı (muhtemelen API’ye değil Next’e istek gitti). API: ${apiBaseUrl} — web/.env.local içinde NEXT_PUBLIC_API_URL=http://localhost:4000 ve API’nin çalıştığını doğrula.`,
    );
  }
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Geçersiz JSON (ilk 120 karakter): ${text.slice(0, 120)}`);
  }
}
