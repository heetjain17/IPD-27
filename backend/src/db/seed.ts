import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { places, tags, placeTags, savedPlaces, placeMedia, reviews, users } from './schema.js'; // adjust path as needed

// ---------------------------------------------------------------------------
// DB connection — reads DATABASE_URL from your .env
// Use the direct connection string (port 5432), not the pooler, for seeding
// ---------------------------------------------------------------------------
const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

// ---------------------------------------------------------------------------
// Seed users
// NOTE: auth_id values are placeholders — replace with real Supabase auth
// user IDs after creating them via the dashboard or Admin SDK.
// ---------------------------------------------------------------------------
// const USERS = [
//   {
//     authId: 'auth0000-0000-0000-0000-000000000001',
//     email: 'alice@example.com',
//     name: 'Alice Chen',
//   },
//   { authId: 'auth0000-0000-0000-0000-000000000002', email: 'bob@example.com', name: 'Bob Tanaka' },
//   {
//     authId: 'auth0000-0000-0000-0000-000000000003',
//     email: 'carla@example.com',
//     name: 'Carla Mendes',
//   },
//   { authId: 'auth0000-0000-0000-0000-000000000004', email: 'dan@example.com', name: 'Dan Osei' },
// ] satisfies (typeof users.$inferInsert)[];

