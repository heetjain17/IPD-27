import fs from 'fs';
import { db } from '../utils/db.js';
import { places } from '../../src/db/schema.js';

const area = process.argv[2];
const file = process.argv[3];

if (!area || !file) {
  throw new Error('Usage: tsx seedPlaces.ts <area> <file>');
}

async function run() {
  const data = JSON.parse(fs.readFileSync(`data-scripts/processedData/${area}/${file}`, 'utf-8'));

  for (const place of data) {
    if (
      typeof place.name !== 'string' ||
      typeof place.lat !== 'number' ||
      typeof place.lng !== 'number'
    ) {
      continue;
    }

    await db
      .insert(places)
      .values({
        name: place.name,
        description: place.description ?? null,
        lat: place.lat,
        lng: place.lng,
        category: place.category ?? 'unknown',
        source: 'google',
        externalId: place.external_id,
        address: place.address ?? null,
        googleTypes: Array.isArray(place.google_types) ? place.google_types : [],
        area: place.area ?? area,
        openingHours: place.opening_hours ?? null,
        contactPhone: place.contact_phone ?? null,
        websiteUrl: place.website_url ?? null,
        priceLevel: typeof place.price_level === 'number' ? place.price_level : null,
        lastSyncedAt:
          typeof place.last_synced_at === 'string' ? new Date(place.last_synced_at) : new Date(),
        isActive: place.is_active ?? true,
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded: ${area}/${file}`);
}

run();
