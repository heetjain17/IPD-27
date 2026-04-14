import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  deleteSavedPlaceParamsSchema,
  savePlaceBodySchema,
  savedPlacesQuerySchema,
} from './schema.js';
import * as savedPlacesController from './controller.js';

const router = Router();

router.post(
  '/save',
  authMiddleware,
  validate({ body: savePlaceBodySchema }),
  savedPlacesController.savePlace,
);
router.delete(
  '/save/:placeId',
  authMiddleware,
  validate({ params: deleteSavedPlaceParamsSchema }),
  savedPlacesController.deleteSavedPlace,
);
router.get(
  '/saved',
  authMiddleware,
  validate({ query: savedPlacesQuerySchema }),
  savedPlacesController.getSavedPlaces,
);

export default router;
