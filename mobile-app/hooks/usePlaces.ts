import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import * as placesService from '@/services/places';
import type { PlacesParams } from '@/types/api';

export function usePlaces(params?: Omit<PlacesParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['places', params] as const,
    queryFn: ({ pageParam }) => placesService.getPlaces({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ['place', id] as const,
    queryFn: () => placesService.getPlace(id),
    enabled: !!id,
  });
}

export function usePlaceReviews(id: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['reviews', id] as const,
    queryFn: ({ pageParam }) => placesService.getPlaceReviews(id, { limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!id,
  });
}

export function usePlaceMedia(id: string) {
  return useInfiniteQuery({
    queryKey: ['media', id] as const,
    queryFn: ({ pageParam }) => placesService.getPlaceMedia(id, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!id,
  });
}

export function useFilters() {
  return useQuery({
    queryKey: ['filters'] as const,
    queryFn: () => placesService.getFilters(),
    staleTime: Infinity,
  });
}
