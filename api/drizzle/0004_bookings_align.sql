-- Eski / elle oluşturulmuş bookings tablolarında Drizzle şemasıyla uyum
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "starts_at" timestamp with time zone;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "ends_at" timestamp with time zone;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "time_slot_label" text;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "user_id" uuid;
--> statement-breakpoint
UPDATE "bookings" AS b
SET
  "starts_at" = v.s,
  "ends_at" = COALESCE(b."ends_at", v.s + interval '1 hour'),
  "time_slot_label" = COALESCE(NULLIF(trim(b."time_slot_label"), ''), '-'),
  "created_at" = COALESCE(b."created_at", now())
FROM (
  SELECT
    id,
    now() + (ROW_NUMBER() OVER (ORDER BY id)) * interval '1 microsecond' AS s
  FROM "bookings"
  WHERE "starts_at" IS NULL
) AS v
WHERE b.id = v.id;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "starts_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "ends_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "time_slot_label" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "created_at" SET DEFAULT now();
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_starts_at_idx" ON "bookings" USING btree ("starts_at");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_starts_at_unique" ON "bookings" USING btree ("starts_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_user_id_idx" ON "bookings" USING btree ("user_id");
