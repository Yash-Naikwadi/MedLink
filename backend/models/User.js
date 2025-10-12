import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    ipfsURL: { type: String, required: true },
    encryptionKey: { type: String, required: true }, // store as hex
    reportHash: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    wallet: {
      address: { type: String, required: true },
      encryptedPrivateKey: { type: String, required: true },
    },
    reports: [reportSchema], // array of uploaded reports
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
