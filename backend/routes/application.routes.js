import express from 'express';
import { getAllApplications } from '../controllers/application.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Get all applications (Admin only)
router.route('/admin/all')
    .get(isAuthenticated, authorizeAdmin, getAllApplications);

export default router; 