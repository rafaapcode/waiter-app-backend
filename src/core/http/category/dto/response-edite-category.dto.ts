import { z } from 'zod';

export const editCategorySchemaResponse = z.object({
  message: z.string(),
});
export type ResponseEditCategoryResponse = z.infer<
  typeof editCategorySchemaResponse
>;
