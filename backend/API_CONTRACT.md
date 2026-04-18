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
- Auth via Bearer token and secure cookies (Supabase JWT)
- Mobile calls backend API, NOT Supabase directly

---

## Standard Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

### Error format

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# 2) Auth API

**Implementation:** Hybrid Supabase Auth (Backend API Primary)

- Backend creates Supabase auth user via Admin API
- Backend creates profile entry in `public.users` table (with `auth_id` reference)
- Returns Supabase JWT + sets HTTP-only cookies
- Mobile/web calls backend API, NOT Supabase directly
- Tokens: `accessToken` (short-lived) + `refreshToken` (30 days)
- Cookies: `accessToken` and `refreshToken` (HTTP-only, secure, SameSite strict)

## POST /api/v1/auth/register

### Request

```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "John Doe"
}
```

`name` is optional.

### Response (201 Created)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
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

### Cookies Set

```
Set-Cookie: accessToken=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/api/v1/auth/refresh
```

### Notes

- Password is handled by Supabase Auth (never stored locally)
- `user.id` is from `public.users` table
- `auth_id` field references Supabase `auth.users.id`
- No `passwordHash` in `public.users` table
- Tokens returned in response body AND set as cookies
- Refresh token cookie restricted to `/api/v1/auth/refresh` path

### Errors

- `409 Conflict` - User with email already exists
- `400 Bad Request` - Validation error or Supabase auth error

---

## POST /api/v1/auth/login

### Request

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
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

### Cookies Set

```
Set-Cookie: accessToken=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/api/v1/auth/refresh
```

### Notes

- Credentials verified via Supabase `signInWithPassword`
- Returns Supabase-managed JWT
- JWT contains user claims for auth middleware
- Tokens returned in response body AND set as cookies

### Errors

- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User profile not found in local DB

---

## POST /api/v1/auth/logout

### Headers

```
Authorization: Bearer <access-token>
```

**OR** uses `accessToken` cookie if header not present

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

### Cookies Cleared

```
Set-Cookie: accessToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/api/v1/auth/refresh
```

### Notes

- Invalidates Supabase session via Admin API
- Clears both `accessToken` and `refreshToken` cookies
- Accepts token from header OR cookie

### Errors

- `401 Unauthorized` - No token provided
- `500 Internal Server Error` - Failed to logout

---

## GET /api/v1/auth/me

### Headers

```
Authorization: Bearer <access-token>
```

**OR** uses `accessToken` cookie if header not present

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Notes

- Returns current user from `public.users` table
- Requires valid Supabase JWT (verified via `auth.getUser`)
- Accepts token from header OR cookie
- User identified by `auth_id` from JWT claims

### Errors

- `401 Unauthorized` - Invalid or expired token
- `404 Not Found` - User profile not found

---

## POST /api/v1/auth/refresh

### Request

No body required. Uses `refreshToken` from cookie.

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "session": {
      "accessToken": "new-supabase-jwt-token",
      "refreshToken": "new-refresh-token",
      "expiresIn": 3600
    }
  }
}
```

### Cookies Set

```
Set-Cookie: accessToken=<new-jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
Set-Cookie: refreshToken=<new-token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/api/v1/auth/refresh
```

### Notes

- Uses `refreshToken` from cookie (path-restricted)
- Calls Supabase `auth.refreshSession()` to get new tokens
- Returns new access token + new refresh token (token rotation)
- Updates both cookies with new tokens
- No Authorization header required

### Errors

- `401 Unauthorized` - No refresh token provided or invalid/expired refresh token
- `404 Not Found` - User profile not found

---

# 3) Places API

## GET /api/v1/places

### Query Params

```text
lat: number (optional, must be paired with lng)
lng: number (optional, must be paired with lat)
radius: number (meters, optional, default 5000, clamped max 50000)

category: string (optional)
area: string (optional)
verified: boolean (optional)
isHiddenGem: boolean (optional)
minPrice: number (optional)
maxPrice: number (optional)

tags: comma-separated string (optional)
tagsMode: all | any (optional, default any)

q: string (optional)

sort: distance | rating | newest | price_low | price_high | priority (optional)
order: asc | desc (optional)

limit: number (default 20, max 100)
cursor: string (optional, keyset pagination)

