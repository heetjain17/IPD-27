// API response shapes for the Places module

export interface PlaceSummary {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  distance: number; // metres, computed by Location module
  tags: string[];
  thumbnail: string | null; // first image URL, null if no media
}

export interface PlaceDetail {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  category: string;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  media: { url: string; type: string | null }[];
}

export interface NearbyResponse {
  places: PlaceSummary[];
  nextCursor: string | null;
}

// Internal enriched type returned by the repository (used inside the module only)
export interface PlaceRow {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  category: string;
  averageRating: number;
  reviewCount: number;
}

export interface PlaceWithEnrichment extends PlaceRow {
  tags: string[];
  media: { url: string; type: string | null }[];
}
