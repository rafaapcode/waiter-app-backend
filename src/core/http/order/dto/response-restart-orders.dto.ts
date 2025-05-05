import { z } from 'zod';

export const restartOrderSchemaResponse = z.object({
  message: z.string(),
});

export type ResponseRestartOrderDTO = z.infer<
  typeof restartOrderSchemaResponse
>;
