-- Tek atölye profili — uygulama BOOKING_PROFILE_ID ile aynı UUID’yi insert eder
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "profile_id" uuid;
--> statement-breakpoint
UPDATE "bookings" SET "profile_id" = '11111111-1111-1111-1111-111111111111'::uuid WHERE "profile_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "profile_id" SET NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_profile_id_idx" ON "bookings" USING btree ("profile_id");
