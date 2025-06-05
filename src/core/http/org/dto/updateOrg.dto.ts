import { z } from 'zod';

export const updateOrgSchema = z
  .object({
    name: z.string().min(2, 'Nome da ORGANIZAÇÃO é obrigatório').optional(),
    imageUrl: z.string().url('Url inválida').optional(),
    descricao: z
      .string()
      .min(4, 'A descrição da organização deve ter no minimo 4 caracteres')
      .optional(),
    info: z
      .object({
        abertura: z.string(),
        fechamento: z.string(),
      })
      .optional(),
  })
  .optional();

export type UpdateOrgDto = z.infer<typeof updateOrgSchema>;
