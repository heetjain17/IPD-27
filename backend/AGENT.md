# V1 Backend

This file is read by Cascade (Windsurf), Claude Code, and any agent working in this repository.
Follow every rule here in every session. Do not deviate unless explicitly instructed by the developer.

---

## Project overview

Node.js REST API backend for a location-based mobile app.
Stack: Node.js + Express, TypeScript, Supabase (PostgreSQL + PostGIS), JWT auth.

V1 scope: Auth, User, Places, Location, SavedPlaces modules only.
Deferred (do NOT build): Activity Signal Engine, Discovery & Ranking Engine, AI Pipeline, AR Layer, Gamification.

---

## System boundaries

| Layer         | Responsibility              | Notes                        |
| ------------- | --------------------------- | ---------------------------- |
| Node backend  | Business logic + DB access  | This repo                    |
| Supabase / DB | Source of truth             | PostgreSQL + PostGIS         |
| Mobile        | UI only — consumes this API | No business logic on mobile  |
| Python        | Future intelligence layer   | Not built in V1, do not stub |

Rules:

- The backend owns ALL business logic. Never push logic to the mobile client.
- Python services do not exist in V1. Do not create stubs, interfaces, or placeholder hooks for them.
- Never access another module's database tables directly. All cross-module data access goes through that module's service layer.

---

## Module structure

Every module follows this exact layout. No exceptions.

```
src/
  modules/
    <module>/
      controller.ts   — Express route handlers only. No business logic.
      service.ts      — All business logic lives here.
      repository.ts   — All DB queries live here. No logic, only data access.
      schema.ts       — Zod (or joi) validation schemas for request bodies.
      routes.ts       — Route definitions. Mounts controller methods.
      types.ts        — Module-specific TypeScript interfaces and types.
```

### Rules

- Controllers call services. Services call repositories. Never skip a layer.
- Repositories only import from their own module and shared DB utilities.
- Services from module A must NOT import repositories from module B.
- Validation happens in `schema.ts` and is applied as middleware before the controller is reached.
- No raw SQL in controllers or services. Raw queries belong in the repository layer only.

---

## V1 Modules

### 1. Auth Module (`src/modules/auth/`)

Responsibilities:

- `POST /auth/register` — hash password (bcrypt), insert user, return JWT
- `POST /auth/login` — validate credentials, return JWT
- JWT middleware (`src/middleware/auth.middleware.ts`) — verify token, attach `req.user`

Rules:

- Passwords are always hashed with bcrypt (min 10 rounds) before DB insert.
- Never return password hashes in any response.
- JWT secret is read from `process.env.JWT_SECRET`. Never hardcode it.
- The auth middleware is the single gatekeeper. All protected routes use it.
- Auth module does NOT own the users table in the sense of profile data — that belongs to User module.

### 2. User Module (`src/modules/user/`)

Responsibilities:

- User profile read/update
- Preferences are deferred to V2 — do not build now

Rules:

- User module owns `SELECT` / `UPDATE` on the `users` table for profile data.
- Auth module owns `INSERT` into `users` (during register). This is the one exception to the no-cross-table rule and is intentional.
- Never expose internal user IDs in public-facing responses where avoidable. Use the UUID.

### 3. Places Module (`src/modules/places/`)

Responsibilities:

- `GET /places/nearby` — fetch places within radius (delegates distance calc to Location module)
- `GET /places/:id` — fetch single place detail

Rules:

- Places module does NOT compute distances or do geo queries itself.
- Distance calculation and radius filtering is the responsibility of the Location module service.
- Places module calls `LocationService.findNearby(lat, lng, radiusMeters)` to get IDs/distances, then enriches with place data.
- All place data returned must be validated against the Place response schema before sending.

### 4. Location Module (`src/modules/location/`)

Responsibilities:

- Latitude/longitude validation and normalisation
- Radius queries using PostGIS (`ST_DWithin`)
- Distance calculation (`ST_Distance`)
- Sorting results by distance

Rules:

- This module owns all PostGIS queries. No other module writes `ST_*` functions.
- Input lat/lng is validated (lat: -90 to 90, lng: -180 to 180) before any DB call.
- All distances returned are in metres unless explicitly documented otherwise.
- The PostGIS extension must be enabled before any migration in this module is applied.
  Always check: `CREATE EXTENSION IF NOT EXISTS postgis;`
- Use `geography` type (not `geometry`) for the location column so distance calculations use metres by default.

### 5. Saved Places Module (`src/modules/saved-places/`)

Responsibilities:

