import Doctor from "../models/Doctor.js";

export const getAccessibleReports = async (req, res) => {
  try {
    // 1️⃣ Get doctor ID from JWT middleware
    const doctorId = req.doctor.id;

    // 2️⃣ Fetch doctor and populate the user info for each shared report
    const doctor = await Doctor.findById(doctorId).populate(
      "accessibleReports.userId",
      "username email"
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 3️⃣ Format reports to plain JS objects (avoid serialization issues)
    const formattedReports = doctor.accessibleReports.map((r) => ({
      _id: r._id.toString(),
      reportHash: r.reportHash,
      ipfsURL: r.ipfsURL,
      accessGrantedAt: r.accessGrantedAt,
      user: {
        _id: r.userId?._id.toString() || null,
        username: r.userId?.username || "Unknown",
        email: r.userId?.email || "Unknown",
      },
    }));

    // 4️⃣ Send response
    res.status(200).json({
      success: true,
      accessibleReports: formattedReports,
    });

    // Optional: log to console for debugging
    console.log("Shared reports for doctor:", formattedReports);
  } catch (err) {
    console.error("Error fetching shared reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};
