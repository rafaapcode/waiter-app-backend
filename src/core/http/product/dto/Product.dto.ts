import { z } from 'zod';

export const createProductSchema = z
  .object({
    name: z.string({ message: 'Nome é obrigatório' }).min(3, {
      message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
    }),
    description: z.string({ message: 'Descrição é obrigatório' }).min(10, {
      message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
    }),
    imageUrl: z
      .string({ message: 'ImageUrl é obrigatório' })
      .url({ message: 'URL inválida' }),
    price: z.number({ message: 'Preço é obrigatório' }),
    ingredients: z.array(
      z
        .string({ message: 'PRODUCT deve conter um ID válido' })
        .length(24, { message: 'ID invalido' }),
    ),
    category: z
      .string({ message: 'PRODUCT deve conter um ID válido' })
      .length(24, { message: 'ID invalido' }),
  })
  .required();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
