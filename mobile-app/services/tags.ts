import type { ApiSuccess, TagsResponse } from '@/types/api';

import { apiClient } from './api';

export async function getTags(): Promise<string[]> {
  const { data } = await apiClient.get<ApiSuccess<TagsResponse>>('/api/v1/tags');
  return data.data.tags;
}
