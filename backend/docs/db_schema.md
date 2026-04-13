**final V1 schema**

---

# 1) Extensions (must enable first)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

**Note:** Drizzle uses `gen_random_uuid()` (built-in Postgres 13+) instead of `uuid-ossp`.

---

# 2) USERS

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

---

# 3) PLACES (core of your system)

```sql
-- Create enum type first
CREATE TYPE place_source AS ENUM ('google', 'user', 'admin');

CREATE TABLE places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL,
  description text,

  lat double precision NOT NULL,
  lng double precision NOT NULL,
  geom geography(Point, 4326),

  category text NOT NULL,

  source place_source NOT NULL,
  external_id text,

  opening_hours text,
  contact_phone text,
  website_url text,
  price_level int,

  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

---

# 4) TAGS (flexible categorization)

```sql
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);
```

```sql
CREATE TABLE place_tags (
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, tag_id)
);
```

---

# 5) SAVED PLACES (user bookmarks)

```sql
CREATE TABLE saved_places (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, place_id)
);
```

---

# 6) PLACE MEDIA (images/videos)

```sql
CREATE TABLE place_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text CHECK (type IN ('image', 'video')),
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);
```

---

# 7) REVIEWS

```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  rating double precision NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

---

# 8) INDEXES (critical for performance)

### Geo index (must be created manually)

```sql
CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);
```

**Note:** GIST indexes are not supported in Drizzle schema definitions and must be created manually after migration.

### Useful indexes

```sql
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_source ON places(source);
CREATE INDEX idx_saved_user ON saved_places(user_id);
CREATE INDEX idx_reviews_place ON reviews(place_id);
```

---

# 9) Important constraints & decisions

### Prevent duplicate external imports

```sql
CREATE UNIQUE INDEX idx_places_external_unique
ON places (external_id)
WHERE external_id IS NOT NULL;
```

---

### Keep geom in sync (you handle in backend)

Whenever inserting/updating:

```sql
geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
```

---

# 10) Final structure (mental model)

```text
users
  ↓
places ← place_tags → tags
  ↓
saved_places
  ↓
reviews
  ↓
place_media
```

---

# 11) What this schema gives you

### You can already:

- store Google + custom places
- support hidden/local places
- run geo queries (PostGIS)
- tag/filter places
- save/bookmark
- add media
- add reviews

---

# 12) What you intentionally skipped (correctly)

- no JSON fields
- no over-engineering
- no AI tables
- no activity system
- no social graph

---

# 13) Known limitations (acceptable for V1)

- opening_hours is raw text
- no crowd/activity tracking
- no advanced search index
- no ownership/business claims

All of these can be added later **without breaking schema**.

---

# 14) Drizzle ORM Walkthrough

This section explains how the SQL schema above maps to our Drizzle ORM implementation in `src/db/schema.ts`.

## A. Drizzle Basics

### How Drizzle Maps to SQL

Drizzle is a TypeScript ORM that generates SQL from type-safe schema definitions:

```typescript
// Drizzle schema
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
});

// Generates SQL
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL
);
```

### Type Inference

Drizzle automatically infers TypeScript types from your schema:

```typescript
export type User = typeof users.$inferSelect;
// { id: string; email: string; passwordHash: string; createdAt: Date }

export type NewUser = typeof users.$inferInsert;
// { id?: string; email: string; passwordHash: string; createdAt?: Date }
```

- `$inferSelect` - Type for reading from database (all fields present)
- `$inferInsert` - Type for inserting (optional fields with defaults)

### Column Modifiers

```typescript
.notNull()          // NOT NULL constraint
.unique()           // UNIQUE constraint
.primaryKey()       // PRIMARY KEY
.defaultRandom()    // DEFAULT gen_random_uuid()
.defaultNow()       // DEFAULT now()
.references()       // FOREIGN KEY
```

## B. Custom Types (PostGIS Geography)

PostgreSQL PostGIS types aren't built into Drizzle, so we define them as custom types:

```typescript
const geography = customType<{ data: string }>({
  dataType() {
    return 'geography(Point, 4326)';
  },
});

// Usage
geom: geography('geom'),
```

**Important:** The `geom` column must be populated manually in your repository layer:

```typescript
// In repository when inserting/updating
await db.execute(sql`
  UPDATE places 
  SET geom = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
  WHERE id = ${placeId}
`);
```

## C. Enums

### PostgreSQL Enum (pgEnum)

For database-level enums that enforce constraints at the DB layer:

