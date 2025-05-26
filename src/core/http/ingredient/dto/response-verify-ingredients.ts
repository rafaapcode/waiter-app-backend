import { z } from 'zod';

export const ingredientsSchema = z.object({
  name: z.string({ message: 'Nome é obrigatório' }).min(2),
  id: z.string().min(24, { message: 'O ID deve ser um OBJECTID' }),
});

export const verifyIngredientSchemaResponse = z.object({
  data: z.array(ingredientsSchema),
});

export type ResponseVerifyIngredients = z.infer<
  typeof verifyIngredientSchemaResponse
>;
