import bcryptjs from 'bcryptjs';

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isMatch = await bcryptjs.compare(password, hash);

  return isMatch;
};
