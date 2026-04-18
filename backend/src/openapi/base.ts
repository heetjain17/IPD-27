import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registerApiPaths } from './register.js';

extendZodWithOpenApi(z);

export const openApiRegistry = new OpenAPIRegistry();

openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

openApiRegistry.registerComponent('schemas', 'ApiSuccessEnvelope', {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    statusCode: { type: 'number', example: 200 },
    message: { type: 'string', example: 'Request successful' },
    data: { type: 'object', additionalProperties: true },
  },
  required: ['success', 'statusCode', 'message'],
});

openApiRegistry.registerComponent('schemas', 'ApiErrorEnvelope', {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    statusCode: { type: 'number', example: 400 },
    message: { type: 'string', example: 'Validation failed' },
    errors: {
      type: 'array',
      items: { type: 'object', additionalProperties: true },
    },
  },
  required: ['success', 'statusCode', 'message'],
});

export function buildOpenApiDocument() {
  registerApiPaths(openApiRegistry);

  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Tourism Backend API',
      version: '1.0.0',
      description:
        'Machine-readable API contract. Step 1 includes shared metadata/components only; path registration follows in later steps.',
    },
    servers: [
      {
        url: process.env.API_BASE_URL ?? 'http://localhost:3000',
        description: 'Current API server',
      },
    ],
    tags: [
      { name: 'auth' },
      { name: 'places' },
      { name: 'saved-places' },
      { name: 'reviews' },
      { name: 'tags' },
      { name: 'health' },
    ],
  });
}
