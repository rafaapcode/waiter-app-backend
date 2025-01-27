import { z } from 'zod';

export const listCategorySchemaResponse = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    icon: z.string().optional(),
  }),
);

export type ResponseListCategoryResponse = z.infer<
  typeof listCategorySchemaResponse
>;
