import { z } from "zod";

/** GET /bookings/available?date=YYYY-MM-DD */
export const availableQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date YYYY-MM-DD olmalı"),
});

export type AvailableQuery = z.infer<typeof availableQuerySchema>;

/**
 * İstemciden POST /bookings gövdesi — userId JWT ile sunucuda eklenir (gönderilmez).
 */
export const createBookingInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

/** Sunucu içi: kullanıcı + slot */
export const createBookingPayloadSchema = createBookingInputSchema.extend({
  userId: z.string().uuid(),
});

export type CreateBookingPayload = z.infer<typeof createBookingPayloadSchema>;

export const slotItemSchema = z.object({
  timeSlot: z.string(),
  durationMinutes: z.number(),
  startsAt: z.string().nullable(),
  available: z.boolean(),
});

export const availableSessionsResponseSchema = z.object({
  date: z.string(),
  timezone: z.string(),
  slots: z.array(slotItemSchema),
});

export type AvailableSessionsResponse = z.infer<
  typeof availableSessionsResponseSchema
>;

export const createBookingResponseSchema = z.object({
  success: z.literal(true),
  /** İstemcinin doğrudan gösterebileceği kısa başarı metni */
  message: z.string(),
  id: z.string().uuid(),
  startsAt: z.string(),
  endsAt: z.string(),
  timeSlotLabel: z.string(),
});

export type CreateBookingResponse = z.infer<typeof createBookingResponseSchema>;
