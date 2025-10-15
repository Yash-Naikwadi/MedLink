import { downloadFromIPFS, uploadToIPFS } from "../utils/ipfsUtils.js";
import { decryptFile, encryptFile } from "../utils/encryptUtils.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
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


export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      reports: user.reports || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const viewReport = async (req, res) => {
  try {
    const { reportHash } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const report = user.reports.find((r) => r.reportHash === reportHash);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // 1️⃣ Download encrypted file from IPFS (local IPFS node or gateway)
    const encryptedPath = await downloadFromIPFS(report.ipfsURL);

    // 2️⃣ Decrypt file locally using the stored encryption key
    const decryptedPath = decryptFile(encryptedPath, Buffer.from(report.encryptionKey, "hex"));

    // 3️⃣ Stream the decrypted file back to the frontend
    const fileName = path.basename(report.fileName);
    res.download(decryptedPath, fileName, (err) => {
      if (err) console.error("File download error:", err);

      // optional cleanup (delete temp files after download)
      fs.unlinkSync(encryptedPath);
      fs.unlinkSync(decryptedPath);
    });

  } catch (err) {
    console.error("Error while viewing report:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const shareReportWithDoctor = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { reportHash, doctorEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Find the report to share
    const report = user.reports.find((r) => r.reportHash === reportHash);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Check if already shared
    const alreadyShared = report.sharedWith?.some(
      (share) => share.doctorId.toString() === doctor._id.toString()
    );
    if (alreadyShared) {
      return res.status(400).json({ message: "Report already shared with this doctor" });
    }

    // 1️⃣ Add reference in user's report
    report.sharedWith.push({ doctorId: doctor._id });

    // 2️⃣ Add entry in doctor's accessibleReports
    doctor.accessibleReports.push({
      userId,
      reportHash: report.reportHash,
      ipfsURL: report.ipfsURL,
    });

    await user.save();
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Report shared successfully with Dr. ${doctor.name}`,
    });
  } catch (err) {
    console.error("Error sharing report:", err);
    res.status(500).json({ message: "Server error" });
  }
};