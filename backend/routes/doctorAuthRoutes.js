import express from "express";
import { registerDoctor, loginDoctor, logoutDoctor } from "../controllers/doctorAuthController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);

export default router;
