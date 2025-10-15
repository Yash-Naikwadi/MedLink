import express from "express";
import { getUserReports, shareReportWithDoctor, uploadReport, viewReport } from "../controllers/reportController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadReport);
router.get("/myreports", protect, getUserReports);
router.get("/view/:reportHash", protect, viewReport);
router.post("/share", protect, shareReportWithDoctor);

export default router;
