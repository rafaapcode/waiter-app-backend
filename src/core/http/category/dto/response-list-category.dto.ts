import { z } from 'zod';

export const listCategorySchema = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    icon: z.string().optional(),
  }),
);

export const listCategorySchemaResponse = z.object({
  total_pages: z.number(),
  categories: listCategorySchema,
});

export type ResponseListCategoryResponse = z.infer<
  typeof listCategorySchemaResponse
>;
