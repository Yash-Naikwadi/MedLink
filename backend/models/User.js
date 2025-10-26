import mongoose from "mongoose";

// 🧾 Individual Report Schema (user’s own uploads)
const reportSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    ipfsURL: { type: String, required: true },
    encryptionKey: { type: String, required: true }, // stored as hex
    reportHash: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // 💰 Wallet info for blockchain integration
    wallet: {
      address: { type: String, required: true },
      encryptedPrivateKey: { type: String, required: true },
    },

    // 📁 Array of user's uploaded & encrypted reports
    reports: [reportSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);