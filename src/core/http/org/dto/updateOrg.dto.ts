import { z } from 'zod';

export const updateOrgSchema = z
  .object({
    name: z.string().min(2, 'Nome da ORGANIZAÇÃO é obrigatório').optional(),
    imageUrl: z.string().url('Url inválida').optional(),
    description: z
      .string()
      .min(4, 'A descrição da organização deve ter no minimo 4 caracteres')
      .optional(),
    openHour: z
      .string()
      .min(4, 'O horário de abertura deve ter no mínimo 4 caracteres')
      .max(6, 'O horário de abertura deve ter no máximo 6 caracteres')
      .optional(),
    closeHour: z
      .string()
      .min(4, 'O horário de abertura deve ter no mínimo 4 caracteres')
      .max(6, 'O horário de fechamento deve ter no máximo 6 caracteres')
      .optional(),
    cep: z
      .string()
      .min(8, 'O CEP deve ter no mínimo 8 caracteres')
      .max(9, 'O CEP deve ter no máximo 9 caracteres')
      .optional(),
    city: z
      .string()
      .min(3, 'A cidade deve ter no mínimo 3 caracteres')
      .optional(),
    neighborhood: z
      .string()
      .min(3, 'O bairro deve ter no mínimo 3 caracteres')
      .optional(),
    street: z
      .string()
      .min(3, 'A rua deve ter no mínimo 3 caracteres')
      .optional(),
    location: z.number().array().optional(),
  })
  .optional();

export type UpdateOrgDto = z.infer<typeof updateOrgSchema>;
