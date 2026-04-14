import {
  pgTable,
  uuid,
  text,
  timestamp,
  doublePrecision,
  integer,
  primaryKey,
  index,
  uniqueIndex,
  pgEnum,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Custom type for PostGIS geography
const geography = customType<{ data: string }>({
  dataType() {
    return 'geography(Point, 4326)';
  },
});

// ENUMS
export const placeSourceEnum = pgEnum('place_source', ['google', 'user', 'admin']);

// USERS
// Note: auth_id references Supabase auth.users.id
// Supabase handles password hashing, we only store profile data

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: uuid('auth_id').notNull().unique(), // References Supabase auth.users.id
  email: text('email').notNull().unique(),
  name: text('name'), // Optional profile field
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// PLACES
export const places = pgTable(
  'places',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),

    // Location
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),
    geom: geography('geom'),

    category: text('category').notNull(),

    // Source tracking
    source: placeSourceEnum('source').notNull(),
    externalId: text('external_id'),

    // Place details
    openingHours: text('opening_hours'),
    contactPhone: text('contact_phone'),
    websiteUrl: text('website_url'),
    priceLevel: integer('price_level'),

    // Cached rating data (updated via trigger)
    averageRating: doublePrecision('average_rating').default(0).notNull(),
    reviewCount: integer('review_count').default(0).notNull(),

    // Metadata
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Regular indexes
    index('idx_places_category').on(table.category),
    index('idx_places_source').on(table.source),
    index('idx_places_created_by').on(table.createdBy),

    // Prevent duplicate external imports (unique where not null)
    uniqueIndex('idx_places_external_unique')
      .on(table.externalId)
      .where(sql`${table.externalId} IS NOT NULL`),
  ],
);

export type Place = typeof places.$inferSelect;
export type NewPlace = typeof places.$inferInsert;

// TAGS (flexible categorization)
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

// PLACE_TAGS (many-to-many junction)
export const placeTags = pgTable(
  'place_tags',
  {
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.placeId, table.tagId] })],
);

export type PlaceTag = typeof placeTags.$inferSelect;
export type NewPlaceTag = typeof placeTags.$inferInsert;

// SAVED_PLACES (user bookmarks)
export const savedPlaces = pgTable(
  'saved_places',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.placeId] }),
    index('idx_saved_user').on(table.userId),
  ],
);

export type SavedPlace = typeof savedPlaces.$inferSelect;
export type NewSavedPlace = typeof savedPlaces.$inferInsert;

// PLACE_MEDIA (images/videos)
export const placeMedia = pgTable('place_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  placeId: uuid('place_id')
    .notNull()
    .references(() => places.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: text('type', { enum: ['image', 'video'] }),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PlaceMedia = typeof placeMedia.$inferSelect;
export type NewPlaceMedia = typeof placeMedia.$inferInsert;

// REVIEWS
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    rating: doublePrecision('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_reviews_place').on(table.placeId)],
);

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
