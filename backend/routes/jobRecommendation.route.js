import express from 'express';
import { getJobRecommendations } from '../controllers/jobRecommendation.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/recommendations', isAuthenticated, getJobRecommendations);

export default router;
