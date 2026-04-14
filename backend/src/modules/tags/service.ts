import * as tagsRepo from './repository.js';

export async function getAllTags(): Promise<string[]> {
  return tagsRepo.getAllTags();
}
