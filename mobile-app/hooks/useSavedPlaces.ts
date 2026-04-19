import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as savedPlacesService from '@/services/savedPlaces';

export function useSavedPlaces() {
  return useInfiniteQuery({
    queryKey: ['savedPlaces'] as const,
    queryFn: ({ pageParam }) => savedPlacesService.getSavedPlaces({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useSavePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => savedPlacesService.savePlace(placeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savedPlaces'] });
    },
  });
}

export function useUnsavePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => savedPlacesService.unsavePlace(placeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savedPlaces'] });
    },
  });
}
