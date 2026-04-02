# API (NestJS + Drizzle + PostgreSQL)

## Kurulum

```bash
# Monorepo kökünden
cd booking-task
pnpm install

# Ortam dosyası
cp api/.env.example api/.env
# DATABASE_URL ve JWT_SECRET (≥32 karakter) düzenle
```

## PostgreSQL

Yerel örnek:

```bash
docker run --name booking-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=booking -p 5432:5432 -d postgres:16
```

## Şema ve migration

```bash
cd api
pnpm db:generate   # drizzle/ altında SQL üretir
pnpm db:migrate    # veritabanına uygular (DATABASE_URL gerekli)
# veya geliştirme için:
pnpm db:push       # migration dosyası olmadan şemayı iter (etkileşimli sorular çıkabilir)
# Mevcut DB + migrate çakışması:
pnpm db:ensure-auth   # `users` yoksa 0001 SQL’ini uygular (bkz. scripts/ensure-auth-schema.mjs)
```

## Çalıştırma

```bash
# kökten
pnpm dev:api

# veya
cd api && pnpm dev
```

Varsayılan adres: `http://localhost:4000`

**Swagger UI:** `http://localhost:4000/docs` — OpenAPI dokümantasyonu ve “Try it out”.

## Web (Next.js) bağlantısı

- `web/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000` (isteğe bağlı `NEXT_PUBLIC_AUTH_COOKIE_NAME`)
- İstemci: `credentials: 'include'` ile httpOnly JWT çerezi (`booking_token`) taşınır
- `web/lib/auth/api.ts` → `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout`
- `web/lib/bookings/api.ts` → `GET /bookings/available`, `POST /bookings` (POST için oturum zorunlu)
- Şemalar: `packages/shared` (`@booking/shared`) — web ve API aynı Zod tanımlarını kullanır

## Modül dosya düzeni (ör. `bookings`, yeni domain için aynı kalıp)

```
src/modules/bookings/
├── bookings.module.ts      # Modül tanımı
├── bookings.controller.ts  # HTTP
├── bookings.service.ts     # İş kuralları
├── bookings.repository.ts  # Drizzle / DB erişimi
├── bookings.dto.ts         # Zod şemaları + Swagger sınıfları
└── slot.utils.ts           # Domain yardımcıları (opsiyonel)
```

## Uç noktalar

### Kimlik doğrulama (`src/modules/auth/`)

| Metod | Yol | Açıklama |
|--------|-----|----------|
| POST | `/auth/register` | Kayıt; JWT httpOnly çerez set eder |
| POST | `/auth/login` | Giriş; JWT httpOnly çerez |
| POST | `/auth/logout` | Çıkış (JWT gerekli) |
| GET | `/auth/me` | Oturumdaki kullanıcı — **bilgi PostgreSQL’den** okunur |

### Rezervasyon

| Metod | Yol | Açıklama |
|--------|-----|----------|
| GET | `/bookings/available?date=YYYY-MM-DD` | Müsait slotlar (herkese açık) |
| POST | `/bookings` | Rezervasyon — **JWT zorunlu**; `userId` istemciden alınmaz |

### POST `/bookings` gövdesi

```json
{
  "date": "2026-04-02",
  "timeSlot": "11:00 ص"
}
```

## Mimari

- `src/config/` — Zod ile `DATABASE_URL` vb. doğrulama
- `src/database/` — `DrizzleService`, Drizzle şeması, migration çıktısı `drizzle/`
- `src/modules/auth/` — JWT (Passport), kullanıcı tablosu, çerez
- `src/modules/bookings/` — Rezervasyon domain’i (controller, service, DTO/Zod)
- Yeni özellikler için `src/modules/<ad>/` altında yeni modül ekleyin; `AppModule` içine import edin.

## Testler (rules.md §4.4)

```bash
cd api
pnpm test
# veya monorepo kökünden: pnpm test:api
```

- `src/modules/bookings/bookings.service.spec.ts` — müsait slot listesi, çift rezervasyon (`23505`), geçersiz slot.
