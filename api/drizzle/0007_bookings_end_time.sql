-- Bazı DB şemalarında ends_at ile aynı anlamda end_time zorunlu
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "end_time" timestamp with time zone;
--> statement-breakpoint
UPDATE "bookings" SET "end_time" = "ends_at" WHERE "end_time" IS NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "end_time" SET NOT NULL;
