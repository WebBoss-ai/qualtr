import express from 'express';
import { register, login, updateProfile,updateExperiences,deleteExperience,updateEducation,deleteEducation, viewProfile, getAllProfiles, editExperience } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.post('/profile/experiences', isAuthenticated, updateExperiences);
router.put('/edit-experience', isAuthenticated, editExperience);
router.delete('/delete-experience/:id', isAuthenticated, deleteExperience);
router.post('/profile/education', isAuthenticated, updateEducation);
router.delete('/profile/education/:id', isAuthenticated, deleteEducation);
router.get('/profile/:id', isAuthenticated, viewProfile);
router.get('/profiles', getAllProfiles);

export default router;
