import { db } from '../../db/client.js';
import { tags } from '../../db/schema.js';
import { asc } from 'drizzle-orm';

/**
 * Returns all tag names sorted alphabetically.
 * The `id` column is intentionally excluded — only names are public.
 */
export async function getAllTags(): Promise<string[]> {
  const rows = await db.select({ name: tags.name }).from(tags).orderBy(asc(tags.name));
  return rows.map((r) => r.name);
}