// ---------------------------------------------------------------------------
// Seed places
// averageRating and reviewCount are intentionally omitted here —
// the Postgres trigger on the reviews table keeps them in sync automatically.
// ---------------------------------------------------------------------------
const PLACES = [
  {
    name: 'The Blue Door Café',
    description: 'Cozy brunch spot with seasonal menus',
    lat: 37.7749,
    lng: -122.4194,
    category: 'cafe',
    source: 'google' as const,
    externalId: 'gp_001',
    openingHours: 'Mon-Fri 7am-4pm, Sat-Sun 8am-5pm',
    contactPhone: '+14155550101',
    websiteUrl: 'https://bluedoorcafe.example.com',
    priceLevel: 2,
  },
  {
    name: 'Meridian Rooftop Bar',
    description: 'Cocktails with panoramic city views',
    lat: 37.7751,
    lng: -122.418,
    category: 'bar',
    source: 'google' as const,
    externalId: 'gp_002',
    openingHours: 'Tue-Sun 5pm-1am',
    contactPhone: '+14155550102',
    websiteUrl: 'https://meridianbar.example.com',
    priceLevel: 3,
  },
  {
    name: 'Sakura Japanese Kitchen',
    description: 'Authentic ramen and izakaya dishes',
    lat: 37.7762,
    lng: -122.4165,
    category: 'restaurant',
    source: 'google' as const,
    externalId: 'gp_003',
    openingHours: 'Daily 11am-10pm',
    contactPhone: '+14155550103',
    websiteUrl: 'https://sakurasf.example.com',
    priceLevel: 2,
  },
  {
    name: 'Golden Gate Park Trail',
    description: 'Scenic 3-mile loop through the park',
    lat: 37.7694,
    lng: -122.4862,
    category: 'park',
    source: 'admin' as const,
    openingHours: 'Open 24h',
    priceLevel: 1,
  },
  {
    name: 'Volta Electric Bikes',
    description: 'E-bike rentals and guided city tours',
    lat: 37.7835,
    lng: -122.4089,
    category: 'activity',
    source: 'google' as const,
    externalId: 'gp_005',
    openingHours: 'Daily 9am-7pm',
    contactPhone: '+14155550105',
    websiteUrl: 'https://voltabikes.example.com',
    priceLevel: 2,
  },
  {
    name: 'Haight Street Market',
    description: 'Family-run grocery with local produce',
    lat: 37.7692,
    lng: -122.4482,
    category: 'grocery',
    source: 'user' as const,
    openingHours: 'Mon-Sat 8am-9pm, Sun 9am-8pm',
    contactPhone: '+14155550106',
    priceLevel: 1,
  },
  {
    name: 'Fog City Bookshop',
    description: 'Independent bookstore & community hub',
    lat: 37.7949,
    lng: -122.3937,
    category: 'shopping',
    source: 'google' as const,
    externalId: 'gp_007',
    openingHours: 'Mon-Sat 10am-8pm, Sun 11am-6pm',
    contactPhone: '+14155550107',
    websiteUrl: 'https://fogcitybooks.example.com',
    priceLevel: 1,
  },
  {
    name: 'Embarcadero Fitness Club',
    description: 'Full-service gym with bay views',
    lat: 37.7955,
    lng: -122.394,
    category: 'gym',
    source: 'admin' as const,
    openingHours: 'Mon-Fri 5am-11pm, Sat-Sun 6am-10pm',
    contactPhone: '+14155550108',
    websiteUrl: 'https://embarcaderofitness.example.com',
    priceLevel: 3,
  },
  {
    name: 'Nopa Bistro',
    description: 'Farm-to-table with wood-fired dishes',
    lat: 37.7762,
    lng: -122.4342,
    category: 'restaurant',
    source: 'google' as const,
    externalId: 'gp_009',
    openingHours: 'Daily 5:30pm-1am',
    contactPhone: '+14155550109',
    websiteUrl: 'https://nopabistro.example.com',
    priceLevel: 3,
  },
  {
    name: 'Castro Theatre',
    description: 'Historic 1920s cinema, live events',
    lat: 37.7626,
    lng: -122.4348,
    category: 'entertainment',
    source: 'google' as const,
    externalId: 'gp_010',
    openingHours: 'Varies by show',
    contactPhone: '+14155550110',
    websiteUrl: 'https://castrotheatre.example.com',
    priceLevel: 2,
  },
  {
    name: 'Tartine Bakery',
    description: 'World-famous sourdough and pastries',
    lat: 37.7616,
    lng: -122.4241,
    category: 'bakery',
    source: 'google' as const,
    externalId: 'gp_011',
    openingHours: 'Wed-Fri 8am-7pm, Sat-Sun 8am-6pm',
    contactPhone: '+14155550111',
    websiteUrl: 'https://tartinebakery.example.com',
    priceLevel: 2,
  },
  {
    name: 'SoMa Rock Climbing Wall',
    description: 'Indoor bouldering for all skill levels',
    lat: 37.7749,
    lng: -122.406,
    category: 'activity',
    source: 'user' as const,
    openingHours: 'Mon-Fri 6am-10pm, Sat-Sun 8am-8pm',
    contactPhone: '+14155550112',
    priceLevel: 2,
  },
  {
    name: 'Presidio Spa & Wellness',
    description: 'Holistic spa with eucalyptus steam rooms',
    lat: 37.7989,
    lng: -122.4662,
    category: 'spa',
    source: 'google' as const,
    externalId: 'gp_013',
    openingHours: 'Daily 9am-9pm',
    contactPhone: '+14155550113',
    websiteUrl: 'https://presidiospa.example.com',
    priceLevel: 4,
  },
  {
    name: 'Mission Dolores Park',
    description: 'Sunny hilltop park with skyline views',
    lat: 37.7596,
    lng: -122.4269,
    category: 'park',
    source: 'admin' as const,
    openingHours: 'Open daily 6am-10pm',
    priceLevel: 1,
  },
  {
    name: 'Chinatown Night Market',
    description: 'Weekly street food market, Fri evenings',
    lat: 37.7941,
    lng: -122.4078,
    category: 'market',
    source: 'user' as const,
    openingHours: 'Fri 5pm-10pm',
    priceLevel: 1,
  },
] satisfies (typeof places.$inferInsert)[];

