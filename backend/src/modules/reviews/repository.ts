import { db } from '../../db/client.js';
import { reviews } from '../../db/schema.js';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { ReviewPayload } from './types.js';

export interface CreateReviewParams {
  userId: string;
  placeId: string;
  rating: number;
  comment?: string;
}

export interface GetReviewsParams {
  limit: number;
  cursorTs?: Date;
  cursorId?: string;
}

/**
 * Inserts a new review and returns the full row.
 */
export async function createReview(params: CreateReviewParams): Promise<ReviewPayload> {
  const [row] = await db
    .insert(reviews)
    .values({
      userId: params.userId,
      placeId: params.placeId,
      rating: params.rating,
      comment: params.comment ?? null,
    })
    .returning({
      id: reviews.id,
      placeId: reviews.placeId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
    });

  if (!row) {
    throw new Error('Failed to insert review');
  }

  return {
    id: row.id,
    placeId: row.placeId,
    userId: row.userId,
    rating: row.rating,
    comment: row.comment ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * Returns reviews for a given place in reverse-chronological order.
 * Keyset cursor: (createdAt DESC, id DESC) via { ts, id } payload.
 * Returns limit+1 rows so the caller can detect hasMore.
 */
export async function getReviewsByPlaceId(
  placeId: string,
  params: GetReviewsParams,
): Promise<ReviewPayload[]> {
  const { limit, cursorTs, cursorId } = params;

  const cursorFilter =
    cursorTs && cursorId
      ? or(
          lt(reviews.createdAt, cursorTs),
          and(eq(reviews.createdAt, cursorTs), lt(reviews.id, cursorId)),
        )
      : undefined;

  const whereClause = cursorFilter
    ? and(eq(reviews.placeId, placeId), cursorFilter)
    : eq(reviews.placeId, placeId);

  const rows = await db
    .select({
      id: reviews.id,
      placeId: reviews.placeId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(whereClause)
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(limit + 1);

  return rows.map((r) => ({
    id: r.id,
    placeId: r.placeId,
    userId: r.userId,
    rating: r.rating,
    comment: r.comment ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}
