import { ApiError } from '../../utils/ApiError.js';
import * as authService from '../auth/service.js';
import * as placesService from '../places/service.js';
import * as savedPlacesRepo from './repository.js';
import type { SavePlaceResponse } from './types.js';

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  if (typeof maybeCode === 'string' && maybeCode === '23505') {
    return true;
  }

  const cause = (error as { cause?: unknown }).cause;
  if (cause && typeof cause === 'object') {
    const causeCode = (cause as { code?: unknown }).code;
    if (typeof causeCode === 'string' && causeCode === '23505') {
      return true;
    }
  }

  return false;
}

export async function savePlace(authId: string, placeId: string): Promise<SavePlaceResponse> {
  const user = await authService.getCurrentUser(authId);

  // Validate place existence before write; places service throws 404 if missing.
  await placesService.getById(placeId);

  try {
    await savedPlacesRepo.savePlace(user.id, placeId);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Place already saved');
    }
    throw error;
  }

  return { saved: true };
}
