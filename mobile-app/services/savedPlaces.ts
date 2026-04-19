import type { ApiSuccess, SavedPlacesResponse } from '@/types/api';

import { apiClient } from './api';

export async function savePlace(placeId: string): Promise<{ saved: boolean }> {
  const { data } = await apiClient.post<ApiSuccess<{ saved: boolean }>>('/api/v1/places/save', {
    placeId,
  });
  return data.data;
}

export async function unsavePlace(placeId: string): Promise<{ saved: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ saved: boolean }>>(
    `/api/v1/places/save/${placeId}`,
  );
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
