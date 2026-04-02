import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ad gerekli")
    .max(120, "Ad çok uzun"),
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

/** GET /auth/me — oturum yoksa user null (401 yerine; istemci konsol gürültüsü olmaz) */
export const authMeResponseSchema = z.object({
  user: authUserSchema.nullable(),
});

export type AuthMeResponse = z.infer<typeof authMeResponseSchema>;
