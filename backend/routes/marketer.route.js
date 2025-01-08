import express from 'express';
import { register, login, updateProfile,editEducation,updateExperiences,deleteExperience,updateEducation,deleteEducation, viewProfile, getAllProfiles, editExperience } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profiles', getAllProfiles);
router.get('/profile/:id', isAuthenticated, viewProfile);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.post('/profile/experiences', isAuthenticated, updateExperiences);
router.post('/profile/education', isAuthenticated, updateEducation);
router.put('/edit-experience', isAuthenticated, editExperience);
router.delete('/delete-experience/:id', isAuthenticated, deleteExperience);
router.put('/edit-education', isAuthenticated, editEducation);
router.delete('/delete-education/:id', isAuthenticated, deleteEducation);

export default router;
