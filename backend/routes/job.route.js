import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, getJobsByCategory } from "../controllers/job.controller.js";  // Import the new controller function
import upload from '../middlewares/multer.js'; 
import { saveJobForLater, removeSavedJob, getSavedJobs } from '../controllers/jobController.js';

const router = express.Router();

// Routes
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.post('/post', upload.single('requirement_doc'), isAuthenticated, postJob); 

router.get('/jobs-by-category', isAuthenticated, getJobsByCategory);

router.post('/save/:jobId', isAuthenticated, saveJobForLater);
router.delete('/save/:jobId', isAuthenticated, removeSavedJob);
router.get('/saved', isAuthenticated, getSavedJobs);

export default router;
