-- Bazı DB şemalarında starts_at ile aynı anlamda start_time zorunlu
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "start_time" timestamp with time zone;
--> statement-breakpoint
UPDATE "bookings" SET "start_time" = "starts_at" WHERE "start_time" IS NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "start_time" SET NOT NULL;
