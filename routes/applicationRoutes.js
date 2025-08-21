import express from "express";
import upload from "../middleware/multer.js";
import { submitApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply", upload.single("resume"), submitApplication);

export default router;
