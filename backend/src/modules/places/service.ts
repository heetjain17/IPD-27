import * as locationService from '../location/service.js';
import * as placesRepo from './repository.js';
import * as savedPlacesRepo from '../saved-places/repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { placeDetailSchema } from './schema.js';
import type { NearbyQuery, PlaceMediaQuery, PlacesListQuery } from './schema.js';
import type {
  NearbyResponse,
  PlaceDetail,
  PlaceFiltersResponse,
  PlaceListItem,
  PlaceMediaResponse,
  PlaceSummary,
  PriceRangeOption,
  PlacesListResponse,
  SavedPlaceSummary,
} from './types.js';

interface PlacesCursorPayload {
  id: string;
  sortValue: number;
}

interface PlaceMediaCursorPayload {
  id: string;
  createdAt: string;
}

const PLACE_DETAIL_MEDIA_LIMIT = 10;

function parsePlacesCursor(cursor: string): PlacesCursorPayload {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<PlacesCursorPayload> | null;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      parsed.id.length === 0 ||
      typeof parsed.sortValue !== 'number' ||
      !Number.isFinite(parsed.sortValue)
    ) {
      throw new ApiError(400, 'Invalid cursor');
    }

    return { id: parsed.id, sortValue: parsed.sortValue };
  } catch {
    throw new ApiError(400, 'Invalid cursor');
  }
}

function buildPlacesCursor(id: string, sortValue: number): string {
  return Buffer.from(JSON.stringify({ id, sortValue })).toString('base64url');
}

function parsePlaceMediaCursor(cursor: string): { id: string; createdAt: Date } {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<PlaceMediaCursorPayload> | null;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      parsed.id.length === 0 ||
      typeof parsed.createdAt !== 'string'
    ) {
      throw new ApiError(400, 'Invalid cursor');
    }

    const createdAt = new Date(parsed.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      throw new ApiError(400, 'Invalid cursor');
    }

    return { id: parsed.id, createdAt };
  } catch {
    throw new ApiError(400, 'Invalid cursor');
  }
}

function buildPlaceMediaCursor(id: string, createdAt: Date): string {
  return Buffer.from(
    JSON.stringify({
      id,
      createdAt: createdAt.toISOString(),
    }),
  ).toString('base64url');
}

function buildPriceRanges(min: number | null, max: number | null): PriceRangeOption[] {
  if (min === null || max === null) {
    return [];
  }

  return [
    { key: 'budget', min: 0, max: 500 },
    { key: 'mid', min: 501, max: 1000 },
    { key: 'premium', min: 1001, max: 2000 },
    { key: 'luxury', min: 2001, max: Math.max(2001, max) },
  ].filter((range) => range.max >= min && range.min <= max);
}

function toPlaceListItem(
  place: Awaited<ReturnType<typeof placesRepo.getPlacesByIds>>[number],
  fields: PlacesListQuery['fields'],
  include: PlacesListQuery['include'],
  distance: number | null,
  savedIds: Set<string>,
): PlaceListItem {
  const baseItem: PlaceListItem = {
    id: place.id,
    name: place.name,
    lat: place.lat,
    lng: place.lng,
  };

  if (fields === 'basic') {
    return baseItem;
  }

  const cardItem: PlaceListItem = {
    ...baseItem,
    category: place.category,
    address: place.address ?? null,
    area: place.area ?? null,
    thumbnail: place.media[0]?.url ?? null,
    tags: place.tags,
    isSaved: savedIds.has(place.id),
    ...(distance !== null ? { distance: Math.round(distance) } : {}),
  };

  if (fields === 'card') {
    return cardItem;
  }

  return {
    ...cardItem,
    googleTypes: place.googleTypes ?? [],
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
    ...(include.includes('media') ? { media: place.media } : {}),
  };
}

