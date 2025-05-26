import { z } from 'zod';

export const ingredientsSchema = z.object({
  name: z.string({ message: 'Nome é obrigatório' }).min(2),
  icon: z.string(),
  _id: z.string().min(24, { message: 'O ID deve ser um OBJECTID' }).optional(),
});

export const createIngredientSchemaResponse = z.object({
  message: z.string(),
  data: ingredientsSchema.optional(),
});

export type ResponseCreateIngredient = z.infer<
  typeof createIngredientSchemaResponse
>;
