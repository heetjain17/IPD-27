import { ApiError } from '../../utils/ApiError.js';
import * as authService from '../auth/service.js';
import * as placesService from '../places/service.js';
import * as reviewsRepo from './repository.js';
import type { ReviewsCursorPayload, CreateReviewResponse, ReviewsListResponse } from './types.js';
import type { CreateReviewBodyInput, ReviewsQueryInput } from './schema.js';

// ---------------------------------------------------------------------------
// Cursor parsing
// ---------------------------------------------------------------------------

function parseReviewsCursor(cursor: string): { ts: Date; id: string } {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<ReviewsCursorPayload> | null;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      parsed.id.length === 0
    ) {
      throw new ApiError(400, 'Invalid cursor');
    }

    if (typeof parsed.ts !== 'string') {
      throw new ApiError(400, 'Invalid cursor');
    }

    const ts = new Date(parsed.ts);
    if (Number.isNaN(ts.getTime()) || ts.toISOString() !== parsed.ts) {
      throw new ApiError(400, 'Invalid cursor');
    }

    return { ts, id: parsed.id };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, 'Invalid cursor');
  }
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * POST /api/v1/reviews
 *
 * Resolves the local user, verifies the place exists, then inserts the review.
 * Rating is already validated (0.5 step, 0.5–5) by the schema layer.
 */
export async function createReview(
  authId: string,
  body: CreateReviewBodyInput,
): Promise<CreateReviewResponse> {
  const user = await authService.getCurrentUser(authId);

  // Verify place existence; getById throws 404 if missing.
  await placesService.getById(body.placeId);

  const review = await reviewsRepo.createReview({
    userId: user.id,
    placeId: body.placeId,
    rating: body.rating,
    ...(body.comment !== undefined && { comment: body.comment }),
  });

  return { review };
}

/**
 * GET /api/v1/places/:id/reviews
 *
 * Public endpoint. Paginates reviews for a given place using
 * keyset cursor { ts, id } on (createdAt DESC, id DESC).
 */
export async function getReviewsByPlace(
  placeId: string,
  query: ReviewsQueryInput,
): Promise<ReviewsListResponse> {
  // Verify place existence first; throws 404 if missing.
  await placesService.getById(placeId);

  const { limit, cursor } = query;

  let cursorTs: Date | undefined;
  let cursorId: string | undefined;

  if (cursor !== undefined) {
    const parsed = parseReviewsCursor(cursor);
    cursorTs = parsed.ts;
    cursorId = parsed.id;
  }

  const repoParams: { limit: number; cursorTs?: Date; cursorId?: string } = { limit };
  if (cursorTs && cursorId) {
    repoParams.cursorTs = cursorTs;
    repoParams.cursorId = cursorId;
  }

  const rows = await reviewsRepo.getReviewsByPlaceId(placeId, repoParams);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  let nextCursor: string | null = null;
  if (hasMore && pageRows.length > 0) {
    const last = pageRows[pageRows.length - 1]!;
    nextCursor = Buffer.from(JSON.stringify({ ts: last.createdAt, id: last.id })).toString(
      'base64url',
    );
  }

  return { reviews: pageRows, nextCursor };
}
