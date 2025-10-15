import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    hospitalName: { type: String },
    // reports shared with the doctor by users
    accessibleReports: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reportHash: String,
        ipfsURL: String,
        accessGrantedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 Compare password during login
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Correct export
const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
