import type { Config } from 'drizzle-kit';
import { getEnv } from './src/utils/getEnv.js';

const DATABASE_URL = getEnv('DATABASE_URL');

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
