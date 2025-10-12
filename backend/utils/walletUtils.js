import { ethers } from "ethers";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Connect to Ganache
const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL);
const funder = new ethers.Wallet(process.env.FUNDER_PRIVATE_KEY, provider);

export const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();

  // AES-GCM encryption
  const iv = crypto.randomBytes(12); // 12 bytes IV for GCM
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.WALLET_SECRET, "hex"),
    iv
  );

  let encrypted = cipher.update(wallet.privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  const payload = `${iv.toString("hex")}:${authTag}:${encrypted}`;

  // Fund the wallet with 1 ETH from funder
  const tx = await funder.sendTransaction({
    to: wallet.address,
    value: ethers.parseEther("1.0"),
  });
  await tx.wait();

  return {
    address: wallet.address,
    encryptedPrivateKey: payload, // store this in MongoDB
  };
};
