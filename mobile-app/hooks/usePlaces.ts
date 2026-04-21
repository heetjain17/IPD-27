import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

import * as placesService from '@/services/places';
import type { PlacesParams, SavedPlacesResponse } from '@/types/api';

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

export function useSavedPlaces() {
  return useInfiniteQuery({
    queryKey: ['savedPlaces'] as const,
    queryFn: ({ pageParam }) => placesService.getSavedPlaces({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useSavePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) => placesService.savePlace(placeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savedPlaces'] });
    },
  });
}

export function useUnsavePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) => placesService.unsavePlace(placeId),
    onMutate: async (placeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['savedPlaces'] });
      const snapshot = queryClient.getQueryData<InfiniteData<SavedPlacesResponse>>(['savedPlaces']);
      queryClient.setQueryData<InfiniteData<SavedPlacesResponse>>(['savedPlaces'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            places: page.places.filter((p) => p.id !== placeId),
          })),
        };
      });
      return { snapshot };
    },
    onError: (_err, _placeId, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(['savedPlaces'], context.snapshot);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['savedPlaces'] });
    },
  });
}
