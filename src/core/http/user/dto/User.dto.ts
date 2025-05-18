import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, {
        message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
      })
      .optional(),
    email: z
      .string({ message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' }),
    password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    role: z.enum(['WAITER', 'ADMIN']),
  })
  .required();

export type CreateUserDTO = z.infer<typeof createUserSchema>;
