export interface SavePlaceBody {
  placeId: string;
}

export interface SavePlaceResponse {
  saved: true;
}

export interface DeleteSavedPlaceResponse {
  saved: false;
}
