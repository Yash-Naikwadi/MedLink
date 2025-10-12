import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactPath = path.join(__dirname, "../../blockchain/artifacts/contracts/HealthRecord.sol/HealthRecord.json");
const HealthRecordArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL);
const contractAddress = process.env.HEALTH_RECORD_CONTRACT_ADDRESS;

export const sendReportHashToBlockchain = async (userWallet, reportHash) => {
  try {
    // Split payload: iv:authTag:encrypted
    const [ivHex, authTagHex, encryptedHex] = userWallet.privateKey.split(":");

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.WALLET_SECRET, "hex"),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    let privateKey = decipher.update(encryptedHex, "hex", "utf8");
    privateKey += decipher.final("utf8");

    const signer = new ethers.Wallet(privateKey, provider);

    const contractWithSigner = new ethers.Contract(contractAddress, HealthRecordArtifact.abi, signer);

    // msg.sender will now be the user's wallet
    const tx = await contractWithSigner.addRecord(reportHash);
    await tx.wait();

    console.log(`✅ Report hash stored on blockchain for user: ${userWallet.address}`);
  } catch (err) {
    console.error("Blockchain transaction failed:", err);
    throw err;
  }
};
