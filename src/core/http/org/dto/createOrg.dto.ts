import { z } from 'zod';

export const createOrgSchema = z.object({
  name: z.string().min(2, 'Nome da ORGANIZAÇÃO é obrigatório'),
  imageUrl: z.string().optional(),
  email: z.string().email('Email inválido'),
  description: z
    .string()
    .min(4, 'A descrição da organização deve ter no minimo 4 caracteres'),
  openHour: z
    .string()
    .min(4, 'O horário de abertura deve ter no mínimo 4 caracteres')
    .max(6, 'O horário de abertura deve ter no máximo 6 caracteres'),
  closeHour: z
    .string()
    .min(4, 'O horário de abertura deve ter no mínimo 4 caracteres')
    .max(6, 'O horário de fechamento deve ter no máximo 6 caracteres'),
  cep: z
    .string()
    .min(8, 'O CEP deve ter no mínimo 8 caracteres')
    .max(9, 'O CEP deve ter no máximo 9 caracteres'),
  city: z.string().min(3, 'A cidade deve ter no mínimo 3 caracteres'),
  neighborhood: z.string().min(3, 'O bairro deve ter no mínimo 3 caracteres'),
  street: z.string().min(3, 'A rua deve ter no mínimo 3 caracteres'),
  location: z.number().array().optional(),
  user: z.string().length(24, 'Id inválido'),
});

export type CreateOrgDto = z.infer<typeof createOrgSchema>;
