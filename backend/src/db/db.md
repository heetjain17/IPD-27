# Database Setup with Drizzle ORM

## Structure

```
src/db/
  ├── client.ts   - Database connection and Drizzle instance
  ├── schema.ts   - Database schema definitions
  └── index.ts    - Exports for easy importing
```

## Usage

### Import the database client

```typescript
import { db } from './db/index.js';

// Query example
const users = await db.select().from(users);
```

### Environment Variables

Make sure `DATABASE_URL` is set in your `.env` file:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

## Drizzle Kit Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly to database (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Adding New Tables

1. Define your table in `schema.ts`:

```typescript
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

2. Generate migration:

```bash
npm run db:generate
```

3. Apply migration:

```bash
npm run db:migrate
```
