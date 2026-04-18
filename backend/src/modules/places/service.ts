import * as locationService from '../location/service.js';
import * as placesRepo from './repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { placeDetailSchema } from './schema.js';
import type { NearbyQuery } from './schema.js';
import type { NearbyResponse, PlaceDetail, PlaceSummary, SavedPlaceSummary } from './types.js';

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
      address: place.address ?? null,
      googleTypes: place.googleTypes ?? [],
      area: place.area ?? null,
      lastSyncedAt: place.lastSyncedAt ? place.lastSyncedAt.toISOString() : null,
      isActive: place.isActive,
      customDescription: place.customDescription ?? null,
      vibe: place.vibe ?? null,
      isHiddenGem: place.isHiddenGem,
      priorityScore: place.priorityScore,
      verified: place.verified,
      bestTimeToVisit: place.bestTimeToVisit ?? null,
      avgCostForTwo: place.avgCostForTwo ?? null,
      crowdLevelOverride: place.crowdLevelOverride ?? null,
      notes: place.notes ?? null,
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

export async function getById(id: string): Promise<PlaceDetail> {
  const place = await placesRepo.getPlaceById(id);

  if (!place) {
    throw new ApiError(404, 'Place not found');
  }

  const detail: PlaceDetail = {
    id: place.id,
    name: place.name,
    description: place.description ?? null,
    lat: place.lat,
    lng: place.lng,
    category: place.category,
    address: place.address ?? null,
    googleTypes: place.googleTypes ?? [],
    area: place.area ?? null,
    lastSyncedAt: place.lastSyncedAt ? place.lastSyncedAt.toISOString() : null,
    isActive: place.isActive,
    customDescription: place.customDescription ?? null,
    vibe: place.vibe ?? null,
    isHiddenGem: place.isHiddenGem,
    priorityScore: place.priorityScore,
    verified: place.verified,
    bestTimeToVisit: place.bestTimeToVisit ?? null,
    avgCostForTwo: place.avgCostForTwo ?? null,
    crowdLevelOverride: place.crowdLevelOverride ?? null,
    notes: place.notes ?? null,
    averageRating: place.averageRating,
    reviewCount: place.reviewCount,
    tags: place.tags ?? [],
    media: place.media ?? [],
  };

  return placeDetailSchema.parse(detail);
}

export async function getSavedPlaceSummariesByIds(ids: string[]): Promise<SavedPlaceSummary[]> {
  if (ids.length === 0) {
    return [];
  }

  const placesData = await placesRepo.getPlacesByIds(ids);
  const placeMap = new Map(placesData.map((place) => [place.id, place]));

  const summaries: SavedPlaceSummary[] = [];
  for (const id of ids) {
    const place = placeMap.get(id);
    if (!place) continue;

    summaries.push({
      id: place.id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      address: place.address ?? null,
      googleTypes: place.googleTypes ?? [],
      area: place.area ?? null,
      lastSyncedAt: place.lastSyncedAt ? place.lastSyncedAt.toISOString() : null,
      isActive: place.isActive,
      customDescription: place.customDescription ?? null,
      vibe: place.vibe ?? null,
      isHiddenGem: place.isHiddenGem,
      priorityScore: place.priorityScore,
      verified: place.verified,
      bestTimeToVisit: place.bestTimeToVisit ?? null,
      avgCostForTwo: place.avgCostForTwo ?? null,
      crowdLevelOverride: place.crowdLevelOverride ?? null,
      notes: place.notes ?? null,
      tags: place.tags,
      thumbnail: place.media[0]?.url ?? null,
    });
  }

  return summaries;
}
