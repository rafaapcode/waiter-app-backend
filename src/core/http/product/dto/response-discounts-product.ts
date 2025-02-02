import { z } from 'zod';

export const discountsProductSchemaRes = z.object({
  message: z.string(),
});
export type ResponseDiscountsProductDTO = z.infer<
  typeof discountsProductSchemaRes
>;
