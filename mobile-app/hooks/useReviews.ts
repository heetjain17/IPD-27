import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as reviewsService from '@/services/reviews';
import type { CreateReviewParams } from '@/types/api';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReviewParams) => reviewsService.createReview(params),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', variables.placeId] });
      void queryClient.invalidateQueries({ queryKey: ['place', variables.placeId] });
    },
  });
}
