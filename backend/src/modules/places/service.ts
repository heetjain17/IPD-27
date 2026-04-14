import * as locationService from '../location/service.js';
import * as placesRepo from './repository.js';
import type { NearbyQuery } from './schema.js';
import type { NearbyResponse, PlaceSummary } from './types.js';

/**
 * GET /places/nearby
 *
 * Orchestration:
 *  1. Ask LocationService for ordered [{placeId, distanceMetres}]
 *  2. Ask PlacesRepository to enrich those IDs with name/tags/media
 *  3. Merge, preserve distance order, build cursor
 */
export async function findNearby(query: NearbyQuery): Promise<NearbyResponse> {
  const { lat, lng, radius, limit, cursor } = query;

  // Step 1: geo query (delegates all ST_* work to Location module)
  const nearbyResults = await locationService.findNearby({
    lat,
    lng,
    radiusMetres: radius,
    limit,
    cursor,
  });

  // Detect next page: repository returns limit+1 rows
  const hasMore = nearbyResults.length > limit;
  const pageResults = hasMore ? nearbyResults.slice(0, limit) : nearbyResults;

  if (pageResults.length === 0) {
    return { places: [], nextCursor: null };
  }

  // Step 2: enrich with place data
  const ids = pageResults.map((r) => r.placeId);
  const placesData = await placesRepo.getPlacesByIds(ids);

  // O(1) lookup maps
  const placeMap = new Map(placesData.map((p) => [p.id, p]));
  const distanceMap = new Map(pageResults.map((r) => [r.placeId, r.distanceMetres]));

  // Step 3: build summaries in distance order (order comes from location module)
  const summaries: PlaceSummary[] = [];
  for (const id of ids) {
    const place = placeMap.get(id);
    if (!place) continue; // guard: place deleted between queries

    summaries.push({
      id: place.id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      distance: Math.round(distanceMap.get(id) ?? 0),
      tags: place.tags,
      thumbnail: place.media[0]?.url ?? null,
    });
  }

  // Step 4: build next cursor from the last result in the page
  let nextCursor: string | null = null;
  if (hasMore) {
    const last = pageResults[pageResults.length - 1]!;
    nextCursor = Buffer.from(
      JSON.stringify({ id: last.placeId, dist: last.distanceMetres }),
    ).toString('base64url');
  }

  return { places: summaries, nextCursor };
}
