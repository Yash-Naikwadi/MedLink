import express from "express";
import { getAccessibleReports } from "../controllers/doctorReportController.js";
import { protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/shared", protectDoctor, getAccessibleReports);

export default router;