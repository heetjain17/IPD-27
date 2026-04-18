# Execution commands

## STEP 1 — set area & query

```ts
data - scripts / ingest / query.ts;
```

```ts
export const query = 'tourist attractions in juhu mumbai';
export const area = 'juhu';
```

---

## STEP 2 — fetch

```bash
npx tsx data-scripts/ingest/fetchPlaces.ts
```

### Output:

```text
data-scripts/rawData/juhu/<query>.json
```

---

## STEP 3 — normalize

```bash
npx tsx data-scripts/transform/normalizePlaces.ts juhu [output-file].json
```

What this does:

- reads all JSON files from `data-scripts/rawData/juhu`
- merges all places into one list
- removes duplicates by Google `external_id`
- writes one compiled file into `data-scripts/processedData/juhu`

Examples:

```bash
npx tsx data-scripts/transform/normalizePlaces.ts juhu
```

Default output file:

```text
all_places.json
```

Custom output file:

```bash
npx tsx data-scripts/transform/normalizePlaces.ts juhu juhu_compiled.json
```

### Output:

```text
data-scripts/processedData/juhu/<output-file>.json
```

---

## STEP 4 — seed

```bash
npx tsx data-scripts/seed/seedPlaces.ts juhu <filename>.json
```

Example:

```bash
npx tsx data-scripts/seed/seedPlaces.ts juhu all_places.json
```

---

## Final structure after few runs

```text
data-scripts/rawData/
  juhu/
    tourist_attractions.json
    cafes.json
  bandra/
  andheri/

data-scripts/processedData/
  juhu/
    tourist_attractions.json
    cafes.json
```
