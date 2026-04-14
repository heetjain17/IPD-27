export interface SavePlaceBody {
  placeId: string;
}

export interface SavePlaceResponse {
  saved: true;
}

export interface DeleteSavedPlaceResponse {
  saved: false;
}

export interface SavedPlacesCursorPayload {
  ts: string;
  id: string;
}

export interface SavedPlaceSummary {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  tags: string[];
  thumbnail: string | null;
}

export interface SavedPlacesListResponse {
  places: SavedPlaceSummary[];
  nextCursor: string | null;
}
