// API response shapes for the Places module

export interface PlaceListItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  address?: string | null;
  googleTypes?: string[];
  area?: string | null;
  lastSyncedAt?: string | null;
  isActive?: boolean;
  customDescription?: string | null;
  vibe?: string | null;
  isHiddenGem?: boolean;
  priorityScore?: number;
  verified?: boolean;
  bestTimeToVisit?: string | null;
  avgCostForTwo?: number | null;
  crowdLevelOverride?: string | null;
  notes?: string | null;
  averageRating?: number;
  reviewCount?: number;
  distance?: number;
  tags?: string[];
  thumbnail?: string | null;
  media?: { url: string; type: string | null }[];
  isSaved?: boolean;
}

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
  customDescription: string | null;
  vibe: string | null;
  isHiddenGem: boolean;
  priorityScore: number;
  verified: boolean;
  bestTimeToVisit: string | null;
  avgCostForTwo: number | null;
  crowdLevelOverride: string | null;
  notes: string | null;
  distance: number; // metres, computed by Location module
  tags: string[];
  thumbnail: string | null; // first image URL, null if no media
  isSaved: boolean;
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
  customDescription: string | null;
  vibe: string | null;
  isHiddenGem: boolean;
  priorityScore: number;
  verified: boolean;
  bestTimeToVisit: string | null;
  avgCostForTwo: number | null;
  crowdLevelOverride: string | null;
  notes: string | null;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  thumbnail: string | null;
  media: { url: string; type: string | null }[];
  isSaved: boolean;
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
  customDescription: string | null;
  vibe: string | null;
  isHiddenGem: boolean;
  priorityScore: number;
  verified: boolean;
  bestTimeToVisit: string | null;
  avgCostForTwo: number | null;
  crowdLevelOverride: string | null;
  notes: string | null;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  media: { url: string; type: string | null }[];
  isSaved: boolean;
}

export interface NearbyResponse {
  places: PlaceSummary[];
  nextCursor: string | null;
}

export interface PlacesListResponse {
  places: PlaceListItem[];
  nextCursor: string | null;
}

export interface PriceRangeOption {
  key: string;
  min: number;
  max: number;
}

export interface PlaceFiltersResponse {
  categories: string[];
  areas: string[];
  tags: string[];
  priceRanges: PriceRangeOption[];
}

export interface PlaceMediaItem {
  url: string;
  type: string | null;
}

export interface PlaceMediaResponse {
  media: PlaceMediaItem[];
  nextCursor: string | null;
}

export interface PlaceListPageRow {
  placeId: string;
  sortValue: number;
  distanceMetres: number | null;
}

export interface PlaceEnrichmentOptions {
  includeTags?: boolean;
  includeMedia?: boolean;
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
  customDescription: string | null;
  vibe: string | null;
  isHiddenGem: boolean;
  priorityScore: number;
  verified: boolean;
  bestTimeToVisit: string | null;
  avgCostForTwo: number | null;
  crowdLevelOverride: string | null;
  notes: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface PlaceWithEnrichment extends PlaceRow {
  tags: string[];
  media: { url: string; type: string | null }[];
}
