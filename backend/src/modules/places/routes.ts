import { Router } from 'express';
import * as placesController from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { nearbyQuerySchema, placeIdParamsSchema } from './schema.js';

const router = Router();

// IMPORTANT: static routes MUST be registered before /:id
// Otherwise Express matches 'nearby' and 'saved' as ID params.
router.get('/nearby', validate({ query: nearbyQuerySchema }), placesController.nearby);

router.get('/:id', validate({ params: placeIdParamsSchema }), placesController.getById);

export default router;
