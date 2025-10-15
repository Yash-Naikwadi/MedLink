import Doctor from "../models/Doctor.js";
import { generateToken } from "../utils/jwtUtils.js";


// 🩺 Register Doctor
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, licenseNumber, hospitalName } = req.body;

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) return res.status(400).json({ message: "Doctor already registered" });

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization,
      licenseNumber,
      hospitalName,
    });

    const token = generateToken({ id: doctor._id, role: "doctor" });
    res.cookie("doctorToken", token, {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (err) {
    console.error("Doctor registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧠 Login Doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor || !(await doctor.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: doctor._id, role: "doctor" });
    res.cookie("doctorToken", token, {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Doctor logged in successfully", doctor });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🚪 Logout Doctor
export const logoutDoctor = (req, res) => {
  res.clearCookie("doctorToken");
  res.json({ message: "Doctor logged out successfully" });
};
