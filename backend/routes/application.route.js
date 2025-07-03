import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, uploadResume } from "../controllers/application.controller.js";
import multer from "multer";
import { getJobRecommendations } from "../controllers/jobRecommendation.controller.js";

const router = express.Router();
const upload = multer();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/upload-resume").post(isAuthenticated, upload.single('resume'), uploadResume);

// New route for job recommendations
router.route("/recommendations").get(isAuthenticated, getJobRecommendations);

export default router;
