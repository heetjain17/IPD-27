import { db } from '../../db/client.js';
import { sql } from 'drizzle-orm';
import type { FindNearbyRepositoryParams, NearbyResult } from './types.js';

// Raw DB row returned by the spatial query
interface DistanceRow {
  id: string;
  distance_metres: number;
}

/**
 * PostGIS radius query.
 * Ownership rule: this is the ONLY place in the codebase that writes ST_* functions.
 *
 * Uses a CTE so ST_Distance is computed once and reused for cursor filtering.
 * ST_MakePoint(lng, lat) — longitude first, latitude second.
 */
export async function findNearbyPlaces(
  params: FindNearbyRepositoryParams,
): Promise<NearbyResult[]> {
  const { lat, lng, radiusMetres, limit, cursorDist, cursorId } = params;

  // Keyset filter: (distance, id) > (cursorDist, cursorId) for stable pagination
  const cursorFilter =
    cursorDist !== undefined && cursorId !== undefined
      ? sql`AND (distance_metres > ${cursorDist} OR (distance_metres = ${cursorDist} AND id > ${cursorId}))`
      : sql``;

  // Fetch limit + 1 so the service can detect whether a next page exists
  const rows = await db.execute(sql`
    WITH distance_map AS (
      SELECT
        p.id,
        ST_Distance(
          p.geom,
          ST_MakePoint(${lng}, ${lat})::geography
        ) AS distance_metres
      FROM places p
      WHERE
        p.geom IS NOT NULL
        AND ST_DWithin(
          p.geom,
          ST_MakePoint(${lng}, ${lat})::geography,
          ${radiusMetres}
        )
    )
    SELECT id, distance_metres
    FROM distance_map
    WHERE 1=1
    ${cursorFilter}
    ORDER BY distance_metres ASC, id ASC
    LIMIT ${limit + 1}
  `);

  return (rows as unknown as DistanceRow[]).map((row) => ({
    placeId: row.id,
    distanceMetres: Number(row.distance_metres),
  }));
}
