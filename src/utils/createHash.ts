import { randomBytes, scrypt } from 'node:crypto';

export const createHash = async (password: string): Promise<string> => {
  const { promise, reject, resolve } = Promise.withResolvers<string>();

  const salt = randomBytes(16).toString('hex');
  scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err.message);
    resolve(derivedKey.toString('hex'));
  });

  return promise;
};
