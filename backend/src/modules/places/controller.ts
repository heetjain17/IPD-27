import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiSuccess } from '../../utils/apiSuccess.js';
import { ApiError } from '../../utils/ApiError.js';
import * as placesService from './service.js';
import type { NearbyQuery, PlaceIdParams, PlacesListQuery } from './schema.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validated?.query as PlacesListQuery | undefined;
  if (!query) {
    throw new ApiError(400, 'Invalid query parameters');
  }

  const result = await placesService.listPlaces(query);
  return res.json(apiSuccess(200, 'Places retrieved', result));
});

/**
 * GET /api/v1/places/nearby?lat=&lng=&radius=&limit=&cursor=
 *
 * Public endpoint — no auth required.
 * Query params are validated by validation.middleware.ts before this handler.
 */
export const nearby = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validated?.query as NearbyQuery | undefined;
  if (!query) {
    throw new ApiError(400, 'Invalid query parameters');
  }

  const result = await placesService.findNearby(query);
  return res.json(apiSuccess(200, 'Nearby places retrieved', result));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const params = req.validated?.params as PlaceIdParams | undefined;
  if (!params) {
    throw new ApiError(400, 'Invalid route parameters');
  }

  const place = await placesService.getById(params.id);
  return res.json(apiSuccess(200, 'Place retrieved', place));
});
