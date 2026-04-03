## Full‑Stack Booking System (Monorepo)

This repository contains a full‑stack booking system that follows the **“Full‑Stack Booking System Test”** requirements in `rules.md`.  
It is implemented as a monorepo with:

- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Shared Zod schemas published as `@booking/shared`

###Images
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/f6b41950-f163-43a7-9ae4-4eaaa2a9225d" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/6196b928-97cd-4e59-91b6-a41c769d27a2" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/0594f1e2-2e16-48de-86ce-a4d816cca535" />


### Project structure

| Spec (`rules.md`) | This repo |
| ------------------ | --------- |
| `apps/web`        | `web/` – Next.js app, components and API client logic (`lib/`) |
| `apps/api`        | `api/` – NestJS modules, controllers, services, Drizzle setup |
| shared schemas    | `packages/shared/` – shared Zod schemas (`@booking/shared`) |

---

## Features mapped to the test

### Booking widget & profile page (frontend)

- Calendar view with selectable days and time slots.
- Time‑slot selection with clear loading and error states.
- “Book session” button and confirmation modal with success message.
- Authenticated home page showing the booking widget.

### `GET /bookings/available?date=YYYY-MM-DD`

- Returns **available time slots** for the given date.
- Already‑booked sessions are filtered out at the database level.
- Each slot includes:
  - `startsAt` (ISO string)
  - `durationMinutes`
  - `available`
  - `timezone` (Asia/Riyadh)

### `POST /bookings`

- Validates that the requested slot is still available before inserting.
- Uses PostgreSQL unique constraints to prevent double bookings; on conflict the API returns `409 Conflict`.
- The authenticated **user id comes from the JWT**, not from the client payload.
- Success response contains `success`, a human‑readable `message`, and the created booking.
- Confirmation email is **optional in the spec** and is not implemented to keep the scope focused.

### Authentication & authorization

- Username / password registration and login.
- JWT stored in an httpOnly cookie; automatically attached via `credentials: "include"`.
- `GET /auth/me` returns:
  - `200` + `{ user: null }` when there is no active session (SPA‑friendly),
  - or the authenticated user object when logged in.
- `POST /bookings` and the main dashboard page are protected and require a valid session.

### UI / UX

- Responsive layout, matching the provided Figma design (Arabic labels, right‑to‑left layout).
- Global loading and error states for auth and bookings.
- Login and register forms centered on the page; main app pages show a top navigation bar.
- Clear success confirmations (modal + success text) after booking.

### Testing

- **Unit tests (API)**: Jest tests for `BookingsService` covering:
  - listing available slots,
  - rejecting double bookings,
  - invalid slot scenarios.
- Run with:

```bash
pnpm test:api
```

Integration / E2E tests and email sending are potential future improvements and are documented below.

---

## Requirements

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (or Docker)

---

## Setup

Install dependencies:

```bash
pnpm install
```

Configure environment variables:

```bash
cp api/.env.example api/.env
# api/.env:
#   DATABASE_URL=postgres://postgres:postgres@localhost:5432/booking
#   JWT_SECRET=at_least_32_characters_long_secret
#   BOOKING_PROFILE_ID=<UUID used for the consultant profile>

cp web/.env.example web/.env.local
# web/.env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start a local PostgreSQL instance (example using Docker):

```bash
docker run --name booking-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=booking \
  -p 5432:5432 -d postgres:16
```

Apply database migrations / ensure schema:

```bash
cd api
pnpm db:migrate

# For existing dev databases that might be out of sync:
pnpm db:ensure-auth
pnpm db:ensure-bookings
```

---

## Running the apps

From the repository root:

```bash
pnpm dev:api    # NestJS API on http://localhost:4000  (Swagger: http://localhost:4000/docs)
pnpm dev:web    # Next.js frontend on http://localhost:3000
```

Frontend pages:

- `/login` – login form
- `/register` – registration form
- `/` – protected home page with the booking widget

---

## API documentation

The backend exposes interactive API documentation via **Swagger UI**:

- `http://localhost:4000/docs`

For more details about modules and endpoints, see `api/README.md`.

---

## Environment & database documentation

| Item                     | Location / notes                           |
| ------------------------ | ------------------------------------------ |
| Setup instructions       | This file + `api/README.md`               |
| API documentation        | Swagger UI at `http://localhost:4000/docs`|
| Env examples             | `api/.env.example`, `web/.env.example`    |
| Drizzle schema & SQL     | `api/src/database/`, `api/drizzle/`       |

---

## Future improvements

These items are intentionally left out of the core scope but are natural next steps:

- **Email confirmation** on successful booking (e.g. via Nodemailer or a transactional email service).
- **Integration / E2E tests** covering the full booking flow (login → select slot → confirm booking).
- **Real‑time updates** for slot availability (e.g. WebSockets or Server‑Sent Events).

Even without these extras, the current implementation fully demonstrates the required stack, booking logic, authentication, error handling and UX requested in the assessment.
