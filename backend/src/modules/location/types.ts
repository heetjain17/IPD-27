export interface NearbyResult {
  placeId: string;
  distanceMetres: number;
}

export interface FindNearbyParams {
  lat: number;
  lng: number;
  radiusMetres: number;
  limit: number;
  cursor?: string | undefined;
}

// Shape of the cursor payload encoded in base64url
export interface NearbyDistanceCursor {
  id: string;
  dist: number;
}

export interface FindNearbyRepositoryParams {
  lat: number;
  lng: number;
  radiusMetres: number;
  limit: number;
  cursorDist?: number;
  cursorId?: string;
}
