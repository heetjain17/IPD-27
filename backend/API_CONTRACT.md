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

## GET /api/v1/places/nearby

### Query Params

```text
lat: number
lng: number
radius: number (meters, min 1, max 50000)
limit: number (default 20, max 100)
cursor: string (optional)
```

### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Nearby places retrieved",
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
- `distance` is computed by Location module (metres)
- Uses keyset pagination cursor

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

- `GET /api/v1/places/nearby`
- `GET /api/v1/places/:id`
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

---
