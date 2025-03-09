import { z } from 'zod';

export const createProductSchemaRes = z.object({
  _id: z.any(),
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
  ingredients: z.array(z.any()),
  category: z.any(),
  discount: z.boolean(),
  priceInDiscount: z.number().optional(),
});

export const getProductSchemaRes = z.object({
  _id: z.any(),
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
  ingredients: z.array(z.any()),
  category: z.any(),
  discount: z.boolean(),
  priceInDiscount: z.number().optional(),
});
export type ResponseCreateProductDTO = z.infer<typeof createProductSchemaRes>;
