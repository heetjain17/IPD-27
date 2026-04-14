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

export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
