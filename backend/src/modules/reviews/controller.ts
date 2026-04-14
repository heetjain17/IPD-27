import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth.js';
import { ApiError } from '../../utils/ApiError.js';
import { apiSuccess } from '../../utils/apiSuccess.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type { CreateReviewBodyInput, ReviewsQueryInput, ReviewsPlaceParamsInput } from './schema.js';
import * as reviewsService from './service.js';

/**
 * POST /api/v1/reviews
 * Auth-required. Creates a review for a place.
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const authId = (req as AuthenticatedRequest).user?.authId;
  if (!authId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const body = req.validated?.body as CreateReviewBodyInput | undefined;
  if (!body) {
    throw new ApiError(400, 'Invalid request body');
  }

  const result = await reviewsService.createReview(authId, body);
  return res.status(201).json(apiSuccess(201, 'Review created', result));
});

/**
 * GET /api/v1/places/:id/reviews
 * Public endpoint. Returns paginated reviews for a place.
 */
export const getReviewsByPlace = asyncHandler(async (req: Request, res: Response) => {
  const params = req.validated?.params as ReviewsPlaceParamsInput | undefined;
  if (!params) {
    throw new ApiError(400, 'Invalid route parameters');
  }

  const query = req.validated?.query as ReviewsQueryInput | undefined;
  if (!query) {
    throw new ApiError(400, 'Invalid query parameters');
  }

  const result = await reviewsService.getReviewsByPlace(params.id, query);
  return res.json(apiSuccess(200, 'Reviews retrieved', result));
});
