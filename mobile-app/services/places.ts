import type {
  ApiSuccess,
  FilterMeta,
  NearbyParams,
  PlaceDetail,
  PlacesParams,
  PlacesResponse,
  ReviewsResponse,
} from '@/types/api';

import { apiClient } from './api';

export async function getPlaces(params?: PlacesParams): Promise<PlacesResponse> {
  const { data } = await apiClient.get<ApiSuccess<PlacesResponse>>('/api/v1/places', { params });
  return data.data;
}

export async function getNearby(params: NearbyParams): Promise<PlacesResponse> {
  const { data } = await apiClient.get<ApiSuccess<PlacesResponse>>('/api/v1/places/nearby', {
    params,
  });
  return data.data;
}

export async function getPlace(id: string): Promise<PlaceDetail> {
  const { data } = await apiClient.get<ApiSuccess<PlaceDetail>>(`/api/v1/places/${id}`);
  return data.data;
}

export async function getPlaceReviews(
  id: string,
  params?: { limit?: number; cursor?: string },
): Promise<ReviewsResponse> {
  const { data } = await apiClient.get<ApiSuccess<ReviewsResponse>>(
    `/api/v1/places/${id}/reviews`,
    { params },
  );
  return data.data;
}

export async function getFilters(): Promise<FilterMeta> {
  const { data } = await apiClient.get<ApiSuccess<FilterMeta>>('/api/v1/places/filters');
  return data.data;
}
