import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";


import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import doctorAuthRoutes from "./routes/doctorAuthRoutes.js";
import doctorReportRoutes from "./routes/doctorReportRoutes.js";

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser()); // must be before routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/doctor/auth", doctorAuthRoutes);
app.use("/api/doctor/reports", doctorReportRoutes);

// Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
