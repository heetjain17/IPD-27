import { z } from 'zod';

const DEFAULT_RADIUS = 5000;
const MAX_RADIUS = 50000;

const placesSortSchema = z.enum([
  'distance',
  'rating',
  'newest',
  'price_low',
  'price_high',
  'priority',
]);

const placesOrderSchema = z.enum(['asc', 'desc']);
const placesFieldsSchema = z.enum(['basic', 'card', 'full']);
const placesTagsModeSchema = z.enum(['all', 'any']);
const placesIncludeSchema = z.enum(['media', 'tags']);

const optionalNumber = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}, z.number().finite().optional());

const optionalBoolean = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;

  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;

  return value;
}, z.boolean().optional());

const commaSeparatedList = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(',');
  }

  return value;
}, z.array(z.string()).default([]));

function getDefaultOrder(
  sort: z.infer<typeof placesSortSchema>,
): z.infer<typeof placesOrderSchema> {
  switch (sort) {
    case 'price_high':
    case 'rating':
    case 'newest':
      return 'desc';
    default:
      return 'asc';
  }
}

export const placesListQuerySchema = z
  .object({
    lat: optionalNumber,
    lng: optionalNumber,
    radius: optionalNumber,
    category: z.string().trim().min(1).optional(),
    area: z.string().trim().min(1).optional(),
    verified: optionalBoolean,
    isHiddenGem: optionalBoolean,
    minPrice: optionalNumber,
    maxPrice: optionalNumber,
    tags: commaSeparatedList,
    tagsMode: placesTagsModeSchema.default('any'),
    q: z.string().trim().min(1).optional(),
    sort: placesSortSchema.optional(),
    order: placesOrderSchema.optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    cursor: z.string().min(1).optional(),
    fields: placesFieldsSchema.default('card'),
    include: commaSeparatedList,
  })
  .superRefine((value, ctx) => {
    const hasLat = value.lat !== undefined;
    const hasLng = value.lng !== undefined;

    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: 'custom',
        message: 'lat and lng must be provided together',
        path: hasLat ? ['lng'] : ['lat'],
      });
    }

    if (value.lat !== undefined && (value.lat < -90 || value.lat > 90)) {
      ctx.addIssue({
        code: 'custom',
        message: 'lat must be between -90 and 90',
        path: ['lat'],
      });
    }

    if (value.lng !== undefined && (value.lng < -180 || value.lng > 180)) {
      ctx.addIssue({
        code: 'custom',
        message: 'lng must be between -180 and 180',
        path: ['lng'],
      });
    }

    const normalizedIncludes = Array.from(
      new Set(value.include.map((item) => item.trim()).filter((item) => item.length > 0)),
    );

    if (normalizedIncludes.length > 2) {
      ctx.addIssue({
        code: 'custom',
        message: 'include supports at most 2 values',
        path: ['include'],
      });
    }

    for (const item of normalizedIncludes) {
      if (!placesIncludeSchema.safeParse(item).success) {
        ctx.addIssue({
          code: 'custom',
          message: `Unsupported include value: ${item}`,
          path: ['include'],
        });
      }
    }

    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'minPrice cannot be greater than maxPrice',
        path: ['minPrice'],
      });
    }

    if (value.sort === 'distance' && !(hasLat && hasLng)) {
      ctx.addIssue({
        code: 'custom',
        message: 'distance sort requires lat and lng',
        path: ['sort'],
      });
    }
  })
  .transform((value) => {
    const hasGeo = value.lat !== undefined && value.lng !== undefined;
    const sort = value.sort ?? (hasGeo ? 'distance' : 'priority');

    const radius =
      value.radius === undefined || value.radius < 1
        ? DEFAULT_RADIUS
        : Math.min(value.radius, MAX_RADIUS);

    const tags = Array.from(
      new Set(
        value.tags.map((item) => item.trim().toLowerCase()).filter((item) => item.length > 0),
      ),
    );

    const include = Array.from(
      new Set(
        value.include.map((item) => item.trim().toLowerCase()).filter((item) => item.length > 0),
      ),
    ) as z.infer<typeof placesIncludeSchema>[];

    return {
      lat: value.lat,
      lng: value.lng,
      radius,
      category: value.category,
      area: value.area,
      verified: value.verified,
      isHiddenGem: value.isHiddenGem,
      minPrice: value.minPrice,
      maxPrice: value.maxPrice,
      tags,
      tagsMode: value.tagsMode,
      q: value.q,
      sort,
      order: value.order ?? getDefaultOrder(sort),
      limit: value.limit,
      cursor: value.cursor,
      fields: value.fields,
      include,
      hasGeo,
    };
  });

/**
 * Validation schema for GET /places/nearby query params.
 * z.coerce.number() is required because query params arrive as strings.
 */
export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(50000),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

export const placeMediaQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

export const placeIdParamsSchema = z.object({
  id: z.uuid(),
});

export const placeDetailSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  category: z.string(),
  address: z.string().nullable(),
  googleTypes: z.array(z.string()),
  area: z.string().nullable(),
  lastSyncedAt: z.string().nullable(),
  isActive: z.boolean(),
  customDescription: z.string().nullable(),
  vibe: z.string().nullable(),
  isHiddenGem: z.boolean(),
  priorityScore: z.number().int(),
  verified: z.boolean(),
  bestTimeToVisit: z.string().nullable(),
  avgCostForTwo: z.number().int().nullable(),
  crowdLevelOverride: z.string().nullable(),
  notes: z.string().nullable(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  tags: z.array(z.string()),
  media: z.array(
    z.object({
      url: z.string(),
      type: z.string().nullable(),
    }),
  ),
  isSaved: z.boolean(),
});

export type PlacesListQuery = z.infer<typeof placesListQuerySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type PlaceMediaQuery = z.infer<typeof placeMediaQuerySchema>;
export type PlaceIdParams = z.infer<typeof placeIdParamsSchema>;
