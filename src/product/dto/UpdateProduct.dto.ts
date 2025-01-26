import { z } from 'zod';

export const updateProductSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, {
        message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
      })
      .optional(),
    description: z
      .string({ message: 'Descrição é obrigatório' })
      .min(10, {
        message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
      })
      .optional(),
    imageUrl: z
      .string({ message: 'ImageUrl é obrigatório' })
      .url({ message: 'URL inválida' })
      .optional(),
    price: z.number({ message: 'Preço é obrigatório' }).optional(),
    ingredients: z
      .array(
        z
          .object({
            name: z.string({ message: 'Nome é obrigatório' }),
            icon: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    category: z
      .string({ message: 'PRODUCT deve conter um ID válido' })
      .length(24, { message: 'ID invalido' })
      .optional(),
  })
  .optional();

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
