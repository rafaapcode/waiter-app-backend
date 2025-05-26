import { z } from 'zod';

export const getCurrentUserSchemaRes = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string(),
});
export type ResponseGetCurrentUserDTO = z.infer<typeof getCurrentUserSchemaRes>;
