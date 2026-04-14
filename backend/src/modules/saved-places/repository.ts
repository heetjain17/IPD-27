import { db } from '../../db/client.js';
import { savedPlaces } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

export async function savePlace(userId: string, placeId: string): Promise<void> {
  await db.insert(savedPlaces).values({ userId, placeId });
}

export async function deleteSavedPlace(userId: string, placeId: string): Promise<boolean> {
  const deleted = await db
    .delete(savedPlaces)
    .where(and(eq(savedPlaces.userId, userId), eq(savedPlaces.placeId, placeId)))
    .returning({ userId: savedPlaces.userId });

  return deleted.length > 0;
}
