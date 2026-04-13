import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: true,
  },
  tablesFilter: ['!spatial_ref_sys', '!geography_columns', '!geometry_columns'],
} satisfies Config;
