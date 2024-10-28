// routes/jobSeeker.route.js
import express from "express";
import { updateAgencyProfile, getJobSeekerProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/update").post(isAuthenticated, updateAgencyProfile); 

export default router;
