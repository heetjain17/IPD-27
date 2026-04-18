# OpenAPI (Step 3 Docs Exposure)

OpenAPI scaffolding is set up in code-first mode.

Current status:
- shared OpenAPI metadata/components are defined
- generation script is wired
- all current API routes are registered in OpenAPI path definitions
- runtime endpoint `/openapi.json` is mounted in all environments
- runtime endpoint `/docs` is mounted in all environments

## Generate spec

```bash
npm run openapi:generate
```

Output:
- `backend/openapi.json`

## Implementation files

- `src/openapi/base.ts`
- `src/openapi/generate.ts`
- `src/openapi/register.ts`

## Notes

- `/docs` serves Swagger UI using `/openapi.json` as the source.
- `/docs` is enabled in production and non-production environments.
