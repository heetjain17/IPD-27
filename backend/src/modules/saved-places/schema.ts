import { z } from 'zod';

export const savePlaceBodySchema = z.object({
  placeId: z.string().uuid(),
});

export const deleteSavedPlaceParamsSchema = z.object({
  placeId: z.string().uuid(),
});

export const savedPlacesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

export type SavePlaceBodyInput = z.infer<typeof savePlaceBodySchema>;
export type DeleteSavedPlaceParamsInput = z.infer<typeof deleteSavedPlaceParamsSchema>;
export type SavedPlacesQueryInput = z.infer<typeof savedPlacesQuerySchema>;
