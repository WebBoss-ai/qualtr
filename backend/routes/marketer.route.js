import express from 'express';
import { register, login, updateProfile,addCampaign,listAllCampaigns, followUser, editEducation,updateExperiences,deleteExperience,updateEducation,deleteEducation, viewProfile, getAllProfiles, editExperience, editCampaign, deleteCampaign, getRandomSuggestedProfiles, getAllProfilesAdmin, updateSuggestedStatus } from '../controllers/marketer.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../middlewares/multer.js";
import { addComment, createPost, getAllPosts, getPostById, getTrendingPosts, replyToComment, toggleLike, toggleTrendingStatus } from '../controllers/post.controller.js';
import isAuthenticated2 from '../middlewares/isAuthenticated2.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profiles', isAuthenticated2, getAllProfiles);

router.get('/posts', getAllPosts);
router.get('/post/:id', getPostById);
router.post('/posts',isAuthenticated, upload.array('images', 10), createPost);
router.get('/posts/trending', getTrendingPosts);
router.post('/posts/toggle-trending', toggleTrendingStatus);

router.post('/posts/:postId/like', isAuthenticated, toggleLike);
router.post('/posts/:postId/comment',isAuthenticated, addComment);
router.post('/posts/:postId/comment/:commentId/reply',isAuthenticated, replyToComment);

router.get('/profile/:id', viewProfile);

router.get('/admin/profiles', getAllProfilesAdmin);
router.put('/admin/profiles/:id/suggested', updateSuggestedStatus)
router.post('/profiles/follow', isAuthenticated, followUser);

router.get('/random-suggested', getRandomSuggestedProfiles);
router.post('/profile/update', isAuthenticated, upload.single('profilePhoto'), updateProfile);
router.post('/profile/experiences', isAuthenticated, updateExperiences);
router.post('/profile/education', isAuthenticated, updateEducation);
router.put('/edit-experience', isAuthenticated, editExperience);
router.delete('/delete-experience/:id', isAuthenticated, deleteExperience);
router.put('/edit-education', isAuthenticated, editEducation);
router.delete('/delete-education/:id', isAuthenticated, deleteEducation);

router.get('/campaigns', listAllCampaigns);
router.post('/campaigns/add', isAuthenticated, upload.array('images', 10), addCampaign);
router.put('/campaigns/edit', isAuthenticated, upload.array('images', 10), editCampaign);
router.delete('/campaigns/delete/:id', isAuthenticated, deleteCampaign);


export default router;
