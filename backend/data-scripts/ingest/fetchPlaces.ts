import fs from 'fs';
import path from 'path';
import { queries, area } from './query.js';
import { searchPlaces } from '../utils/googleClient.js';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const dirPath = `data-scripts/rawData/${area}`;
  fs.mkdirSync(dirPath, { recursive: true });

  for (const query of queries) {
    console.log(`Running query: ${query} for ${area}`);

    try {
      const data = await searchPlaces(query);

      const fileName = query.replace(/\s+/g, '_').toLowerCase();

      fs.writeFileSync(path.join(dirPath, `${fileName}.json`), JSON.stringify(data, null, 2));

      console.log(`Saved: ${area}/${fileName}.json`);
    } catch (err) {
      console.error(`Failed query: ${query}`, err);
    }

    await sleep(1000);
  }

  console.log('All queries completed');
}

run();
