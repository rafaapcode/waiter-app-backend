import { z } from 'zod';

export const createIngredientSchema = z.object({
  name: z.string({ message: 'Nome é obrigatório' }),
  icon: z.string().optional(),
});

export type CreateIngredientDTO = z.infer<typeof createIngredientSchema>;
