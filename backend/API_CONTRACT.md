# V1 API Contract

**Authentication:** Supabase Auth (hybrid backend-first approach)
**Database:** PostgreSQL + PostGIS via Drizzle ORM
**Auth Flow:** Backend API → Supabase Admin API → Custom users table

---

# 1) API design principles (lock these first)

Before writing endpoints:

### Rules

- Consistent response format
- No raw DB leaking
- Pagination always standardized (cursor-based)
- Errors standardized
- Auth via Bearer token (Supabase JWT)
- Mobile calls backend API, NOT Supabase directly

---

## Standard Response Format

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Error format

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid email"
  }
}
```

---

# 2) Auth API

**Implementation:** Uses Supabase Auth under the hood

- Backend creates Supabase auth user via Admin API
- Backend creates profile entry in `public.users` table
- Returns Supabase JWT to client

## POST /auth/register

### Request

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "session": {
      "accessToken": "supabase-jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": 3600
    }
  }
}
```

### Notes

- Password is handled by Supabase Auth (bcrypt hashing)
- `user.id` is from `public.users` table (references `auth.users.id`)
- No `passwordHash` stored in `public.users`

---

## POST /auth/login

### Request

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "accessToken": "supabase-jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": 3600
    }
  }
}
```

### Notes

- Credentials verified via Supabase Auth
- Returns Supabase-managed JWT
- JWT contains user claims for auth middleware

---

## POST /auth/logout

### Headers

```
Authorization: Bearer <access-token>
```

### Response

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Notes

- Invalidates Supabase session
- Client should clear stored tokens

---

## GET /auth/me

### Headers

```
Authorization: Bearer <access-token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Notes

- Returns current user from `public.users` table
- Requires valid Supabase JWT

---

# 3) Places API

## GET /places/nearby

### Query Params

```text
lat: number
lng: number
radius: number (meters)
limit: number (default 20)
cursor: string (optional)
```

### Response

```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Cafe",
        "lat": 19.07,
        "lng": 72.87,
        "category": "food",
        "distance": 120,
        "tags": ["coffee", "wifi"],
        "thumbnail": "url"
      }
    ],
    "nextCursor": "string"
  }
}
```

### Notes

- `distance` is computed (not stored)
- Uses PostGIS (`ST_DWithin`)

---

## GET /places/:id

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cafe",
    "description": "text",
    "lat": 19.07,
    "lng": 72.87,
    "category": "food",
    "tags": ["coffee"],
    "media": [
      {
        "url": "string",
        "type": "image"
      }
    ],
    "reviews": [
      {
        "rating": 4.5,
        "comment": "Great place"
      }
    ]
  }
}
```

---

## (Optional Admin) POST /places

### Request

```json
{
  "name": "Cafe",
  "lat": 19.07,
  "lng": 72.87,
  "category": "food",
  "source": "user"
}
```

---

# 4) Saved Places API

## POST /places/save

### Request

```json
{
  "placeId": "uuid"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "saved": true
  }
}
```

---

## DELETE /places/save/:placeId

### Response

```json
{
  "success": true,
  "data": {
    "saved": false
  }
}
```

---

## GET /places/saved

### Query Params

```text
limit: number
cursor: string
```

### Response

```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Cafe",
        "lat": 19.07,
        "lng": 72.87
      }
    ],
    "nextCursor": "string"
  }
}
```

---

# 5) Reviews API (you added table → use it minimally)

## POST /reviews

### Request

```json
{
  "placeId": "uuid",
  "rating": 4.5,
  "comment": "Nice place"
}
```

---

## GET /places/:id/reviews

### Response

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "userId": "uuid",
        "rating": 4.5,
        "comment": "Nice place"
      }
    ]
  }
}
```

---

# 6) Tags API (optional but useful)

## GET /tags

```json
{
  "success": true,
  "data": {
    "tags": ["coffee", "wifi"]
  }
}
```

---

# 7) Health API

## GET /health

```json
{
  "status": "ok"
}
```

---

# 8) Important backend decisions (based on your schema)

From your schema:

### You MUST handle:

- **Auth:** Supabase Auth via Admin API (service role key)
- **Users table:** No `passwordHash` - auth handled by Supabase
- **`geom` column:** Populated manually using PostGIS functions
  ```sql
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
  ```
- **Joins:**
  - places ↔ tags (via `place_tags`)
  - places ↔ media
  - places ↔ reviews
- **Unique constraints:**
  - saved_places (user_id, place_id) - composite PK
  - places.external_id (partial unique index WHERE NOT NULL)
- **Enums:**
  - `place_source` - PostgreSQL enum ('google', 'user', 'admin')
  - `place_media.type` - inline enum ('image', 'video')

---

# 9) Authentication & Authorization