```typescript
// Define enum first
export const placeSourceEnum = pgEnum('place_source', ['google', 'user', 'admin']);

// Use in table
source: placeSourceEnum('source').notNull(),
```

Generates:

```sql
CREATE TYPE place_source AS ENUM ('google', 'user', 'admin');
ALTER TABLE places ADD COLUMN source place_source NOT NULL;
```

### Inline Enum

For application-level validation without DB constraint:

```typescript
type: text('type', { enum: ['image', 'video'] }),
```

Generates:

```sql
type text CHECK (type IN ('image', 'video'))
```

**When to use which:**

- `pgEnum` - When the enum is shared across tables or needs DB-level enforcement
- Inline enum - For simple, table-specific enums

## D. Relationships

### Foreign Keys

```typescript
placeId: uuid('place_id')
  .notNull()
  .references(() => places.id, { onDelete: 'cascade' }),
```

Generates:

```sql
place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE
```

### Composite Primary Keys

```typescript
export const placeTags = pgTable(
  'place_tags',
  {
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.placeId, table.tagId] })],
);
```

**Note:** The second parameter to `pgTable` is a function that returns index/constraint definitions.

## E. Indexes

### Regular Index

```typescript
(table) => [index('idx_places_category').on(table.category)];
```

Generates:

```sql
CREATE INDEX idx_places_category ON places(category);
```

### Unique Index with WHERE Clause

```typescript
uniqueIndex('idx_places_external_unique')
  .on(table.externalId)
  .where(sql`${table.externalId} IS NOT NULL`),
```

Generates:

```sql
CREATE UNIQUE INDEX idx_places_external_unique
ON places (external_id)
WHERE external_id IS NOT NULL;
```

### GIST Indexes (Manual)

Drizzle doesn't support GIST indexes in schema definitions. Create them manually:

```sql
CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);
```

Run this after `drizzle-kit push` or in a separate migration file.

## F. Complete Example: Places Table

```typescript
export const places = pgTable(
  'places', // Table name
  {
    // Column definitions
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),
    geom: geography('geom'), // Custom PostGIS type
    source: placeSourceEnum('source').notNull(), // PostgreSQL enum
    createdBy: uuid('created_by').references(() => users.id),
  },
  (table) => [
    // Indexes and constraints
    index('idx_places_category').on(table.category),
    uniqueIndex('idx_places_external_unique')
      .on(table.externalId)
      .where(sql`${table.externalId} IS NOT NULL`),
  ],
);

// Type exports
export type Place = typeof places.$inferSelect;
export type NewPlace = typeof places.$inferInsert;
```

## G. Using Types in Code

### In Repositories

```typescript
import { db } from '../db/client';
import { users, type NewUser, type User } from '../db/schema';

export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}
```

### In Services

```typescript
import type { NewPlace, Place } from '../db/schema';
import * as placeRepo from './repository';

export async function createPlace(data: NewPlace): Promise<Place> {
  // Business logic here
  return await placeRepo.create(data);
}
```

## H. Migration Workflow

### 1. Update Schema

Edit `src/db/schema.ts` with your changes.

### 2. Generate Migration

```bash
npm run db:generate
```

Creates a new migration file in `drizzle/` folder.

### 3. Review Migration

Check the generated SQL in `drizzle/XXXX_migration_name.sql`.

### 4. Apply Migration

```bash
npm run db:push
```

Applies the migration to your database.

### 5. Manual Steps (if needed)

For PostGIS GIST indexes or other unsupported features, run SQL manually:

```bash
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);"
```

## I. Common Patterns

### Timestamps

```typescript
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
```

### Optional Foreign Keys

```typescript
createdBy: uuid('created_by').references(() => users.id),  // Nullable
```

### Cascade Deletes

```typescript
.references(() => users.id, { onDelete: 'cascade' })
```

When parent is deleted, child rows are automatically deleted.

## J. Drizzle vs Raw SQL

**Use Drizzle for:**

- Table definitions and schema management
- Type-safe queries
- Simple CRUD operations
- Joins and relations

**Use Raw SQL for:**

- PostGIS spatial queries
- Complex aggregations
- Performance-critical queries
- Database-specific features (GIST indexes, triggers, etc.)

Example mixing both:

```typescript
// Drizzle query
const place = await db.query.places.findFirst({
  where: eq(places.id, placeId),
});

// Raw SQL for PostGIS
const nearby = await db.execute(sql`
  SELECT * FROM places
  WHERE ST_DWithin(
    geom,
    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
    ${radiusMeters}
  )
`);
```

---
