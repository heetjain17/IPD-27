import { useQuery } from '@tanstack/react-query';

import * as tagsService from '@/services/tags';

export function useTags() {
  return useQuery({
    queryKey: ['tags'] as const,
    queryFn: () => tagsService.getTags(),
    staleTime: Infinity,
  });
}