export async function listPlaces(
  query: PlacesListQuery,
  authId?: string,
): Promise<PlacesListResponse> {
  const cursorPayload = query.cursor ? parsePlacesCursor(query.cursor) : null;
  const validTags = await placesRepo.getExistingTagNames(query.tags);

  const pageParams = {
    radius: query.radius,
    tags: validTags,
    tagsMode: query.tagsMode,
    sort: query.sort,
    order: query.order,
    limit: query.limit,
    ...(query.lat !== undefined ? { lat: query.lat } : {}),
    ...(query.lng !== undefined ? { lng: query.lng } : {}),
    ...(query.category !== undefined ? { category: query.category } : {}),
    ...(query.area !== undefined ? { area: query.area } : {}),
    ...(query.verified !== undefined ? { verified: query.verified } : {}),
    ...(query.isHiddenGem !== undefined ? { isHiddenGem: query.isHiddenGem } : {}),
    ...(query.minPrice !== undefined ? { minPrice: query.minPrice } : {}),
    ...(query.maxPrice !== undefined ? { maxPrice: query.maxPrice } : {}),
    ...(query.q !== undefined ? { q: query.q } : {}),
    ...(cursorPayload?.sortValue !== undefined ? { cursorSortValue: cursorPayload.sortValue } : {}),
    ...(cursorPayload?.id !== undefined ? { cursorId: cursorPayload.id } : {}),
  };

  const pageRows = await placesRepo.getPlacesPage(pageParams);

  const hasMore = pageRows.length > query.limit;
  const page = hasMore ? pageRows.slice(0, query.limit) : pageRows;

  if (page.length === 0) {
    return { places: [], nextCursor: null };
  }

  const ids = page.map((row) => row.placeId);
  const includeTags = query.fields !== 'basic' || query.include.includes('tags');
  const includeMedia = query.fields !== 'basic';
  const placesData = await placesRepo.getPlacesByIds(ids, {
    includeTags,
    includeMedia,
  });

  const placeMap = new Map(placesData.map((place) => [place.id, place]));
  const distanceMap = new Map(page.map((row) => [row.placeId, row.distanceMetres]));
  const savedIds = authId
    ? await savedPlacesRepo.getSavedPlaceIdsByAuthId(authId)
    : new Set<string>();

  const places: PlaceListItem[] = [];
  for (const id of ids) {
    const place = placeMap.get(id);
    if (!place) continue;

    const distance = distanceMap.get(id) ?? null;
    places.push(toPlaceListItem(place, query.fields, query.include, distance, savedIds));
  }

  let nextCursor: string | null = null;
  if (hasMore) {
    const last = page[page.length - 1]!;
    nextCursor = buildPlacesCursor(last.placeId, last.sortValue);
  }

  return { places, nextCursor };
}

export async function getPlaceFilters(): Promise<PlaceFiltersResponse> {
  const [categories, areas, tags, priceStats] = await Promise.all([
    placesRepo.getFilterCategories(),
    placesRepo.getFilterAreas(),
    placesRepo.getFilterTags(),
    placesRepo.getPriceStats(),
  ]);

  return {
    categories,
    areas,
    tags,
    priceRanges: buildPriceRanges(priceStats.min, priceStats.max),
  };
}

/**
 * GET /places/nearby
 *
 * Orchestration:
 *  1. Ask LocationService for ordered [{placeId, distanceMetres}]
 *  2. Ask PlacesRepository to enrich those IDs with name/tags/media
 *  3. Merge, preserve distance order, build cursor
 */
export async function findNearby(query: NearbyQuery, authId?: string): Promise<NearbyResponse> {
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
  const savedIds = authId
    ? await savedPlacesRepo.getSavedPlaceIdsByAuthId(authId)
    : new Set<string>();

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
      isSaved: savedIds.has(id),
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

export async function getById(id: string, authId?: string): Promise<PlaceDetail> {
  const place = await placesRepo.getPlaceById(id);

  if (!place) {
    throw new ApiError(404, 'Place not found');
  }

  const savedIds = authId
    ? await savedPlacesRepo.getSavedPlaceIdsByAuthId(authId)
    : new Set<string>();

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
    media: (place.media ?? []).slice(0, PLACE_DETAIL_MEDIA_LIMIT),
    isSaved: savedIds.has(id),
  };

  return placeDetailSchema.parse(detail);
}

export async function getMediaByPlaceId(
  placeId: string,
  query: PlaceMediaQuery,
): Promise<PlaceMediaResponse> {
  const exists = await placesRepo.placeExists(placeId);
  if (!exists) {
    throw new ApiError(404, 'Place not found');
  }

  const cursorPayload = query.cursor ? parsePlaceMediaCursor(query.cursor) : null;
  const rows = await placesRepo.getPlaceMediaPage({
    placeId,
    limit: query.limit,
    ...(cursorPayload
      ? { cursorCreatedAt: cursorPayload.createdAt, cursorId: cursorPayload.id }
      : {}),
  });

  const hasMore = rows.length > query.limit;
  const page = hasMore ? rows.slice(0, query.limit) : rows;

  const media = page.map((row) => ({ url: row.url, type: row.type }));
  const nextCursor =
    hasMore && page.length > 0
      ? buildPlaceMediaCursor(page[page.length - 1]!.id, page[page.length - 1]!.createdAt)
      : null;

  return { media, nextCursor };
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
      isSaved: true,
    });
  }

  return summaries;
}
