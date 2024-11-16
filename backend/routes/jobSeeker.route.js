// routes/jobSeeker.route.js
import express from "express";
import { getAllJobSeekers, getJobSeekerProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(getAllJobSeekers); // `/api/v1/job-seekers`
router.route("/:id").get(isAuthenticated, getJobSeekerProfile); // `/api/v1/job-seekers/:id`

export default router;
