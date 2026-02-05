import crypto from 'crypto';

export function createSHA256Hash(input: Buffer) {
  const hash = crypto.createHash('sha256');

  hash.update(input);

  const digest = hash.digest('hex');

  return digest;
}