fields: basic | card | full (optional, default card)
include: comma-separated string (optional, allowed: media, tags; max 2)
```

### Query Rules

- `lat` and `lng` must be provided together. If only one is present, return `400 Bad Request`.
- If `lat/lng` are missing, geo distance is not computed and geo sorting is not applied.
- If `lat/lng` are present and `sort` is omitted, default sort is `distance`.
- If `lat/lng` are absent and `sort` is omitted, default sort is `priority`.
- `radius` defaults to `5000` metres.
- `radius > 50000` is clamped to `50000`.
- `radius < 1` falls back to the default.
- All filters are AND-based.
- `tagsMode=all` means a place must match all provided tags.
- `tagsMode=any` means a place may match any provided tag.
- Unknown tags are ignored.
- `q` is applied using case-insensitive partial matching on `name`, `description`, and `area` in V1.
- Only whitelisted sort values are accepted.
- `cursor` is keyset-based and tied to the active sort key plus `id` as a stable tie-breaker.
- `include` is intentionally limited in V1 to avoid heavy list queries.

### Field Presets

#### `basic`

- `id`
- `name`
- `lat`
- `lng`

#### `card` (default)

- `id`
- `name`
- `lat`
- `lng`
- `category`
- `address`
- `area`
- `thumbnail`
- `tags`
- `distance` when geo is enabled

#### `full`

- includes all non-heavy list-safe place fields
- excludes heavy relations by default
- relation data is still controlled by `include`

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Places retrieved",
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Cafe",
        "lat": 19.07,
        "lng": 72.87,
        "category": "food",
        "address": "123 Main St, Mumbai",
        "googleTypes": ["cafe", "food", "point_of_interest"],
        "area": "juhu",
        "lastSyncedAt": "2026-04-18T10:00:00.000Z",
        "isActive": true,
        "customDescription": "A cozy local spot with street-side seating",
        "vibe": "casual",
        "isHiddenGem": false,
        "priorityScore": 0,
        "verified": false,
        "bestTimeToVisit": "Evening",
        "avgCostForTwo": 800,
        "crowdLevelOverride": null,
        "notes": null,
        "distance": 120,
        "tags": ["coffee", "wifi"],
        "thumbnail": "https://..."
      }
    ],
    "nextCursor": "base64url-cursor-or-null"
  }
}
```

### Notes

- Public endpoint
- `distance` is returned only when geo inputs are present
- Uses keyset pagination cursor only; offset pagination is not supported
- Reviews are not joined into list results in V1
- Includes are controlled and limited to prevent overfetching

### Empty Results

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Places retrieved",
  "data": {
    "places": [],
    "nextCursor": null
  }
}
```

### Errors

- `400 Bad Request` - Invalid query combination or unsupported query value

---

## GET /api/v1/places/filters

Returns metadata for building client-side filter UIs.

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Place filters retrieved",
  "data": {
    "categories": ["food", "cafe"],
    "areas": ["juhu", "bandra"],
    "tags": ["coffee", "wifi"],
    "priceRanges": [
      {
        "key": "budget",
        "min": 0,
        "max": 500
      }
    ]
  }
}
```

### Notes

- Public endpoint
- Intended for filter metadata only
- Keeps mobile clients from hardcoding categories, tags, or area options

---

## GET /api/v1/places/:id

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Place retrieved",
  "data": {
    "id": "uuid",
    "name": "Cafe",
    "description": "text",
    "lat": 19.07,
    "lng": 72.87,
    "category": "food",
    "address": "123 Main St, Mumbai",
    "googleTypes": ["cafe", "food", "point_of_interest"],
    "area": "juhu",
    "lastSyncedAt": "2026-04-18T10:00:00.000Z",
    "isActive": true,
    "customDescription": "A cozy local spot with street-side seating",
    "vibe": "casual",
    "isHiddenGem": false,
    "priorityScore": 0,
    "verified": false,
    "bestTimeToVisit": "Evening",
    "avgCostForTwo": 800,
    "crowdLevelOverride": null,
    "notes": null,
    "averageRating": 4.3,
    "reviewCount": 12,
    "tags": ["coffee", "wifi"],
    "media": [
      {
        "url": "https://...",
        "type": "image"
      }
    ]
  }
}
```

### Notes

- Public endpoint
- `averageRating` and `reviewCount` are cached columns on `places`
- Cached values are kept in sync by Postgres trigger on `reviews`
- This is the primary full-detail endpoint for a single place
- Returns tags, limited media, and rating summary

---

## GET /api/v1/places/:id/media

### Query Params

```text
limit: number (default 20, max 100)
cursor: string (optional)
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Place media retrieved",
  "data": {
    "media": [
      {
        "url": "https://...",
        "type": "image"
      }
    ],
    "nextCursor": "base64url-cursor-or-null"
  }
}
```

### Notes

- Public endpoint
- Dedicated media endpoint prevents unbounded media payloads in list and detail responses
- Uses cursor pagination

---

# 4) Saved Places API

## POST /api/v1/places/save

### Request

```json
{
  "placeId": "uuid"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Place saved",
  "data": {
    "saved": true
  }
}
```

### Errors

- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Place not found
- `409 Conflict` - Place already saved

---

## DELETE /api/v1/places/save/:placeId

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Place unsaved",
  "data": {
    "saved": false
  }
}
```

