import express from 'express';
import { register, login, updateProfile, viewProfile, getAllProfiles } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/update', isAuthenticated, updateProfile);
router.get('/profile/:id', isAuthenticated, viewProfile);
router.get('/profiles', getAllProfiles);

export default router;
