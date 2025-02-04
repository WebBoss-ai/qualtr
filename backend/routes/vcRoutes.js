import express from 'express';
import { getAllVCs, getVCById, createVC, updateVC, deleteVC, getRandomVCs } from '../controllers/vcController.js';
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get('/', getAllVCs);
router.get('/random', getRandomVCs);
router.get('/:id', getVCById);
router.post('/', upload.single('logo'), createVC);
router.put('/:id',upload.single('logo'),  updateVC);
router.delete('/:id', deleteVC);

export default router;