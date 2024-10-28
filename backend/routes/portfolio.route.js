// routes/portfolioRoutes.js
import express from 'express';
import { addPortfolio, deletePortfolio } from '../controllers/user.controller.js';

const router = express.Router();

// POST route to add a new portfolio entry
router.post('/update', addPortfolio);
router.post('/delete', deletePortfolio);
export default router;
