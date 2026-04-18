// API response shapes for the Places module

export interface PlaceSummary {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  address: string | null;
  googleTypes: string[];
  area: string | null;
  lastSyncedAt: string | null;
  isActive: boolean;
  distance: number; // metres, computed by Location module
  tags: string[];
  thumbnail: string | null; // first image URL, null if no media
}

export interface SavedPlaceSummary {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  address: string | null;
  googleTypes: string[];
  area: string | null;
  lastSyncedAt: string | null;
  isActive: boolean;
  tags: string[];
  thumbnail: string | null;
}

export interface PlaceDetail {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  category: string;
  address: string | null;
  googleTypes: string[];
  area: string | null;
  lastSyncedAt: string | null;
  isActive: boolean;
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
  address: string | null;
  googleTypes: string[] | null;
  area: string | null;
  lastSyncedAt: Date | null;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface PlaceWithEnrichment extends PlaceRow {
  tags: string[];
  media: { url: string; type: string | null }[];
}
