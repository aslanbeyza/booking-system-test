import {
  availableSessionsResponseSchema,
  createBookingInputSchema,
  createBookingResponseSchema,
  type CreateBookingInput,
} from "@booking/shared";

import { parseJsonFromApi } from "@/lib/parse-api-response";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.warn(
      "NEXT_PUBLIC_API_URL tanımlı değil; http://localhost:4000 kullanılıyor",
    );
    return "http://localhost:4000";
  }
  return url.replace(/\/$/, "");
}

export class BookingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

function messageFromNestJson(json: unknown): string {
  if (!json || typeof json !== "object") return "طلب غير ناجح";
  const o = json as { message?: unknown };
  if (Array.isArray(o.message)) return o.message.map(String).join(" ");
  if (typeof o.message === "string") return o.message;
  return "طلب غير ناجح";
}

const cred: RequestInit = { credentials: "include" };

export async function fetchAvailableSessions(date: string) {
  const url = `${getBaseUrl()}/bookings/available?${new URLSearchParams({ date })}`;
  const res = await fetch(url, { cache: "no-store", ...cred });
  let json: unknown;
  try {
    json = await parseJsonFromApi(res, getBaseUrl());
  } catch (e: unknown) {
    throw new BookingApiError(
      e instanceof Error ? e.message : "استجابة غير صالحة",
      res.status,
    );
  }

  if (!res.ok) {
    throw new BookingApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }

  const parsed = availableSessionsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new BookingApiError("API yanıtı beklenen formatta değil", res.status, json);
  }
  return parsed.data;
}

export async function createBooking(body: CreateBookingInput) {
  const parsedBody = createBookingInputSchema.parse(body);
  const url = `${getBaseUrl()}/bookings`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedBody),
    ...cred,
  });
  let json: unknown;
  try {
    json = await parseJsonFromApi(res, getBaseUrl());
  } catch (e: unknown) {
    throw new BookingApiError(
      e instanceof Error ? e.message : "استجابة غير صالحة",
      res.status,
    );
  }

  if (!res.ok) {
    throw new BookingApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }

  const parsed = createBookingResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new BookingApiError("API yanıtı beklenen formatta değil", res.status, json);
  }
  return parsed.data;
}
