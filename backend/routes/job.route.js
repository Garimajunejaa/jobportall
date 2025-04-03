import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    postJob, 
    applyToJob,
    getAppliedJobs,
    getRecentApplications,
    searchJobs
} from "../controllers/job.controller.js";
import { Job } from "../models/job.model.js";  // Change this line

const router = express.Router();

// Public routes
router.get("/all", getAllJobs);
router.get("/jobs", getAllJobs);
router.get("/get/:id", getJobById);

// Search and filter routes
router.post("/search", searchJobs);

// Protected routes
router.post("/post", isAuthenticated, postJob);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
router.post("/apply/:id", isAuthenticated, applyToJob);
router.get("/applied", isAuthenticated, getAppliedJobs);
router.get("/recent-applications", isAuthenticated, getRecentApplications);

// Filter route
// ... existing imports ...

// Update the filter route path
router.post("/filter", async (req, res) => {
    try {
        const { query, location, jobType, salaryRange, experienceLevel, sortBy } = req.body;
        
        let filterQuery = {};

        if (query) {
            filterQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        if (location) {
            filterQuery.location = { $regex: location, $options: 'i' };
        }

        if (jobType) {
            filterQuery.jobType = { $regex: jobType, $options: 'i' };
        }

        if (experienceLevel) {
            filterQuery.experienceLevel = experienceLevel;
        }

        if (salaryRange) {
            const [min, max] = salaryRange.split('-').map(Number);
            if (max) {
                filterQuery.salary = { $gte: min, $lte: max };
            } else {
                filterQuery.salary = { $gte: min };
            }
        }

        let sortOptions = { createdAt: -1 };
        if (sortBy) {
            switch (sortBy) {
                case 'recent':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'salary-high':
                    sortOptions = { salary: -1 };
                    break;
                case 'salary-low':
                    sortOptions = { salary: 1 };
                    break;
            }
        }

        const jobs = await Job.find(filterQuery)
            .sort(sortOptions)
            .populate('company', 'name logo location');

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error('Filter error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
