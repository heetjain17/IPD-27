import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sql } from 'drizzle-orm';

import { db } from './db/client.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { getEnv } from './utils/getEnv.js';

import authRoutes from './modules/auth/routes.js';
import placesRoutes from './modules/places/routes.js';
import savedPlacesRoutes from './modules/saved-places/routes.js';
import reviewsRoutes from './modules/reviews/routes.js';
import tagsRoutes from './modules/tags/routes.js';
import { mountOpenApiRoutes } from './openapi/routes.js';

const PORT = getEnv('PORT');
// const FRONTEND_URL = getEnv('FRONTEND_URL');

const app = express();

// Security & Protection
app.use(helmet());

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        db: 'connected',
      },
      error: null,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      data: null,
      error: {
        code: 'DB_UNREACHABLE',
        message: error,
      },
    });
  }
});

// OpenAPI: raw spec is always available; interactive docs are non-production only.
mountOpenApiRoutes(app);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/places', savedPlacesRoutes);
app.use('/api/v1/places', placesRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/tags', tagsRoutes);

// Error handling
app.use(errorMiddleware);

/**
 * Verify database connectivity before starting the server.
 * Logs the connected database name and server timestamp.
 */
async function verifyDatabase(): Promise<void> {
  const result = await db.execute(sql`SELECT current_database() AS db, now() AS time`);
  const row = result[0] as { db: string; time: string };
  console.log(`✓ Database connected — db: "${row.db}", server time: ${row.time}`);
}

/**
 * Initialize and start the Express server.
 * Performs database connectivity check before accepting requests.
 */
async function startServer(): Promise<void> {
  try {
    await verifyDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Docs on http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
