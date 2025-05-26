import { z } from 'zod';

export const deleteUserSchemaRes = z.object({
  message: z.string(),
});
export type ResponseDeleteUserDTO = z.infer<typeof deleteUserSchemaRes>;
