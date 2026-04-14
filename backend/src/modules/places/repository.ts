import { db } from '../../db/client.js';
import { places, placeTags, tags, placeMedia } from '../../db/schema.js';
import { inArray, eq, asc } from 'drizzle-orm';
import type { PlaceWithEnrichment } from './types.js';

/**
 * Fetches base place data + tags + media for a list of IDs.
 * Runs 3 targeted queries instead of one big JOIN to keep rows flat and avoid
 * cartesian explosion when a place has many tags AND many media rows.
 *
 * NOTE: geom column is intentionally excluded — it's a PostGIS binary type
 * and must never appear in API responses.
 */
export async function getPlacesByIds(ids: string[]): Promise<PlaceWithEnrichment[]> {
  if (ids.length === 0) return [];

  // 1. Base place rows (no geom column)
  const placesData = await db
    .select({
      id: places.id,
      name: places.name,
      description: places.description,
      lat: places.lat,
      lng: places.lng,
      category: places.category,
      averageRating: places.averageRating,
      reviewCount: places.reviewCount,
    })
    .from(places)
    .where(inArray(places.id, ids));

  // 2. Tags for these places
  const tagsData = await db
    .select({
      placeId: placeTags.placeId,
      tagName: tags.name,
    })
    .from(placeTags)
    .innerJoin(tags, eq(placeTags.tagId, tags.id))
    .where(inArray(placeTags.placeId, ids));

  // 3. Media for these places
  const mediaData = await db
    .select({
      placeId: placeMedia.placeId,
      url: placeMedia.url,
      type: placeMedia.type,
    })
    .from(placeMedia)
    .where(inArray(placeMedia.placeId, ids))
    .orderBy(asc(placeMedia.createdAt), asc(placeMedia.id));

  // Group tags and media by placeId
  const tagsByPlace = new Map<string, string[]>();
  for (const row of tagsData) {
    const list = tagsByPlace.get(row.placeId) ?? [];
    list.push(row.tagName);
    tagsByPlace.set(row.placeId, list);
  }

  const mediaByPlace = new Map<string, { url: string; type: string | null }[]>();
  for (const row of mediaData) {
    const list = mediaByPlace.get(row.placeId) ?? [];
    list.push({ url: row.url, type: row.type ?? null });
    mediaByPlace.set(row.placeId, list);
  }

  return placesData.map((place) => ({
    ...place,
    tags: tagsByPlace.get(place.id) ?? [],
    media: mediaByPlace.get(place.id) ?? [],
  }));
}
