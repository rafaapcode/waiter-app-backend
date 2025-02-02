import { z } from 'zod';

export const createCategorySchemaResponse = z.object({
  name: z.string({ message: 'Nome é obrigatório' }).min(2),
  icon: z.string().optional(),
  _id: z.string().min(24, { message: 'O ID deve ser um OBJECTID' }),
});

export type ResponseCreateCategoryResponse = z.infer<
  typeof createCategorySchemaResponse
>;
