import { db } from '../../db/client.js';
import { places, placeTags, tags, placeMedia, reviews } from '../../db/schema.js';
import { inArray, eq, asc, sql } from 'drizzle-orm';
import type { PlaceEnrichmentOptions, PlaceListPageRow, PlaceWithEnrichment } from './types.js';

interface GetPlacesPageParams {
  lat?: number;
  lng?: number;
  radius: number;
  category?: string;
  area?: string;
  verified?: boolean;
  isHiddenGem?: boolean;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  tags: string[];
  tagsMode: 'all' | 'any';
  sort: 'distance' | 'rating' | 'newest' | 'price_low' | 'price_high' | 'priority';
  order: 'asc' | 'desc';
  limit: number;
  cursorSortValue?: number;
  cursorId?: string;
}

interface PlacesPageRow {
  place_id: string;
  sort_value: number;
  distance_metres: number | null;
}

interface GetPlaceMediaPageParams {
  placeId: string;
  limit: number;
  cursorCreatedAt?: Date;
  cursorId?: string;
}

function buildTagFilterClause(tagNames: string[], tagsMode: 'all' | 'any') {
  if (tagNames.length === 0) {
    return sql``;
  }

  const tagValues = sql.join(
    tagNames.map((tagName) => sql`${tagName}`),
    sql`, `,
  );

  if (tagsMode === 'all') {
    return sql`
      AND p.id IN (
        SELECT pt.place_id
        FROM place_tags pt
        INNER JOIN tags t ON pt.tag_id = t.id
        WHERE t.name IN (${tagValues})
        GROUP BY pt.place_id
        HAVING COUNT(DISTINCT t.name) = ${tagNames.length}
      )
    `;
  }

  return sql`
    AND EXISTS (
      SELECT 1
      FROM place_tags pt
      INNER JOIN tags t ON pt.tag_id = t.id
      WHERE pt.place_id = p.id
        AND t.name IN (${tagValues})
    )
  `;
}

function buildCursorClause(order: 'asc' | 'desc', cursorSortValue?: number, cursorId?: string) {
  if (cursorSortValue === undefined || cursorId === undefined) {
    return sql``;
  }

  if (order === 'desc') {
    return sql`
      AND (
        sort_value < ${cursorSortValue}
        OR (sort_value = ${cursorSortValue} AND place_id > ${cursorId})
      )
    `;
  }

  return sql`
    AND (
      sort_value > ${cursorSortValue}
      OR (sort_value = ${cursorSortValue} AND place_id > ${cursorId})
    )
  `;
}

function buildOrderClause(order: 'asc' | 'desc') {
  return order === 'desc'
    ? sql`ORDER BY sort_value DESC, place_id ASC`
    : sql`ORDER BY sort_value ASC, place_id ASC`;
}

export async function getExistingTagNames(names: string[]): Promise<string[]> {
  if (names.length === 0) {
    return [];
  }

  const rows = await db.select({ name: tags.name }).from(tags).where(inArray(tags.name, names));

  return rows.map((row) => row.name);
}

export async function getFilterCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: places.category })
    .from(places)
    .where(eq(places.isActive, true))
    .orderBy(asc(places.category));

  return rows.map((row) => row.category);
}

export async function getFilterAreas(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ area: places.area })
    .from(places)
    .where(sql`${places.isActive} = true AND ${places.area} IS NOT NULL`)
    .orderBy(asc(places.area));

  return rows.map((row) => row.area).filter((area): area is string => area !== null);
}

export async function getFilterTags(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ name: tags.name })
    .from(tags)
    .innerJoin(placeTags, eq(placeTags.tagId, tags.id))
    .innerJoin(places, eq(placeTags.placeId, places.id))
    .where(eq(places.isActive, true))
    .orderBy(asc(tags.name));

  return rows.map((row) => row.name);
}

export async function getPriceStats(): Promise<{ min: number | null; max: number | null }> {
  const [row] = await db
    .select({
      min: sql<number | null>`MIN(${places.avgCostForTwo})`,
      max: sql<number | null>`MAX(${places.avgCostForTwo})`,
    })
    .from(places)
    .where(sql`${places.isActive} = true AND ${places.avgCostForTwo} IS NOT NULL`);

  return {
    min: row?.min ?? null,
    max: row?.max ?? null,
  };
}

