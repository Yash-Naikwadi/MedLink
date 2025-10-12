import { uploadToIPFS } from "../utils/ipfsUtils.js";
import { encryptFile } from "../utils/encryptUtils.js";
import User from "../models/User.js";
import crypto from "crypto";
import fs from "fs";
import { sendReportHashToBlockchain } from "../utils/blockchainUtils.js";

export const uploadReport = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const file = req.file;

    if (!file) return res.status(400).json({ message: "File required" });

    const encryptionKey = crypto.randomBytes(32); // 32 bytes key
    const encryptedPath = encryptFile(file.path, encryptionKey);

    const ipfsURL = await uploadToIPFS(encryptedPath);

    const reportHash = crypto.createHash("sha256").update(ipfsURL).digest("hex");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.reports = user.reports || [];
    user.reports.push({
      fileName: file.originalname,
      ipfsURL,
      encryptionKey: encryptionKey.toString("hex"),
      reportHash,
    });

    await user.save();

    await sendReportHashToBlockchain(
      {
        address: user.wallet.address,
        privateKey: user.wallet.encryptedPrivateKey
      },
      reportHash
    );

    fs.unlinkSync(file.path);
    fs.unlinkSync(encryptedPath);

    res.status(200).json({
      success: true,
      message: "Report uploaded and encrypted successfully",
      ipfsURL,
      reportHash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
