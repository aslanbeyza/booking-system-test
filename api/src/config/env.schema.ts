import { z } from "zod";

/**
 * Ortam değişkenleri — bootstrap sırasında doğrulanır.
 * PostgreSQL bağlantısı için DATABASE_URL zorunlu.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  /** PostgreSQL connection string, örn: postgresql://user:pass@localhost:5432/booking */
  DATABASE_URL: z.string().min(1, "DATABASE_URL gerekli"),
  /** Next.js vb. için CORS */
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  /** JWT imzası (en az 32 karakter) */
  JWT_SECRET: z.string().min(32, "JWT_SECRET en az 32 karakter olmalı"),
  /** Örn. 7d, 24h, 3600 (jsonwebtoken expiresIn) */
  JWT_EXPIRES_IN: z.string().default("7d"),
  /** httpOnly cookie adı (API + tarayıcı) */
  AUTH_COOKIE_NAME: z.string().default("booking_token"),
  /**
   * Tek atölye/danışman kaydı — DB’deki `bookings.profile_id` (ve varsa `profiles.id`) ile aynı UUID.
   */
  BOOKING_PROFILE_ID: z.string().uuid(),
});

export type Env = z.infer<typeof envSchema>;