export async function getPlacesPage(params: GetPlacesPageParams): Promise<PlaceListPageRow[]> {
  const {
    lat,
    lng,
    radius,
    category,
    area,
    verified,
    isHiddenGem,
    minPrice,
    maxPrice,
    q,
    tags,
    tagsMode,
    sort,
    order,
    limit,
    cursorSortValue,
    cursorId,
  } = params;

  const hasGeo = lat !== undefined && lng !== undefined;
  const searchTerm = q ? `%${q}%` : undefined;
  const tagFilterClause = buildTagFilterClause(tags, tagsMode);
  const cursorClause = buildCursorClause(order, cursorSortValue, cursorId);
  const orderClause = buildOrderClause(order);

  const sortValueExpression = (() => {
    switch (sort) {
      case 'distance':
        return sql<number>`ST_Distance(p.geom, ST_MakePoint(${lng!}, ${lat!})::geography)`;
      case 'rating':
        return sql<number>`p.average_rating`;
      case 'newest':
        return sql<number>`EXTRACT(EPOCH FROM p.created_at)`;
      case 'price_low':
        return sql<number>`COALESCE(p.avg_cost_for_two, 2147483647)`;
      case 'price_high':
        return sql<number>`COALESCE(p.avg_cost_for_two, -1)`;
      case 'priority':
      default:
        return sql<number>`p.priority_score`;
    }
  })();

  const distanceExpression = hasGeo
    ? sql<number>`ST_Distance(p.geom, ST_MakePoint(${lng}, ${lat})::geography)`
    : sql<null>`NULL`;

  const rows = await db.execute(sql`
    WITH filtered_places AS (
      SELECT
        p.id AS place_id,
        ${sortValueExpression} AS sort_value,
        ${distanceExpression} AS distance_metres
      FROM places p
      WHERE
        p.is_active = true
        ${category ? sql`AND p.category = ${category}` : sql``}
        ${area ? sql`AND p.area ILIKE ${area}` : sql``}
        ${verified !== undefined ? sql`AND p.verified = ${verified}` : sql``}
        ${isHiddenGem !== undefined ? sql`AND p.is_hidden_gem = ${isHiddenGem}` : sql``}
        ${minPrice !== undefined ? sql`AND p.avg_cost_for_two >= ${minPrice}` : sql``}
        ${maxPrice !== undefined ? sql`AND p.avg_cost_for_two <= ${maxPrice}` : sql``}
        ${
          searchTerm
            ? sql`AND (p.name ILIKE ${searchTerm} OR p.description ILIKE ${searchTerm} OR p.area ILIKE ${searchTerm})`
            : sql``
        }
        ${
          hasGeo
            ? sql`
              AND p.geom IS NOT NULL
              AND ST_DWithin(
                p.geom,
                ST_MakePoint(${lng}, ${lat})::geography,
                ${radius}
              )
            `
            : sql``
        }
        ${tagFilterClause}
    )
    SELECT place_id, sort_value, distance_metres
    FROM filtered_places
    WHERE 1=1
    ${cursorClause}
    ${orderClause}
    LIMIT ${limit + 1}
  `);

  return (rows as unknown as PlacesPageRow[]).map((row) => ({
    placeId: row.place_id,
    sortValue: Number(row.sort_value),
    distanceMetres: row.distance_metres === null ? null : Number(row.distance_metres),
  }));
}

/**
 * Fetches base place data + tags + media for a list of IDs.
 * Runs 3 targeted queries instead of one big JOIN to keep rows flat and avoid
 * cartesian explosion when a place has many tags AND many media rows.
 *
 * NOTE: geom column is intentionally excluded — it's a PostGIS binary type
 * and must never appear in API responses.
 */
