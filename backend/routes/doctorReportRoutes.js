import express from "express";
import { addOrUpdatePrescription, getAccessibleReports } from "../controllers/doctorReportController.js";
import { protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/shared", protectDoctor, getAccessibleReports);
router.put("/add-prescription/:reportHash", protectDoctor, addOrUpdatePrescription);

export default router;