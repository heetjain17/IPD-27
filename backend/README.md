# Tourism — Backend API

Node.js + Express + TypeScript REST API for the tourism discovery platform. Uses **Drizzle ORM**, **PostGIS**, and **Supabase Auth**.

## Tech Stack

| Layer      | Library                             |
| ---------- | ----------------------------------- |
| Runtime    | Node.js (ESM)                       |
| Framework  | Express                             |
| Language   | TypeScript (nodenext)               |
| ORM        | Drizzle ORM                         |
| Database   | PostgreSQL + PostGIS (via Supabase) |
| Auth       | Supabase Auth (JWT)                 |
| Validation | Zod                                 |
| API Docs   | OpenAPI / Swagger                   |

## Setup

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
JWT_SECRET=<supabase-jwt-secret>
FRONTEND_URL=http://localhost:8081
```

## Available Scripts

```bash
npm run dev              # Start dev server with hot reload (tsx watch)
npm run build            # Compile TypeScript
npm run start            # Run production build

npm run db:generate      # Generate Drizzle migration from schema changes
npm run db:migrate       # Apply pending migrations
npm run db:push          # Push schema directly (dev only)
npm run db:studio        # Open Drizzle Studio GUI

npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format
npm run code:fix         # format + lint:fix together
```

## Project Structure

```
src/
├── db/
│   ├── client.ts           # Drizzle + postgres-js connection
│   ├── schema.ts           # All table definitions
│   └── index.ts
├── lib/
│   └── supabase.ts         # Supabase public + admin clients
├── middleware/
│   ├── auth.middleware.ts       # JWT verification (header or cookie)
│   ├── validate.middleware.ts   # Zod schema validation
│   └── error.middleware.ts      # Global error handler
├── modules/
│   ├── auth/               # Register, login, logout, me, refresh
│   ├── places/             # Discovery, detail, filters
│   ├── reviews/            # Create + list reviews
│   ├── saved-places/       # Save / unsave / list saved places
│   ├── tags/               # Tag list
│   └── location/           # Reverse geocode helper
├── openapi/                # OpenAPI spec generation
├── types/
│   └── auth.d.ts           # AuthenticatedRequest interface
└── utils/
    ├── ApiError.ts         # Custom error class
    ├── apiSuccess.ts       # Success response formatter
    ├── asyncHandler.ts     # Async route wrapper
    └── getEnv.ts           # Type-safe env getter
```

## API Endpoints

All routes are prefixed with `/api/v1`.

### Auth — `/auth`

| Method | Path             | Auth | Description           |
| ------ | ---------------- | ---- | --------------------- |
| POST   | `/auth/register` | —    | Create account        |
| POST   | `/auth/login`    | —    | Login, returns tokens |
| POST   | `/auth/logout`   | ✅   | Invalidate session    |
| GET    | `/auth/me`       | ✅   | Current user profile  |
| POST   | `/auth/refresh`  | —    | Refresh access token  |

### Places — `/places`

| Method | Path              | Auth | Description                                             |
| ------ | ----------------- | ---- | ------------------------------------------------------- |
| GET    | `/places`         | ✅   | List / search / filter places (paginated)               |
| GET    | `/places/filters` | ✅   | Filter metadata (categories, areas, tags, price ranges) |
| GET    | `/places/:id`     | ✅   | Place detail                                            |

**Query params for `GET /places`:**

| Param         | Type   | Description                                                                     |
| ------------- | ------ | ------------------------------------------------------------------------------- |
| `q`           | string | Full-text search                                                                |
| `category`    | string | Filter by category                                                              |
| `area`        | string | Filter by area                                                                  |
| `sort`        | string | `priority` \| `distance` \| `rating` \| `newest` \| `price_low` \| `price_high` |
| `lat` / `lng` | number | User coordinates (required for `sort=distance`)                                 |
| `radius`      | number | Search radius in metres (default varies)                                        |
| `cursor`      | string | Pagination cursor                                                               |
| `limit`       | number | Page size (default 20)                                                          |

### Reviews — `/places/:id/reviews`

| Method | Path                  | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| GET    | `/places/:id/reviews` | ✅   | List reviews (paginated) |
| POST   | `/places/:id/reviews` | ✅   | Submit a review          |

### Saved Places — `/saved-places`

| Method | Path                | Auth | Description       |
| ------ | ------------------- | ---- | ----------------- |
| GET    | `/saved-places`     | ✅   | List saved places |
| POST   | `/saved-places/:id` | ✅   | Save a place      |
| DELETE | `/saved-places/:id` | ✅   | Unsave a place    |

### Tags — `/tags`

| Method | Path    | Auth | Description   |
| ------ | ------- | ---- | ------------- |
| GET    | `/tags` | ✅   | List all tags |

### Health

```bash
GET /health
# → { "status": "ok", "db": "ok" }
```

## Database Schema

### Tables

| Table          | Description                                        |
| -------------- | -------------------------------------------------- |
| `users`        | App users linked to Supabase auth (`auth_id`)      |
| `places`       | Core place data with PostGIS geography column      |
| `reviews`      | User reviews with star rating and optional comment |
| `saved_places` | User ↔ place bookmarks                             |
| `tags`         | Tag definitions                                    |
| `place_tags`   | Many-to-many place ↔ tag join                      |

### Key Patterns

- **PostGIS** — `places.location` is a `geography(Point, 4326)` column; distance queries use `ST_DWithin` and `ST_Distance`.
- **Cached aggregates** — `places.average_rating` and `places.review_count` are maintained by a Postgres trigger on the `reviews` table (no JOIN at query time).
- **Cursor pagination** — uses an opaque base64 cursor rather than `OFFSET`.

## Module Pattern

Every feature module follows the same structure:

```
modules/<name>/
├── types.ts        # Request/response interfaces
├── schema.ts       # Zod validation schemas
├── repository.ts   # Raw DB queries (Drizzle)
├── service.ts      # Business logic
├── controller.ts   # Route handlers (uses asyncHandler)
└── routes.ts       # Express Router + middleware wiring
```

### Conventions

```typescript
// Throw errors
throw new ApiError(404, 'Place not found');

// Return success
return res.json(apiSuccess(200, 'Places fetched', data));

// Wrap async handlers
router.get('/places', requireAuth, asyncHandler(controller.list));

// Read env
const secret = getEnv('JWT_SECRET');
```

## Development Workflow

1. Start the server:

   ```bash
   npm run dev
   ```

2. Edit `src/db/schema.ts` for schema changes, then:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. Before committing:
   ```bash
   npm run code:fix
   ```

## OpenAPI Docs

The spec is auto-generated and served at:

```
GET /api/v1/docs
```