export async function getPlacesByIds(
  ids: string[],
  options: PlaceEnrichmentOptions = {},
): Promise<PlaceWithEnrichment[]> {
  if (ids.length === 0) return [];

  const includeTags = options.includeTags ?? true;
  const includeMedia = options.includeMedia ?? true;

  const placesData = await db
    .select({
      id: places.id,
      name: places.name,
      description: places.description,
      lat: places.lat,
      lng: places.lng,
      category: places.category,
      address: places.address,
      googleTypes: places.googleTypes,
      area: places.area,
      lastSyncedAt: places.lastSyncedAt,
      isActive: places.isActive,
      customDescription: places.customDescription,
      vibe: places.vibe,
      isHiddenGem: places.isHiddenGem,
      priorityScore: places.priorityScore,
      verified: places.verified,
      bestTimeToVisit: places.bestTimeToVisit,
      avgCostForTwo: places.avgCostForTwo,
      crowdLevelOverride: places.crowdLevelOverride,
      notes: places.notes,
      averageRating: sql<number>`
        COALESCE(
          (SELECT ROUND(AVG(r.rating)::numeric, 2)
           FROM ${reviews} r WHERE r.place_id = ${places.id}),
        0)::float8`,
      reviewCount: sql<number>`
        (SELECT COUNT(*)
         FROM ${reviews} r WHERE r.place_id = ${places.id})::int`,
    })
    .from(places)
    .where(inArray(places.id, ids));

  const tagsByPlace = new Map<string, string[]>();
  if (includeTags) {
    const tagsData = await db
      .select({
        placeId: placeTags.placeId,
        tagName: tags.name,
      })
      .from(placeTags)
      .innerJoin(tags, eq(placeTags.tagId, tags.id))
      .where(inArray(placeTags.placeId, ids));

    for (const row of tagsData) {
      const list = tagsByPlace.get(row.placeId) ?? [];
      list.push(row.tagName);
      tagsByPlace.set(row.placeId, list);
    }
  }

  const mediaByPlace = new Map<string, { url: string; type: string | null }[]>();
  if (includeMedia) {
    const mediaData = await db
      .select({
        placeId: placeMedia.placeId,
        url: placeMedia.url,
        type: placeMedia.type,
      })
      .from(placeMedia)
      .where(inArray(placeMedia.placeId, ids))
      .orderBy(asc(placeMedia.createdAt), asc(placeMedia.id));

    for (const row of mediaData) {
      const list = mediaByPlace.get(row.placeId) ?? [];
      list.push({ url: row.url, type: row.type ?? null });
      mediaByPlace.set(row.placeId, list);
    }
  }

  return placesData.map((place) => ({
    ...place,
    tags: tagsByPlace.get(place.id) ?? [],
    media: mediaByPlace.get(place.id) ?? [],
  }));
}

export async function getPlaceById(id: string): Promise<PlaceWithEnrichment | null> {
  const rows = await getPlacesByIds([id], { includeTags: true, includeMedia: false });
  const place = rows[0] ?? null;
  if (!place) {
    return null;
  }

  const mediaRows = await db
    .select({
      url: placeMedia.url,
      type: placeMedia.type,
    })
    .from(placeMedia)
    .where(eq(placeMedia.placeId, id))
    .orderBy(asc(placeMedia.createdAt), asc(placeMedia.id))
    .limit(10);

  return {
    ...place,
    media: mediaRows.map((row) => ({ url: row.url, type: row.type ?? null })),
  };
}

export async function placeExists(id: string): Promise<boolean> {
  const rows = await db.select({ id: places.id }).from(places).where(eq(places.id, id)).limit(1);
  return rows.length > 0;
}

export async function getPlaceMediaPage(
  params: GetPlaceMediaPageParams,
): Promise<{ id: string; url: string; type: string | null; createdAt: Date }[]> {
  const { placeId, limit, cursorCreatedAt, cursorId } = params;

  const rows = await db
    .select({
      id: placeMedia.id,
      url: placeMedia.url,
      type: placeMedia.type,
      createdAt: placeMedia.createdAt,
    })
    .from(placeMedia)
    .where(
      sql`
        ${placeMedia.placeId} = ${placeId}
        ${
          cursorCreatedAt && cursorId
            ? sql`
              AND (
                ${placeMedia.createdAt} > ${cursorCreatedAt}
                OR (${placeMedia.createdAt} = ${cursorCreatedAt} AND ${placeMedia.id} > ${cursorId})
              )
            `
            : sql``
        }
      `,
    )
    .orderBy(asc(placeMedia.createdAt), asc(placeMedia.id))
    .limit(limit + 1);

  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    type: row.type ?? null,
    createdAt: row.createdAt,
  }));
}
