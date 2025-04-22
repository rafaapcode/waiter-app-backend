import { compare } from 'bcryptjs';

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isMatch = await compare(password, hash);

  return isMatch;
};
