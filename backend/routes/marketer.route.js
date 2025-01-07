import express from 'express';
import { register, login, updateProfile,updateExperiences,updateEducation, viewProfile, getAllProfiles } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.post('/profile/experiences', isAuthenticated, updateExperiences);
router.post('/profile/education', isAuthenticated, updateEducation);
router.get('/profile/:id', isAuthenticated, viewProfile);
router.get('/profiles', getAllProfiles);

export default router;