### JWT Middleware

**All protected routes require:**

```
Authorization: Bearer <supabase-jwt-token>
```

**Middleware responsibilities:**

1. Verify Supabase JWT signature
2. Extract user ID from JWT claims
3. Attach `req.user` with user data
4. Return 401 if token invalid/expired

**Protected routes:**

- `POST /places/save`
- `DELETE /places/save/:placeId`
- `GET /places/saved`
- `POST /reviews`
- `GET /auth/me`
- `POST /auth/logout`

### Environment Variables Required

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (backend only)
JWT_SECRET=your-supabase-jwt-secret
DATABASE_URL=postgresql://...
```

---

# 10) Pagination strategy (decide now)

Use **cursor-based pagination**

Why:

- stable
- scalable

---

# 11) Final API surface (V1)

### Auth (Supabase-backed)

- `POST /auth/register` - Create Supabase user + profile
- `POST /auth/login` - Verify credentials, return JWT
- `POST /auth/logout` - Invalidate session (protected)
- `GET /auth/me` - Get current user (protected)

### Places

- `GET /places/nearby` - PostGIS radius query (public)
- `GET /places/:id` - Get place details with joins (public)
- `POST /places` - Create place (admin only, future)

### Saved Places

- `POST /places/save` - Save place (protected)
- `DELETE /places/save/:placeId` - Unsave place (protected)
- `GET /places/saved` - List saved places (protected)

### Reviews

- `POST /reviews` - Create review (protected)
- `GET /places/:id/reviews` - List place reviews (public)

### Tags

- `GET /tags` - List all tags (public)

### System

- `GET /health` - Health check (public)

---

# 12) Schema-API alignment

Your schema already supports:

- ✅ Geo queries (PostGIS geography + GIST index)
- ✅ Tagging (many-to-many via `place_tags`)
- ✅ Media (one-to-many `place_media`)
- ✅ Reviews (one-to-many with double precision rating)
- ✅ External sources (enum + partial unique index)
- ✅ User bookmarks (`saved_places` composite PK)
- ✅ Supabase Auth integration (no password_hash in users table)

**API layer is clean mapping, not redesign.**

### Data Flow Examples

**Register:**

```
Client → POST /auth/register
  → Backend validates input
  → Backend calls Supabase Admin API (createUser)
  → Backend inserts into public.users (with auth_id reference)
  → Returns Supabase JWT to client
```

**Nearby Places:**

```
Client → GET /places/nearby?lat=19.07&lng=72.87&radius=1000
  → Backend validates params
  → PostGIS query: ST_DWithin(geom, point, radius)
  → Join with tags, media
  → Return sorted by distance
```

**Save Place:**

```
Client → POST /places/save (with JWT)
  → Auth middleware verifies JWT
  → Extract user_id from token
  → Insert into saved_places (user_id, place_id)
  → Handle duplicate (composite PK prevents)
  → Return success
```

---

# 13) What NOT to add right now

- search engine
- filters explosion
- sorting by rating/popularity
- AI endpoints
- activity endpoints

---

# 14) Implementation Notes

### Supabase Auth Integration

**Backend responsibilities:**

1. Use `@supabase/supabase-js` with service role key
2. Create auth users via `supabase.auth.admin.createUser()`
3. Verify sessions via `supabase.auth.getUser(jwt)`
4. Sync `auth.users.id` → `public.users.id`

**Security:**

- ❌ Never expose service role key to mobile
- ✅ Mobile only receives Supabase JWT from backend
- ✅ Backend validates JWT on protected routes
- ✅ RLS enabled on `public.users` table

### PostGIS Integration

**Geom column population:**

```typescript
// In repository layer
await db.execute(sql`
  UPDATE places 
  SET geom = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
  WHERE id = ${placeId}
`);
```

**Nearby query:**

```typescript
await db.execute(sql`
  SELECT *, 
    ST_Distance(geom, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) as distance
  FROM places
  WHERE ST_DWithin(
    geom,
    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
    ${radiusMeters}
  )
  ORDER BY distance
  LIMIT ${limit}
`);
```

---

# 15) Next Steps

At this point you have:

- ✅ Database schema (Drizzle ORM)
- ✅ API contracts (this document)
- ✅ Supabase Auth strategy

**Next: Module-wise implementation**

1. Install dependencies (`@supabase/supabase-js`, `jsonwebtoken`)
2. Create Supabase client utilities (admin + public)
3. Build Auth module (controller → service → repository)
4. Build auth middleware (JWT verification)
5. Build remaining modules following AGENT.md structure

**Module order:**

1. Auth (foundation)
2. User (profile management)
3. Places (core feature)
4. Saved Places (user interaction)
5. Reviews (optional but included in schema)

---
