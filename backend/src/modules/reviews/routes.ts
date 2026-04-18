import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createReviewBodySchema, reviewsQuerySchema, reviewsPlaceParamsSchema } from './schema.js';
import * as reviewsController from './controller.js';

const router = Router();

/**
 * POST /api/v1/reviews
 * Auth-required. Body: { placeId, rating, comment? }
 */
router.post(
  '/',
  authMiddleware,
  validate({ body: createReviewBodySchema }),
  reviewsController.createReview,
);

export default router;

/**
 * Separate sub-router for nested reviews under /places/:id/reviews.
 * Exported for mounting inside the places router to expose the exact API path
 * GET /api/v1/places/:id/reviews without creating a circular module dependency.
 */
export const placeReviewsRouter = Router({ mergeParams: true });

placeReviewsRouter.get(
  '/',
  validate({ params: reviewsPlaceParamsSchema, query: reviewsQuerySchema }),
  reviewsController.getReviewsByPlace,
);
