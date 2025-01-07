import express from 'express';
import { register, login, updateProfile,updateExperiences,deleteExperience,updateEducation,deleteEducation, viewProfile, getAllProfiles } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.post('/profile/experiences', isAuthenticated, updateExperiences);
router.post('/profile/education', isAuthenticated, updateEducation);
router.delete('/profile/experiences/:id', isAuthenticated, deleteExperience);
router.delete('/profile/education/:id', isAuthenticated, deleteEducation);
router.get('/profile/:id', isAuthenticated, viewProfile);
router.get('/profiles', getAllProfiles);

export default router;