### Errors

- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Saved place not found

---

## GET /api/v1/places/saved

### Query Params

```text
limit: number (default 20, max 100)
cursor: string (optional)
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Saved places retrieved",
  "data": {
    "places": [
      {
        "id": "uuid",
        "name": "Cafe",
        "lat": 19.07,
        "lng": 72.87,
        "category": "food",
        "address": "123 Main St, Mumbai",
        "googleTypes": ["cafe", "food", "point_of_interest"],
        "area": "juhu",
        "lastSyncedAt": "2026-04-18T10:00:00.000Z",
        "isActive": true,
        "customDescription": "A cozy local spot with street-side seating",
        "vibe": "casual",
        "isHiddenGem": false,
        "priorityScore": 0,
        "verified": false,
        "bestTimeToVisit": "Evening",
        "avgCostForTwo": 800,
        "crowdLevelOverride": null,
        "notes": null,
        "tags": ["coffee"],
        "thumbnail": "https://..."
      }
    ],
    "nextCursor": "base64url-cursor-or-null"
  }
}
```

---

# 5) Reviews API

## POST /api/v1/reviews

### Request

```json
{
  "placeId": "uuid",
  "rating": 4.5,
  "comment": "Nice place"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created",
  "data": {
    "review": {
      "id": "uuid",
      "placeId": "uuid",
      "userId": "uuid",
      "rating": 4.5,
      "comment": "Nice place",
      "createdAt": "2026-04-17T10:00:00.000Z"
    }
  }
}
```

### Notes

- Protected endpoint
- On insert/update/delete, DB trigger updates `places.average_rating` and `places.review_count`

---

## GET /api/v1/places/:id/reviews

### Query Params

```text
limit: number (default 20, max 100)
cursor: string (optional)
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reviews retrieved",
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "placeId": "uuid",
        "userId": "uuid",
        "rating": 4.5,
        "comment": "Nice place",
        "createdAt": "2026-04-17T10:00:00.000Z"
      }
    ],
    "nextCursor": "base64url-cursor-or-null"
  }
}
```

---

# 6) Tags API

## GET /api/v1/tags

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tags retrieved",
  "data": {
    "tags": ["coffee", "wifi"]
  }
}
```

---

# 7) Health API

## GET /health

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "db": "connected"
  },
  "error": null
}
```

---

# 8) Authentication & Authorization

### Token sources

- `Authorization: Bearer <access-token>` header
- `accessToken` cookie (fallback in auth middleware)

### Protected routes

- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/places/save`
- `DELETE /api/v1/places/save/:placeId`
- `GET /api/v1/places/saved`
- `POST /api/v1/reviews`

### Environment Variables Required

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
```

---

# 9) Final API surface (implemented)

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/refresh`

### Places

- `GET /api/v1/places`
- `GET /api/v1/places/filters`
- `GET /api/v1/places/:id`
- `GET /api/v1/places/:id/media`
- `GET /api/v1/places/:id/reviews`

### Saved Places

- `POST /api/v1/places/save`
- `DELETE /api/v1/places/save/:placeId`
- `GET /api/v1/places/saved`

### Reviews

- `POST /api/v1/reviews`

### Tags

- `GET /api/v1/tags`

### System

- `GET /health`

### Transitional note

- `GET /api/v1/places/nearby` may be retained temporarily as a backward-compatibility route during rollout, but `GET /api/v1/places` is the primary V1 list endpoint going forward.

---
