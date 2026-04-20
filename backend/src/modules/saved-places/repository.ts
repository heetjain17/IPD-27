import { db } from '../../db/client.js';
import { savedPlaces, users } from '../../db/schema.js';
import { and, desc, eq, lt, or } from 'drizzle-orm';

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

interface GetSavedPlaceRowsParams {
  limit: number;
  cursorTs?: Date;
  cursorId?: string;
}

export interface SavedPlaceRow {
  placeId: string;
  createdAt: Date;
}

export async function getSavedPlaceRows(
  userId: string,
  params: GetSavedPlaceRowsParams,
): Promise<SavedPlaceRow[]> {
  const { limit, cursorTs, cursorId } = params;

  const cursorFilter =
    cursorTs && cursorId
      ? or(
          lt(savedPlaces.createdAt, cursorTs),
          and(eq(savedPlaces.createdAt, cursorTs), lt(savedPlaces.placeId, cursorId)),
        )
      : undefined;

  const whereClause = cursorFilter
    ? and(eq(savedPlaces.userId, userId), cursorFilter)
    : eq(savedPlaces.userId, userId);

  return db
    .select({
      placeId: savedPlaces.placeId,
      createdAt: savedPlaces.createdAt,
    })
    .from(savedPlaces)
    .where(whereClause)
    .orderBy(desc(savedPlaces.createdAt), desc(savedPlaces.placeId))
    .limit(limit + 1);
}

export async function getSavedPlaceIdsByAuthId(authId: string): Promise<Set<string>> {
  const rows = await db
    .select({ placeId: savedPlaces.placeId })
    .from(savedPlaces)
    .innerJoin(users, eq(savedPlaces.userId, users.id))
    .where(eq(users.authId, authId));

  return new Set(rows.map((r) => r.placeId));
}
