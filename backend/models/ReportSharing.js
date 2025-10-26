import mongoose from "mongoose";

const reportSharingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  reportHash: { type: String, required: true },
  sharedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  revokedAt: { type: Date, default: null },
  prescription: { type: String, default: null },
});

export default mongoose.model("ReportSharing", reportSharingSchema);