-- users.name: uygulama kayıtta doldurur; eski satırlar e-posta yerel kısmından türetilir
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" text;
UPDATE "users" SET "name" = trim(split_part(email, '@', 1))
WHERE "name" IS NULL OR btrim(COALESCE("name", '')) = '';
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