// ---------------------------------------------------------------------------
// Seed tags
// ---------------------------------------------------------------------------
const TAGS = [
  { name: 'pet-friendly' },
  { name: 'outdoor-seating' },
  { name: 'wifi' },
  { name: 'vegan-options' },
  { name: 'live-music' },
  { name: 'parking' },
  { name: 'kid-friendly' },
  { name: 'date-night' },
  { name: 'late-night' },
  { name: 'scenic' },
  { name: 'cash-only' },
  { name: 'rooftop' },
  { name: 'historic' },
  { name: 'free-entry' },
  { name: 'gluten-free' },
] satisfies (typeof tags.$inferInsert)[];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  console.log('🌱 Seeding database...');

  // Users
  // console.log('  → users');
  // await db.insert(users).values(USERS).onConflictDoNothing();

  // Places — capture generated IDs for FK use below
  console.log('  → places');
  const insertedPlaces = await db
    .insert(places)
    .values(PLACES)
    .returning({ id: places.id, name: places.name });

  // Backfill PostGIS geom from lat/lng
  console.log('  → backfilling geom from lat/lng');
  await client`
    UPDATE places
    SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    WHERE geom IS NULL
  `;

  // Helper: resolve place ID by name
  const placeId = (name: string) => {
    const p = insertedPlaces.find((r) => r.name === name);
    if (!p) throw new Error(`Place not found: "${name}"`);
    return p.id;
  };

  // Tags — capture generated IDs for FK use below
  console.log('  → tags');
  const insertedTags = await db
    .insert(tags)
    .values(TAGS)
    .returning({ id: tags.id, name: tags.name });

  // Helper: resolve tag ID by name
  const tagId = (name: string) => {
    const t = insertedTags.find((r) => r.name === name);
    if (!t) throw new Error(`Tag not found: "${name}"`);
    return t.id;
  };

  // Place tags
  console.log('  → place_tags');
  await db
    .insert(placeTags)
    .values([
      { placeId: placeId('The Blue Door Café'), tagId: tagId('wifi') },
      { placeId: placeId('The Blue Door Café'), tagId: tagId('vegan-options') },
      { placeId: placeId('The Blue Door Café'), tagId: tagId('outdoor-seating') },
      { placeId: placeId('Meridian Rooftop Bar'), tagId: tagId('rooftop') },
      { placeId: placeId('Meridian Rooftop Bar'), tagId: tagId('date-night') },
      { placeId: placeId('Meridian Rooftop Bar'), tagId: tagId('late-night') },
      { placeId: placeId('Sakura Japanese Kitchen'), tagId: tagId('gluten-free') },
      { placeId: placeId('Sakura Japanese Kitchen'), tagId: tagId('date-night') },
      { placeId: placeId('Golden Gate Park Trail'), tagId: tagId('pet-friendly') },
      { placeId: placeId('Golden Gate Park Trail'), tagId: tagId('scenic') },
      { placeId: placeId('Golden Gate Park Trail'), tagId: tagId('free-entry') },
      { placeId: placeId('Fog City Bookshop'), tagId: tagId('historic') },
      { placeId: placeId('Fog City Bookshop'), tagId: tagId('wifi') },
      { placeId: placeId('Castro Theatre'), tagId: tagId('historic') },
      { placeId: placeId('Castro Theatre'), tagId: tagId('live-music') },
      { placeId: placeId('Tartine Bakery'), tagId: tagId('gluten-free') },
      { placeId: placeId('Mission Dolores Park'), tagId: tagId('pet-friendly') },
      { placeId: placeId('Mission Dolores Park'), tagId: tagId('scenic') },
      { placeId: placeId('Chinatown Night Market'), tagId: tagId('cash-only') },
      { placeId: placeId('Chinatown Night Market'), tagId: tagId('vegan-options') },
    ])
    .onConflictDoNothing();

  // Fetch inserted users to resolve IDs by email
  const insertedUsers = await db.select({ id: users.id, email: users.email }).from(users);

  // Helper: resolve user ID by email
  const userId = (email: string) => {
    const u = insertedUsers.find((r) => r.email === email);
    if (!u) throw new Error(`User not found: "${email}"`);
    return u.id;
  };

  // Saved places
  console.log('  → saved_places');
  await db
    .insert(savedPlaces)
    .values([
      { userId: userId('alice@example.com'), placeId: placeId('The Blue Door Café') },
      { userId: userId('alice@example.com'), placeId: placeId('Golden Gate Park Trail') },
      { userId: userId('alice@example.com'), placeId: placeId('Tartine Bakery') },
      { userId: userId('bob@example.com'), placeId: placeId('Meridian Rooftop Bar') },
      { userId: userId('bob@example.com'), placeId: placeId('Sakura Japanese Kitchen') },
      { userId: userId('bob@example.com'), placeId: placeId('Castro Theatre') },
      { userId: userId('carla@example.com'), placeId: placeId('Fog City Bookshop') },
      { userId: userId('carla@example.com'), placeId: placeId('Mission Dolores Park') },
      { userId: userId('dan@example.com'), placeId: placeId('Nopa Bistro') },
      { userId: userId('dan@example.com'), placeId: placeId('Presidio Spa & Wellness') },
    ])
    .onConflictDoNothing();

  // Place media
  console.log('  → place_media');
  await db.insert(placeMedia).values([
    {
      placeId: placeId('The Blue Door Café'),
      url: 'https://cdn.example.com/media/bluedoor_exterior.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('The Blue Door Café'),
      url: 'https://cdn.example.com/media/bluedoor_menu.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Meridian Rooftop Bar'),
      url: 'https://cdn.example.com/media/meridian_rooftop.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Meridian Rooftop Bar'),
      url: 'https://cdn.example.com/media/meridian_cocktails.mp4',
      type: 'video' as const,
    },
    {
      placeId: placeId('Sakura Japanese Kitchen'),
      url: 'https://cdn.example.com/media/sakura_ramen.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Golden Gate Park Trail'),
      url: 'https://cdn.example.com/media/ggpark_trail.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Fog City Bookshop'),
      url: 'https://cdn.example.com/media/fogcity_interior.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Nopa Bistro'),
      url: 'https://cdn.example.com/media/nopa_woodoven.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Castro Theatre'),
      url: 'https://cdn.example.com/media/castro_facade.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Tartine Bakery'),
      url: 'https://cdn.example.com/media/tartine_bread.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Mission Dolores Park'),
      url: 'https://cdn.example.com/media/dolores_skyline.jpg',
      type: 'image' as const,
    },
    {
      placeId: placeId('Chinatown Night Market'),
      url: 'https://cdn.example.com/media/nightmarket_stalls.mp4',
      type: 'video' as const,
    },
  ]);

  // Reviews — inserting these will automatically fire the Postgres trigger,
  // which updates average_rating and review_count on the places table.
  console.log('  → reviews (trigger will update places.average_rating + places.review_count)');
  await db.insert(reviews).values([
    {
      userId: userId('alice@example.com'),
      placeId: placeId('The Blue Door Café'),
      rating: 4.5,
      comment: 'Excellent avocado toast and the staff are super friendly.',
    },
    {
      userId: userId('bob@example.com'),
      placeId: placeId('The Blue Door Café'),
      rating: 4.0,
      comment: 'Great coffee but gets crowded on weekends.',
    },
    {
      userId: userId('carla@example.com'),
      placeId: placeId('Meridian Rooftop Bar'),
      rating: 5.0,
      comment: 'Best rooftop bar in the city, hands down.',
    },
    {
      userId: userId('dan@example.com'),
      placeId: placeId('Meridian Rooftop Bar'),
      rating: 4.0,
      comment: 'Pricey but the views justify every penny.',
    },
    {
      userId: userId('alice@example.com'),
      placeId: placeId('Sakura Japanese Kitchen'),
      rating: 4.5,
      comment: 'Tonkotsu ramen is the real deal, rich and comforting.',
    },
    {
      userId: userId('bob@example.com'),
      placeId: placeId('Golden Gate Park Trail'),
      rating: 5.0,
      comment: 'A must-visit trail, peaceful even on busy days.',
    },
    {
      userId: userId('carla@example.com'),
      placeId: placeId('Fog City Bookshop'),
      rating: 4.5,
      comment: 'Great selection of local zines and indie fiction.',
    },
    {
      userId: userId('dan@example.com'),
      placeId: placeId('Fog City Bookshop'),
      rating: 3.5,
      comment: 'Cozy but can be slow to reshelve returns.',
    },
    {
      userId: userId('alice@example.com'),
      placeId: placeId('Nopa Bistro'),
      rating: 5.0,
      comment: 'Wood-fired branzino was outstanding. Book ahead!',
    },
    {
      userId: userId('bob@example.com'),
      placeId: placeId('Castro Theatre'),
      rating: 4.5,
      comment: 'Saw a vintage Bollywood double feature here, magical.',
    },
    {
      userId: userId('carla@example.com'),
      placeId: placeId('Tartine Bakery'),
      rating: 5.0,
      comment: 'The sourdough country loaf changed my life. Arrive early.',
    },
    {
      userId: userId('dan@example.com'),
      placeId: placeId('SoMa Rock Climbing Wall'),
      rating: 4.0,
      comment: 'Great gym for beginners, coaches are patient.',
    },
    {
      userId: userId('alice@example.com'),
      placeId: placeId('Presidio Spa & Wellness'),
      rating: 4.5,
      comment: 'The eucalyptus steam room is incredibly relaxing.',
    },
    {
      userId: userId('bob@example.com'),
      placeId: placeId('Mission Dolores Park'),
      rating: 4.5,
      comment: 'Perfect picnic spot with a sunset view of the skyline.',
    },
    {
      userId: userId('carla@example.com'),
      placeId: placeId('Chinatown Night Market'),
      rating: 4.0,
      comment: 'Incredible variety of street food, the dumplings are a must.',
    },
  ]);

  console.log('✅ Seed complete.');
  await client.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
