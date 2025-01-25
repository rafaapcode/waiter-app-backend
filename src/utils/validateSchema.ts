import { ZodObject, ZodRawShape } from 'zod';

export function validateSchema<S extends ZodRawShape, D>(
  schema: ZodObject<S>,
  data: D,
) {
  return schema.safeParse(data);
}
