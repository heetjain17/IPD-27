import { z } from 'zod';

export const savePlaceBodySchema = z.object({
  placeId: z.string().uuid(),
});

export type SavePlaceBodyInput = z.infer<typeof savePlaceBodySchema>;
