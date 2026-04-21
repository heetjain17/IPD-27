import type {
  ApiSuccess,
  FilterMeta,
  MediaResponse,
  NearbyParams,
  PlaceDetail,
  PlacesParams,
  PlacesResponse,
  ReviewsResponse,
  SavedPlacesResponse,
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

export async function getPlaceMedia(
  id: string,
  params?: { limit?: number; cursor?: string },
): Promise<MediaResponse> {
  const { data } = await apiClient.get<ApiSuccess<MediaResponse>>(`/api/v1/places/${id}/media`, {
    params,
  });
  return data.data;
}

export async function getFilters(): Promise<FilterMeta> {
  const { data } = await apiClient.get<ApiSuccess<FilterMeta>>('/api/v1/places/filters');
  return data.data;
}

export async function getSavedPlaces(params?: {
  limit?: number;
  cursor?: string;
}): Promise<SavedPlacesResponse> {
  const { data } = await apiClient.get<ApiSuccess<SavedPlacesResponse>>('/api/v1/places/saved', {
    params,
  });
  return data.data;
}

export async function savePlace(placeId: string): Promise<{ saved: true }> {
  const { data } = await apiClient.post<ApiSuccess<{ saved: true }>>('/api/v1/places/save', {
    placeId,
  });
  return data.data;
}

export async function unsavePlace(placeId: string): Promise<{ saved: false }> {
  const { data } = await apiClient.delete<ApiSuccess<{ saved: false }>>(
    `/api/v1/places/save/${placeId}`,
  );
  return data.data;
}
