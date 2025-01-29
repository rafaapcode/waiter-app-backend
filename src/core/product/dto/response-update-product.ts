import { z } from 'zod';

export const updateProductSchemaRes = z.object({
  message: z.string(),
});
export type ResponseUpdateProductDTO = z.infer<typeof updateProductSchemaRes>;
