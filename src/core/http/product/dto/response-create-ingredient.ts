import { z } from 'zod';

export const createIngredientSchemaRes = z.object({
  name: z.string({ message: 'Nome é obrigatório' }),
  icon: z.string().optional(),
});
export type ResponseCreateIngredientDTO = z.infer<
  typeof createIngredientSchemaRes
>;
