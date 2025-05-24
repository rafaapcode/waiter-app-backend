import { z } from 'zod';

export const updateCurrentUserSchema = z
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
    current_password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .optional(),
    new_password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .optional(),
    confirm_password: z
      .string({ message: 'Senha é obrigatório' })
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .optional(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })
  .optional();

export type UpdateCurrentUserDTO = z.infer<typeof updateCurrentUserSchema>;
