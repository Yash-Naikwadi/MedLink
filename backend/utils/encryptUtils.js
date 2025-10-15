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


export const decryptFile = (encryptedPath, encryptionKey) => {
  const input = fs.readFileSync(encryptedPath);

  // Extract IV (first 16 bytes)
  const iv = input.slice(0, 16);
  const encryptedData = input.slice(16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  const decryptedPath = encryptedPath.replace(".enc", ".dec");
  fs.writeFileSync(decryptedPath, decrypted);

  console.log("✅ File decrypted successfully:", decryptedPath);
  return decryptedPath;
};
