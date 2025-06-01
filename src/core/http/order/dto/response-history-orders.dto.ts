import { z } from 'zod';

const ItemSchema = z.object({
  imageUrl: z.string(),
  quantity: z.number(),
  name: z.string(),
  price: z.number(),
  discount: z.boolean(),
  id: z.string(),
});

export const historySchema = z
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

export const historyOrderSchema = z.object({
  total_pages: z.number(),
  history: historySchema,
});

export type ResponseHistoryOrderDTO = z.infer<typeof historyOrderSchema>;
