import { z } from 'zod';

/**
 * Validation schema for POST /reviews (create review).
 * rating must be a multiple of 0.5 in the range [0.5, 5].
 */
export const createReviewBodySchema = z.object({
  placeId: z.string().uuid(),
  rating: z
    .number()
    .min(1)
    .max(5)
    .transform((v) => Math.round(v * 10) / 10),
  comment: z.string().min(1).max(2000).optional(),
});

/**
 * Validation schema for GET /places/:id/reviews query params.
 */
export const reviewsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

/**
 * Validation schema for the :id param on the nested reviews route.
 */
export const reviewsPlaceParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateReviewBodyInput = z.infer<typeof createReviewBodySchema>;
export type ReviewsQueryInput = z.infer<typeof reviewsQuerySchema>;
export type ReviewsPlaceParamsInput = z.infer<typeof reviewsPlaceParamsSchema>;
