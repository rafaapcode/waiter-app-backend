import { z } from 'zod';

export const loginUserSchemaRes = z.object({
  access_token: z.string().jwt({ message: 'Token de acesso inválido' }),
  role: z.string(),
  id: z.string().length(24, { message: 'ID deve ter 24 caracteres' }),
});
export type ResponseLoginUserDTO = z.infer<typeof loginUserSchemaRes>;
