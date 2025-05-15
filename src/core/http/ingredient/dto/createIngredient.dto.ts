import { z } from 'zod';

export const createIngredientSchema = z
  .object({
    name: z
      .string({ message: 'Nome do ingrediente deve ser uma string !' })
      .min(3, {
        message: 'Nome do ingrediente deve ter no mínimo 4 caracteres',
      })
      .max(20, {
        message: 'Nome do ingrediente deve ter no máximo 20 caracteres',
      }),
    icon: z
      .string({ message: 'O ícone é obrigatório' })
      .min(1, {
        message: 'O ícone deve ter no mínimo 1 caractere',
      })
      .max(4, {
        message: 'O ícone deve ter no máximo 4 caracteres',
      }),
  })
  .required();

export type CreateIngredientDTO = z.infer<typeof createIngredientSchema>;
