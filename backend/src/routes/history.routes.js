// backend/src/routes/history.routes.js
import express from 'express';
import {
    getHistory,
    getHistoryById,
    getHistoryByProject,
} from '../controllers/history.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validation.middleware.js';

const router = express.Router();

// ✅ Fix: Remove the () from validateObjectId
router.get('/', protect, getHistory);
router.get('/:id', protect, validateObjectId, getHistoryById);
router.get('/project/:projectId', protect, validateObjectId, getHistoryByProject);

export default router;