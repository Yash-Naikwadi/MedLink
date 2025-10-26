import ReportSharing from "../models/ReportSharing.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

// ✅ Fetch all reports shared with a specific doctor
export const getAccessibleReports = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Fetch all shares for this doctor that are not revoked and not expired
    const now = new Date();
    const sharedReports = await ReportSharing.find({
      doctorId,
      revokedAt: null,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }).populate("userId", "username email");

    const formattedReports = sharedReports.map((report) => ({
      _id: report._id.toString(),
      fileName: report.fileName,
      ipfsURL: report.ipfsURL,
      reportHash: report.reportHash,
      uploadedAt: report.uploadedAt,
      accessGrantedAt: report.sharedAt,
      expiresAt: report.expiresAt,
      user: {
        _id: report.userId?._id?.toString() || null,
        username: report.userId?.username || "Unknown",
        email: report.userId?.email || "Unknown",
      },
    }));

    res.status(200).json({
      success: true,
      accessibleReports: formattedReports,
    });
  } catch (err) {
    console.error("Error fetching accessible reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const addOrUpdatePrescription = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { reportHash } = req.params;
    const { prescription } = req.body;

    // 1️⃣ Validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 2️⃣ Validate prescription input
    if (!prescription || prescription.trim() === "") {
      return res.status(400).json({ message: "Prescription content required" });
    }

    // 3️⃣ Check if doctor has access to the report
    const now = new Date();
    const reportShare = await ReportSharing.findOne({
      reportHash,
      doctorId,
      revokedAt: null,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    });

    if (!reportShare) {
      return res.status(403).json({ message: "Access denied or report not found" });
    }

    // 4️⃣ Update prescription
    reportShare.prescription = prescription;
    await reportShare.save();

    res.status(200).json({
      success: true,
      message: "Prescription saved successfully",
      updatedAt: new Date(),
      report: {
        reportHash: reportShare.reportHash,
        prescription: reportShare.prescription,
      },
    });
  } catch (err) {
    console.error("Error while adding/updating prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};