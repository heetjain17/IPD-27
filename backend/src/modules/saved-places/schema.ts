import { z } from 'zod';

export const savePlaceBodySchema = z.object({
  placeId: z.string().uuid(),
});

export const deleteSavedPlaceParamsSchema = z.object({
  placeId: z.string().uuid(),
});

export type SavePlaceBodyInput = z.infer<typeof savePlaceBodySchema>;
export type DeleteSavedPlaceParamsInput = z.infer<typeof deleteSavedPlaceParamsSchema>;
