import { scrypt } from 'node:crypto';

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const { promise, reject, resolve } = Promise.withResolvers<boolean>();

  const [salt, key] = hash.split(':');
  scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err.message);
    resolve(key === derivedKey.toString('hex'));
  });

  return promise;
};
