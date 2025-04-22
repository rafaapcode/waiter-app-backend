import { z } from 'zod';

export const loginUserSchema = z
  .object({
    email: z
      .string({ message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' }),
    password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  })
  .required();

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
