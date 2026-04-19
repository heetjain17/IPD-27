// ─── Shared Envelopes ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

// ─── Places ───────────────────────────────────────────────────────────────────

export interface PlaceMedia {
  url: string;
  type: string | null;
}

export interface Place {
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
  distance?: number;
  tags: string[];
  thumbnail?: string | null;
  media: PlaceMedia[];
}

export interface PlaceDetail extends Place {
  description: string | null;
}

export interface PlacesResponse {
  places: Place[];
  nextCursor: string | null;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface PriceRange {
  key: string;
  min: number;
  max: number;
}

export interface FilterMeta {
  categories: string[];
  areas: string[];
  tags: string[];
  priceRanges: PriceRange[];
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  nextCursor: string | null;
}

export interface CreateReviewParams {
  placeId: string;
  rating: number;
  comment?: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaResponse {
  media: PlaceMedia[];
  nextCursor: string | null;
}

// ─── Saved Places ─────────────────────────────────────────────────────────────

export interface SavedPlacesResponse {
  places: Place[];
  nextCursor: string | null;
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export interface TagsResponse {
  tags: string[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export type PlacesSortKey =
  | 'distance'
  | 'rating'
  | 'newest'
  | 'price_low'
  | 'price_high'
  | 'priority';
export type SortOrder = 'asc' | 'desc';
export type FieldsLevel = 'basic' | 'card' | 'full';
export type TagsMode = 'all' | 'any';

export interface PlacesParams {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  area?: string;
  verified?: boolean;
  isHiddenGem?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  tagsMode?: TagsMode;
  q?: string;
  sort?: PlacesSortKey;
  order?: SortOrder;
  limit?: number;
  cursor?: string;
  fields?: FieldsLevel;
}

export interface NearbyParams {
  lat?: number;
  lng?: number;
  radius: number;
  limit?: number;
  cursor?: string;
}
