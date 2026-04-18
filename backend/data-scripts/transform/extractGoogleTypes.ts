import fs from 'fs';
import path from 'path';

const defaultInputFiles = [
  'data-scripts/processedData/bandra/bandra_compiled.json',
  'data-scripts/processedData/andheri/andheri_compiled.json',
  'data-scripts/processedData/juhu/juhu_compiled.json',
  'data-scripts/processedData/versova/versova_compiled.json',
];

const inputFiles = process.argv.slice(2);
const filesToRead = inputFiles.length > 0 ? inputFiles : defaultInputFiles;
const outputFile = 'data-scripts/processedData/google_types_category_summary.json';

const googleTypesSet = new Set<string>();
const categoriesSet = new Set<string>();

for (const file of filesToRead) {
  if (!fs.existsSync(file)) {
    throw new Error(`Input file not found: ${file}`);
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf-8')) as unknown;
  if (!Array.isArray(parsed)) {
    continue;
  }

  for (const item of parsed) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const place = item as { google_types?: unknown; category?: unknown };

    if (Array.isArray(place.google_types)) {
      for (const type of place.google_types) {
        if (typeof type === 'string' && type.length > 0) {
          googleTypesSet.add(type);
        }
      }
    }

    if (typeof place.category === 'string' && place.category.length > 0) {
      categoriesSet.add(place.category);
    }
  }
}

const result = {
  input_files: filesToRead,
  total_unique_google_types: googleTypesSet.size,
  total_unique_categories: categoriesSet.size,
  unique_google_types: Array.from(googleTypesSet).sort(),
  unique_categories: Array.from(categoriesSet).sort(),
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

console.log(`Extracted unique values to: ${outputFile}`);
console.log(`Unique google_types: ${result.total_unique_google_types}`);
console.log(`Unique categories: ${result.total_unique_categories}`);
