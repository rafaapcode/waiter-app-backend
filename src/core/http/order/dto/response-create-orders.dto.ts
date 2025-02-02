import { STATUS } from 'src/types/Order.type';
import { z } from 'zod';

export const createOrderSchemaResponse = z
  .object({
    table: z.string({ message: 'Mesa é obrigatório' }),
    status: z.nativeEnum(STATUS),
    products: z.array(z.any()),
  })
  .required();

export type ResponseCreateOrderDTO = z.infer<typeof createOrderSchemaResponse>;
