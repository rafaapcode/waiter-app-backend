import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string({ message: 'Nome é obrigatório' }).min(2),
  icon: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
