import { Router } from 'express';
import * as placesController from './controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { nearbyQuerySchema } from './schema.js';

const router = Router();

// IMPORTANT: static routes MUST be registered before /:id
// Otherwise Express matches 'nearby' and 'saved' as ID params.
router.get('/nearby', validate({ query: nearbyQuerySchema }), placesController.nearby);

// Phase 3: GET /places/:id
// router.get('/:id', placesController.getById);

export default router;
