import { z } from 'zod';

const usersSchema = z
  .object({
    email: z.string().email({ message: 'Email inválido' }),
    name: z.string(),
    role: z.enum(['CLIENT', 'WAITER', 'ADMIN']).optional(),
    id: z
      .string()
      .length(24, { message: 'ID deve ter 24 caracteres' })
      .optional(),
  })
  .array();

export const getAllUsersSchemaRes = z.object({
  total_pages: z.number(),
  users: usersSchema,
});

export type ResponseGetAllUsersDTO = z.infer<typeof getAllUsersSchemaRes>;