- `POST /places/save` — save a place for the authenticated user
- `DELETE /places/save/:id` — remove a saved place
- `GET /places/saved` — list all saved places for the authenticated user

Rules:

- All three routes require auth middleware.
- Before inserting, verify the place exists via `PlacesService.getById()`. Do not rely on FK constraint alone — return a 404 with a clear message if not found.
- The `saved_places` table has a unique constraint on `(user_id, place_id)`. On duplicate insert, return 409 Conflict, not a 500.
- When listing saved places, JOIN with the places table through the service layer, not a raw join in the repository.

---

## Database

### Conventions

- All primary keys are UUIDs (`uuid` type, `gen_random_uuid()` default).
- All tables have `created_at TIMESTAMPTZ DEFAULT NOW()`.
- Soft deletes are NOT used in V1. Use hard deletes.
- Migrations live in `supabase/migrations/`. Never modify an already-applied migration. Always create a new one.

### Key constraints

- `users.email` — UNIQUE, NOT NULL
- `users.password_hash` — NOT NULL (never `password`)
- `saved_places (user_id, place_id)` — UNIQUE composite constraint
- `places.location` — `GEOGRAPHY(POINT, 4326)` type

### PostGIS setup

The PostGIS extension must be enabled in the first migration:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Spatial index on places (required for radius query performance):

```sql
CREATE INDEX IF NOT EXISTS places_location_gidx
  ON places USING GIST (location);
```

Nearby query pattern (always use this form):

```sql
SELECT
  p.*,
  ST_Distance(p.location, ST_MakePoint($1, $2)::geography) AS distance_metres
FROM places p
WHERE ST_DWithin(
  p.location,
  ST_MakePoint($1, $2)::geography,
  $3  -- radius in metres
)
ORDER BY distance_metres ASC;
-- $1 = longitude, $2 = latitude, $3 = radius_metres
-- Note: ST_MakePoint takes (lng, lat), not (lat, lng)
```

**IMPORTANT**: `ST_MakePoint` takes `(longitude, latitude)` — not `(latitude, longitude)`.
Always double-check parameter order. This is the most common PostGIS mistake.

---

## API surface (V1 only)

```
POST   /auth/register
POST   /auth/login

GET    /places/nearby        ?lat=&lng=&radius=
GET    /places/:id

POST   /places/save          (auth required)
DELETE /places/save/:id      (auth required)
GET    /places/saved         (auth required)

GET    /health
```

Do not add endpoints outside this list without explicit developer instruction.

---

## Error handling

Use a centralised error handler (`src/middleware/error.middleware.ts`).
All errors flow through it. Controllers never send error responses directly.

Standard error shape:

```json
{
  "status": "error",
  "code": 404,
  "message": "Place not found"
}
```

HTTP status codes to use:

- `400` — validation error (bad input)
- `401` — missing or invalid JWT
- `403` — authenticated but not authorised
- `404` — resource not found
- `409` — conflict (e.g. duplicate saved place)
- `500` — unexpected server error (never leak stack traces in production)

---

## Environment variables

```
PORT
NODE_ENV               (development | production)
JWT_SECRET
JWT_EXPIRES_IN         (e.g. 7d)
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY   (never expose to client)
DATABASE_URL           (direct connection string for migrations)
```

All env vars are validated at startup. If any required var is missing, the server must refuse to start with a clear error message.

---

## TypeScript rules

- Strict mode is on (`"strict": true` in tsconfig).
- No `any` types. Use `unknown` and narrow it, or define a proper type.
- All service method return types must be explicitly declared.
- Request body types are inferred from Zod schemas using `z.infer<>`.
- DB row types are generated from Supabase MCP (`npx supabase gen types typescript`). Do not hand-write them.

---

## What NOT to build in V1

Do not create files, stubs, interfaces, or TODOs for:

- Activity feeds or signals
- Recommendation or ranking logic
- Any AI/ML pipeline
- AR or content overlay features
- Gamification (points, badges, streaks)
- User preferences beyond basic profile
- Push notifications
- Admin dashboard

If a task seems to involve any of the above, stop and ask the developer before proceeding.

---

## Agent workflow guidance

When given a task:

1. Check this file first. If the task conflicts with any rule here, flag it before writing code.
2. Use Supabase MCP to inspect the current schema before writing any migration or query.
3. Build one module at a time. Suggested order: Auth → User → Location → Places → SavedPlaces.
4. After scaffolding a module, generate/update TypeScript types from the live schema via MCP.
5. Never apply a destructive migration (DROP, ALTER with data loss) without explicit developer confirmation.
