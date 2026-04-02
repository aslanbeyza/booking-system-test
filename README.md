# Booking task (monorepo)

```
booking-task/
├── web/                 # Next.js (App Router)
├── api/                 # NestJS + Drizzle + PostgreSQL
├── packages/shared/     # @booking/shared — ortak Zod şemaları
├── pnpm-workspace.yaml
└── package.json
```

> `rules.md` içinde `apps/web` ve `apps/api` geçiyor; bu repoda paketler kökte `web/` ve `api/` olarak konumlandı.

## Gereksinimler

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (veya Docker)

## Kurulum

```bash
pnpm install
cp api/.env.example api/.env
# api/.env içinde DATABASE_URL ve JWT_SECRET düzenle (en az 32 karakter)

cp web/.env.example web/.env.local
# NEXT_PUBLIC_API_URL varsayılan http://localhost:4000 (Nest API)
```

PostgreSQL örneği:

```bash
docker run --name booking-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=booking \
  -p 5432:5432 -d postgres:16
```

Veritabanı şeması (`users` + güncellenmiş `bookings`):

```bash
cd api && pnpm db:migrate
# veya geliştirme: pnpm db:push
```

`db:migrate` ilk migration’da “bookings already exists” hatası verirse (DB eski, journal boş), auth şemasını şu script ile uygulayın:

```bash
cd api && set -a && source .env && set +a && pnpm db:ensure-auth
```

> `db:ensure-auth`: `public.users` yoksa `0001` ile tabloyu oluşturur; **varsa** eksik `created_at` sütununu `0002` ile ekler (elle/eski şema uyumu). `0001` mevcut `bookings` satırlarını siler — üretimde dikkat.

## Çalıştırma

Önce API + Postgres, sonra web (CORS `http://localhost:3000` için API `.env` içinde `CORS_ORIGIN`):

```bash
pnpm dev:api    # http://localhost:4000 — Swagger: http://localhost:4000/docs
pnpm dev:web    # http://localhost:3000 — takvim slotları GET /bookings/available, حجز جلسة POST /bookings
```

API detayları: [api/README.md](api/README.md)
