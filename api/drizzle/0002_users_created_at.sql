-- Eski / elle oluşturulmuş users tablolarında eksik sütun
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;
