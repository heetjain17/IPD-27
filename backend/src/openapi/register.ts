import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../modules/auth/schema.js';
import {
  deleteSavedPlaceParamsSchema,
  savePlaceBodySchema,
  savedPlacesQuerySchema,
} from '../modules/saved-places/schema.js';
import {
  nearbyQuerySchema,
  placeDetailSchema,
  placeIdParamsSchema,
  placeMediaQuerySchema,
} from '../modules/places/schema.js';
import { createReviewBodySchema, reviewsPlaceParamsSchema, reviewsQuerySchema } from '../modules/reviews/schema.js';

const isoDate = z.string().datetime();

const genericErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  statusCode: z.number().optional(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
  data: z.null().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    })
    .optional(),
});

const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: isoDate,
});

const authSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

const authDataSchema = z.object({
  user: authUserSchema,
  session: authSessionSchema,
});

const reviewSchema = z.object({
  id: z.string().uuid(),
  placeId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: isoDate,
});

const placeListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  category: z.string().optional(),
  address: z.string().nullable().optional(),
  googleTypes: z.array(z.string()).optional(),
  area: z.string().nullable().optional(),
  lastSyncedAt: isoDate.nullable().optional(),
  isActive: z.boolean().optional(),
  customDescription: z.string().nullable().optional(),
  vibe: z.string().nullable().optional(),
  isHiddenGem: z.boolean().optional(),
  priorityScore: z.number().optional(),
  verified: z.boolean().optional(),
  bestTimeToVisit: z.string().nullable().optional(),
  avgCostForTwo: z.number().nullable().optional(),
  crowdLevelOverride: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  averageRating: z.number().optional(),
  reviewCount: z.number().int().optional(),
  distance: z.number().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().nullable().optional(),
  media: z.array(z.object({ url: z.string(), type: z.string().nullable() })).optional(),
});

const placeMediaItemSchema = z.object({
  url: z.string(),
  type: z.string().nullable(),
});

const placesListQueryDocsSchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50000).optional(),
  category: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  verified: z.coerce.boolean().optional(),
  isHiddenGem: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  tags: z.string().optional(),
  tagsMode: z.enum(['all', 'any']).optional(),
  q: z.string().min(1).optional(),
  sort: z.enum(['distance', 'rating', 'newest', 'price_low', 'price_high', 'priority']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().min(1).optional(),
  fields: z.enum(['basic', 'card', 'full']).optional(),
  include: z.string().optional(),
});

const successWithData = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data,
  });

const successNoData = z.object({
  success: z.literal(true),
  statusCode: z.number(),
  message: z.string(),
});

let registered = false;

