import { z } from 'zod';

export const getUserSchemaRes = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string(),
  role: z.enum(['CLIENT', 'WAITER', 'ADMIN']).optional(),
  id: z
    .string()
    .length(24, { message: 'ID deve ter 24 caracteres' })
    .optional(),
});
export type ResponseGetUserDTO = z.infer<typeof getUserSchemaRes>;
