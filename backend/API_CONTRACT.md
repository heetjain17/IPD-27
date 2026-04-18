# V1 API Contract (Simplified)

This is the concise, implementation-aligned API contract for `backend/src` routes.

Machine-readable contract:
- OpenAPI JSON: `GET /openapi.json`
- Swagger UI: `GET /docs`

Base URL:
- `http://localhost:3000`

## Response Envelope

Most endpoints use:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

Common error shape (varies slightly by middleware path):

```json
{
  "success": false,
  "message": "..."
}
```

## Auth

### POST `/api/v1/auth/register`

Auth: public  
Body:
- `email` (`string`, required, email)
- `password` (`string`, required, min 8)
- `name` (`string`, optional)

Success:
- `201` with `data.user` and `data.session`

Errors:
- `400` invalid body
- `409` user already exists

### POST `/api/v1/auth/login`

Auth: public  
Body:
- `email` (`string`, required, email)
- `password` (`string`, required)

Success:
- `200` with `data.user` and `data.session`

Errors:
- `400` invalid body
- `401` invalid credentials
- `404` user profile not found

### POST `/api/v1/auth/logout`

Auth: required (bearer or access token cookie)

Success:
- `200`

Errors:
- `401` no token / not authenticated

### GET `/api/v1/auth/me`

Auth: required

Success:
- `200` with current user profile

Errors:
- `401` not authenticated
- `404` user not found

### POST `/api/v1/auth/refresh`

Auth: refresh cookie based (`refreshToken`)

Success:
- `200` with rotated session tokens

Errors:
- `401` no refresh token or invalid/expired token
- `404` user profile not found

## Places

### GET `/api/v1/places`

Auth: public  
Query (all optional unless noted):
- location: `lat`, `lng` (must be provided together), `radius`
- filters: `category`, `area`, `verified`, `isHiddenGem`, `minPrice`, `maxPrice`
- tags: `tags` (comma-separated), `tagsMode` (`all|any`, default `any`)
- search: `q`
- sort: `sort` (`distance|rating|newest|price_low|price_high|priority`), `order` (`asc|desc`)
- pagination: `limit` (default `20`, max `100`), `cursor`
- shaping: `fields` (`basic|card|full`, default `card`), `include` (comma-separated `media,tags`)

Behavior:
- no geo unless `lat` and `lng` both present
- default sort: `distance` with geo, else `priority`
- radius default `5000`, max clamp `50000`
- unknown tags are ignored
- cursor is keyset sort-key + `id`

Success:
- `200` with `data.places[]`, `data.nextCursor`

Errors:
- `400` invalid query combination/value

### GET `/api/v1/places/filters`

Auth: public

Success:
- `200` with:
  - `categories: string[]`
  - `areas: string[]`
  - `tags: string[]`
  - `priceRanges: { key, min, max }[]`

Notes:
- derived from active places
- tags are active-linked tags

### GET `/api/v1/places/nearby`

Auth: public  
Query:
- `lat` (`number`, required)
- `lng` (`number`, required)
- `radius` (`number`, required, 1..50000)
- `limit` (`number`, optional, default `20`, max `100`)
- `cursor` (`string`, optional)

Success:
- `200` with `data.places[]`, `data.nextCursor`

Errors:
- `400` invalid query

### GET `/api/v1/places/:id`

Auth: public  
Params:
- `id` (`uuid`, required)

Success:
- `200` with full place detail + tags + rating summary + limited media preview (up to 10)

Errors:
- `400` invalid id
- `404` place not found

### GET `/api/v1/places/:id/media`

Auth: public  
Params:
- `id` (`uuid`, required)

Query:
- `limit` (`number`, optional, default `20`, max `100`)
- `cursor` (`string`, optional)

Pagination:
- keyset order: `createdAt ASC, id ASC`

Success:
- `200` with `data.media[]`, `data.nextCursor`

Errors:
- `400` invalid `limit`/`cursor`
- `404` place not found

## Saved Places

### POST `/api/v1/places/save`

Auth: required  
Body:
- `placeId` (`uuid`, required)

Success:
- `200` with `data.saved = true`

Errors:
- `400` invalid body
- `401` not authenticated
- `404` place not found
- `409` already saved

### DELETE `/api/v1/places/save/:placeId`

Auth: required  
Params:
- `placeId` (`uuid`, required)

Success:
- `200` with `data.saved = false`

Errors:
- `400` invalid param
- `401` not authenticated
- `404` saved place not found

### GET `/api/v1/places/saved`

Auth: required  
Query:
- `limit` (`number`, optional, default `20`, max `100`)
- `cursor` (`string`, optional)

Success:
- `200` with `data.places[]`, `data.nextCursor`

Errors:
- `400` invalid `limit`/`cursor`
- `401` not authenticated

## Reviews

### POST `/api/v1/reviews`

Auth: required  
Body:
- `placeId` (`uuid`, required)
- `rating` (`number`, required, min `1`, max `5`)
- `comment` (`string`, optional, min 1, max 2000)

Success:
- `201` with `data.review`

Errors:
- `400` invalid body
- `401` not authenticated
- `404` place not found

### GET `/api/v1/places/:id/reviews`

Auth: public  
Params:
- `id` (`uuid`, required)

Query:
- `limit` (`number`, optional, default `20`, max `100`)
- `cursor` (`string`, optional)

Pagination:
- keyset order: `createdAt DESC, id DESC`

Success:
- `200` with `data.reviews[]`, `data.nextCursor`

Errors:
- `400` invalid `limit`/`cursor`
- `404` place not found

## Tags

### GET `/api/v1/tags`

Auth: public

Success:
- `200` with `data.tags: string[]`

## Health

### GET `/health`

Auth: public

Success:
- `200` with DB connected status

Errors:
- `503` when DB is unreachable

## Implemented Surface

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/places`
- `GET /api/v1/places/filters`
- `GET /api/v1/places/nearby`
- `GET /api/v1/places/:id`
- `GET /api/v1/places/:id/media`
- `POST /api/v1/places/save`
- `DELETE /api/v1/places/save/:placeId`
- `GET /api/v1/places/saved`
- `POST /api/v1/reviews`
- `GET /api/v1/places/:id/reviews`
- `GET /api/v1/tags`
- `GET /health`
