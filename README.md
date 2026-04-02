# Booking task (monorepo)

`rules.md` ile uyumlu tam yığın rezervasyon örneği: Next.js (App Router) + NestJS + PostgreSQL (Drizzle) + ortak Zod (`@booking/shared`).

## Proje yapısı (`rules.md` §2)

| rules.md | Bu repo |
|----------|---------|
| `apps/web` | `web/` — Next.js, bileşenler, `lib/` ile API çağrıları |
| `apps/api` | `api/` — NestJS modüller, controller, service, Drizzle |
| — | `packages/shared/` — web + api için ortak Zod şemaları |

## Teknoloji (`rules.md` §1)

| Gereksinim | Karşılık |
|------------|----------|
| Next.js App Router, TypeScript, Tailwind | `web/` |
| NestJS, TypeScript | `api/` |
| Zod (paylaşımlı) | `packages/shared` → `@booking/shared` |
| PostgreSQL + Drizzle ORM | `api/src/database/`, `api/drizzle/` |
| Tasarım referansı | `image.png` (depo kökü); UI Arapça slot etiketleri + takvim |

## Özellikler — kurallarla eşleme (`rules.md` §3)

### A) `GET /bookings/available?date=YYYY-MM-DD`

- Veritabanında o gün için rezerve edilmiş başlangıç zamanları elenir.
- Dönen her slot: süre (`durationMinutes`), `startsAt` (ISO), `available`, `timezone` (Asia/Riyadh).
- Çift rezervasyon: slot başına benzersiz indeks + uygulama tarafı filtre.

### B) `POST /bookings`

- Geçerli slot + müsaitlik; `userId` JWT’den (istemci göndermez).
- Eşzamanlı çakışma: PostgreSQL `23505` → `409 Conflict`.
- Onay: JSON’da `success`, `message`, rezervasyon alanları.
- E-posta: `rules.md` “optional” — uygulanmadı (ileride `nodemailer` vb.).

### Kimlik doğrulama (`rules.md` §4.2)

- Kayıt / giriş, httpOnly JWT çerezi, `POST /bookings` korumalı (`JwtAuthGuard`).
- `GET /auth/me`: oturum yoksa `200` + `user: null` (SPA dostu).

### UI/UX (`rules.md` §4.3)

- Takvim, slot seçimi, yükleme ve hata durumları, başarı modalı + yeşil onay metni.
- Responsive: dar sütun + esnek düzen (`WorkshopInfoCard`).

### Test (`rules.md` §4.4)

- **Birim:** `pnpm test:api` — `BookingsService` (müsait slot, çakışma, geçersiz slot).
- Entegrasyon / E2E: kurallar kapsamında isteğe bağlı; API Swagger ile manuel doğrulanabilir (`/docs`).

## Gereksinimler

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (veya Docker)

## Kurulum

```bash
pnpm install
cp api/.env.example api/.env
# api/.env: DATABASE_URL, JWT_SECRET (≥32 karakter), BOOKING_PROFILE_ID (UUID)

cp web/.env.example web/.env.local
# NEXT_PUBLIC_API_URL → http://localhost:4000
```

PostgreSQL örneği:

```bash
docker run --name booking-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=booking \
  -p 5432:5432 -d postgres:16
```

Veritabanı (migration veya ensure script’leri):

```bash
cd api && pnpm db:migrate
# veya şema uyumu için:
pnpm db:ensure-auth
pnpm db:ensure-bookings
```

## Çalıştırma

```bash
pnpm dev:api    # http://localhost:4000 — Swagger: http://localhost:4000/docs
pnpm dev:web    # http://localhost:3000
```

Test:

```bash
pnpm test:api
```

## Dokümantasyon ve ortam (`rules.md` §6)

| Madde | Konum |
|-------|--------|
| Kurulum | Bu dosya + [api/README.md](api/README.md) |
| API dokümantasyonu | Swagger UI: `http://localhost:4000/docs` |
| Ortam örneği | `api/.env.example`, `web/.env.example` |
| Veritabanı | `api/drizzle/`, `pnpm db:migrate` / `db:ensure-*` |

---

> Eski not: `db:migrate` ile journal uyumsuz eski DB’de “bookings already exists” çıkarsa `db:ensure-auth` ve `db:ensure-bookings` kullanın (geliştirme).
