import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { getEnv } from '../utils/getEnv.js';

const connectionString = getEnv('DATABASE_URL');

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
