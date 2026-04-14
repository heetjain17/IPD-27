// API response shapes for the Reviews module

export interface ReviewPayload {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string; // ISO-8601
}

export interface CreateReviewResponse {
  review: ReviewPayload;
}

export interface ReviewsCursorPayload {
  ts: string; // ISO-8601 createdAt of the last row
  id: string; // UUID of the last row
}

export interface ReviewsListResponse {
  reviews: ReviewPayload[];
  nextCursor: string | null;
}
