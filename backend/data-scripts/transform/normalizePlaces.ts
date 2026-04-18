import fs from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';

interface RawPlace {
  id?: string;
  displayName?: { text?: string };
  editorialSummary?: { text?: string };
  location?: { latitude?: number; longitude?: number };
  primaryType?: string;
  types?: string[];
  formattedAddress?: string;
  currentOpeningHours?: { weekdayDescriptions?: string[] };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  priceLevel?: unknown;
}

interface NormalizedPlace {
  id: string;
  name: string | undefined;
  description: string | null;
  lat: number | undefined;
  lng: number | undefined;
  source: 'google';
  external_id: string | undefined;
  category: string;
  address: string | null;
  google_types: string[];
  area: string;
  opening_hours: string | null;
  contact_phone: string | null;
  website_url: string | null;
  price_level: number | null;
  last_synced_at: string;
  is_active: boolean;
}

function toPriceLevel(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const map: Record<string, number> = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };

  return map[value] ?? null;
}

function toOpeningHours(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const weekdayDescriptions = (value as { weekdayDescriptions?: unknown }).weekdayDescriptions;
  if (!Array.isArray(weekdayDescriptions)) {
    return null;
  }

  const lines = weekdayDescriptions.filter((line): line is string => typeof line === 'string');
  if (lines.length === 0) {
    return null;
  }

  return lines.join(' | ');
}

function normalize(place: RawPlace, area: string): NormalizedPlace {
  return {
    id: randomUUID(),
    name: place.displayName?.text,
    description: place.editorialSummary?.text ?? null,
    lat: place.location?.latitude,
    lng: place.location?.longitude,
    source: 'google',
    external_id: place.id,
    category: place.primaryType || place.types?.[0] || 'unknown',
    address: place.formattedAddress ?? null,
    google_types: Array.isArray(place.types) ? place.types : [],
    area,
    opening_hours: toOpeningHours(place.currentOpeningHours),
    contact_phone: place.nationalPhoneNumber ?? null,
    website_url: place.websiteUri ?? null,
    price_level: toPriceLevel(place.priceLevel),
    last_synced_at: new Date().toISOString(),
    is_active: true,
  };
}

function dedupe(data: NormalizedPlace[]): NormalizedPlace[] {
  const map = new Map<string, NormalizedPlace>();
  for (const p of data) {
    if (!p.external_id) {
      continue;
    }
    map.set(p.external_id, p);
  }
  return Array.from(map.values());
}

const area = process.argv[2];
const outputFile = process.argv[3] ?? 'all_places.json';

if (!area) {
  throw new Error('Usage: tsx normalizePlaces.ts <area> [output-file]');
}

const rawDir = `data-scripts/rawData/${area}`;
const processedDir = `data-scripts/processedData/${area}`;

if (!fs.existsSync(rawDir)) {
  throw new Error(`Raw data folder not found: ${rawDir}`);
}

const rawFiles = fs
  .readdirSync(rawDir)
  .filter((name) => name.endsWith('.json'))
  .sort();

if (rawFiles.length === 0) {
  throw new Error(`No JSON files found in: ${rawDir}`);
}

// ensure processed folder exists
fs.mkdirSync(processedDir, { recursive: true });

const mergedRaw: RawPlace[] = [];
for (const file of rawFiles) {
  const rawPath = path.join(rawDir, file);
  const parsed = JSON.parse(fs.readFileSync(rawPath, 'utf-8')) as unknown;
  if (Array.isArray(parsed)) {
    mergedRaw.push(...(parsed as RawPlace[]));
  }
}

const normalized = mergedRaw.map((place) => normalize(place, area));
const cleaned = dedupe(normalized);

fs.writeFileSync(path.join(processedDir, outputFile), JSON.stringify(cleaned, null, 2));

console.log(
  `Normalized: ${area}/${outputFile} (${cleaned.length} unique places from ${rawFiles.length} files)`,
);
