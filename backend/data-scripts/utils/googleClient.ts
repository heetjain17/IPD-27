import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set');
}

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.formattedAddress',
  'places.types',
  'places.primaryType',
  'places.editorialSummary',
  'places.currentOpeningHours.weekdayDescriptions',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.priceLevel',
].join(',');

export async function searchPlaces(query: string) {
  const res = await axios.post(
    'https://places.googleapis.com/v1/places:searchText',
    {
      textQuery: query,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY!,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    },
  );

  return res.data.places;
}
