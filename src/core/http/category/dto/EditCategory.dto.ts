import { z } from 'zod';

export const editCategorySchema = z
  .object({
    name: z.string({ message: 'Nome é obrigatório' }).min(2).optional(),
    icon: z.string().optional(),
  })
  .optional();

export type EditCategoryDto = z.infer<typeof editCategorySchema>;