export function registerApiPaths(registry: OpenAPIRegistry) {
  if (registered) return;
  registered = true;

  // Health
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['health'],
    summary: 'Health check',
    responses: {
      200: {
        description: 'Service and DB are healthy.',
        content: {
          'application/json': {
            schema: z.object({
              success: z.literal(true),
              data: z.object({
                status: z.literal('ok'),
                db: z.literal('connected'),
              }),
              error: z.null(),
            }),
          },
        },
      },
      503: {
        description: 'Database unavailable.',
        content: {
          'application/json': {
            schema: z.object({
              success: z.literal(false),
              data: z.null(),
              error: z.object({
                code: z.literal('DB_UNREACHABLE'),
                message: z.unknown(),
              }),
            }),
          },
        },
      },
    },
  });

  // Auth
  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/register',
    tags: ['auth'],
    summary: 'Register a new user',
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: registerSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully.',
        content: {
          'application/json': {
            schema: successWithData(authDataSchema),
          },
        },
      },
      400: {
        description: 'Invalid request payload.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      409: {
        description: 'User already exists.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/login',
    tags: ['auth'],
    summary: 'Login with email and password',
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful.',
        content: {
          'application/json': {
            schema: successWithData(authDataSchema),
          },
        },
      },
      400: {
        description: 'Invalid request payload.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      401: {
        description: 'Invalid credentials.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'User profile not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/logout',
    tags: ['auth'],
    summary: 'Logout current session',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Logged out successfully.',
        content: { 'application/json': { schema: successNoData } },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/auth/me',
    tags: ['auth'],
    summary: 'Get current authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Current user retrieved.',
        content: { 'application/json': { schema: successWithData(authUserSchema) } },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'User not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/refresh',
    tags: ['auth'],
    summary: 'Refresh access token using refresh cookie',
    description: 'Uses refresh token from cookie and rotates session tokens.',
    responses: {
      200: {
        description: 'Token refreshed successfully.',
        content: { 'application/json': { schema: successWithData(authDataSchema) } },
      },
      401: {
        description: 'No refresh token or invalid refresh token.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'User profile not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  // Places
  registry.registerPath({
    method: 'get',
    path: '/api/v1/places',
    tags: ['places'],
    summary: 'Universal places list endpoint',
    description:
      'Supports controlled filtering, search, sorting, and cursor pagination. Cursor key is based on active sort key plus id tie-breaker.',
    request: {
      query: placesListQueryDocsSchema,
    },
    responses: {
      200: {
        description: 'Places retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                places: z.array(placeListItemSchema),
                nextCursor: z.string().nullable(),
              }),
            ),
          },
        },
      },
      400: {
        description: 'Invalid query combination or unsupported value.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/filters',
    tags: ['places'],
    summary: 'Fetch filter metadata for places',
    responses: {
      200: {
        description: 'Filter metadata retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                categories: z.array(z.string()),
                areas: z.array(z.string()),
                tags: z.array(z.string()),
                priceRanges: z.array(
                  z.object({
                    key: z.string(),
                    min: z.number(),
                    max: z.number(),
                  }),
                ),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/nearby',
    tags: ['places'],
    summary: 'Legacy nearby places endpoint',
    description:
      'Distance-based endpoint retained for transition. Uses cursor pagination ordered by distance, id.',
    request: {
      query: nearbyQuerySchema,
    },
    responses: {
      200: {
        description: 'Nearby places retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                places: z.array(placeListItemSchema),
                nextCursor: z.string().nullable(),
              }),
            ),
          },
        },
      },
      400: {
        description: 'Invalid query parameters.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/{id}',
    tags: ['places'],
    summary: 'Get place detail by id',
    request: {
      params: placeIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Place detail retrieved.',
        content: { 'application/json': { schema: successWithData(placeDetailSchema) } },
      },
      400: {
        description: 'Invalid place id.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/{id}/media',
    tags: ['places'],
    summary: 'Get paginated place media',
    description: 'Cursor pagination ordered by createdAt ASC, id ASC.',
    request: {
      params: placeIdParamsSchema,
      query: placeMediaQuerySchema,
    },
    responses: {
      200: {
        description: 'Place media retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                media: z.array(placeMediaItemSchema),
                nextCursor: z.string().nullable(),
              }),
            ),
          },
        },
      },
      400: {
        description: 'Invalid limit or cursor.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/{id}/reviews',
    tags: ['reviews'],
    summary: 'Get paginated reviews for a place',
    description: 'Cursor pagination uses keyset ordering on createdAt DESC, id DESC.',
    request: {
      params: reviewsPlaceParamsSchema,
      query: reviewsQuerySchema,
    },
    responses: {
      200: {
        description: 'Reviews retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                reviews: z.array(reviewSchema),
                nextCursor: z.string().nullable(),
              }),
            ),
          },
        },
      },
      400: {
        description: 'Invalid query parameters.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  // Saved places
  registry.registerPath({
    method: 'post',
    path: '/api/v1/places/save',
    tags: ['saved-places'],
    summary: 'Save a place for current user',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: savePlaceBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Place saved.',
        content: {
          'application/json': {
            schema: successWithData(z.object({ saved: z.literal(true) })),
          },
        },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      409: {
        description: 'Place already saved.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/places/save/{placeId}',
    tags: ['saved-places'],
    summary: 'Delete saved place for current user',
    security: [{ bearerAuth: [] }],
    request: {
      params: deleteSavedPlaceParamsSchema,
    },
    responses: {
      200: {
        description: 'Saved place removed.',
        content: {
          'application/json': {
            schema: successWithData(z.object({ saved: z.literal(false) })),
          },
        },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      400: {
        description: 'Invalid placeId.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Saved place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/places/saved',
    tags: ['saved-places'],
    summary: 'Get paginated saved places for current user',
    description: 'Cursor pagination uses keyset ordering on saved timestamp, placeId.',
    security: [{ bearerAuth: [] }],
    request: {
      query: savedPlacesQuerySchema,
    },
    responses: {
      200: {
        description: 'Saved places retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                places: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    lat: z.number(),
                    lng: z.number(),
                    category: z.string(),
                    address: z.string().nullable(),
                    googleTypes: z.array(z.string()),
                    area: z.string().nullable(),
                    lastSyncedAt: isoDate.nullable(),
                    isActive: z.boolean(),
                    customDescription: z.string().nullable(),
                    vibe: z.string().nullable(),
                    isHiddenGem: z.boolean(),
                    priorityScore: z.number().int(),
                    verified: z.boolean(),
                    bestTimeToVisit: z.string().nullable(),
                    avgCostForTwo: z.number().nullable(),
                    crowdLevelOverride: z.string().nullable(),
                    notes: z.string().nullable(),
                    tags: z.array(z.string()),
                    thumbnail: z.string().nullable(),
                  }),
                ),
                nextCursor: z.string().nullable(),
              }),
            ),
          },
        },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      400: {
        description: 'Invalid limit or cursor.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  // Reviews
  registry.registerPath({
    method: 'post',
    path: '/api/v1/reviews',
    tags: ['reviews'],
    summary: 'Create a review',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: createReviewBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Review created.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                review: reviewSchema,
              }),
            ),
          },
        },
      },
      401: {
        description: 'Not authenticated.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      400: {
        description: 'Invalid review payload.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
      404: {
        description: 'Place not found.',
        content: { 'application/json': { schema: genericErrorSchema } },
      },
    },
  });

  // Tags
  registry.registerPath({
    method: 'get',
    path: '/api/v1/tags',
    tags: ['tags'],
    summary: 'Get all tags',
    responses: {
      200: {
        description: 'Tags retrieved.',
        content: {
          'application/json': {
            schema: successWithData(
              z.object({
                tags: z.array(z.string()),
              }),
            ),
          },
        },
      },
    },
  });
}
