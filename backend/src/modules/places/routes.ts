import { Router } from 'express';
import * as placesController from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import {
  nearbyQuerySchema,
  placeIdParamsSchema,
  placeMediaQuerySchema,
  placesListQuerySchema,
} from './schema.js';
import { placeReviewsRouter } from '../reviews/routes.js';

const router = Router();

// IMPORTANT: static routes MUST be registered before /:id
// Otherwise Express matches 'nearby' and 'saved' as ID params.
router.get(
  '/',
  optionalAuthMiddleware,
  validate({ query: placesListQuerySchema }),
  placesController.list,
);
router.get('/filters', placesController.filters);
router.get(
  '/nearby',
  optionalAuthMiddleware,
  validate({ query: nearbyQuerySchema }),
  placesController.nearby,
);
router.get(
  '/:id/media',
  validate({ params: placeIdParamsSchema, query: placeMediaQuerySchema }),
  placesController.getMedia,
);

// Nested: GET /api/v1/places/:id/reviews
router.use('/:id/reviews', placeReviewsRouter);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validate({ params: placeIdParamsSchema }),
  placesController.getById,
);

export default router;
