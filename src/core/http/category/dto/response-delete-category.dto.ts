import { z } from 'zod';

export const deleteCategorySchemaResponse = z.object({
  message: z.string(),
});
export type ResponseDeleteCategoryResponse = z.infer<
  typeof deleteCategorySchemaResponse
>;
