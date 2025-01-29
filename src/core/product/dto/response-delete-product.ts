import { z } from 'zod';

export const deleteProductSchemaRes = z.object({
  message: z.string(),
});
export type ResponseDeleteProductDTO = z.infer<typeof deleteProductSchemaRes>;
