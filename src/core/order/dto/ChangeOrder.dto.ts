import { z } from 'zod';

export const changeOrderSchema = z
  .object({
    status: z.enum(['WAITING', 'IN_PRODUCTION', 'DONE']),
  })
  .required();

export type ChangeOrderDto = z.infer<typeof changeOrderSchema>;
