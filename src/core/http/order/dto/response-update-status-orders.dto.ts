import { STATUS } from 'src/shared/types/Order.type';
import { z } from 'zod';

export const updateOrderSchemaResponse = z
  .object({
    _id: z.string().min(24),
    table: z.string({ message: 'Mesa é obrigatório' }),
    status: z.nativeEnum(STATUS),
    products: z.array(z.any()),
  })
  .required();

export type ResponseUpdateOrderDTO = z.infer<typeof updateOrderSchemaResponse>;
