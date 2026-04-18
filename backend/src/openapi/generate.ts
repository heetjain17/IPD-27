import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildOpenApiDocument } from './base.js';

async function main() {
  const doc = buildOpenApiDocument();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..', '..');
  const outputPath = path.join(rootDir, 'openapi.json');

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');

  console.log(`OpenAPI spec generated at ${outputPath}`);
}

main().catch((error) => {
  console.error('Failed to generate OpenAPI spec:', error);
  process.exit(1);
});
