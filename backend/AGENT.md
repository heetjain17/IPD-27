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

- `POST /auth/register` — Create user in Supabase Auth + local users table, return session
- `POST /auth/login` — Validate credentials via Supabase, return session
- `POST /auth/logout` — Invalidate session in Supabase
- `GET /auth/me` — Get current user profile
- `POST /auth/refresh` — Refresh access token using refresh token
- JWT middleware (`src/middleware/auth.middleware.ts`) — verify Supabase JWT, attach `req.user`

Rules:

- **Hybrid Supabase Auth approach**: Supabase handles passwords/sessions, backend is primary API interface
- Users table has `auth_id` (references Supabase auth.users.id), NO `password_hash` field
- Passwords are handled by Supabase Auth Admin API — never store them locally
- Sessions include `accessToken` (short-lived) and `refreshToken` (long-lived, 30 days)
- Both tokens are set as HTTP-only cookies AND returned in response body
- Cookie settings: `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`
- Refresh token cookie has `path: '/api/v1/auth/refresh'` restriction
- Auth middleware checks Authorization header first, falls back to cookies
- Never return Supabase service role key to client
- Auth module creates user in local DB during register — this is intentional exception

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

## Utilities and Middleware

### Core Utilities (`src/utils/`)

**`ApiError.ts`** - Standard error class

```typescript
class ApiError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true)
}
```

Usage: `throw new ApiError(404, 'Resource not found');`

**`apiSuccess.ts`** - Standard success response formatter

```typescript
apiSuccess(statusCode: number, message: string, data?: T)
```

Usage: `res.json(apiSuccess(200, 'Success', data));`

**`asyncHandler.ts`** - Wraps async route handlers to catch errors

```typescript
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Usage: `export const login = asyncHandler(async (req, res) => { ... });`

**`getEnv.ts`** - Type-safe environment variable getter

```typescript
getEnv(key: string): string  // throws if not found
```

Usage: `const port = getEnv('PORT');`

### Middleware (`src/middleware/`)

**`auth.middleware.ts`** - JWT verification

- Checks `Authorization: Bearer <token>` header first
- Falls back to `accessToken` cookie
- Verifies token with Supabase `auth.getUser()`
- Attaches `user` object to request: `{ authId, email }`
- Throws `ApiError(401)` if invalid/missing

**`validate.middleware.ts`** - Request validation

- Takes Zod schema as parameter
- Validates `req.body` against schema
- Returns 400 with validation errors if invalid
- Replaces `req.body` with parsed data if valid
  Usage: `router.post('/login', validate(loginSchema), controller.login);`

**`error.middleware.ts`** - Centralized error handler

- Catches all thrown errors
- Formats ApiError instances properly
- Returns standard error response format
- Never leaks stack traces in production

### Type Definitions (`src/types/`)

**`auth.d.ts`** - Authenticated request type

```typescript
export interface AuthenticatedRequest extends Request {
  user?: {
    authId: string;
    email: string;
  };
}
```

Usage: `(req as AuthenticatedRequest).user?.authId`

**`express.d.ts`** - Express type extensions (if needed)

### Patterns to Follow

1. **Always use `asyncHandler`** for async route handlers
2. **Always throw `ApiError`** for operational errors (don't return error responses)
3. **Always use `apiSuccess`** for success responses
4. **Always use `getEnv`** instead of `process.env`
5. **Always validate with Zod schemas** before controller logic
6. **Never use `any` type** - use type assertions or proper types
7. **Always use type assertion** for authenticated requests: `(req as AuthenticatedRequest)`

---

## Database

### Conventions

- All primary keys are UUIDs (`uuid` type, `gen_random_uuid()` default).
- All tables have `created_at TIMESTAMPTZ DEFAULT NOW()`.
- Soft deletes are NOT used in V1. Use hard deletes.
- Migrations live in `supabase/migrations/`. Never modify an already-applied migration. Always create a new one.

### Key constraints

- `users.auth_id` — UNIQUE, NOT NULL (references Supabase auth.users.id)
- `users.email` — UNIQUE, NOT NULL
- `users.password_hash` — DOES NOT EXIST (Supabase handles passwords)
- `saved_places (user_id, place_id)` — UNIQUE composite constraint
- `places.geom` — `GEOGRAPHY(POINT, 4326)` type (PostGIS)

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
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout      (auth required)
GET    /api/v1/auth/me          (auth required)
POST   /api/v1/auth/refresh

GET    /api/v1/places/nearby    ?lat=&lng=&radius=
GET    /api/v1/places/:id

POST   /api/v1/places/save      (auth required)
DELETE /api/v1/places/save/:id (auth required)
GET    /api/v1/places/saved     (auth required)

GET    /health
```

Do not add endpoints outside this list without explicit developer instruction.

---

## Error handling

Use a centralised error handler (`src/middleware/error.middleware.ts`).
All errors flow through it. Controllers never send error responses directly.

### ApiError class (`src/utils/ApiError.ts`)

All errors should throw `ApiError`:

```typescript
throw new ApiError(statusCode: number, message: string);
```

Examples:

- `throw new ApiError(404, 'User not found');`
- `throw new ApiError(409, 'User with this email already exists');`
- `throw new ApiError(401, 'Invalid credentials');`

### Standard response formats

**Success** (use `apiSuccess` utility from `src/utils/apiSuccess.ts`):

```typescript
return res.json(apiSuccess(statusCode, message, data?));
// Example: res.json(apiSuccess(200, 'Login successful', result));
```

Response shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": { ... }
}
```

**Error** (thrown as ApiError, caught by error middleware):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [ ... ]  // optional
  }
}
```

HTTP status codes to use:

- `400` — validation error (bad input)
- `401` — missing or invalid JWT
- `403` — authenticated but not authorised
- `404` — resource not found
- `409` — conflict (e.g. duplicate user, duplicate saved place)
- `500` — unexpected server error (never leak stack traces in production)

---

## Environment variables

```
PORT
NODE_ENV                    (development | production)
SUPABASE_URL                (e.g. https://xxx.supabase.co)
SUPABASE_ANON_KEY           (public key for client SDK)
SUPABASE_SERVICE_ROLE_KEY   (NEVER expose to client, server-side only)
DATABASE_URL                (PostgreSQL connection string)
```

All env vars are validated at startup using `getEnv()` utility. If any required var is missing, the server must refuse to start with a clear error message.

**Important**: Use `getEnv('VAR_NAME')` instead of `process.env.VAR_NAME` for type safety and validation.

---

## TypeScript rules

- Strict mode is on (`"strict": true` in tsconfig).
- No `any` types. Use proper types or type assertions when necessary.
- All service method return types must be explicitly declared.
- Request body types are inferred from Zod schemas using `z.infer<>`.
- DB row types are inferred from Drizzle schema using `typeof table.$inferSelect`.
- For authenticated requests, use type assertion: `(req as AuthenticatedRequest).user`
- AuthenticatedRequest type is defined in `src/types/auth.d.ts`

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
