import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth.js';
import { ApiError } from '../../utils/ApiError.js';
import { apiSuccess } from '../../utils/apiSuccess.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type {
  DeleteSavedPlaceParamsInput,
  SavePlaceBodyInput,
  SavedPlacesQueryInput,
} from './schema.js';
import * as savedPlacesService from './service.js';

export const savePlace = asyncHandler(async (req: Request, res: Response) => {
  const authId = (req as AuthenticatedRequest).user?.authId;
  if (!authId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const body = req.validated?.body as SavePlaceBodyInput | undefined;
  if (!body) {
    throw new ApiError(400, 'Invalid request body');
  }

  const result = await savedPlacesService.savePlace(authId, body.placeId);
  return res.json(apiSuccess(200, 'Place saved', result));
});

export const deleteSavedPlace = asyncHandler(async (req: Request, res: Response) => {
  const authId = (req as AuthenticatedRequest).user?.authId;
  if (!authId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const params = req.validated?.params as DeleteSavedPlaceParamsInput | undefined;
  if (!params) {
    throw new ApiError(400, 'Invalid route parameters');
  }

  const result = await savedPlacesService.deleteSavedPlace(authId, params.placeId);
  return res.json(apiSuccess(200, 'Place unsaved', result));
});

export const getSavedPlaces = asyncHandler(async (req: Request, res: Response) => {
  const authId = (req as AuthenticatedRequest).user?.authId;
  if (!authId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const query = req.validated?.query as SavedPlacesQueryInput | undefined;
  if (!query) {
    throw new ApiError(400, 'Invalid query parameters');
  }

  const result = await savedPlacesService.getSavedPlaces(authId, query);
  return res.json(apiSuccess(200, 'Saved places retrieved', result));
});
