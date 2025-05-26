import { z } from 'zod';

export const updateCurrentUserSchemaRes = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string(),
  role: z.enum(['CLIENT', 'WAITER', 'ADMIN']).optional(),
  id: z
    .string()
    .length(24, { message: 'ID deve ter 24 caracteres' })
    .optional(),
  access_token: z
    .string()
    .jwt({ message: 'Token de acesso inválido' })
    .optional(),
});
export type ResponseUpdateCurrentUserDTO = z.infer<
  typeof updateCurrentUserSchemaRes
>;
