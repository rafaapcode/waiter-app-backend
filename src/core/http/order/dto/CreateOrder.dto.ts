import { z } from 'zod';

const productOrderSchema = z
  .object({
    product: z
      .string({ message: 'PRODUCT deve conter um ID válido' })
      .length(24, { message: 'ID invalido' }),
    quantity: z
      .number()
      .positive({ message: 'Quantidade deve ser um número positivo' })
      .min(1),
  })
  .required();

export const createOrderSchema = z
  .object({
    table: z.string({ message: 'Mesa é obrigatório' }),
    products: z.array(productOrderSchema, {
      message: 'Produtos é obrigatório',
    }),
  })
  .required();

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
