import { STATUS } from 'src/types/Order.type';
import { z } from 'zod';

export const listOrdersSchemaResponse = z.array(
  z.object({
    _id: z.string(),
    table: z.string(),
    status: z.nativeEnum(STATUS),
    products: z.array(z.any()),
    createdAt: z.date(),
  }),
);

export type ResponseListOrdersDTO = z.infer<typeof listOrdersSchemaResponse>;
