import { ApiError } from '../../utils/ApiError.js';
import * as authService from '../auth/service.js';
import * as placesService from '../places/service.js';
import * as savedPlacesRepo from './repository.js';
import type {
  DeleteSavedPlaceResponse,
  SavePlaceResponse,
  SavedPlacesCursorPayload,
  SavedPlacesListResponse,
} from './types.js';
import type { SavedPlacesQueryInput } from './schema.js';

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

export async function deleteSavedPlace(
  authId: string,
  placeId: string,
): Promise<DeleteSavedPlaceResponse> {
  const user = await authService.getCurrentUser(authId);
  const deleted = await savedPlacesRepo.deleteSavedPlace(user.id, placeId);

  if (!deleted) {
    throw new ApiError(404, 'Saved place not found');
  }

  return { saved: false };
}

function parseSavedPlacesCursor(cursor: string): { ts: Date; id: string } {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<SavedPlacesCursorPayload> | null;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      parsed.id.length === 0
    ) {
      throw new ApiError(400, 'Invalid cursor');
    }

    if (typeof parsed.ts !== 'string') {
      throw new ApiError(400, 'Invalid cursor');
    }

    const ts = new Date(parsed.ts);
    if (Number.isNaN(ts.getTime()) || ts.toISOString() !== parsed.ts) {
      throw new ApiError(400, 'Invalid cursor');
    }

    return { ts, id: parsed.id };
  } catch {
    throw new ApiError(400, 'Invalid cursor');
  }
}

export async function getSavedPlaces(
  authId: string,
  query: SavedPlacesQueryInput,
): Promise<SavedPlacesListResponse> {
  const user = await authService.getCurrentUser(authId);
  const { limit, cursor } = query;

  let cursorTs: Date | undefined;
  let cursorId: string | undefined;

  if (cursor !== undefined) {
    const parsed = parseSavedPlacesCursor(cursor);
    cursorTs = parsed.ts;
    cursorId = parsed.id;
  }

  const repoParams: {
    limit: number;
    cursorTs?: Date;
    cursorId?: string;
  } = { limit };

  if (cursorTs && cursorId) {
    repoParams.cursorTs = cursorTs;
    repoParams.cursorId = cursorId;
  }

  const savedRows = await savedPlacesRepo.getSavedPlaceRows(user.id, repoParams);

  const hasMore = savedRows.length > limit;
  const pageRows = hasMore ? savedRows.slice(0, limit) : savedRows;
  const placeIds = pageRows.map((row) => row.placeId);

  const places = await placesService.getSavedPlaceSummariesByIds(placeIds);

  let nextCursor: string | null = null;
  if (hasMore && pageRows.length > 0) {
    const last = pageRows[pageRows.length - 1]!;
    nextCursor = Buffer.from(
      JSON.stringify({ ts: last.createdAt.toISOString(), id: last.placeId }),
    ).toString('base64url');
  }

  return { places, nextCursor };
}
