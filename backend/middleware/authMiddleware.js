import { verifyToken } from "../utils/jwtUtils.js";

// 🧍 Protect User Routes
export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token; // user cookie
    if (!token) return res.status(401).json({ message: "Not authorized as user" });

    const decoded = verifyToken(token);
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied: user role required" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired user token" });
  }
};

// 🩺 Protect Doctor Routes
export const protectDoctor = (req, res, next) => {
  try {
    console.log("Doctor cookie:", req.cookies.doctorToken);
    const doctoken = req.cookies.doctorToken; // doctor cookie
    if (!doctoken) return res.status(401).json({ message: "Not authorized as doctor" });

    const decoded = verifyToken(doctoken);
    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Access denied: doctor role required" });
    }

    req.doctor = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired doctor token" });
  }
};
