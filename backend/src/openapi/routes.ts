import type { Express } from 'express';
import { buildOpenApiDocument } from './base.js';

function getSwaggerUiHtml(specUrl: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tourism API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      body {
        margin: 0;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
        persistAuthorization: true
      });
    </script>
  </body>
</html>`;
}

export function mountOpenApiRoutes(app: Express) {
  app.get('/openapi.json', (_req, res) => {
    return res.json(buildOpenApiDocument());
  });

  app.get('/docs', (_req, res) => {
    // Override default helmet CSP for this page so Swagger UI assets can load.
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://unpkg.com; script-src 'self' 'unsafe-inline' https://unpkg.com; font-src 'self' https://unpkg.com; connect-src 'self';",
    );
    res.type('html').send(getSwaggerUiHtml('/openapi.json'));
  });
}
