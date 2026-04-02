import {
  authMeResponseSchema,
  loginSchema,
  registerSchema,
  type AuthUser,
} from "@booking/shared";

import { parseJsonFromApi } from "@/lib/parse-api-response";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    return "http://localhost:4000";
  }
  return url.replace(/\/$/, "");
}

const cred: RequestInit = { credentials: "include" };

const NETWORK_ERROR_MSG =
  "Sunucuya ulaşılamıyor. API çalışıyor mu? (örn. kök dizinde pnpm dev:api veya cd api && pnpm dev — http://localhost:4000)";

async function fetchApi(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, { ...cred, ...init });
  } catch {
    throw new AuthApiError(NETWORK_ERROR_MSG, 0);
  }
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

function messageFromNestJson(json: unknown): string {
  if (!json || typeof json !== "object") return "طلب غير ناجح";
  const o = json as { message?: unknown };
  if (Array.isArray(o.message)) return o.message.map(String).join(" ");
  if (typeof o.message === "string") return o.message;
  return "طلب غير ناجح";
}

export async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetchApi(`${getBaseUrl()}/auth/me`, {
    cache: "no-store",
  });
  if (res.status === 401) return null;
  let json: unknown;
  try {
    json = await parseJsonFromApi(res, getBaseUrl());
  } catch (e: unknown) {
    throw new AuthApiError(
      e instanceof Error ? e.message : "استجابة غير صالحة",
      res.status,
    );
  }
  if (!res.ok) {
    throw new AuthApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }
  const parsed = authMeResponseSchema.safeParse(json);
  if (!parsed.success) return null;
  return parsed.data.user;
}

export async function loginRequest(email: string, password: string) {
  const body = loginSchema.parse({ email, password });
  const res = await fetchApi(`${getBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let json: unknown;
  try {
    json = await parseJsonFromApi(res, getBaseUrl());
  } catch (e: unknown) {
    throw new AuthApiError(
      e instanceof Error ? e.message : "استجابة غير صالحة",
      res.status,
    );
  }
  if (!res.ok) {
    throw new AuthApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }
  const parsed = authMeResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new AuthApiError("استجابة غير متوقعة", res.status, json);
  }
  return parsed.data.user;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
) {
  const body = registerSchema.parse({ name, email, password });
  const res = await fetchApi(`${getBaseUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let json: unknown;
  try {
    json = await parseJsonFromApi(res, getBaseUrl());
  } catch (e: unknown) {
    throw new AuthApiError(
      e instanceof Error ? e.message : "استجابة غير صالحة",
      res.status,
    );
  }
  if (!res.ok) {
    throw new AuthApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }
  const parsed = authMeResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new AuthApiError("استجابة غير متوقعة", res.status, json);
  }
  return parsed.data.user;
}

export async function logoutRequest() {
  const res = await fetchApi(`${getBaseUrl()}/auth/logout`, {
    method: "POST",
  });
  if (!res.ok) {
    let json: unknown;
    try {
      json = await parseJsonFromApi(res, getBaseUrl());
    } catch (e: unknown) {
      throw new AuthApiError(
        e instanceof Error ? e.message : "استجابة غير صالحة",
        res.status,
      );
    }
    throw new AuthApiError(
      messageFromNestJson(json) || `خطأ ${res.status}`,
      res.status,
      json,
    );
  }
}
