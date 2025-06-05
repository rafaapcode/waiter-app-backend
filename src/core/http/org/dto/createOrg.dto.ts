import { z } from 'zod';

export const createOrgSchema = z.object({
  name: z.string().min(2, 'Nome da ORGANIZAÇÃO é obrigatório'),
  imageUrl: z.string().optional(),
  email: z.string().email('Email inválido'),
  descricao: z
    .string()
    .min(4, 'A descrição da organização deve ter no minimo 4 caracteres'),
  info: z.object({
    abertura: z.string(),
    fechamento: z.string(),
  }),
  user: z.string().length(24, 'Id inválidi'),
});

export type CreateOrgDto = z.infer<typeof createOrgSchema>;
