import express from 'express';
import { getAllVCs, getVCById, createVC, updateVC, deleteVC } from '../controllers/vcController.js';
const router = express.Router();

router.get('/', getAllVCs);
router.get('/:id', getVCById);
router.post('/', createVC);
router.put('/:id', updateVC);
router.delete('/:id', deleteVC);

export default router;