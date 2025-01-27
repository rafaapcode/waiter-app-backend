import { z } from 'zod';

export const deleteOrderSchemaResponse = z.object({
  message: z.string(),
});

export type ResponseDeleteOrderDTO = z.infer<typeof deleteOrderSchemaResponse>;
