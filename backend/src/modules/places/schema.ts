import { z } from 'zod';

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

export const placeIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const placeDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  category: z.string(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  tags: z.array(z.string()),
  media: z.array(
    z.object({
      url: z.string(),
      type: z.string().nullable(),
    }),
  ),
});

export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type PlaceIdParams = z.infer<typeof placeIdParamsSchema>;
