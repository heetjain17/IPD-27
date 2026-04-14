import type { Request, Response } from 'express';
import { apiSuccess } from '../../utils/apiSuccess.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as tagsService from './service.js';

/**
 * GET /api/v1/tags
 * Public endpoint. Returns all tag names sorted alphabetically.
 */
export const getTags = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await tagsService.getAllTags();
  return res.json(apiSuccess(200, 'Tags retrieved', { tags }));
});
