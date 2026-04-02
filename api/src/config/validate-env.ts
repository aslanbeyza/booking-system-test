import { envSchema, type Env } from "./env.schema";

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Geçersiz ortam değişkenleri: ${JSON.stringify(msg, null, 2)}`,
    );
  }
  return parsed.data;
}
