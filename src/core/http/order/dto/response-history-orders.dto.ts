import { z } from 'zod';

const ItemSchema = z.object({
  imageUrl: z.string(),
  quantity: z.number(),
  name: z.string(),
  price: z.string(),
});

export const historyOrderSchema = z
  .object({
    id: z.string(),
    table: z.string(),
    data: z.date(),
    name: z.string(),
    category: z.string(),
    totalPrice: z.string(),
    itens: z.array(ItemSchema),
  })
  .array();

export type ResponseHistoryOrderDTO = z.infer<typeof historyOrderSchema>;
