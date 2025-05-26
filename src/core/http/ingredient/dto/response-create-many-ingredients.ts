import { z } from 'zod';

export const ingredientsSchema = z.object({
  name: z.string({ message: 'Nome é obrigatório' }).min(2),
  id: z.string().min(24, { message: 'O ID deve ser um OBJECTID' }),
});

export const createManyIngredientSchemaResponse = z.object({
  data: z.array(ingredientsSchema),
});

export type ResponseCreateManyIngredients = z.infer<
  typeof createManyIngredientSchemaResponse
>;
