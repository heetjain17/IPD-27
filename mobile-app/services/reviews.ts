import type { ApiSuccess, CreateReviewParams, Review } from '@/types/api';

import { apiClient } from './api';

export async function createReview(params: CreateReviewParams): Promise<Review> {
  const { data } = await apiClient.post<ApiSuccess<{ review: Review }>>('/api/v1/reviews', params);
  return data.data.review;
}
