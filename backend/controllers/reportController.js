import { downloadFromIPFS, uploadToIPFS } from "../utils/ipfsUtils.js";
import { decryptFile, encryptFile } from "../utils/encryptUtils.js";
import { sendReportHashToBlockchain } from "../utils/blockchainUtils.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import ReportSharing from "../models/ReportSharing.js";
import crypto from "crypto";
import fs from "fs";
import mime from "mime-types";


// ✅ 1️⃣ Upload a new report
export const uploadReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "File required" });

    const encryptionKey = crypto.randomBytes(32);
    const encryptedPath = encryptFile(file.path, encryptionKey);
    const ipfsURL = await uploadToIPFS(encryptedPath);

    const reportHash = crypto.createHash("sha256").update(ipfsURL).digest("hex");
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Store in ReportSharing collection
    const report = new ReportSharing({
      userId,
      fileName: file.originalname,
      ipfsURL,
      encryptionKey: encryptionKey.toString("hex"),
      reportHash,
      uploadedAt: new Date(),
    });
    await report.save();

    // ✅ Log hash on blockchain
    await sendReportHashToBlockchain(
      {
        address: user.wallet.address,
        privateKey: user.wallet.encryptedPrivateKey,
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
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 2️⃣ Get all reports of a logged-in user
export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await ReportSharing.find({ userId });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 3️⃣ View report (for both user or doctor)
export const viewReport = async (req, res) => {
  try {
    const { reportHash } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role; // either 'user' or 'doctor'

    // Find the report share document
    let report;
    if (requesterRole === "user") {
      // User can view their own report
      report = await ReportSharing.findOne({ reportHash, userId: requesterId });
    } else if (requesterRole === "doctor") {
      const now = new Date();
      report = await ReportSharing.findOne({
        reportHash,
        doctorId: requesterId,
        revokedAt: null,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      });
    }

    if (!report) return res.status(403).json({ message: "Access denied or report not found" });

    // Download + decrypt
    const encryptedPath = await downloadFromIPFS(report.ipfsURL);
    const decryptedPath = decryptFile(encryptedPath, Buffer.from(report.encryptionKey, "hex"));

    const fileBuffer = fs.readFileSync(decryptedPath);
    const base64File = fileBuffer.toString("base64");
    const mimeType = mime.lookup(report.fileName) || "application/pdf";

    res.status(200).json({
      success: true,
      fileName: report.fileName,
      mimeType,
      fileData: `data:${mimeType};base64,${base64File}`,
    });

    fs.unlinkSync(encryptedPath);
    fs.unlinkSync(decryptedPath);
  } catch (err) {
    console.error("Error while viewing report:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 4️⃣ Share a report with a doctor
export const shareReportWithDoctor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportHash, doctorEmail, durationInHours } = req.body; // duration sent by user

    if (!durationInHours || durationInHours <= 0) {
      return res.status(400).json({ message: "Duration must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if the report exists in user's uploads
    const report = await ReportSharing.findOne({ reportHash, userId });
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Check if already shared with this doctor
    const alreadyShared = await ReportSharing.findOne({
      userId,
      doctorId: doctor._id,
      reportHash,
      revokedAt: null,
    });

    if (alreadyShared) {
      return res.status(400).json({ message: "Report already shared with this doctor" });
    }

    // Calculate expiresAt dynamically
    const sharedAt = new Date();
    const expiresAt = new Date(sharedAt.getTime() + durationInHours * 60 * 60 * 1000); // hours to ms

    // Create new ReportSharing document
    const newShare = new ReportSharing({
      userId,
      doctorId: doctor._id,
      reportHash,
      ipfsURL: report.ipfsURL,
      sharedAt,
      expiresAt,
    });

    await newShare.save();

    res.status(200).json({
      success: true,
      message: `Report shared with Dr. ${doctor.name} for ${durationInHours} hours`,
      sharedAt,
      expiresAt,
    });
  } catch (err) {
    console.error("Error sharing report:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🛑 Revoke access to a shared report
export const revokeReportAccess = async (req, res) => {
  try {
    const userId = req.user.id;           // User making the request
    const { reportHash, doctorId } = req.body;

    // 1️⃣ Find the share document
    const share = await ReportSharing.findOne({ userId, doctorId, reportHash });

    if (!share) {
      return res.status(404).json({ message: "Report share not found" });
    }

    if (share.revokedAt) {
      return res.status(400).json({ message: "Access already revoked" });
    }

    // 2️⃣ Set revokedAt to current time
    share.revokedAt = new Date();
    await share.save();

    res.status(200).json({
      success: true,
      message: `Access to report ${reportHash} revoked for doctor ${doctorId}`,
      revokedAt: share.revokedAt,
    });

  } catch (err) {
    console.error("Error revoking report access:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getPrescriptionForReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportHash } = req.params;

    // 1️⃣ Find the report-sharing entry for this user and report
    const reportShare = await ReportSharing.findOne({ reportHash, userId });

    if (!reportShare) {
      return res.status(404).json({ message: "No shared report found for this user" });
    }

    // 2️⃣ Check if prescription exists
    if (!reportShare.prescription) {
      return res.status(200).json({
        success: true,
        message: "No prescription has been uploaded yet by the doctor",
        prescription: null,
      });
    }

    // 3️⃣ Return prescription details
    res.status(200).json({
      success: true,
      reportHash: reportShare.reportHash,
      prescription: reportShare.prescription,
      sharedAt: reportShare.sharedAt,
      doctorId: reportShare.doctorId,
      expiresAt: reportShare.expiresAt,
    });
  } catch (err) {
    console.error("Error fetching prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// export const viewReport = async (req, res) => {
//   try {
//     const { reportHash } = req.params;
//     const userId = req.user.id;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const report = user.reports.find((r) => r.reportHash === reportHash);
//     if (!report) return res.status(404).json({ message: "Report not found" });

//     // 1️⃣ Download encrypted file from IPFS
//     const encryptedPath = await downloadFromIPFS(report.ipfsURL);

//     // 2️⃣ Decrypt file
//     const decryptedPath = decryptFile(encryptedPath, Buffer.from(report.encryptionKey, "hex"));

//     // 3️⃣ Set proper headers for PDF streaming
//     const fileName = report.fileName;
//     const mimeType = mime.lookup(fileName) || "application/pdf";
//     res.setHeader("Content-Type", mimeType);
//     res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

//     // 4️⃣ Stream the decrypted file
//     const fileStream = fs.createReadStream(decryptedPath);
//     fileStream.pipe(res);

//     // 5️⃣ Cleanup temp files after streaming
//     fileStream.on("end", () => {
//       fs.unlinkSync(encryptedPath);
//       fs.unlinkSync(decryptedPath);
//     });

//     fileStream.on("error", (err) => {
//       console.error("File streaming error:", err);
//       res.status(500).end();
//     });

//   } catch (err) {
//     console.error("Error while streaming report:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


