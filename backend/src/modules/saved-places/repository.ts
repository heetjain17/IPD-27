import { db } from '../../db/client.js';
import { savedPlaces } from '../../db/schema.js';

export async function savePlace(userId: string, placeId: string): Promise<void> {
  await db.insert(savedPlaces).values({ userId, placeId });
}
