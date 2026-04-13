# Tourism Backend API

Node.js + Express + TypeScript + Drizzle ORM backend for the tourism discovery platform.

## Project Structure

```
src/
├── config/           # Configuration files
├── db/              # Database client and schema
│   ├── client.ts    # Drizzle database connection
│   ├── schema.ts    # Database schema definitions
│   └── index.ts     # Exports
├── middleware/      # Global middleware
│   ├── error.middleware.ts       # Error handling
│   ├── validation.middleware.ts  # Request validation
│   └── index.ts
├── modules/         # Feature modules (auth, places, etc.)
├── shared/          # Shared utilities across modules
├── types/           # TypeScript type definitions
│   └── express.d.ts # Express type extensions
├── utils/           # Utility functions
│   ├── ApiError.ts      # Custom error class
│   ├── apiSuccess.ts    # Success response helper
│   ├── asyncHandler.ts  # Async route wrapper
│   ├── getEnv.ts        # Environment variable helper
│   └── index.ts
└── index.ts         # Application entry point
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT (for future auth module)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build & Production
npm run build            # Compile TypeScript
npm run start            # Run production build

# Database
npm run db:generate      # Generate migration from schema
npm run db:migrate       # Apply migrations
npm run db:push          # Push schema directly (dev only)
npm run db:studio        # Open Drizzle Studio GUI

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted
npm run code:check       # Run both format check and lint
npm run code:fix         # Run both format and lint fix
```

## Usage Examples

### Using Utilities

```typescript
import { ApiError, apiSuccess, asyncHandler, getEnv } from './utils/index.js';

// Custom error
throw new ApiError(404, 'Resource not found');

// Success response
return res.json(apiSuccess(200, 'Success', { data: user }));

// Async route handler
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await db.select().from(users);
    res.json(apiSuccess(200, 'Users fetched', users));
  }),
);

// Environment variable
const jwtSecret = getEnv('JWT_SECRET');
```

### Request Validation

```typescript
import { validate } from './middleware/index.js';
import { z } from 'zod';

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated.body;
  // ... login logic
});
```

### Error Handling

All errors are automatically caught and formatted by the error middleware:

```typescript
// Validation errors (Zod) → 400
// ApiError → custom status code
// Unknown errors → 500
```

## Development Workflow

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Make schema changes in `src/db/schema.ts`**

3. **Generate and apply migration:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Format and lint before committing:**
   ```bash
   npm run code:fix
   ```

## API Health Check

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "db": "ok"
}
```
