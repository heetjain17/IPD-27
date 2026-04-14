import { ApiError } from '../../utils/ApiError.js';
import * as locationRepo from './repository.js';
import type {
  FindNearbyParams,
  FindNearbyRepositoryParams,
  NearbyDistanceCursor,
  NearbyResult,
} from './types.js';

function parseNearbyCursor(cursor: string): NearbyDistanceCursor {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<NearbyDistanceCursor> | null;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      parsed.id.length === 0 ||
      typeof parsed.dist !== 'number' ||
      !Number.isFinite(parsed.dist) ||
      parsed.dist < 0
    ) {
      throw new ApiError(400, 'Invalid cursor');
    }

    return { id: parsed.id, dist: parsed.dist };
  } catch {
    throw new ApiError(400, 'Invalid cursor');
  }
}

/**
 * Validates lat/lng bounds then delegates to the PostGIS repository.
 * Called by PlacesService — never called directly from a controller.
 */
export async function findNearby(params: FindNearbyParams): Promise<NearbyResult[]> {
  if (params.lat < -90 || params.lat > 90) {
    throw new ApiError(400, 'lat must be between -90 and 90');
  }

  if (params.lng < -180 || params.lng > 180) {
    throw new ApiError(400, 'lng must be between -180 and 180');
  }

  const repoParams: FindNearbyRepositoryParams = {
    lat: params.lat,
    lng: params.lng,
    radiusMetres: params.radiusMetres,
    limit: params.limit,
  };

  if (params.cursor !== undefined) {
    const parsedCursor = parseNearbyCursor(params.cursor);
    repoParams.cursorDist = parsedCursor.dist;
    repoParams.cursorId = parsedCursor.id;
  }

  return locationRepo.findNearbyPlaces(repoParams);
}
