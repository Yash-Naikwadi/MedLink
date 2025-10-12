import crypto from "crypto";
import fs from "fs";

const ALGORITHM = "aes-256-cbc";

export const encryptFile = (filePath, encryptionKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);

  const input = fs.readFileSync(filePath);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);

  const encryptedPath = filePath + ".enc";
  fs.writeFileSync(encryptedPath, Buffer.concat([iv, encrypted])); // prepend IV for decryption

  return encryptedPath;
};
