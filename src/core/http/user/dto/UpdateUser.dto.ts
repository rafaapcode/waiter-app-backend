import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, {
        message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
      })
      .optional(),
    email: z
      .string({ message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' })
      .optional(),
    password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .optional(),
  })
  .optional();

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
