import express from "express";
import { getActiveJobs } from "../controllers/jobAnalytics.controller.js";

const router = express.Router();

router.route("/active").get(getActiveJobs);

export default router;
